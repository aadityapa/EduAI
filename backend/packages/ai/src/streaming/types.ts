export interface StreamChunk {
  type: 'delta' | 'done' | 'error';
  content?: string;
  tokensUsed?: number;
  model?: string;
  provider?: string;
  error?: string;
}

export interface StreamingProvider {
  streamComplete(
    messages: import('../types.js').ChatMessage[],
    options?: import('../types.js').CompletionOptions,
  ): AsyncGenerator<StreamChunk>;
}
