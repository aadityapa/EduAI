import { Module } from '@nestjs/common';
import { TutorController } from './tutor.controller';
import { TutorService } from './tutor.service';
import { AiModule } from '../ai/ai.module';
import { ConversationModule } from '../conversation/conversation.module';
import { SecurityModule } from '../security/security.module';
import { CostModule } from '../cost/cost.module';
import { ObservabilityModule } from '../observability/observability.module';

@Module({
  imports: [AiModule, ConversationModule, SecurityModule, CostModule, ObservabilityModule],
  controllers: [TutorController],
  providers: [TutorService],
})
export class TutorModule {}
