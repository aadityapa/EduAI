import { Module } from '@nestjs/common';
import { PlannerController } from './planner.controller';
import { PlannerService } from './planner.service';
import { AiModule } from '../ai/ai.module';
import { ConversationModule } from '../conversation/conversation.module';

@Module({
  imports: [AiModule, ConversationModule],
  controllers: [PlannerController],
  providers: [PlannerService],
})
export class PlannerModule {}
