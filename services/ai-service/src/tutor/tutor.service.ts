import { Inject, Injectable } from '@nestjs/common';
import type { AiClient } from '@eduai/ai';
import { AI_CLIENT } from '../ai/ai-client.provider';
import { ConversationService } from '../conversation/conversation.service';
import type { UserContext } from '../common/decorators';
import type { TutorChatDto } from './dto/tutor.dto';

@Injectable()
export class TutorService {
  constructor(
    @Inject(AI_CLIENT) private readonly aiClient: AiClient,
    private readonly conversationService: ConversationService,
  ) {}

  async chat(user: UserContext, dto: TutorChatDto) {
    const conversation = await this.conversationService.findOrCreateConversation(
      user.tenantId,
      user.sub,
      'tutor',
      dto.conversationId,
      {
        lessonId: dto.lessonId,
        subjectId: dto.subjectId,
        title: dto.message.slice(0, 80),
      },
    );

    const history = await this.conversationService.getConversationHistory(
      conversation.id,
      user.tenantId,
      user.sub,
    );

    const chatHistory =
      history?.messages.map((m) => ({
        role: m.role as 'user' | 'assistant' | 'system',
        content: m.content,
      })) ?? [];

    await this.conversationService.saveMessage(conversation.id, 'user', dto.message);

    const result = await this.aiClient.tutorMessage(dto.message, chatHistory, {
      tenantId: user.tenantId,
      userId: user.sub,
      subject: dto.subjectId,
      lessonTitle: dto.lessonId,
    });

    await this.conversationService.saveMessage(
      conversation.id,
      'assistant',
      result.content,
      result.tokensUsed.total,
      result.model,
      { provider: result.provider },
    );

    await this.conversationService.recordQuotaUsage(
      user.tenantId,
      user.sub,
      result.tokensUsed.total,
    );

    return {
      conversationId: conversation.id,
      message: result.content,
      model: result.model,
      provider: result.provider,
      tokensUsed: result.tokensUsed.total,
    };
  }
}
