import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ConversationService } from './conversation.service';
import { CurrentUser, RequirePermission } from '../common/decorators';
import type { UserContext } from '../common/decorators';
import { apiResponse } from '../common/response.util';
import { PrismaService } from '../prisma/prisma.service';

@ApiTags('conversations')
@ApiBearerAuth()
@Controller('conversations')
export class ConversationController {
  constructor(
    private readonly conversationService: ConversationService,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  @RequirePermission('ai:tutor:use:own')
  async list(
    @CurrentUser() user: UserContext,
    @Query('type') type?: string,
    @Query('limit') limit?: string,
  ) {
    const conversations = await this.prisma.aiConversation.findMany({
      where: {
        tenantId: user.tenantId,
        userId: user.sub,
        ...(type ? { type: type as 'tutor' | 'homework' | 'general' } : {}),
      },
      orderBy: { updatedAt: 'desc' },
      take: Math.min(Number(limit) || 20, 50),
      select: {
        id: true,
        type: true,
        title: true,
        contextSubjectId: true,
        contextLessonId: true,
        createdAt: true,
        updatedAt: true,
        _count: { select: { messages: true } },
      },
    });

    return apiResponse(conversations);
  }

  @Get(':id')
  @RequirePermission('ai:tutor:use:own')
  async get(@CurrentUser() user: UserContext, @Param('id') id: string) {
    const conversation = await this.conversationService.getConversationHistory(
      id,
      user.tenantId,
      user.sub,
    );
    return apiResponse(conversation);
  }
}
