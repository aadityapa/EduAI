import type { AiProvider, ChatMessage, CompletionOptions, CompletionResult } from '../types.js';

export class MockAiProvider implements AiProvider {
  readonly name = 'mock';

  isAvailable(): boolean {
    return true;
  }

  async complete(messages: ChatMessage[], options?: CompletionOptions): Promise<CompletionResult> {
    const lastUser = [...messages].reverse().find((m) => m.role === 'user');
    const prompt = lastUser?.content ?? '';
    const content = this.buildMockResponse(prompt, options?.systemPrompt);

    return {
      content,
      model: 'mock-v1',
      provider: this.name,
      tokensUsed: {
        prompt: Math.ceil(prompt.length / 4),
        completion: Math.ceil(content.length / 4),
        total: Math.ceil((prompt.length + content.length) / 4),
      },
    };
  }

  private buildMockResponse(prompt: string, systemPrompt?: string): string {
    if (systemPrompt?.includes('question') || prompt.includes('Generate')) {
      return JSON.stringify({
        questions: [
          {
            type: 'mcq',
            stem: 'What is 2 + 2?',
            options: [
              { label: '3', isCorrect: false },
              { label: '4', isCorrect: true },
              { label: '5', isCorrect: false },
            ],
            explanation: 'Basic addition.',
            marks: 1,
          },
        ],
      });
    }

    if (systemPrompt?.includes('study plan') || prompt.includes('study plan')) {
      return JSON.stringify({
        summary: 'Balanced weekly study plan (mock).',
        weeklyHours: 10,
        schedule: [
          {
            day: 'Monday',
            focus: 'Mathematics',
            tasks: ['Review algebra basics', 'Practice 10 problems'],
            durationMinutes: 60,
          },
        ],
        tips: ['Take short breaks every 25 minutes.', 'Review notes before sleep.'],
      });
    }

    if (systemPrompt?.includes('homework') || prompt.includes('homework')) {
      return JSON.stringify({
        analysis: 'The problem involves linear equations. Isolate x by subtracting constants.',
        steps: ['Identify the equation form', 'Isolate the variable', 'Verify the solution'],
        hints: ['Remember to perform the same operation on both sides.'],
        answer: 'x = 5 (mock solution)',
      });
    }

    return `[Mock AI] I understand your question about "${prompt.slice(0, 80)}". This is a development mock response — configure OPENAI_API_KEY or GEMINI_API_KEY for live AI.`;
  }
}
