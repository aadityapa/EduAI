import { Inject, Injectable } from '@nestjs/common';
import type { AiClient } from '@eduai/ai';
import { AI_CLIENT } from '../ai/ai-client.provider';
import { ConversationService } from '../conversation/conversation.service';
import type { UserContext } from '../common/decorators';
import type { PlannerGenerateDto } from './dto/planner.dto';

@Injectable()
export class PlannerService {
  constructor(
    @Inject(AI_CLIENT) private readonly aiClient: AiClient,
    private readonly conversationService: ConversationService,
  ) {}

  async generate(user: UserContext, dto: PlannerGenerateDto) {
    const plan = await this.aiClient.planStudy(
      {
        subjects: dto.subjects,
        goals: dto.goals,
        availableHoursPerWeek: dto.availableHoursPerWeek,
        examDate: dto.examDate,
        classLevel: dto.classLevel,
      },
      { tenantId: user.tenantId, userId: user.sub, feature: 'planner' },
    );

    const conversation = await this.conversationService.findOrCreateConversation(
      user.tenantId,
      user.sub,
      'general',
      undefined,
      { title: `Study plan: ${dto.subjects.join(', ')}` },
    );

    await this.conversationService.saveMessage(conversation.id, 'user', JSON.stringify(dto));
    await this.conversationService.saveMessage(
      conversation.id,
      'assistant',
      JSON.stringify(plan),
      0,
      'planner',
    );

    await this.conversationService.recordQuotaUsage(user.tenantId, user.sub, 0);

    return { conversationId: conversation.id, plan };
  }

  async listPlans(user: UserContext) {
    const conversations = await this.conversationService.listByType(
      user.tenantId,
      user.sub,
      'general',
      10,
    );

    return conversations
      .filter((c) => c.title?.startsWith('Study plan:'))
      .map((c) => {
        const lastAssistant = c.messages?.find((m) => m.role === 'assistant');
        let plan = null;
        if (lastAssistant?.content) {
          try {
            plan = JSON.parse(lastAssistant.content);
          } catch {
            plan = null;
          }
        }
        return {
          conversationId: c.id,
          title: c.title,
          createdAt: c.createdAt,
          updatedAt: c.updatedAt,
          plan,
        };
      });
  }
}
