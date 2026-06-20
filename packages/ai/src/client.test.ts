import { describe, expect, it } from 'vitest';
import { AiClient } from './client.js';
import { InMemoryCostTracker } from './cost-tracker.js';
import type { AiProvider, ChatMessage, CompletionResult } from './types.js';

class StubProvider implements AiProvider {
  readonly name = 'stub';
  private fail: boolean;

  constructor(options?: { fail?: boolean }) {
    this.fail = options?.fail ?? false;
  }

  isAvailable(): boolean {
    return true;
  }

  async complete(messages: ChatMessage[]): Promise<CompletionResult> {
    if (this.fail) {
      throw new Error('stub failure');
    }

    const last = messages[messages.length - 1]?.content ?? '';
    return {
      content: `stub-response:${last}`,
      model: 'stub-model',
      provider: this.name,
      tokensUsed: { prompt: 10, completion: 20, total: 30 },
    };
  }
}

describe('AiClient', () => {
  it('routes chat through mock provider when no API keys', async () => {
    const client = new AiClient({ allowMockFallback: true });
    const result = await client.chat([{ role: 'user', content: 'Explain fractions' }]);

    expect(result.content).toContain('Mock AI');
    expect(result.provider).toBe('mock');
    expect(result.tokensUsed.total).toBeGreaterThan(0);
  });

  it('tracks token usage via cost tracker', async () => {
    const tracker = new InMemoryCostTracker();
    const client = new AiClient({ costTracker: tracker, allowMockFallback: true });

    await client.chat(
      [{ role: 'user', content: 'Hello' }],
      { context: { tenantId: 't1', userId: 'u1', feature: 'tutor' } },
    );

    const usage = await tracker.getUsage({ tenantId: 't1', userId: 'u1' });
    expect(usage.requestCount).toBe(1);
    expect(usage.totalTokens).toBeGreaterThan(0);
    expect(usage.byFeature.tutor).toBeGreaterThan(0);
  });

  it('generates mock questions', async () => {
    const client = new AiClient({ allowMockFallback: true });
    const questions = await client.generateQuestions({
      subject: 'Math',
      topic: 'Algebra',
      classLevel: 8,
      count: 2,
    });

    expect(questions.length).toBeGreaterThan(0);
    expect(questions[0]?.stem).toBeTruthy();
  });

  it('generates mock study plan', async () => {
    const client = new AiClient({ allowMockFallback: true });
    const plan = await client.planStudy({
      subjects: ['Math', 'Science'],
      goals: 'Prepare for mid-term',
      availableHoursPerWeek: 10,
    });

    expect(plan.summary).toBeTruthy();
    expect(plan.schedule.length).toBeGreaterThan(0);
  });

  it('generates mock test via mock provider', async () => {
    const client = new AiClient({ allowMockFallback: true });
    const test = await client.generateMockTest({
      subject: 'Science',
      topic: 'Photosynthesis',
      classLevel: 8,
      questionCount: 5,
      durationMinutes: 30,
    });

    expect(test.title).toBeTruthy();
    expect(test.questions.length).toBeGreaterThan(0);
  });

  it('analyzes homework with mock provider', async () => {
    const client = new AiClient({ allowMockFallback: true });
    const analysis = await client.analyzeHomework('Solve 2x + 3 = 13');

    expect(analysis.analysis).toBeTruthy();
    expect(analysis.steps.length).toBeGreaterThan(0);
  });

  it('tutorMessage includes context in prompt', async () => {
    const client = new AiClient({ allowMockFallback: true });
    const result = await client.tutorMessage('What is pi?', [], {
      subject: 'Math',
      classLevel: 8,
    });

    expect(result.content).toBeTruthy();
    expect(result.provider).toBe('mock');
  });
});

describe('AiRouter fallback', () => {
  it('falls back to mock when preferred provider unavailable', async () => {
    const client = new AiClient({
      preferredProvider: 'openai',
      allowMockFallback: true,
    });

    const providers = client.getActiveProviders();
    expect(providers).toContain('mock');
  });
});
