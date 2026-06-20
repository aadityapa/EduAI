import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { UserContext } from '../common/decorators';

@Injectable()
export class ScaffoldService {
  constructor(private readonly prisma: PrismaService) {}

  async listTransport(user: UserContext) {
    return this.prisma.transportRoute.findMany({
      where: { tenantId: user.tenantId },
      include: { _count: { select: { assignments: true } } },
    });
  }

  async listHostelRooms(user: UserContext) {
    return this.prisma.hostelRoom.findMany({
      where: { tenantId: user.tenantId },
      include: { _count: { select: { allocations: true } } },
    });
  }

  async listLibraryBooks(user: UserContext) {
    return this.prisma.libraryBook.findMany({
      where: { tenantId: user.tenantId },
      take: 100,
    });
  }

  async listInventory(user: UserContext) {
    return this.prisma.inventoryItem.findMany({
      where: { tenantId: user.tenantId },
      take: 100,
    });
  }
}
