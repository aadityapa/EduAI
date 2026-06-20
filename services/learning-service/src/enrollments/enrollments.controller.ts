import { Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { EnrollmentsService } from './enrollments.service';
import { CurrentUser, RequireAnyPermission, RequirePermission } from '../common/decorators';
import type { UserContext } from '../common/decorators';
import { apiResponse } from '../common/response.util';

@ApiTags('enrollments')
@ApiBearerAuth()
@Controller()
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Post('courses/:id/enroll')
  @RequirePermission('lessons:read:class')
  async enroll(@CurrentUser() user: UserContext, @Param('id') courseId: string) {
    const data = await this.enrollmentsService.enroll(user, courseId);
    return apiResponse(data);
  }

  @Get('enrollments/me')
  @RequireAnyPermission('lessons:read:class', 'progress:read:own')
  async myEnrollments(@CurrentUser() user: UserContext) {
    const data = await this.enrollmentsService.getMyEnrollments(user);
    return apiResponse(data);
  }
}
