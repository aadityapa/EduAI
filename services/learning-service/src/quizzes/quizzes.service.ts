import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AttemptStatus, ContentStatus } from '@eduai/database';
import { PrismaService } from '../prisma/prisma.service';
import type { UserContext } from '../common/decorators';
import { QuizEvaluationService } from './quiz-evaluation.service';
import type { SubmitQuizAttemptDto } from './dto/quizzes.dto';
import { GamificationService } from '../gamification/gamification.service';

@Injectable()
export class QuizzesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly evaluationService: QuizEvaluationService,
    private readonly gamificationService: GamificationService,
  ) {}

  async getQuiz(user: UserContext, quizId: string) {
    const quiz = await this.prisma.quiz.findFirst({
      where: {
        id: quizId,
        deletedAt: null,
        status: ContentStatus.published,
      },
      include: {
        questions: {
          orderBy: { sortOrder: 'asc' },
          include: {
            options: {
              orderBy: { sortOrder: 'asc' },
              select: {
                id: true,
                label: true,
                sortOrder: true,
              },
            },
          },
        },
      },
    });

    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    return {
      id: quiz.id,
      title: quiz.title,
      timeLimitMinutes: quiz.timeLimitMinutes,
      passingScore: Number(quiz.passingScore),
      lessonId: quiz.lessonId,
      questions: quiz.questions.map((q) => ({
        id: q.id,
        type: q.type,
        stem: q.stem,
        marks: Number(q.marks),
        sortOrder: q.sortOrder,
        options: q.options,
      })),
    };
  }

  async startAttempt(user: UserContext, quizId: string) {
    const quiz = await this.prisma.quiz.findFirst({
      where: {
        id: quizId,
        deletedAt: null,
        status: ContentStatus.published,
      },
    });

    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    const attempt = await this.prisma.quizAttempt.create({
      data: {
        tenantId: user.tenantId,
        userId: user.sub,
        quizId,
        status: AttemptStatus.in_progress,
        answers: {},
      },
    });

    return {
      attemptId: attempt.id,
      quizId: attempt.quizId,
      status: attempt.status,
      startedAt: attempt.startedAt,
    };
  }

  async submitAttempt(
    user: UserContext,
    attemptId: string,
    dto: SubmitQuizAttemptDto,
  ) {
    const attempt = await this.prisma.quizAttempt.findFirst({
      where: {
        id: attemptId,
        tenantId: user.tenantId,
        userId: user.sub,
      },
      include: {
        quiz: {
          include: {
            questions: {
              orderBy: { sortOrder: 'asc' },
              include: { options: true },
            },
          },
        },
      },
    });

    if (!attempt) {
      throw new NotFoundException('Quiz attempt not found');
    }

    if (attempt.status !== AttemptStatus.in_progress) {
      throw new BadRequestException('Attempt already submitted');
    }

    const passingScore = Number(attempt.quiz.passingScore);
    const evaluation = this.evaluationService.evaluateQuiz(
      attempt.quiz.questions,
      dto.answers,
      passingScore,
    );

    const updated = await this.prisma.quizAttempt.update({
      where: { id: attemptId },
      data: {
        answers: dto.answers as object,
        score: evaluation.scorePercent,
        timeSpentSeconds: dto.timeSpent,
        status: AttemptStatus.graded,
        submittedAt: new Date(),
      },
    });

    if (evaluation.passed) {
      await this.gamificationService.awardQuizPass(
        user.tenantId,
        user.sub,
        attempt.quizId,
        evaluation.scorePercent,
      );
    }

    return {
      attemptId: updated.id,
      quizId: updated.quizId,
      score: Number(updated.score),
      passed: evaluation.passed,
      status: updated.status,
      submittedAt: updated.submittedAt,
      evaluation,
    };
  }

  async getStudentQuizSummary(tenantId: string, studentId: string) {
    const attempts = await this.prisma.quizAttempt.findMany({
      where: {
        tenantId,
        userId: studentId,
        status: AttemptStatus.graded,
      },
      include: {
        quiz: { select: { id: true, title: true, passingScore: true } },
      },
      orderBy: { submittedAt: 'desc' },
      take: 20,
    });

    return attempts.map((attempt) => ({
      attemptId: attempt.id,
      quizId: attempt.quizId,
      quizTitle: attempt.quiz.title,
      score: attempt.score ? Number(attempt.score) : null,
      passed: attempt.score
        ? Number(attempt.score) >= Number(attempt.quiz.passingScore)
        : false,
      submittedAt: attempt.submittedAt,
    }));
  }
}
