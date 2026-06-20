import { Module } from '@nestjs/common';
import { HomeworkController } from './homework.controller';
import { HomeworkService } from './homework.service';
import { AiModule } from '../ai/ai.module';
import { ConversationModule } from '../conversation/conversation.module';
import { SecurityModule } from '../security/security.module';
import { CostModule } from '../cost/cost.module';

@Module({
  imports: [AiModule, ConversationModule, SecurityModule, CostModule],
  controllers: [HomeworkController],
  providers: [HomeworkService],
})
export class HomeworkModule {}
