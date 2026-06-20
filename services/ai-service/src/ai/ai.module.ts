import { Module } from '@nestjs/common';
import { aiClientProvider } from './ai-client.provider';

@Module({
  providers: [aiClientProvider],
  exports: [aiClientProvider],
})
export class AiModule {}
