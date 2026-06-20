import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { HubService } from './hub.service';
import { HubQuery } from './dto/hub.dto';
import { CurrentUser, RequirePermission } from '../common/decorators';
import type { UserContext } from '../common/decorators';
import { apiResponse } from '../common/response.util';

@ApiTags('hub')
@ApiBearerAuth()
@Controller('hub')
export class HubController {
  constructor(private readonly hubService: HubService) {}

  @Get()
  @RequirePermission('lessons:read:class')
  async getHub(@CurrentUser() user: UserContext, @Query() query: HubQuery) {
    const data = await this.hubService.getLearningHub(user, query);
    return apiResponse(data);
  }
}
