import { Module } from '@nestjs/common';
import { ParentController } from './parent.controller';
import { ParentService } from './parent.service';
import { ProgressModule } from '../progress/progress.module';
import { QuizzesModule } from '../quizzes/quizzes.module';

@Module({
  imports: [ProgressModule, QuizzesModule],
  controllers: [ParentController],
  providers: [ParentService],
})
export class ParentModule {}
