import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AttendanceService } from './attendance.service';
import { MarkAttendanceDto } from './dto/attendance.dto';
import { CurrentUser, RequireAnyPermission, RequirePermission } from '../common/decorators';
import type { UserContext } from '../common/decorators';
import { apiResponse } from '../common/response.util';

@ApiTags('attendance')
@ApiBearerAuth()
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post()
  @RequirePermission('attendance:write:class')
  async mark(@CurrentUser() user: UserContext, @Body() dto: MarkAttendanceDto) {
    return apiResponse(await this.attendanceService.markAttendance(user, dto));
  }

  @Get('class/:classId')
  @RequireAnyPermission('attendance:read:school', 'attendance:write:class')
  async classAttendance(
    @CurrentUser() user: UserContext,
    @Param('classId') classId: string,
    @Query('date') date?: string,
  ) {
    return apiResponse(await this.attendanceService.getClassAttendance(user, classId, date));
  }

  @Get('student/:studentId')
  @RequireAnyPermission('attendance:read:school', 'attendance:read:linked', 'progress:read:own')
  async studentAttendance(
    @CurrentUser() user: UserContext,
    @Param('studentId') studentId: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return apiResponse(await this.attendanceService.getStudentAttendance(user, studentId, from, to));
  }
}
