import { AiRouter, type AiRouterConfig } from './router.js';
import { InMemoryCostTracker, type CostTracker } from './cost-tracker.js';
import { ResponseCache } from './cache/response-cache.js';
import { PromptCache } from './cache/prompt-cache.js';
import { guardPrompt } from './security/prompt-guard.js';
import { filterContent } from './security/content-filter.js';
import { mockStreamComplete } from './streaming/mock-stream.js';
import type { StreamChunk } from './streaming/types.js';
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
  responseCache?: ResponseCache;
  promptCache?: PromptCache;
  enableCaching?: boolean;
  dailyTokenBudget?: number;
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
  private readonly responseCache: ResponseCache;
  private readonly promptCache: PromptCache;
  private readonly enableCaching: boolean;
  private readonly dailyTokenBudget: number;
  private dailyTokensUsed = 0;

  constructor(private readonly config: AiClientConfig = {}) {
    this.router = new AiRouter(config);
    this.costTracker = config.costTracker ?? new InMemoryCostTracker();
    this.responseCache = config.responseCache ?? new ResponseCache();
    this.promptCache = config.promptCache ?? new PromptCache();
    this.enableCaching = config.enableCaching ?? true;
    this.dailyTokenBudget = config.dailyTokenBudget ?? 500_000;
  }

  getActiveProviders(): string[] {
    return this.router.getActiveProviders();
  }

  getCostTracker(): CostTracker {
    return this.costTracker;
  }

  getResponseCache(): ResponseCache {
    return this.responseCache;
  }

  checkTokenBudget(tokensNeeded = 0): boolean {
    return this.dailyTokensUsed + tokensNeeded <= this.dailyTokenBudget;
  }

  validateInput(message: string): { safe: boolean; reason?: string; sanitized?: string } {
    return guardPrompt(message);
  }

  filterOutput(content: string): { allowed: boolean; reason?: string; filtered?: string } {
    return filterContent(content);
  }

  async *streamChat(
    messages: ChatMessage[],
    options?: CompletionOptions & { context?: ChatContext },
  ): AsyncGenerator<StreamChunk> {
    const lastUser = [...messages].reverse().find((m) => m.role === 'user');
    if (lastUser) {
      const guard = guardPrompt(lastUser.content);
      if (!guard.safe) {
        yield { type: 'error', error: guard.reason ?? 'Invalid input' };
        return;
      }
    }

    let totalTokens = 0;
    let fullContent = '';

    for await (const chunk of mockStreamComplete(messages, options)) {
      if (chunk.type === 'delta' && chunk.content) {
        fullContent += chunk.content;
        yield chunk;
      } else if (chunk.type === 'done') {
        const filtered = filterContent(fullContent);
        if (!filtered.allowed) {
          yield { type: 'error', error: filtered.reason ?? 'Content blocked' };
          return;
        }
        totalTokens = chunk.tokensUsed ?? 0;
        this.dailyTokensUsed += totalTokens;
        await this.costTracker.record({
          tenantId: options?.context?.tenantId,
          userId: options?.context?.userId,
          provider: chunk.provider ?? 'mock',
          model: chunk.model ?? 'mock-v1',
          feature: options?.context?.feature ?? 'tutor',
          tokensUsed: { prompt: 0, completion: totalTokens, total: totalTokens },
          timestamp: new Date(),
        });
        yield { ...chunk, content: filtered.filtered ?? fullContent };
      } else {
        yield chunk;
      }
    }
  }

  async chat(
    messages: ChatMessage[],
    options?: CompletionOptions & { context?: ChatContext },
  ): Promise<ChatResult> {
    const lastUser = [...messages].reverse().find((m) => m.role === 'user');
    if (lastUser) {
      const guard = guardPrompt(lastUser.content);
      if (!guard.safe) {
        throw new Error(guard.reason ?? 'Invalid input');
      }
    }

    const feature = options?.context?.feature ?? 'tutor';
    const cacheKey = JSON.stringify(messages);
    const cached = this.enableCaching ? this.responseCache.get(feature, cacheKey, options?.model) : null;
    if (cached) {
      return cached;
    }

    const systemPrompt = options?.systemPrompt ?? TUTOR_SYSTEM_PROMPT;
    const cachedPrompt = this.promptCache.get(feature, options?.context?.tenantId);
    if (!cachedPrompt) {
      this.promptCache.set(feature, systemPrompt, options?.context?.tenantId);
    }

    const result = await this.router.complete(messages, { ...options, systemPrompt });

    const filtered = filterContent(result.content);
    if (!filtered.allowed) {
      throw new Error(filtered.reason ?? 'Content blocked by safety filter');
    }
    result.content = filtered.filtered ?? result.content;

    if (!this.checkTokenBudget(result.tokensUsed.total)) {
      throw new Error('Daily token budget exceeded');
    }
    this.dailyTokensUsed += result.tokensUsed.total;

    await this.costTracker.record({
      tenantId: options?.context?.tenantId,
      userId: options?.context?.userId,
      provider: result.provider,
      model: result.model,
      feature,
      tokensUsed: result.tokensUsed,
      timestamp: new Date(),
    });

    if (this.enableCaching) {
      this.responseCache.set(feature, cacheKey, result, options?.model);
    }

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
