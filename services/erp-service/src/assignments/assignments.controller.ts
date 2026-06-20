import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AssignmentsService } from './assignments.service';
import { CreateAssignmentDto } from './dto/assignments.dto';
import { CurrentUser, RequireAnyPermission, RequirePermission } from '../common/decorators';
import type { UserContext } from '../common/decorators';
import { apiResponse } from '../common/response.util';

@ApiTags('assignments')
@ApiBearerAuth()
@Controller('assignments')
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  @Post()
  @RequirePermission('lessons:assign:class')
  async create(@CurrentUser() user: UserContext, @Body() dto: CreateAssignmentDto) {
    return apiResponse(await this.assignmentsService.create(user, dto));
  }

  @Get('mine')
  @RequirePermission('lessons:assign:class')
  async mine(@CurrentUser() user: UserContext) {
    return apiResponse(await this.assignmentsService.listMine(user));
  }

  @Get('class/:classId')
  @RequireAnyPermission('lessons:read:class', 'lessons:assign:class', 'progress:read:linked')
  async byClass(@CurrentUser() user: UserContext, @Param('classId') classId: string) {
    return apiResponse(await this.assignmentsService.listByClass(user, classId));
  }

  @Get('student/:studentId/homework')
  @RequireAnyPermission('progress:read:linked', 'lessons:read:class')
  async homework(@CurrentUser() user: UserContext, @Param('studentId') studentId: string) {
    return apiResponse(await this.assignmentsService.getStudentHomework(user, studentId));
  }

  @Patch(':id/publish')
  @RequirePermission('lessons:assign:class')
  async publish(@CurrentUser() user: UserContext, @Param('id') id: string) {
    return apiResponse(await this.assignmentsService.publish(user, id));
  }
}
