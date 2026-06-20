import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SchoolsService } from './schools.service';
import { CurrentUser, RequireAnyPermission } from '../common/decorators';
import type { UserContext } from '../common/decorators';
import { apiResponse } from '../common/response.util';

@ApiTags('schools')
@ApiBearerAuth()
@Controller('schools')
export class SchoolsController {
  constructor(private readonly schoolsService: SchoolsService) {}

  @Get()
  @RequireAnyPermission('enrollment:manage:school', 'analytics:read:school', 'attendance:read:school')
  async list(@CurrentUser() user: UserContext) {
    return apiResponse(await this.schoolsService.listSchools(user));
  }
}
