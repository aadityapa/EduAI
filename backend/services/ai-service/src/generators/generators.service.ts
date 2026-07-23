import { Inject, Injectable } from '@nestjs/common';
import type { AiClient, GeneratedQuestion } from '@eduai/ai';
import { enqueueMockTest, enqueueQpg } from '@eduai/jobs';
import { AI_CLIENT } from '../ai/ai-client.provider';
import { ConversationService } from '../conversation/conversation.service';
import { CostService } from '../cost/cost.service';
import { ExportService } from './export.service';
import type { UserContext } from '../common/decorators';
import type { GenerateMockTestDto, GenerateQuestionsDto } from './dto/generators.dto';

@Injectable()
export class GeneratorsService {
  constructor(
    @Inject(AI_CLIENT) private readonly aiClient: AiClient,
    private readonly conversationService: ConversationService,
    private readonly costService: CostService,
    private readonly exportService: ExportService,
  ) {}

  async generateQuestions(user: UserContext, dto: GenerateQuestionsDto) {
    await this.costService.checkQuota(user.tenantId, user.sub, 800);

    const preferAsync = process.env.AI_JOBS_ASYNC === 'true';
    if (preferAsync) {
      const queued = await enqueueQpg({
        tenantId: user.tenantId,
        userId: user.sub,
        subject: dto.subject,
        topic: dto.topic,
        classLevel: dto.classLevel,
        count: dto.count,
        difficulty: dto.difficulty,
        questionTypes: dto.questionTypes,
      });
      if (queued.queued) {
        return {
          status: 'queued' as const,
          jobId: queued.jobId,
          queue: queued.queue,
          subject: dto.subject,
          topic: dto.topic,
          count: dto.count,
        };
      }
    }

    return this.generateQuestionsSync(user, dto);
  }

  private async generateQuestionsSync(user: UserContext, dto: GenerateQuestionsDto) {
    const questions = await this.aiClient.generateQuestions(
      {
        subject: dto.subject,
        topic: dto.topic,
        classLevel: dto.classLevel,
        count: dto.count,
        difficulty: dto.difficulty,
        questionTypes: dto.questionTypes,
      },
      { tenantId: user.tenantId, userId: user.sub, feature: 'question-gen' },
    );

    const tokensEstimate = Math.max(200, questions.length * 120);
    await this.conversationService.recordQuotaUsage(user.tenantId, user.sub, tokensEstimate);

    return {
      subject: dto.subject,
      topic: dto.topic,
      count: questions.length,
      questions,
      tokensUsed: tokensEstimate,
    };
  }

  async generateMockTest(user: UserContext, dto: GenerateMockTestDto) {
    await this.costService.checkQuota(user.tenantId, user.sub, 1200);

    if (process.env.AI_JOBS_ASYNC === 'true') {
      const queued = await enqueueMockTest({
        tenantId: user.tenantId,
        userId: user.sub,
        subject: dto.subject,
        topic: dto.topic,
        classLevel: dto.classLevel,
        questionCount: dto.questionCount,
        durationMinutes: dto.durationMinutes,
        difficulty: dto.difficulty,
      });
      if (queued.queued) {
        return {
          status: 'queued' as const,
          jobId: queued.jobId,
          queue: queued.queue,
          subject: dto.subject,
          topic: dto.topic,
        };
      }
    }

    const mockTest = await this.aiClient.generateMockTest(
      {
        subject: dto.subject,
        topic: dto.topic,
        classLevel: dto.classLevel,
        questionCount: dto.questionCount,
        durationMinutes: dto.durationMinutes,
        difficulty: dto.difficulty,
      },
      { tenantId: user.tenantId, userId: user.sub, feature: 'mock-test' },
    );

    const tokensEstimate = Math.max(400, mockTest.questions.length * 150);
    await this.conversationService.recordQuotaUsage(user.tenantId, user.sub, tokensEstimate);

    return { ...mockTest, tokensUsed: tokensEstimate };
  }

  async exportQuestionsPdf(user: UserContext, dto: GenerateQuestionsDto) {
    const { questions, subject, topic } = await this.generateQuestionsSync(user, dto);
    const buffer = this.exportService.exportQuestionsPdf(subject, topic, questions);
    return { buffer, filename: `${subject}-${topic}-questions.pdf`, contentType: 'application/pdf' };
  }

  async exportQuestionsDocx(user: UserContext, dto: GenerateQuestionsDto) {
    const { questions, subject, topic } = await this.generateQuestionsSync(user, dto);
    const buffer = await this.exportService.exportQuestionsDocx(subject, topic, questions);
    return {
      buffer,
      filename: `${subject}-${topic}-questions.docx`,
      contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    };
  }

  evaluateMockTest(
    questions: GeneratedQuestion[],
    answers: Record<string, string>,
  ) {
    const results = questions.map((q, i) => {
      const key = `q${i}`;
      const userAnswer = answers[key] ?? '';
      const correctOption = q.options?.find((o) => o.isCorrect);
      const isCorrect =
        q.type === 'mcq' || q.type === 'true_false'
          ? userAnswer.toLowerCase() === correctOption?.label.toLowerCase()
          : userAnswer.length > 0;

      return {
        questionIndex: i,
        stem: q.stem,
        userAnswer,
        correctAnswer: correctOption?.label ?? q.explanation ?? '',
        isCorrect,
        marks: isCorrect ? q.marks : 0,
        maxMarks: q.marks,
        weakTopic: !isCorrect ? q.stem.split(' ').slice(0, 3).join(' ') : undefined,
      };
    });

    const earnedMarks = results.reduce((s, r) => s + r.marks, 0);
    const totalMarks = results.reduce((s, r) => s + r.maxMarks, 0);
    const weakTopics = [...new Set(results.filter((r) => !r.isCorrect && r.weakTopic).map((r) => r.weakTopic!))];

    return {
      earnedMarks,
      totalMarks,
      scorePercent: totalMarks > 0 ? Math.round((earnedMarks / totalMarks) * 100) : 0,
      passed: totalMarks > 0 ? earnedMarks / totalMarks >= 0.4 : false,
      questions: results,
      weakTopics,
    };
  }
}
