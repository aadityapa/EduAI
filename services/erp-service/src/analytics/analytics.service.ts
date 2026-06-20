import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { UserContext } from '../common/decorators';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getTenantAnalytics(user: UserContext) {
    const tenantId = user.tenantId;
    const [
      studentCount,
      teacherCount,
      classCount,
      attendanceToday,
      feeOutstanding,
      assignmentCount,
      aiUsage,
    ] = await Promise.all([
      this.prisma.user.count({
        where: {
          tenantId,
          deletedAt: null,
          userRoles: { some: { role: { code: 'student' } } },
        },
      }),
      this.prisma.user.count({
        where: {
          tenantId,
          deletedAt: null,
          userRoles: { some: { role: { code: 'teacher' } } },
        },
      }),
      this.prisma.academicClass.count({ where: { tenantId, status: 'active' } }),
      this.getTodayAttendanceRate(tenantId),
      this.getOutstandingFees(tenantId),
      this.prisma.assignment.count({ where: { tenantId, status: 'published' } }),
      this.prisma.aiQuotaUsage.aggregate({
        where: { tenantId },
        _sum: { tokensUsed: true, queryCount: true },
      }),
    ]);

    return {
      engagement: {
        students: studentCount,
        teachers: teacherCount,
        classes: classCount,
        activeAssignments: assignmentCount,
      },
      attendance: attendanceToday,
      fees: feeOutstanding,
      ai: {
        totalTokens: aiUsage._sum.tokensUsed ?? 0,
        totalQueries: aiUsage._sum.queryCount ?? 0,
      },
    };
  }

  async getSchoolAnalytics(user: UserContext) {
    return this.getTenantAnalytics(user);
  }

  private async getTodayAttendanceRate(tenantId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const records = await this.prisma.attendanceRecord.findMany({
      where: { tenantId, date: today },
      select: { status: true },
    });
    if (!records.length) return { rate: 0, marked: 0 };
    const present = records.filter((r) => r.status === 'present' || r.status === 'late').length;
    return { rate: Math.round((present / records.length) * 100), marked: records.length };
  }

  private async getOutstandingFees(tenantId: string) {
    const invoices = await this.prisma.feeInvoice.findMany({
      where: { tenantId, status: { in: ['issued', 'partial', 'overdue'] } },
      select: { amount: true, gstAmount: true },
    });
    const total = invoices.reduce((sum, i) => sum + i.amount.toNumber() + i.gstAmount.toNumber(), 0);
    return { outstandingAmount: total, invoiceCount: invoices.length };
  }
}
