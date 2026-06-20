import { Module } from '@nestjs/common';
import { GeneratorsController } from './generators.controller';
import { GeneratorsService } from './generators.service';
import { AiModule } from '../ai/ai.module';
import { ConversationModule } from '../conversation/conversation.module';

@Module({
  imports: [AiModule, ConversationModule],
  controllers: [GeneratorsController],
  providers: [GeneratorsService],
})
export class GeneratorsModule {}
