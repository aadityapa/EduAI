import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ExamsService } from './exams.service';
import { CurrentUser, RequireAnyPermission } from '../common/decorators';
import type { UserContext } from '../common/decorators';
import { apiResponse } from '../common/response.util';

@ApiTags('exams')
@ApiBearerAuth()
@Controller('exams')
export class ExamsController {
  constructor(private readonly examsService: ExamsService) {}

  @Get()
  @RequireAnyPermission('assessments:read:class', 'assessments:read:linked')
  async list(@CurrentUser() user: UserContext, @Query('classId') classId?: string) {
    return apiResponse(await this.examsService.listExams(user, classId));
  }

  @Get('student/:studentId/results')
  @RequireAnyPermission('assessments:read:own', 'assessments:read:class', 'assessments:read:linked')
  async studentResults(@CurrentUser() user: UserContext, @Param('studentId') studentId: string) {
    return apiResponse(await this.examsService.getStudentResults(user, studentId));
  }
}
