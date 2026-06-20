import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GeneratorsService } from './generators.service';
import { GenerateMockTestDto, GenerateQuestionsDto } from './dto/generators.dto';
import { CurrentUser, RequirePermission } from '../common/decorators';
import type { UserContext } from '../common/decorators';
import { apiResponse } from '../common/response.util';

@ApiTags('generators')
@ApiBearerAuth()
@Controller('generators')
export class GeneratorsController {
  constructor(private readonly generatorsService: GeneratorsService) {}

  @Post('questions')
  @RequirePermission('ai:qpg:use:school')
  async generateQuestions(
    @CurrentUser() user: UserContext,
    @Body() dto: GenerateQuestionsDto,
  ) {
    const data = await this.generatorsService.generateQuestions(user, dto);
    return apiResponse(data);
  }

  @Post('mock-test')
  @RequirePermission('ai:qpg:use:school')
  async generateMockTest(
    @CurrentUser() user: UserContext,
    @Body() dto: GenerateMockTestDto,
  ) {
    const data = await this.generatorsService.generateMockTest(user, dto);
    return apiResponse(data);
  }
}
