import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import type { AiConversation } from '@eduai/database';
import type { AiClient } from '@eduai/ai';
import { AI_CLIENT } from '../ai/ai-client.provider';
import { ConversationService } from '../conversation/conversation.service';
import { SecurityService } from '../security/security.service';
import { AuditService } from '../security/audit.service';
import { CostService } from '../cost/cost.service';
import type { UserContext } from '../common/decorators';
import type { HomeworkAnalyzeDto } from './dto/homework.dto';

@Injectable()
export class HomeworkService {
  constructor(
    @Inject(AI_CLIENT) private readonly aiClient: AiClient,
    private readonly conversationService: ConversationService,
    private readonly securityService: SecurityService,
    private readonly auditService: AuditService,
    private readonly costService: CostService,
  ) {}

  async analyze(user: UserContext, dto: HomeworkAnalyzeDto) {
    let text = dto.text?.trim() ?? '';

    if (dto.imageUrl) {
      const ocrText = await this.extractFromImage(dto.imageUrl);
      text = text ? `${text}\n\n${ocrText}` : ocrText;
    }

    if (dto.pdfUrl) {
      const pdfText = await this.extractFromPdf(dto.pdfUrl);
      text = text ? `${text}\n\n${pdfText}` : pdfText;
    }

    if (!text) {
      throw new BadRequestException('Provide text, imageUrl, or pdfUrl for homework analysis');
    }

    const guard = this.securityService.validateInput(text);
    if (!guard.safe) {
      throw new BadRequestException(guard.reason ?? 'Invalid input');
    }

    await this.costService.checkQuota(user.tenantId, user.sub, 1000);

    const conversation = await this.conversationService.findOrCreateConversation(
      user.tenantId,
      user.sub,
      'homework',
      dto.conversationId,
      { title: text.slice(0, 80) },
    );

    await this.conversationService.saveMessage(conversation.id, 'user', text);

    const analysis = await this.aiClient.analyzeHomework(text, {
      tenantId: user.tenantId,
      userId: user.sub,
      feature: 'homework',
    });

    const alternativeSolution = this.buildAlternativeSolution(analysis.steps);
    const similarQuestions = this.generateSimilarQuestions(text);

    const assistantContent = JSON.stringify({
      ...analysis,
      alternativeSolution,
      similarQuestions,
    });

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

    await this.auditService.logAiRequest(user.tenantId, user.sub, 'homework', {
      conversationId: conversation.id,
      ocrUsed: Boolean(dto.imageUrl),
      pdfUsed: Boolean(dto.pdfUrl),
    });

    return {
      conversationId: conversation.id,
      extractedText: text,
      ocrUsed: Boolean(dto.imageUrl),
      pdfUsed: Boolean(dto.pdfUrl),
      analysis: analysis.analysis,
      steps: analysis.steps,
      hints: analysis.hints,
      answer: analysis.answer,
      alternativeSolution,
      similarQuestions,
      tokensUsed: analysis.tokensUsed,
      model: analysis.model,
      provider: analysis.provider,
    };
  }

  async getHistory(user: UserContext, limit = 20): Promise<
    Array<AiConversation & { messages: Array<{ id: string; role: string; content: string }> }>
  > {
    return this.conversationService.listByType(user.tenantId, user.sub, 'homework', limit);
  }

  private buildAlternativeSolution(steps: string[]): string {
    if (steps.length === 0) return 'Try working backwards from the answer to verify.';
    return `Alternative approach: ${[...steps].reverse().join(' → ')}`;
  }

  private generateSimilarQuestions(text: string): string[] {
    const topic = text.slice(0, 40).replace(/\s+/g, ' ');
    return [
      `Practice a similar problem on the same topic: ${topic}`,
      'Solve a variation with different numbers but same concept',
      'Explain the underlying principle in your own words',
    ];
  }

  private async extractFromImage(imageUrl: string): Promise<string> {
    const apiKey = process.env.OPENAI_API_KEY;
    if (apiKey) {
      try {
        const { default: OpenAI } = await import('openai');
        const client = new OpenAI({ apiKey });
        const response = await client.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'user',
              content: [
                { type: 'text', text: 'Extract all text and math from this homework image.' },
                { type: 'image_url', image_url: { url: imageUrl } },
              ],
            },
          ],
          max_tokens: 1500,
        });
        return response.choices[0]?.message?.content ?? `[OCR] ${imageUrl}`;
      } catch {
        return `[OCR stub — vision API failed] ${imageUrl}`;
      }
    }
    return `[OCR stub] Extracted text from image: ${imageUrl}`;
  }

  private async extractFromPdf(pdfUrl: string): Promise<string> {
    return `[PDF stub] Extracted text from PDF: ${pdfUrl}. Configure vision API for full extraction.`;
  }
}
