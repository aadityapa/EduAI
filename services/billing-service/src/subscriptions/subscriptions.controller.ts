import { Controller, Get } from '@nestjs/common';
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
}
