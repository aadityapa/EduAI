import type { AiProvider, ChatMessage, CompletionOptions, CompletionResult } from '../types.js';

export interface OpenAiProviderConfig {
  apiKey?: string;
  defaultModel?: string;
}

type OpenAiCompletionResponse = {
  choices: Array<{ message?: { content?: string | null } }>;
  model: string;
  usage?: { prompt_tokens?: number; completion_tokens?: number; total_tokens?: number };
};

export class OpenAiProvider implements AiProvider {
  readonly name = 'openai';
  private client: unknown = null;
  private readonly defaultModel: string;

  constructor(private readonly config: OpenAiProviderConfig = {}) {
    this.defaultModel = config.defaultModel ?? 'gpt-4o-mini';
  }

  isAvailable(): boolean {
    return Boolean(this.config.apiKey);
  }

  private async getClient(): Promise<{
    chat: { completions: { create: (params: Record<string, unknown>) => Promise<OpenAiCompletionResponse> } };
  }> {
    if (this.client) {
      return this.client as {
        chat: { completions: { create: (params: Record<string, unknown>) => Promise<OpenAiCompletionResponse> } };
      };
    }

    if (!this.config.apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const { default: OpenAI } = await import('openai');
    this.client = new OpenAI({ apiKey: this.config.apiKey });
    return this.client as {
      chat: { completions: { create: (params: Record<string, unknown>) => Promise<OpenAiCompletionResponse> } };
    };
  }

  async complete(messages: ChatMessage[], options?: CompletionOptions): Promise<CompletionResult> {
    const client = await this.getClient();
    const model = options?.model ?? this.defaultModel;

    const apiMessages = messages.map((m) => ({ role: m.role, content: m.content }));
    if (options?.systemPrompt) {
      apiMessages.unshift({ role: 'system', content: options.systemPrompt });
    }

    const response = await client.chat.completions.create({
      model,
      messages: apiMessages,
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.maxTokens ?? 2048,
    });

    const content = response.choices[0]?.message?.content ?? '';
    const usage = response.usage;

    return {
      content,
      model: response.model,
      provider: this.name,
      tokensUsed: {
        prompt: usage?.prompt_tokens ?? 0,
        completion: usage?.completion_tokens ?? 0,
        total: usage?.total_tokens ?? 0,
      },
    };
  }
}
