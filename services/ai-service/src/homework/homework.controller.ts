import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { HomeworkService } from './homework.service';
import { HomeworkAnalyzeDto } from './dto/homework.dto';
import { CurrentUser, RequirePermission } from '../common/decorators';
import type { UserContext } from '../common/decorators';
import { apiResponse } from '../common/response.util';

@ApiTags('homework')
@ApiBearerAuth()
@Controller('homework')
export class HomeworkController {
  constructor(private readonly homeworkService: HomeworkService) {}

  @Post('analyze')
  @RequirePermission('ai:homework:use:own')
  async analyze(@CurrentUser() user: UserContext, @Body() dto: HomeworkAnalyzeDto) {
    const data = await this.homeworkService.analyze(user, dto);
    return apiResponse(data);
  }

  @Get('history')
  @RequirePermission('ai:homework:use:own')
  async history(@CurrentUser() user: UserContext, @Query('limit') limit?: string) {
    const data = await this.homeworkService.getHistory(user, Number(limit) || 20);
    return apiResponse(data);
  }
}
