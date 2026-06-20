import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { CurrentUser, RequireAnyPermission } from '../common/decorators';
import type { UserContext } from '../common/decorators';
import { apiResponse } from '../common/response.util';

@ApiTags('analytics')
@ApiBearerAuth()
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('tenant')
  @RequireAnyPermission('analytics:read:tenant', 'analytics:read:school')
  async tenant(@CurrentUser() user: UserContext) {
    return apiResponse(await this.analyticsService.getTenantAnalytics(user));
  }

  @Get('school')
  @RequireAnyPermission('analytics:read:school')
  async school(@CurrentUser() user: UserContext) {
    return apiResponse(await this.analyticsService.getSchoolAnalytics(user));
  }
}
