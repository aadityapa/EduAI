import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { BillingAnalyticsService } from './analytics.service';
import { RequireAnyPermission } from '../common/decorators';
import { apiResponse } from '../common/response.util';

@ApiTags('analytics')
@ApiBearerAuth()
@Controller('analytics')
export class BillingAnalyticsController {
  constructor(private readonly analyticsService: BillingAnalyticsService) {}

  @Get('revenue')
  @RequireAnyPermission('analytics:read:global', 'billing:manage:tenant')
  async revenue() {
    return apiResponse(await this.analyticsService.getRevenueMetrics());
  }
}
