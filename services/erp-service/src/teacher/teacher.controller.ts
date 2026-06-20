import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TeacherService } from './teacher.service';
import { CurrentUser, RequireAnyPermission } from '../common/decorators';
import type { UserContext } from '../common/decorators';
import { apiResponse } from '../common/response.util';

@ApiTags('teacher')
@ApiBearerAuth()
@Controller('teacher')
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

  @Get('dashboard')
  @RequireAnyPermission('attendance:write:class', 'lessons:assign:class')
  async dashboard(@CurrentUser() user: UserContext) {
    return apiResponse(await this.teacherService.getDashboard(user));
  }
}
