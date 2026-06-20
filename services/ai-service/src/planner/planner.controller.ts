import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PlannerService } from './planner.service';
import { PlannerGenerateDto } from './dto/planner.dto';
import { CurrentUser, RequirePermission } from '../common/decorators';
import type { UserContext } from '../common/decorators';
import { apiResponse } from '../common/response.util';

@ApiTags('planner')
@ApiBearerAuth()
@Controller('planner')
export class PlannerController {
  constructor(private readonly plannerService: PlannerService) {}

  @Post('generate')
  @RequirePermission('ai:tutor:use:own')
  async generate(@CurrentUser() user: UserContext, @Body() dto: PlannerGenerateDto) {
    const data = await this.plannerService.generate(user, dto);
    return apiResponse(data);
  }
}
