import { Inject, Injectable } from '@nestjs/common';
import type { AiClient } from '@eduai/ai';
import { AI_CLIENT } from '../ai/ai-client.provider';
import { ConversationService } from '../conversation/conversation.service';
import type { UserContext } from '../common/decorators';
import type { GenerateMockTestDto, GenerateQuestionsDto } from './dto/generators.dto';

@Injectable()
export class GeneratorsService {
  constructor(
    @Inject(AI_CLIENT) private readonly aiClient: AiClient,
    private readonly conversationService: ConversationService,
  ) {}

  async generateQuestions(user: UserContext, dto: GenerateQuestionsDto) {
    const questions = await this.aiClient.generateQuestions(
      {
        subject: dto.subject,
        topic: dto.topic,
        classLevel: dto.classLevel,
        count: dto.count,
        difficulty: dto.difficulty,
        questionTypes: dto.questionTypes,
      },
      { tenantId: user.tenantId, userId: user.sub, feature: 'question-gen' },
    );

    await this.conversationService.recordQuotaUsage(user.tenantId, user.sub, 0);

    return {
      subject: dto.subject,
      topic: dto.topic,
      count: questions.length,
      questions,
    };
  }

  async generateMockTest(user: UserContext, dto: GenerateMockTestDto) {
    const mockTest = await this.aiClient.generateMockTest(
      {
        subject: dto.subject,
        topic: dto.topic,
        classLevel: dto.classLevel,
        questionCount: dto.questionCount,
        durationMinutes: dto.durationMinutes,
        difficulty: dto.difficulty,
      },
      { tenantId: user.tenantId, userId: user.sub, feature: 'mock-test' },
    );

    await this.conversationService.recordQuotaUsage(user.tenantId, user.sub, 0);

    return mockTest;
  }
}
