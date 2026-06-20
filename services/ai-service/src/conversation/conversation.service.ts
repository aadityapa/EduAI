import { Injectable } from '@nestjs/common';
import type { AiConversation, AiConversationType, AiMessage, AiMessageRole, Prisma } from '@eduai/database';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ConversationService {
  constructor(private readonly prisma: PrismaService) {}

  async findOrCreateConversation(
    tenantId: string,
    userId: string,
    type: AiConversationType,
    conversationId?: string,
    context?: { lessonId?: string; subjectId?: string; title?: string },
  ): Promise<AiConversation> {
    if (conversationId) {
      const existing = await this.prisma.aiConversation.findFirst({
        where: { id: conversationId, tenantId, userId },
      });
      if (existing) return existing;
    }

    return this.prisma.aiConversation.create({
      data: {
        tenantId,
        userId,
        type,
        contextLessonId: context?.lessonId,
        contextSubjectId: context?.subjectId,
        title: context?.title,
      },
    });
  }

  async getConversationHistory(
    conversationId: string,
    tenantId: string,
    userId: string,
  ): Promise<(AiConversation & { messages: AiMessage[] }) | null> {
    const conversation = await this.prisma.aiConversation.findFirst({
      where: { id: conversationId, tenantId, userId },
      include: {
        messages: { orderBy: { createdAt: 'asc' }, take: 20 },
      },
    });
    return conversation;
  }

  async saveMessage(
    conversationId: string,
    role: AiMessageRole,
    content: string,
    tokensUsed = 0,
    model?: string,
    metadata?: Prisma.InputJsonValue,
  ): Promise<AiMessage> {
    const message = await this.prisma.aiMessage.create({
      data: {
        conversationId,
        role,
        content,
        tokensUsed,
        model,
        metadata: metadata ?? {},
      },
    });

    await this.prisma.aiConversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });

    return message;
  }

  async recordQuotaUsage(tenantId: string, userId: string, tokensUsed: number): Promise<void> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await this.prisma.aiQuotaUsage.upsert({
      where: {
        tenantId_userId_usageDate: {
          tenantId,
          userId,
          usageDate: today,
        },
      },
      create: {
        tenantId,
        userId,
        usageDate: today,
        queryCount: 1,
        tokensUsed,
      },
      update: {
        queryCount: { increment: 1 },
        tokensUsed: { increment: tokensUsed },
      },
    });
  }
}
