import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TutorService } from './tutor.service';
import { TutorChatDto } from './dto/tutor.dto';
import { CurrentUser, RequirePermission } from '../common/decorators';
import type { UserContext } from '../common/decorators';
import { apiResponse } from '../common/response.util';

@ApiTags('tutor')
@ApiBearerAuth()
@Controller('tutor')
export class TutorController {
  constructor(private readonly tutorService: TutorService) {}

  @Post('chat')
  @RequirePermission('ai:tutor:use:own')
  async chat(@CurrentUser() user: UserContext, @Body() dto: TutorChatDto) {
    const data = await this.tutorService.chat(user, dto);
    return apiResponse(data);
  }
}
