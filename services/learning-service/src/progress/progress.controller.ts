import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ProgressService } from './progress.service';
import { UpdateLessonProgressDto } from './dto/progress.dto';
import { CurrentUser, RequirePermission } from '../common/decorators';
import type { UserContext } from '../common/decorators';
import { apiResponse } from '../common/response.util';

@ApiTags('progress')
@ApiBearerAuth()
@Controller('progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Get('me')
  @RequirePermission('progress:read:own')
  async getMyProgress(@CurrentUser() user: UserContext) {
    const data = await this.progressService.getMyProgress(user);
    return apiResponse(data);
  }

  @Patch('lessons/:lessonId')
  @RequirePermission('lessons:complete:own')
  async updateLessonProgress(
    @CurrentUser() user: UserContext,
    @Param('lessonId') lessonId: string,
    @Body() dto: UpdateLessonProgressDto,
  ) {
    const data = await this.progressService.updateLessonProgress(user, lessonId, dto);
    return apiResponse(data);
  }
}
