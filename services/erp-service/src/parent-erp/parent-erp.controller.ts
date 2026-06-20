import { Controller, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ParentErpService } from './parent-erp.service';
import { CurrentUser, RequirePermission } from '../common/decorators';
import type { UserContext } from '../common/decorators';
import { apiResponse } from '../common/response.util';

@ApiTags('parent-erp')
@ApiBearerAuth()
@Controller('parent')
export class ParentErpController {
  constructor(private readonly parentErpService: ParentErpService) {}

  @Get('children/:studentId/dashboard')
  @RequirePermission('progress:read:linked')
  async childDashboard(@CurrentUser() user: UserContext, @Param('studentId') studentId: string) {
    return apiResponse(await this.parentErpService.getChildDashboard(user, studentId));
  }
}
