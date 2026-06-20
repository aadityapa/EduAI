import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GamificationService } from './gamification.service';
import { InternalAwardDto } from './dto/gamification.dto';
import { CurrentUser, Internal, RequirePermission } from '../common/decorators';
import type { UserContext } from '../common/decorators';
import { apiResponse } from '../common/response.util';

@ApiTags('gamification')
@Controller('gamification')
export class GamificationController {
  constructor(private readonly gamificationService: GamificationService) {}

  @Get('me')
  @ApiBearerAuth()
  @RequirePermission('gamification:read:own')
  async getMe(@CurrentUser() user: UserContext) {
    const data = await this.gamificationService.getMyGamification(user);
    return apiResponse(data);
  }

  @Get('leaderboard')
  @ApiBearerAuth()
  @RequirePermission('leaderboard:read:class')
  async getLeaderboard(@CurrentUser() user: UserContext) {
    const data = await this.gamificationService.getLeaderboard(user);
    return apiResponse(data);
  }

  @Post('internal/award')
  @Internal()
  async internalAward(@Body() dto: InternalAwardDto) {
    const data =
      dto.eventType === 'lesson_complete'
        ? await this.gamificationService.awardLessonComplete(
            dto.tenantId,
            dto.userId,
            dto.resourceId ?? '',
          )
        : await this.gamificationService.awardQuizPass(
            dto.tenantId,
            dto.userId,
            dto.resourceId ?? '',
            dto.score ?? 0,
          );

    return apiResponse(data);
  }
}
