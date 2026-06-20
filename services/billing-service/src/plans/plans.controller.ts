import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PlansService } from './plans.service';
import { Public } from '../common/decorators';
import { apiResponse } from '../common/response.util';

@ApiTags('plans')
@Controller('plans')
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

  @Get()
  @Public()
  async list() {
    return apiResponse(await this.plansService.listPlans());
  }

  @Get(':code')
  @Public()
  async get(@Param('code') code: string) {
    return apiResponse(await this.plansService.getPlan(code));
  }
}
