import { Inject, Injectable } from '@nestjs/common';
import type { AiClient, GeneratedQuestion } from '@eduai/ai';
import { AI_CLIENT } from '../ai/ai-client.provider';
import { ConversationService } from '../conversation/conversation.service';
import { ExportService } from './export.service';
import type { UserContext } from '../common/decorators';
import type { GenerateMockTestDto, GenerateQuestionsDto } from './dto/generators.dto';

@Injectable()
export class GeneratorsService {
  constructor(
    @Inject(AI_CLIENT) private readonly aiClient: AiClient,
    private readonly conversationService: ConversationService,
    private readonly exportService: ExportService,
  ) {}

  async generateQuestions(user: UserContext, dto: GenerateQuestionsDto) {
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

    await this.conversationService.recordQuotaUsage(user.tenantId, user.sub, 0);

    return {
      subject: dto.subject,
      topic: dto.topic,
      count: questions.length,
      questions,
    };
  }

  async generateMockTest(user: UserContext, dto: GenerateMockTestDto) {
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

    await this.conversationService.recordQuotaUsage(user.tenantId, user.sub, 0);

    return mockTest;
  }

  async exportQuestionsPdf(user: UserContext, dto: GenerateQuestionsDto) {
    const { questions, subject, topic } = await this.generateQuestions(user, dto);
    const buffer = this.exportService.exportQuestionsPdf(subject, topic, questions);
    return { buffer, filename: `${subject}-${topic}-questions.pdf`, contentType: 'application/pdf' };
  }

  async exportQuestionsDocx(user: UserContext, dto: GenerateQuestionsDto) {
    const { questions, subject, topic } = await this.generateQuestions(user, dto);
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
