import { Controller, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FeesService } from './fees.service';
import { CurrentUser, RequireAnyPermission } from '../common/decorators';
import type { UserContext } from '../common/decorators';
import { apiResponse } from '../common/response.util';

@ApiTags('fees')
@ApiBearerAuth()
@Controller('fees')
export class FeesController {
  constructor(private readonly feesService: FeesService) {}

  @Get('me')
  async mine(@CurrentUser() user: UserContext) {
    return apiResponse(await this.feesService.getMyFees(user));
  }

  @Get('children')
  @RequireAnyPermission('billing:manage:linked')
  async children(@CurrentUser() user: UserContext) {
    return apiResponse(await this.feesService.getLinkedChildrenFees(user));
  }

  @Get('student/:studentId')
  @RequireAnyPermission('billing:read:school', 'billing:manage:linked', 'billing:manage:own')
  async student(@CurrentUser() user: UserContext, @Param('studentId') studentId: string) {
    return apiResponse(await this.feesService.getStudentFees(user, studentId));
  }
}
