import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AiClient, createAiClient } from '@eduai/ai';

export const AI_CLIENT = 'AI_CLIENT';

@Injectable()
export class AiClientFactory {
  create(config: ConfigService): AiClient {
    return createAiClient({
      openaiApiKey: config.get<string>('OPENAI_API_KEY'),
      geminiApiKey: config.get<string>('GEMINI_API_KEY'),
      preferredProvider: config.get<'openai' | 'gemini' | 'mock'>('AI_PREFERRED_PROVIDER') ?? 'openai',
      allowMockFallback: true,
    });
  }
}

export const aiClientProvider = {
  provide: AI_CLIENT,
  inject: [ConfigService],
  useFactory: (config: ConfigService) => {
    const factory = new AiClientFactory();
    return factory.create(config);
  },
};
