import { Injectable } from '@nestjs/common';
import { QuestionType } from '@eduai/database';

export interface EvaluatedQuestion {
  questionId: string;
  type: QuestionType;
  marks: number;
  earnedMarks: number;
  isCorrect: boolean;
}

export interface QuizEvaluationResult {
  totalMarks: number;
  earnedMarks: number;
  scorePercent: number;
  passed: boolean;
  questions: EvaluatedQuestion[];
}

interface QuestionWithOptions {
  id: string;
  type: QuestionType;
  marks: { toNumber(): number } | number;
  metadata: unknown;
  options: Array<{ id: string; label: string; isCorrect: boolean }>;
}

@Injectable()
export class QuizEvaluationService {
  evaluateQuiz(
    questions: QuestionWithOptions[],
    answers: Record<string, unknown>,
    passingScore: number,
  ): QuizEvaluationResult {
    const evaluated = questions.map((question) =>
      this.evaluateQuestion(question, answers[question.id]),
    );

    const totalMarks = evaluated.reduce((sum, q) => sum + q.marks, 0);
    const earnedMarks = evaluated.reduce((sum, q) => sum + q.earnedMarks, 0);
    const scorePercent = totalMarks > 0 ? (earnedMarks / totalMarks) * 100 : 0;

    return {
      totalMarks,
      earnedMarks,
      scorePercent: Math.round(scorePercent * 100) / 100,
      passed: scorePercent >= passingScore,
      questions: evaluated,
    };
  }

  evaluateQuestion(
    question: QuestionWithOptions,
    answer: unknown,
  ): EvaluatedQuestion {
    const marks = this.toNumber(question.marks);

    switch (question.type) {
      case QuestionType.mcq:
        return this.evaluateMcq(question, answer, marks);
      case QuestionType.multi_select:
        return this.evaluateMultiSelect(question, answer, marks);
      case QuestionType.true_false:
        return this.evaluateTrueFalse(question, answer, marks);
      case QuestionType.fill_blank:
        return this.evaluateFillBlank(question, answer, marks);
      default:
        return {
          questionId: question.id,
          type: question.type,
          marks,
          earnedMarks: 0,
          isCorrect: false,
        };
    }
  }

  private evaluateMcq(
    question: QuestionWithOptions,
    answer: unknown,
    marks: number,
  ): EvaluatedQuestion {
    const correctOption = question.options.find((o) => o.isCorrect);
    const isCorrect =
      correctOption !== undefined &&
      (answer === correctOption.id || answer === correctOption.label);

    return {
      questionId: question.id,
      type: question.type,
      marks,
      earnedMarks: isCorrect ? marks : 0,
      isCorrect,
    };
  }

  private evaluateMultiSelect(
    question: QuestionWithOptions,
    answer: unknown,
    marks: number,
  ): EvaluatedQuestion {
    const selected = this.normalizeArray(answer).map(String);
    const correctIds = question.options.filter((o) => o.isCorrect).map((o) => o.id);

    const isCorrect =
      selected.length === correctIds.length &&
      correctIds.every((id) => selected.includes(id));

    return {
      questionId: question.id,
      type: question.type,
      marks,
      earnedMarks: isCorrect ? marks : 0,
      isCorrect,
    };
  }

  private evaluateTrueFalse(
    question: QuestionWithOptions,
    answer: unknown,
    marks: number,
  ): EvaluatedQuestion {
    const correctOption = question.options.find((o) => o.isCorrect);
    if (!correctOption) {
      return {
        questionId: question.id,
        type: question.type,
        marks,
        earnedMarks: 0,
        isCorrect: false,
      };
    }

    let isCorrect = false;
    if (typeof answer === 'boolean') {
      const answerLabel = answer ? 'true' : 'false';
      isCorrect = correctOption.label.toLowerCase() === answerLabel;
    } else if (typeof answer === 'string') {
      isCorrect =
        answer === correctOption.id ||
        answer.toLowerCase() === correctOption.label.toLowerCase();
    }

    return {
      questionId: question.id,
      type: question.type,
      marks,
      earnedMarks: isCorrect ? marks : 0,
      isCorrect,
    };
  }

  private evaluateFillBlank(
    question: QuestionWithOptions,
    answer: unknown,
    marks: number,
  ): EvaluatedQuestion {
    const metadata = question.metadata as { acceptedAnswers?: string[] } | null;
    const accepted = metadata?.acceptedAnswers?.length
      ? metadata.acceptedAnswers
      : question.options.filter((o) => o.isCorrect).map((o) => o.label);

    const normalizedAnswer = String(answer ?? '')
      .trim()
      .toLowerCase();
    const isCorrect = accepted.some(
      (candidate) => candidate.trim().toLowerCase() === normalizedAnswer,
    );

    return {
      questionId: question.id,
      type: question.type,
      marks,
      earnedMarks: isCorrect ? marks : 0,
      isCorrect,
    };
  }

  private normalizeArray(value: unknown): unknown[] {
    if (Array.isArray(value)) return value;
    if (value === undefined || value === null) return [];
    return [value];
  }

  private toNumber(value: { toNumber(): number } | number): number {
    return typeof value === 'number' ? value : value.toNumber();
  }
}
