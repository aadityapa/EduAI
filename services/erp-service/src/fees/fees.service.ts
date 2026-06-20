import { ForbiddenException, Injectable } from '@nestjs/common';
import { ParentLinkStatus } from '@eduai/database';
import { PrismaService } from '../prisma/prisma.service';
import type { UserContext } from '../common/decorators';

@Injectable()
export class FeesService {
  constructor(private readonly prisma: PrismaService) {}

  async getMyFees(user: UserContext) {
    const invoices = await this.prisma.feeInvoice.findMany({
      where: { tenantId: user.tenantId, studentId: user.sub },
      include: { payments: true },
      orderBy: { dueDate: 'desc' },
    });
    return this.summarize(invoices);
  }

  async getStudentFees(user: UserContext, studentId: string) {
    await this.assertCanView(user, studentId);
    const invoices = await this.prisma.feeInvoice.findMany({
      where: { tenantId: user.tenantId, studentId },
      include: { payments: true },
      orderBy: { dueDate: 'desc' },
    });
    return this.summarize(invoices);
  }

  async getLinkedChildrenFees(user: UserContext) {
    const links = await this.prisma.parentStudentLink.findMany({
      where: {
        tenantId: user.tenantId,
        parentId: user.sub,
        status: ParentLinkStatus.verified,
        deletedAt: null,
      },
      include: { student: { select: { id: true, firstName: true, lastName: true } } },
    });

    const results = await Promise.all(
      links.map(async (link) => {
        const fees = await this.getStudentFees(user, link.studentId);
        return { student: link.student, ...fees };
      }),
    );
    return results;
  }

  private summarize(
    invoices: Array<{
      id: string;
      invoiceNumber: string;
      description: string;
      amount: { toNumber(): number };
      gstAmount: { toNumber(): number };
      status: string;
      dueDate: Date;
      paidAt: Date | null;
      payments: Array<{ amount: { toNumber(): number }; paidAt: Date }>;
    }>,
  ) {
    const totalDue = invoices
      .filter((i) => !['paid', 'cancelled'].includes(i.status))
      .reduce((sum, i) => sum + i.amount.toNumber() + i.gstAmount.toNumber(), 0);
    const totalPaid = invoices
      .filter((i) => i.status === 'paid')
      .reduce((sum, i) => sum + i.amount.toNumber() + i.gstAmount.toNumber(), 0);

    return {
      summary: { totalDue, totalPaid, invoiceCount: invoices.length },
      invoices: invoices.map((i) => ({
        id: i.id,
        invoiceNumber: i.invoiceNumber,
        description: i.description,
        amount: i.amount.toNumber(),
        gstAmount: i.gstAmount.toNumber(),
        status: i.status,
        dueDate: i.dueDate,
        paidAt: i.paidAt,
        payments: i.payments.map((p) => ({
          amount: p.amount.toNumber(),
          paidAt: p.paidAt,
        })),
      })),
    };
  }

  private async assertCanView(user: UserContext, studentId: string) {
    if (user.sub === studentId) return;
    if (user.permissions.includes('billing:read:school')) return;
    if (user.permissions.includes('billing:manage:linked')) {
      const link = await this.prisma.parentStudentLink.findFirst({
        where: {
          tenantId: user.tenantId,
          parentId: user.sub,
          studentId,
          status: ParentLinkStatus.verified,
          deletedAt: null,
        },
      });
      if (link) return;
    }
    throw new ForbiddenException('Cannot view fees for this student');
  }
}
