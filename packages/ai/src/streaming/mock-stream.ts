import type { ChatMessage, CompletionOptions } from '../types.js';
import type { StreamChunk } from './types.js';

export async function* mockStreamComplete(
  messages: ChatMessage[],
  options?: CompletionOptions,
): AsyncGenerator<StreamChunk> {
  const lastUser = [...messages].reverse().find((m) => m.role === 'user');
  const prompt = lastUser?.content ?? '';
  const fullText = options?.systemPrompt?.includes('homework')
    ? '{"analysis":"Mock homework analysis","steps":["Step 1","Step 2"],"hints":["Try isolating x"],"answer":"x = 5"}'
    : `[Mock AI Stream] Response to: ${prompt.slice(0, 60)}… Configure API keys for live streaming.`;

  const words = fullText.split(/(\s+)/);
  let accumulated = '';

  for (const word of words) {
    accumulated += word;
    yield { type: 'delta', content: word };
    await new Promise((r) => setTimeout(r, 15));
  }

  yield {
    type: 'done',
    content: accumulated,
    tokensUsed: Math.ceil((prompt.length + accumulated.length) / 4),
    model: 'mock-v1',
    provider: 'mock',
  };
}
