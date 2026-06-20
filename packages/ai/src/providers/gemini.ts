import type { AiProvider, ChatMessage, CompletionOptions, CompletionResult } from '../types.js';

export interface GeminiProviderConfig {
  apiKey?: string;
  defaultModel?: string;
}

export class GeminiProvider implements AiProvider {
  readonly name = 'gemini';
  private readonly defaultModel: string;

  constructor(private readonly config: GeminiProviderConfig = {}) {
    this.defaultModel = config.defaultModel ?? 'gemini-2.0-flash';
  }

  isAvailable(): boolean {
    return Boolean(this.config.apiKey);
  }

  async complete(messages: ChatMessage[], options?: CompletionOptions): Promise<CompletionResult> {
    if (!this.config.apiKey) {
      throw new Error('Gemini API key not configured');
    }

    const model = options?.model ?? this.defaultModel;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.config.apiKey}`;

    const contents = messages
      .filter((m) => m.role !== 'system')
      .map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));

    const body: Record<string, unknown> = {
      contents,
      generationConfig: {
        temperature: options?.temperature ?? 0.7,
        maxOutputTokens: options?.maxTokens ?? 2048,
      },
    };

    if (options?.systemPrompt) {
      body.systemInstruction = { parts: [{ text: options.systemPrompt }] };
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API error (${response.status}): ${errorText}`);
    }

    const data = (await response.json()) as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
      usageMetadata?: {
        promptTokenCount?: number;
        candidatesTokenCount?: number;
        totalTokenCount?: number;
      };
    };

    const content =
      data.candidates?.[0]?.content?.parts?.map((p) => p.text ?? '').join('') ?? '';
    const usage = data.usageMetadata;
    const promptTokens = usage?.promptTokenCount ?? 0;
    const completionTokens = usage?.candidatesTokenCount ?? 0;

    return {
      content,
      model,
      provider: this.name,
      tokensUsed: {
        prompt: promptTokens,
        completion: completionTokens,
        total: usage?.totalTokenCount ?? promptTokens + completionTokens,
      },
    };
  }
}
