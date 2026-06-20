import { CircuitBreaker } from './circuit-breaker.js';
import { GeminiProvider } from './providers/gemini.js';
import { MockAiProvider } from './providers/mock.js';
import { OpenAiProvider } from './providers/openai.js';
import type {
  AiProvider,
  ChatMessage,
  CompletionOptions,
  CompletionResult,
} from './types.js';

export type ProviderName = 'openai' | 'gemini' | 'mock';

export interface AiRouterConfig {
  openaiApiKey?: string;
  geminiApiKey?: string;
  preferredProvider?: ProviderName;
  openaiModel?: string;
  geminiModel?: string;
  allowMockFallback?: boolean;
}

export class AiRouter {
  private readonly providers: AiProvider[];
  private readonly orderedProviders: AiProvider[];
  private readonly breakers = new Map<string, CircuitBreaker>();

  constructor(config: AiRouterConfig = {}) {
    const openai = new OpenAiProvider({
      apiKey: config.openaiApiKey,
      defaultModel: config.openaiModel,
    });
    const gemini = new GeminiProvider({
      apiKey: config.geminiApiKey,
      defaultModel: config.geminiModel,
    });
    const mock = new MockAiProvider();

    this.providers = [openai, gemini, mock];

    const preference = config.preferredProvider ?? 'openai';
    const available = this.providers.filter((p) => p.isAvailable());

    const preferred = available.find((p) => p.name === preference);
    const others = available.filter((p) => p.name !== preference);
    this.orderedProviders = preferred ? [preferred, ...others] : available;

    if (this.orderedProviders.length === 0 && config.allowMockFallback !== false) {
      this.orderedProviders = [mock];
    }
  }

  getActiveProviders(): string[] {
    return this.orderedProviders.map((p) => p.name);
  }

  async complete(messages: ChatMessage[], options?: CompletionOptions): Promise<CompletionResult> {
    if (this.orderedProviders.length === 0) {
      throw new Error('No AI providers available. Configure API keys or enable mock fallback.');
    }

    let lastError: Error | undefined;

    for (const provider of this.orderedProviders) {
      const breaker = this.getBreaker(provider.name);
      try {
        return await breaker.execute(() => provider.complete(messages, options));
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
      }
    }

    throw lastError ?? new Error('All AI providers failed');
  }

  private getBreaker(providerName: string): CircuitBreaker {
    let breaker = this.breakers.get(providerName);
    if (!breaker) {
      breaker = new CircuitBreaker({
        name: providerName,
        failureThreshold: 5,
        resetTimeoutMs: 30_000,
      });
      this.breakers.set(providerName, breaker);
    }
    return breaker;
  }
}
