import { Body, Controller, Get, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { BrandingService } from './branding.service';
import { CurrentUser, RequireAnyPermission } from '../common/decorators';
import type { UserContext } from '../common/decorators';
import { apiResponse } from '../common/response.util';
import { UpdateBrandingDto } from './dto/branding.dto';

@ApiTags('branding')
@ApiBearerAuth()
@Controller('branding')
export class BrandingController {
  constructor(private readonly brandingService: BrandingService) {}

  @Get()
  @RequireAnyPermission('tenants:configure:own', 'tenants:read:own')
  async get(@CurrentUser() user: UserContext) {
    return apiResponse(await this.brandingService.getBranding(user));
  }

  @Patch()
  @Throttle({ mutate: { limit: 20, ttl: 60000 } })
  @ApiHeader({ name: 'Idempotency-Key', required: false })
  @RequireAnyPermission('tenants:configure:own')
  async update(@CurrentUser() user: UserContext, @Body() body: UpdateBrandingDto) {
    return apiResponse(await this.brandingService.updateBranding(user, body));
  }
}
