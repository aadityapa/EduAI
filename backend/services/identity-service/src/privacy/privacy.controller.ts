import { Body, Controller, Get, Headers, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PrivacyService } from './privacy.service';
import { CreateDsrDto, UpdateDsrStatusDto } from './dto/privacy.dto';
import { CurrentUser, RequirePermission } from '../common/decorators';
import type { UserContext } from '../common/decorators';
import { apiResponse } from '../common/response.util';

@ApiTags('privacy')
@ApiBearerAuth()
@Controller('privacy')
export class PrivacyController {
  constructor(private readonly privacyService: PrivacyService) {}

  @Get('dsr')
  @RequirePermission('privacy:export:own')
  async listMine(@CurrentUser() user: UserContext) {
    return apiResponse(await this.privacyService.listMine(user));
  }

  @Get('dsr/tenant')
  @RequirePermission('privacy:manage:tenant')
  async listTenant(@CurrentUser() user: UserContext) {
    return apiResponse(await this.privacyService.listTenant(user));
  }

  @Post('dsr')
  async create(
    @CurrentUser() user: UserContext,
    @Body() dto: CreateDsrDto,
    @Headers('x-forwarded-for') fwd?: string,
  ) {
    const ip = fwd?.split(',')[0]?.trim();
    return apiResponse(await this.privacyService.create(user, dto, ip));
  }

  @Get('dsr/:id/export')
  async getExport(@CurrentUser() user: UserContext, @Param('id') id: string) {
    return apiResponse(await this.privacyService.getExport(user, id));
  }

  @Patch('dsr/:id')
  @RequirePermission('privacy:manage:tenant')
  async updateStatus(
    @CurrentUser() user: UserContext,
    @Param('id') id: string,
    @Body() dto: UpdateDsrStatusDto,
    @Headers('x-forwarded-for') fwd?: string,
  ) {
    const ip = fwd?.split(',')[0]?.trim();
    return apiResponse(await this.privacyService.updateStatus(user, id, dto, ip));
  }
}
