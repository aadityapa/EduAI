import { AiRouter, type AiRouterConfig } from './router.js';
import { InMemoryCostTracker, type CostTracker } from './cost-tracker.js';
import {
  HOMEWORK_SYSTEM_PROMPT,
  MOCK_TEST_SYSTEM_PROMPT,
  PLANNER_SYSTEM_PROMPT,
  QUESTION_GEN_SYSTEM_PROMPT,
  TUTOR_SYSTEM_PROMPT,
  buildHomeworkPrompt,
  buildMockTestPrompt,
  buildPlannerPrompt,
  buildQuestionGenPrompt,
  buildTutorUserPrompt,
} from './prompts/index.js';
import type {
  ChatMessage,
  ChatResult,
  CompletionOptions,
  GeneratedQuestion,
  GenerateQuestionsParams,
  MockTest,
  MockTestParams,
  PlanStudyParams,
  StudyPlan,
} from './types.js';

export interface AiClientConfig extends AiRouterConfig {
  costTracker?: CostTracker;
}

export interface ChatContext {
  tenantId?: string;
  userId?: string;
  feature?: string;
  subject?: string;
  lessonTitle?: string;
  classLevel?: number;
}

export class AiClient {
  private readonly router: AiRouter;
  private readonly costTracker: CostTracker;

  constructor(private readonly config: AiClientConfig = {}) {
    this.router = new AiRouter(config);
    this.costTracker = config.costTracker ?? new InMemoryCostTracker();
  }

  getActiveProviders(): string[] {
    return this.router.getActiveProviders();
  }

  getCostTracker(): CostTracker {
    return this.costTracker;
  }

  async chat(
    messages: ChatMessage[],
    options?: CompletionOptions & { context?: ChatContext },
  ): Promise<ChatResult> {
    const systemPrompt = options?.systemPrompt ?? TUTOR_SYSTEM_PROMPT;
    const result = await this.router.complete(messages, { ...options, systemPrompt });

    await this.costTracker.record({
      tenantId: options?.context?.tenantId,
      userId: options?.context?.userId,
      provider: result.provider,
      model: result.model,
      feature: options?.context?.feature ?? 'tutor',
      tokensUsed: result.tokensUsed,
      timestamp: new Date(),
    });

    return result;
  }

  async generateQuestions(
    params: GenerateQuestionsParams,
    context?: ChatContext,
  ): Promise<GeneratedQuestion[]> {
    const prompt = buildQuestionGenPrompt(params);
    const result = await this.router.complete(
      [{ role: 'user', content: prompt }],
      { systemPrompt: QUESTION_GEN_SYSTEM_PROMPT },
    );

    await this.costTracker.record({
      tenantId: context?.tenantId,
      userId: context?.userId,
      provider: result.provider,
      model: result.model,
      feature: 'question-gen',
      tokensUsed: result.tokensUsed,
      timestamp: new Date(),
    });

    return this.parseJsonField<GeneratedQuestion[]>(result.content, 'questions', []);
  }

  async planStudy(params: PlanStudyParams, context?: ChatContext): Promise<StudyPlan> {
    const prompt = buildPlannerPrompt(params);
    const result = await this.router.complete(
      [{ role: 'user', content: prompt }],
      { systemPrompt: PLANNER_SYSTEM_PROMPT },
    );

    await this.costTracker.record({
      tenantId: context?.tenantId,
      userId: context?.userId,
      provider: result.provider,
      model: result.model,
      feature: 'planner',
      tokensUsed: result.tokensUsed,
      timestamp: new Date(),
    });

    const parsed = this.parseJson<StudyPlan>(result.content);
    return {
      summary: parsed.summary ?? 'Study plan',
      weeklyHours: parsed.weeklyHours ?? params.availableHoursPerWeek,
      schedule: parsed.schedule ?? [],
      tips: parsed.tips ?? [],
    };
  }

  async generateMockTest(params: MockTestParams, context?: ChatContext): Promise<MockTest> {
    const prompt = buildMockTestPrompt(params);
    const result = await this.router.complete(
      [{ role: 'user', content: prompt }],
      { systemPrompt: MOCK_TEST_SYSTEM_PROMPT },
    );

    await this.costTracker.record({
      tenantId: context?.tenantId,
      userId: context?.userId,
      provider: result.provider,
      model: result.model,
      feature: 'mock-test',
      tokensUsed: result.tokensUsed,
      timestamp: new Date(),
    });

    const parsed = this.parseJson<MockTest>(result.content);
    return {
      title: parsed.title ?? `${params.subject} Mock Test`,
      durationMinutes: parsed.durationMinutes ?? params.durationMinutes,
      totalMarks: parsed.totalMarks ?? params.questionCount,
      questions: parsed.questions ?? [],
    };
  }

  async analyzeHomework(
    text: string,
    context?: ChatContext,
  ): Promise<{
    analysis: string;
    steps: string[];
    hints: string[];
    answer: string;
    tokensUsed: number;
    model: string;
    provider: string;
  }> {
    const prompt = buildHomeworkPrompt(text);
    const result = await this.router.complete(
      [{ role: 'user', content: prompt }],
      { systemPrompt: HOMEWORK_SYSTEM_PROMPT },
    );

    await this.costTracker.record({
      tenantId: context?.tenantId,
      userId: context?.userId,
      provider: result.provider,
      model: result.model,
      feature: 'homework',
      tokensUsed: result.tokensUsed,
      timestamp: new Date(),
    });

    const parsed = this.parseJson<{
      analysis?: string;
      steps?: string[];
      hints?: string[];
      answer?: string;
    }>(result.content);

    return {
      analysis: parsed.analysis ?? result.content,
      steps: parsed.steps ?? [],
      hints: parsed.hints ?? [],
      answer: parsed.answer ?? '',
      tokensUsed: result.tokensUsed.total,
      model: result.model,
      provider: result.provider,
    };
  }

  async tutorMessage(
    message: string,
    history: ChatMessage[] = [],
    context?: ChatContext,
  ): Promise<ChatResult> {
    const userContent = buildTutorUserPrompt(message, {
      subject: context?.subject,
      lessonTitle: context?.lessonTitle,
      classLevel: context?.classLevel,
    });

    return this.chat(
      [...history, { role: 'user', content: userContent }],
      { context: { ...context, feature: 'tutor' } },
    );
  }

  private parseJson<T>(content: string): T {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return {} as T;
    }
    try {
      return JSON.parse(jsonMatch[0]) as T;
    } catch {
      return {} as T;
    }
  }

  private parseJsonField<T>(content: string, field: string, fallback: T): T {
    const parsed = this.parseJson<Record<string, T>>(content);
    return parsed[field] ?? fallback;
  }
}

export function createAiClient(config?: AiClientConfig): AiClient {
  return new AiClient(config);
}
