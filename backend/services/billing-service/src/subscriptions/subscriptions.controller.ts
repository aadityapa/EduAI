import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { SubscriptionsService } from './subscriptions.service';
import { CurrentUser, RequireAnyPermission } from '../common/decorators';
import type { UserContext } from '../common/decorators';
import { apiResponse } from '../common/response.util';
import {
  CancelSubscriptionDto,
  ChangePlanDto,
  RenewSubscriptionDto,
  StartTrialDto,
  UsageBillingDto,
} from './dto/subscriptions.dto';

@ApiTags('subscriptions')
@ApiBearerAuth()
@ApiHeader({ name: 'Idempotency-Key', required: false })
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
  @Throttle({ mutate: { limit: 10, ttl: 60000 } })
  @RequireAnyPermission('billing:manage:tenant')
  async startTrial(@CurrentUser() user: UserContext, @Body() body: StartTrialDto) {
    return apiResponse(
      await this.subscriptionsService.startTrial(user, body.planCode, body.trialDays),
    );
  }

  @Post('renew')
  @Throttle({ mutate: { limit: 10, ttl: 60000 } })
  @RequireAnyPermission('billing:manage:tenant')
  async renew(@CurrentUser() user: UserContext, @Body() body: RenewSubscriptionDto = {}) {
    return apiResponse(
      await this.subscriptionsService.renewSubscription(user, body.couponCode),
    );
  }

  @Post('cancel')
  @Throttle({ mutate: { limit: 10, ttl: 60000 } })
  @RequireAnyPermission('billing:manage:tenant')
  async cancel(@CurrentUser() user: UserContext, @Body() body: CancelSubscriptionDto = {}) {
    return apiResponse(
      await this.subscriptionsService.cancelSubscription(user, body.immediate === true),
    );
  }

  @Post('change-plan')
  @Throttle({ mutate: { limit: 10, ttl: 60000 } })
  @RequireAnyPermission('billing:manage:tenant')
  async changePlan(@CurrentUser() user: UserContext, @Body() body: ChangePlanDto) {
    return apiResponse(
      await this.subscriptionsService.changePlan(user, body.planCode, body.couponCode),
    );
  }

  @Post('usage-billing')
  @Throttle({ mutate: { limit: 20, ttl: 60000 } })
  @RequireAnyPermission('billing:manage:tenant')
  async usageBilling(@CurrentUser() user: UserContext, @Body() body: UsageBillingDto) {
    return apiResponse(
      await this.subscriptionsService.recordUsageBilling(user, body.tokensUsed),
    );
  }

  @Post('dunning/run')
  @Throttle({ mutate: { limit: 5, ttl: 60000 } })
  @RequireAnyPermission('tenants:manage:global', 'billing:manage:tenant')
  async runDunning() {
    return apiResponse(await this.subscriptionsService.processDunning());
  }
}
