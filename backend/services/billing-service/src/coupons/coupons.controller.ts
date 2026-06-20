import { Controller, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CouponsService } from './coupons.service';
import { Public, RequirePermission } from '../common/decorators';
import { apiResponse } from '../common/response.util';

@ApiTags('coupons')
@Controller('coupons')
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  @Get('validate/:code')
  @Public()
  async validate(@Param('code') code: string) {
    return apiResponse(await this.couponsService.validateCoupon(code));
  }

  @Get()
  @ApiBearerAuth()
  @RequirePermission('billing:manage:tenant')
  async list() {
    return apiResponse(await this.couponsService.listCoupons());
  }
}
