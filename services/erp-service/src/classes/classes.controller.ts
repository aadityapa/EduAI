import { Controller, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ClassesService } from './classes.service';
import { CurrentUser, RequireAnyPermission } from '../common/decorators';
import type { UserContext } from '../common/decorators';
import { apiResponse } from '../common/response.util';

@ApiTags('classes')
@ApiBearerAuth()
@Controller('classes')
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Get()
  @RequireAnyPermission('attendance:read:school', 'attendance:write:class', 'enrollment:manage:school')
  async list(@CurrentUser() user: UserContext) {
    return apiResponse(await this.classesService.listClasses(user));
  }

  @Get('mine')
  @RequireAnyPermission('attendance:write:class', 'lessons:assign:class')
  async mine(@CurrentUser() user: UserContext) {
    return apiResponse(await this.classesService.getTeacherClasses(user));
  }

  @Get(':id')
  @RequireAnyPermission('attendance:read:school', 'attendance:write:class')
  async getOne(@CurrentUser() user: UserContext, @Param('id') id: string) {
    return apiResponse(await this.classesService.getClass(user, id));
  }
}
