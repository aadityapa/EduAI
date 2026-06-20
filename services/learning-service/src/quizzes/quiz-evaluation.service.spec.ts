import { QuestionType } from '@eduai/database';
import { QuizEvaluationService } from './quiz-evaluation.service';

describe('QuizEvaluationService', () => {
  let service: QuizEvaluationService;

  beforeEach(() => {
    service = new QuizEvaluationService();
  });

  const baseQuestion = {
    id: 'q1',
    marks: 2,
    metadata: {},
    options: [
      { id: 'opt-a', label: 'Paris', isCorrect: true },
      { id: 'opt-b', label: 'London', isCorrect: false },
    ],
  };

  it('evaluates mcq correctly', () => {
    const result = service.evaluateQuestion(
      { ...baseQuestion, type: QuestionType.mcq },
      'opt-a',
    );
    expect(result.isCorrect).toBe(true);
    expect(result.earnedMarks).toBe(2);
  });

  it('evaluates multi_select correctly', () => {
    const question = {
      id: 'q2',
      type: QuestionType.multi_select,
      marks: 3,
      metadata: {},
      options: [
        { id: 'a', label: 'A', isCorrect: true },
        { id: 'b', label: 'B', isCorrect: true },
        { id: 'c', label: 'C', isCorrect: false },
      ],
    };

    expect(service.evaluateQuestion(question, ['a', 'b']).isCorrect).toBe(true);
    expect(service.evaluateQuestion(question, ['a']).isCorrect).toBe(false);
    expect(service.evaluateQuestion(question, ['a', 'b', 'c']).isCorrect).toBe(false);
  });

  it('evaluates true_false correctly', () => {
    const question = {
      id: 'q3',
      type: QuestionType.true_false,
      marks: 1,
      metadata: {},
      options: [{ id: 'true', label: 'True', isCorrect: true }],
    };

    expect(service.evaluateQuestion(question, true).isCorrect).toBe(true);
    expect(service.evaluateQuestion(question, 'true').isCorrect).toBe(true);
    expect(service.evaluateQuestion(question, false).isCorrect).toBe(false);
  });

  it('evaluates fill_blank with accepted answers', () => {
    const question = {
      id: 'q4',
      type: QuestionType.fill_blank,
      marks: 1,
      metadata: { acceptedAnswers: ['New Delhi', 'Delhi'] },
      options: [],
    };

    expect(service.evaluateQuestion(question, 'delhi').isCorrect).toBe(true);
    expect(service.evaluateQuestion(question, 'Mumbai').isCorrect).toBe(false);
  });

  it('computes quiz score and pass status', () => {
    const questions = [
      { ...baseQuestion, type: QuestionType.mcq },
      {
        id: 'q5',
        type: QuestionType.true_false,
        marks: 2,
        metadata: {},
        options: [{ id: 'false', label: 'False', isCorrect: true }],
      },
    ];

    const result = service.evaluateQuiz(questions, { q1: 'opt-a', q5: false }, 70);
    expect(result.totalMarks).toBe(4);
    expect(result.earnedMarks).toBe(4);
    expect(result.scorePercent).toBe(100);
    expect(result.passed).toBe(true);
  });
});
