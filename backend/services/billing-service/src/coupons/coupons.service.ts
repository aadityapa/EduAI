import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CouponsService {
  constructor(private readonly prisma: PrismaService) {}

  async validateCoupon(code: string, tenantId?: string) {
    const coupon = await this.prisma.coupon.findUnique({ where: { code: code.toUpperCase() } });
    if (!coupon || !coupon.isActive) throw new BadRequestException('Invalid coupon');
    const now = new Date();
    if (now < coupon.validFrom || now > coupon.validUntil) {
      throw new BadRequestException('Coupon expired');
    }
    if (coupon.usedCount >= coupon.maxUses) throw new BadRequestException('Coupon fully redeemed');
    if (coupon.tenantId && tenantId && coupon.tenantId !== tenantId) {
      throw new BadRequestException('Coupon not valid for this tenant');
    }
    return {
      id: coupon.id,
      code: coupon.code,
      discountPct: coupon.discountPct.toNumber(),
    };
  }

  /**
   * Apply coupon server-side and increment redemption. Returns discounted amount.
   */
  async applyCoupon(code: string, listAmount: number, tenantId?: string) {
    if (!Number.isFinite(listAmount) || listAmount < 0) {
      throw new BadRequestException('Invalid amount');
    }
    const validated = await this.validateCoupon(code, tenantId);
    const discountAmount =
      Math.round(listAmount * (validated.discountPct / 100) * 100) / 100;
    const finalAmount = Math.max(0, Math.round((listAmount - discountAmount) * 100) / 100);

    await this.prisma.coupon.update({
      where: { id: validated.id },
      data: { usedCount: { increment: 1 } },
    });

    return {
      code: validated.code,
      discountPct: validated.discountPct,
      listAmount,
      discountAmount,
      finalAmount,
    };
  }

  async listCoupons() {
    return this.prisma.coupon.findMany({ orderBy: { createdAt: 'desc' }, take: 100 });
  }
}
