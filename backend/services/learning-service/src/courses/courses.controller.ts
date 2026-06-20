import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CoursesService } from './courses.service';
import { ListCoursesQuery } from './dto/courses.dto';
import { CurrentUser, RequirePermission } from '../common/decorators';
import type { UserContext } from '../common/decorators';
import { apiResponse } from '../common/response.util';

@ApiTags('courses')
@ApiBearerAuth()
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  @RequirePermission('lessons:read:class')
  async list(@CurrentUser() user: UserContext, @Query() query: ListCoursesQuery) {
    const data = await this.coursesService.listCatalog(user, query);
    return apiResponse(data);
  }

  @Get(':id')
  @RequirePermission('lessons:read:class')
  async getById(@CurrentUser() user: UserContext, @Param('id') id: string) {
    const data = await this.coursesService.getById(user, id);
    return apiResponse(data);
  }

  @Get(':id/lessons')
  @RequirePermission('lessons:read:class')
  async getLessons(@CurrentUser() user: UserContext, @Param('id') id: string) {
    const data = await this.coursesService.getLessons(user, id);
    return apiResponse(data);
  }
}
