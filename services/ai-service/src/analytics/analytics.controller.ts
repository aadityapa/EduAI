import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { CurrentUser, RequireAnyPermission } from '../common/decorators';
import type { UserContext } from '../common/decorators';
import { apiResponse } from '../common/response.util';

@ApiTags('analytics')
@ApiBearerAuth()
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('usage')
  @RequireAnyPermission(
    'ai:tutor:use:own',
    'ai:quota:manage:tenant',
    'analytics:read:tenant',
  )
  @ApiQuery({ name: 'userId', required: false, description: 'Target user (admin only)' })
  async getUsage(@CurrentUser() user: UserContext, @Query('userId') userId?: string) {
    const data = await this.analyticsService.getUsage(user, userId);
    return apiResponse(data);
  }
}
