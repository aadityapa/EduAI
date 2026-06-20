import { GeneratorsService } from './generators.service';

describe('GeneratorsService evaluateMockTest', () => {
  const service = new GeneratorsService({} as never, {} as never, {} as never);

  it('evaluates MCQ answers correctly', () => {
    const result = service.evaluateMockTest(
      [
        {
          type: 'mcq',
          stem: 'What is 2+2?',
          options: [
            { label: '3', isCorrect: false },
            { label: '4', isCorrect: true },
          ],
          marks: 1,
        },
      ],
      { q0: '4' },
    );

    expect(result.earnedMarks).toBe(1);
    expect(result.scorePercent).toBe(100);
    expect(result.passed).toBe(true);
  });

  it('identifies weak topics on incorrect answers', () => {
    const result = service.evaluateMockTest(
      [
        {
          type: 'mcq',
          stem: 'Photosynthesis occurs in',
          options: [{ label: 'Roots', isCorrect: true }],
          marks: 2,
        },
      ],
      { q0: 'Wrong' },
    );

    expect(result.earnedMarks).toBe(0);
    expect(result.weakTopics.length).toBeGreaterThan(0);
  });
});
