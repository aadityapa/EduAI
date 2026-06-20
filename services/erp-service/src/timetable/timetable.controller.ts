import { Controller, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TimetableService } from './timetable.service';
import { CurrentUser, RequireAnyPermission } from '../common/decorators';
import type { UserContext } from '../common/decorators';
import { apiResponse } from '../common/response.util';

@ApiTags('timetable')
@ApiBearerAuth()
@Controller('timetable')
export class TimetableController {
  constructor(private readonly timetableService: TimetableService) {}

  @Get('me')
  async mine(@CurrentUser() user: UserContext) {
    return apiResponse(await this.timetableService.getMyTimetable(user));
  }

  @Get('class/:classId')
  @RequireAnyPermission('attendance:read:school', 'attendance:write:class', 'lessons:read:class')
  async classTimetable(@CurrentUser() user: UserContext, @Param('classId') classId: string) {
    return apiResponse(await this.timetableService.getClassTimetable(user, classId));
  }
}
