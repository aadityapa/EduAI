import { Module, forwardRef } from '@nestjs/common';
import { QuizzesController } from './quizzes.controller';
import { QuizzesService } from './quizzes.service';
import { QuizEvaluationService } from './quiz-evaluation.service';
import { GamificationModule } from '../gamification/gamification.module';

@Module({
  imports: [forwardRef(() => GamificationModule)],
  controllers: [QuizzesController],
  providers: [QuizzesService, QuizEvaluationService],
  exports: [QuizzesService, QuizEvaluationService],
})
export class QuizzesModule {}
