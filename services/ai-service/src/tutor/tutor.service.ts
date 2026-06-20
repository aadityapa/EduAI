import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import type { AiClient } from '@eduai/ai';
import { AI_CLIENT } from '../ai/ai-client.provider';
import { ConversationService } from '../conversation/conversation.service';
import { SecurityService } from '../security/security.service';
import { AuditService } from '../security/audit.service';
import { CostService } from '../cost/cost.service';
import { LoggerService } from '../observability/logger.service';
import { MetricsService } from '../observability/metrics.service';
import { TracingService } from '../observability/tracing.service';
import type { UserContext } from '../common/decorators';
import type { TutorChatDto } from './dto/tutor.dto';
import type { Response } from 'express';

@Injectable()
export class TutorService {
  constructor(
    @Inject(AI_CLIENT) private readonly aiClient: AiClient,
    private readonly conversationService: ConversationService,
    private readonly securityService: SecurityService,
    private readonly auditService: AuditService,
    private readonly costService: CostService,
    private readonly logger: LoggerService,
    private readonly metrics: MetricsService,
    private readonly tracing: TracingService,
  ) {}

  async chat(user: UserContext, dto: TutorChatDto) {
    const start = Date.now();
    const span = this.tracing.startSpan('tutor.chat', {
      tenantId: user.tenantId,
      userId: user.sub,
    });

    try {
      const guard = this.securityService.validateInput(dto.message);
      if (!guard.safe) {
        throw new BadRequestException(guard.reason ?? 'Invalid message');
      }

      await this.costService.checkQuota(user.tenantId, user.sub, 500);

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
        classLevel: dto.classLevel,
      });

      const filtered = this.securityService.filterOutput(result.content);

      await this.conversationService.saveMessage(
        conversation.id,
        'assistant',
        filtered.filtered ?? result.content,
        result.tokensUsed.total,
        result.model,
        {
          provider: result.provider,
          sources: dto.lessonId ? [{ type: 'lesson', id: dto.lessonId }] : [],
        },
      );

      await this.conversationService.recordQuotaUsage(
        user.tenantId,
        user.sub,
        result.tokensUsed.total,
      );

      await this.auditService.logAiRequest(user.tenantId, user.sub, 'tutor', {
        conversationId: conversation.id,
        tokensUsed: result.tokensUsed.total,
      });

      this.metrics.recordRequest('tutor', 'success', Date.now() - start);
      this.logger.info('Tutor chat completed', {
        tenantId: user.tenantId,
        userId: user.sub,
        feature: 'tutor',
        durationMs: Date.now() - start,
      });

      return {
        conversationId: conversation.id,
        message: filtered.filtered ?? result.content,
        model: result.model,
        provider: result.provider,
        tokensUsed: result.tokensUsed.total,
        sources: dto.lessonId ? [{ type: 'lesson', id: dto.lessonId, label: dto.lessonId }] : [],
      };
    } catch (error) {
      this.metrics.recordRequest('tutor', 'error', Date.now() - start);
      throw error;
    } finally {
      this.tracing.endSpan(span);
    }
  }

  async streamChat(user: UserContext, dto: TutorChatDto, res: Response): Promise<void> {
    const guard = this.securityService.validateInput(dto.message);
    if (!guard.safe) {
      res.status(400).json({ error: guard.reason });
      return;
    }

    await this.costService.checkQuota(user.tenantId, user.sub, 500);

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

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders?.();

    const userContent = dto.message;
    let fullContent = '';
    let tokensUsed = 0;
    let model = 'mock-v1';
    let provider = 'mock';

    try {
      for await (const chunk of this.aiClient.streamChat(
        [...chatHistory, { role: 'user', content: userContent }],
        {
          context: {
            tenantId: user.tenantId,
            userId: user.sub,
            feature: 'tutor',
            subject: dto.subjectId,
            lessonTitle: dto.lessonId,
          },
        },
      )) {
        if (chunk.type === 'delta' && chunk.content) {
          fullContent += chunk.content;
          res.write(`data: ${JSON.stringify({ type: 'delta', content: chunk.content })}\n\n`);
        } else if (chunk.type === 'done') {
          tokensUsed = chunk.tokensUsed ?? 0;
          model = chunk.model ?? model;
          provider = chunk.provider ?? provider;
          fullContent = chunk.content ?? fullContent;
        } else if (chunk.type === 'error') {
          res.write(`data: ${JSON.stringify({ type: 'error', error: chunk.error })}\n\n`);
          res.end();
          return;
        }
      }

      await this.conversationService.saveMessage(
        conversation.id,
        'assistant',
        fullContent,
        tokensUsed,
        model,
        { provider, sources: dto.lessonId ? [{ type: 'lesson', id: dto.lessonId }] : [] },
      );

      await this.conversationService.recordQuotaUsage(user.tenantId, user.sub, tokensUsed);
      await this.auditService.logAiRequest(user.tenantId, user.sub, 'tutor-stream', {
        conversationId: conversation.id,
        tokensUsed,
      });

      res.write(
        `data: ${JSON.stringify({
          type: 'done',
          conversationId: conversation.id,
          tokensUsed,
          model,
          provider,
        })}\n\n`,
      );
      res.end();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Stream failed';
      res.write(`data: ${JSON.stringify({ type: 'error', error: message })}\n\n`);
      res.end();
    }
  }
}
