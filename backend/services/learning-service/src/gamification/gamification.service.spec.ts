import { GamificationService } from './gamification.service';

describe('GamificationService', () => {
  const tenantId = 'tenant-1';
  const userId = 'user-1';

  let prisma: {
    userXp: {
      upsert: jest.Mock;
      update: jest.Mock;
    };
    userCoins: {
      upsert: jest.Mock;
      update: jest.Mock;
    };
    userStreak: {
      upsert: jest.Mock;
      update: jest.Mock;
    };
    userBadge: {
      findUnique: jest.Mock;
      create: jest.Mock;
    };
    badge: {
      findFirst: jest.Mock;
    };
  };

  let service: GamificationService;

  beforeEach(() => {
    prisma = {
      userXp: {
        upsert: jest.fn().mockResolvedValue({ totalXp: 0, currentLevel: 1 }),
        update: jest.fn().mockResolvedValue({ totalXp: 10, currentLevel: 1 }),
      },
      userCoins: {
        upsert: jest.fn().mockResolvedValue({ balance: 0 }),
        update: jest.fn().mockResolvedValue({ balance: 5 }),
      },
      userStreak: {
        upsert: jest.fn().mockResolvedValue({
          currentStreak: 0,
          longestStreak: 0,
          lastActivityDate: null,
        }),
        update: jest.fn().mockResolvedValue({
          currentStreak: 1,
          longestStreak: 1,
        }),
      },
      userBadge: {
        findUnique: jest.fn().mockResolvedValue(null),
        create: jest.fn(),
      },
      badge: {
        findFirst: jest.fn().mockResolvedValue(null),
      },
    };

    service = new GamificationService(prisma as never);
  });

  it('calculates level from xp', () => {
    expect((service as unknown as { levelFromXp(n: number): number }).levelFromXp(0)).toBe(1);
    expect((service as unknown as { levelFromXp(n: number): number }).levelFromXp(150)).toBe(2);
  });

  it('awards xp and coins on lesson complete', async () => {
    const result = await service.awardLessonComplete(tenantId, userId, 'lesson-1');

    expect(prisma.userXp.upsert).toHaveBeenCalled();
    expect(prisma.userCoins.upsert).toHaveBeenCalled();
    expect(prisma.userXp.update).toHaveBeenCalled();
    expect(result.eventType).toBe('lesson_complete');
    expect(result.xpAwarded).toBe(10);
    expect(result.coinsAwarded).toBe(5);
  });

  it('awards xp and coins on quiz pass', async () => {
    const result = await service.awardQuizPass(tenantId, userId, 'quiz-1', 85);

    expect(result.eventType).toBe('quiz_pass');
    expect(result.xpAwarded).toBe(25);
    expect(result.coinsAwarded).toBe(10);
    expect(result.score).toBe(85);
  });
});
