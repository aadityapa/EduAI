import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SubscriptionsService } from './subscriptions.service';
import { CurrentUser, RequireAnyPermission } from '../common/decorators';
import type { UserContext } from '../common/decorators';
import { apiResponse } from '../common/response.util';

@ApiTags('subscriptions')
@ApiBearerAuth()
@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Get('me')
  @RequireAnyPermission('billing:manage:tenant', 'billing:manage:own')
  async mine(@CurrentUser() user: UserContext) {
    return apiResponse(await this.subscriptionsService.getTenantSubscription(user));
  }

  @Get()
  @RequireAnyPermission('billing:manage:tenant', 'tenants:manage:global')
  async list(@CurrentUser() user: UserContext) {
    return apiResponse(await this.subscriptionsService.listAllSubscriptions(user));
  }

  @Post('trial')
  @RequireAnyPermission('billing:manage:tenant')
  async startTrial(
    @CurrentUser() user: UserContext,
    @Body() body: { planCode: string; trialDays?: number },
  ) {
    return apiResponse(
      await this.subscriptionsService.startTrial(user, body.planCode, body.trialDays),
    );
  }

  @Post('renew')
  @RequireAnyPermission('billing:manage:tenant')
  async renew(@CurrentUser() user: UserContext) {
    return apiResponse(await this.subscriptionsService.renewSubscription(user));
  }

  @Post('usage-billing')
  @RequireAnyPermission('billing:manage:tenant')
  async usageBilling(
    @CurrentUser() user: UserContext,
    @Body() body: { tokensUsed: number },
  ) {
    return apiResponse(
      await this.subscriptionsService.recordUsageBilling(user, body.tokensUsed),
    );
  }
}
