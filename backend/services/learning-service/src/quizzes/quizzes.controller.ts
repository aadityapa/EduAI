import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { QuizzesService } from './quizzes.service';
import { SubmitQuizAttemptDto } from './dto/quizzes.dto';
import { CurrentUser, RequirePermission } from '../common/decorators';
import type { UserContext } from '../common/decorators';
import { apiResponse } from '../common/response.util';

@ApiTags('quizzes')
@ApiBearerAuth()
@Controller('quizzes')
export class QuizzesController {
  constructor(private readonly quizzesService: QuizzesService) {}

  @Get(':id')
  @RequirePermission('assessments:read:own')
  async getQuiz(@CurrentUser() user: UserContext, @Param('id') id: string) {
    const data = await this.quizzesService.getQuiz(user, id);
    return apiResponse(data);
  }

  @Post(':id/attempts')
  @RequirePermission('assessments:take:own')
  async startAttempt(@CurrentUser() user: UserContext, @Param('id') id: string) {
    const data = await this.quizzesService.startAttempt(user, id);
    return apiResponse(data);
  }

  @Post('attempts/:attemptId/submit')
  @RequirePermission('assessments:take:own')
  async submitAttempt(
    @CurrentUser() user: UserContext,
    @Param('attemptId') attemptId: string,
    @Body() dto: SubmitQuizAttemptDto,
  ) {
    const data = await this.quizzesService.submitAttempt(user, attemptId, dto);
    return apiResponse(data);
  }
}
