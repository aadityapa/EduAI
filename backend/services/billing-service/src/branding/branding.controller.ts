import { Body, Controller, Get, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { BrandingService } from './branding.service';
import { CurrentUser, RequireAnyPermission } from '../common/decorators';
import type { UserContext } from '../common/decorators';
import { apiResponse } from '../common/response.util';

@ApiTags('branding')
@ApiBearerAuth()
@Controller('branding')
export class BrandingController {
  constructor(private readonly brandingService: BrandingService) {}

  @Get()
  @RequireAnyPermission('tenants:manage:tenant', 'tenants:read:own')
  async get(@CurrentUser() user: UserContext) {
    return apiResponse(await this.brandingService.getBranding(user));
  }

  @Patch()
  @RequireAnyPermission('tenants:manage:tenant')
  async update(@CurrentUser() user: UserContext, @Body() body: Record<string, unknown>) {
    return apiResponse(await this.brandingService.updateBranding(user, body));
  }
}
