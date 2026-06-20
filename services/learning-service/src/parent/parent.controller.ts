import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ParentService } from './parent.service';
import { LinkParentDto } from './dto/parent.dto';
import { CurrentUser, RequirePermission } from '../common/decorators';
import type { UserContext } from '../common/decorators';
import { apiResponse } from '../common/response.util';

@ApiTags('parent')
@ApiBearerAuth()
@Controller('parent')
export class ParentController {
  constructor(private readonly parentService: ParentService) {}

  @Get('children')
  @RequirePermission('users:read:linked')
  async getChildren(@CurrentUser() user: UserContext) {
    const data = await this.parentService.getChildren(user);
    return apiResponse(data);
  }

  @Post('link')
  @RequirePermission('users:link_parent:own')
  async linkChild(@CurrentUser() user: UserContext, @Body() dto: LinkParentDto) {
    const data = await this.parentService.linkChild(user, dto);
    return apiResponse(data);
  }

  @Get('children/:studentId/report')
  @RequirePermission('progress:read:linked')
  async getChildReport(
    @CurrentUser() user: UserContext,
    @Param('studentId') studentId: string,
  ) {
    const data = await this.parentService.getChildReport(user, studentId);
    return apiResponse(data);
  }
}
