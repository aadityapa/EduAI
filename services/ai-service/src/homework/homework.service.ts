import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import type { AiClient } from '@eduai/ai';
import { AI_CLIENT } from '../ai/ai-client.provider';
import { ConversationService } from '../conversation/conversation.service';
import type { UserContext } from '../common/decorators';
import type { HomeworkAnalyzeDto } from './dto/homework.dto';

@Injectable()
export class HomeworkService {
  constructor(
    @Inject(AI_CLIENT) private readonly aiClient: AiClient,
    private readonly conversationService: ConversationService,
  ) {}

  async analyze(user: UserContext, dto: HomeworkAnalyzeDto) {
    let text = dto.text?.trim() ?? '';

    if (dto.imageUrl) {
      const ocrText = await this.stubOcr(dto.imageUrl);
      text = text ? `${text}\n\n${ocrText}` : ocrText;
    }

    if (!text) {
      throw new BadRequestException('Provide text or imageUrl for homework analysis');
    }

    const conversation = await this.conversationService.findOrCreateConversation(
      user.tenantId,
      user.sub,
      'homework',
      undefined,
      { title: text.slice(0, 80) },
    );

    await this.conversationService.saveMessage(conversation.id, 'user', text);

    const analysis = await this.aiClient.analyzeHomework(text, {
      tenantId: user.tenantId,
      userId: user.sub,
      feature: 'homework',
    });

    const assistantContent = JSON.stringify(analysis);
    await this.conversationService.saveMessage(
      conversation.id,
      'assistant',
      assistantContent,
      analysis.tokensUsed,
      analysis.model,
      { provider: analysis.provider },
    );

    await this.conversationService.recordQuotaUsage(
      user.tenantId,
      user.sub,
      analysis.tokensUsed,
    );

    return {
      conversationId: conversation.id,
      extractedText: text,
      ocrUsed: Boolean(dto.imageUrl),
      ...analysis,
    };
  }

  /** Stub OCR — Sprint 8 will integrate vision/OCR provider */
  private async stubOcr(imageUrl: string): Promise<string> {
    return `[OCR stub] Extracted text from image: ${imageUrl}`;
  }
}
