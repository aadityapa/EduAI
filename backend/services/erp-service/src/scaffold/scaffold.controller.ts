import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ScaffoldService } from './scaffold.service';
import { CurrentUser, RequireAnyPermission } from '../common/decorators';
import type { UserContext } from '../common/decorators';
import { apiResponse } from '../common/response.util';

@ApiTags('scaffold')
@ApiBearerAuth()
@Controller('scaffold')
export class ScaffoldController {
  constructor(private readonly scaffoldService: ScaffoldService) {}

  @Get('transport')
  @RequireAnyPermission('enrollment:manage:school', 'attendance:read:school')
  async transport(@CurrentUser() user: UserContext) {
    return apiResponse(await this.scaffoldService.listTransport(user));
  }

  @Get('hostel')
  @RequireAnyPermission('enrollment:manage:school')
  async hostel(@CurrentUser() user: UserContext) {
    return apiResponse(await this.scaffoldService.listHostelRooms(user));
  }

  @Get('library')
  @RequireAnyPermission('content:read:tenant')
  async library(@CurrentUser() user: UserContext) {
    return apiResponse(await this.scaffoldService.listLibraryBooks(user));
  }

  @Get('inventory')
  @RequireAnyPermission('enrollment:manage:school')
  async inventory(@CurrentUser() user: UserContext) {
    return apiResponse(await this.scaffoldService.listInventory(user));
  }
}
