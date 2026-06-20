import { Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { CurrentUser } from '../common/decorators';
import type { UserContext } from '../common/decorators';
import { apiResponse } from '../common/response.util';

@ApiTags('notifications')
@ApiBearerAuth()
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  async list(@CurrentUser() user: UserContext, @Query('unread') unread?: string) {
    return apiResponse(await this.notificationsService.listMine(user, unread === 'true'));
  }

  @Patch(':id/read')
  async markRead(@CurrentUser() user: UserContext, @Param('id') id: string) {
    return apiResponse(await this.notificationsService.markRead(user, id));
  }

  @Patch('read-all')
  async markAllRead(@CurrentUser() user: UserContext) {
    return apiResponse(await this.notificationsService.markAllRead(user));
  }
}
