import { Module } from '@nestjs/common';
import { PlannerController } from './planner.controller';
import { PlannerService } from './planner.service';
import { AiModule } from '../ai/ai.module';
import { ConversationModule } from '../conversation/conversation.module';
import { CostModule } from '../cost/cost.module';

@Module({
  imports: [AiModule, ConversationModule, CostModule],
  controllers: [PlannerController],
  providers: [PlannerService],
})
export class PlannerModule {}
