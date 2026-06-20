import { Body, Controller, Post, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { GeneratorsService } from './generators.service';
import {
  EvaluateMockTestDto,
  GenerateMockTestDto,
  GenerateQuestionsDto,
} from './dto/generators.dto';
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

  @Post('questions/export/pdf')
  @RequirePermission('ai:qpg:use:school')
  async exportPdf(
    @CurrentUser() user: UserContext,
    @Body() dto: GenerateQuestionsDto,
    @Res() res: Response,
  ) {
    const { buffer, filename, contentType } = await this.generatorsService.exportQuestionsPdf(
      user,
      dto,
    );
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(buffer);
  }

  @Post('questions/export/docx')
  @RequirePermission('ai:qpg:use:school')
  async exportDocx(
    @CurrentUser() user: UserContext,
    @Body() dto: GenerateQuestionsDto,
    @Res() res: Response,
  ) {
    const { buffer, filename, contentType } = await this.generatorsService.exportQuestionsDocx(
      user,
      dto,
    );
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(buffer);
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

  @Post('mock-test/evaluate')
  @RequirePermission('ai:qpg:use:school')
  async evaluateMockTest(@Body() dto: EvaluateMockTestDto) {
    const data = this.generatorsService.evaluateMockTest(dto.questions, dto.answers);
    return apiResponse(data);
  }
}
