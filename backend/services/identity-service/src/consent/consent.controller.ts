import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ConsentService } from './consent.service';
import {
  GrantConsentDto,
  VerifyParentalConsentDto,
  WithdrawConsentDto,
} from './dto/consent.dto';
import { CurrentUser, RequirePermission } from '../common/decorators';
import type { UserContext } from '../common/decorators';
import { apiResponse } from '../common/response.util';

@ApiTags('consent')
@ApiBearerAuth()
@Controller('consent')
export class ConsentController {
  constructor(private readonly consentService: ConsentService) {}

  @Get()
  @RequirePermission('consent:manage:own')
  async listMine(@CurrentUser() user: UserContext) {
    return apiResponse(await this.consentService.listMine(user));
  }

  @Get('tenant')
  @RequirePermission('consent:read:tenant')
  async listTenant(@CurrentUser() user: UserContext) {
    return apiResponse(await this.consentService.listTenant(user));
  }

  @Post()
  async grant(
    @CurrentUser() user: UserContext,
    @Body() dto: GrantConsentDto,
    @Headers('x-forwarded-for') fwd?: string,
  ) {
    const ip = fwd?.split(',')[0]?.trim();
    return apiResponse(await this.consentService.grant(user, dto, ip));
  }

  @Post(':id/verify')
  async verify(
    @CurrentUser() user: UserContext,
    @Param('id') id: string,
    @Body() dto: VerifyParentalConsentDto,
    @Headers('x-forwarded-for') fwd?: string,
  ) {
    const ip = fwd?.split(',')[0]?.trim();
    return apiResponse(await this.consentService.verifyParental(user, id, dto, ip));
  }

  @Post(':id/withdraw')
  async withdraw(
    @CurrentUser() user: UserContext,
    @Param('id') id: string,
    @Body() dto: WithdrawConsentDto,
    @Headers('x-forwarded-for') fwd?: string,
  ) {
    const ip = fwd?.split(',')[0]?.trim();
    return apiResponse(await this.consentService.withdraw(user, id, dto, ip));
  }
}
