import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { UserContext } from '../common/decorators';

const XP_LESSON_COMPLETE = 10;
const XP_QUIZ_PASS = 25;
const COINS_LESSON_COMPLETE = 5;
const COINS_QUIZ_PASS = 10;

@Injectable()
export class GamificationService {
  constructor(private readonly prisma: PrismaService) {}

  async getMyGamification(user: UserContext) {
    const [xp, coins, badges, streak] = await Promise.all([
      this.ensureXp(user.tenantId, user.sub),
      this.ensureCoins(user.tenantId, user.sub),
      this.prisma.userBadge.findMany({
        where: { tenantId: user.tenantId, userId: user.sub },
        include: {
          badge: {
            select: {
              id: true,
              code: true,
              name: true,
              description: true,
              iconUrl: true,
              category: true,
            },
          },
        },
        orderBy: { earnedAt: 'desc' },
      }),
      this.ensureStreak(user.tenantId, user.sub),
    ]);

    return {
      xp: {
        totalXp: xp.totalXp,
        currentLevel: xp.currentLevel,
      },
      coins: {
        balance: coins.balance,
      },
      badges: badges.map((entry) => ({
        id: entry.id,
        earnedAt: entry.earnedAt,
        badge: entry.badge,
      })),
      streak: {
        currentStreak: streak.currentStreak,
        longestStreak: streak.longestStreak,
        lastActivityDate: streak.lastActivityDate,
        freezeTokens: streak.freezeTokens,
      },
    };
  }

  async getLeaderboard(user: UserContext, limit = 20) {
    const leaders = await this.prisma.userXp.findMany({
      where: { tenantId: user.tenantId },
      orderBy: { totalXp: 'desc' },
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
      },
    });

    return leaders.map((entry, index) => ({
      rank: index + 1,
      userId: entry.userId,
      totalXp: entry.totalXp,
      currentLevel: entry.currentLevel,
      user: entry.user,
    }));
  }

  async awardLessonComplete(tenantId: string, userId: string, lessonId: string) {
    return this.award({
      tenantId,
      userId,
      eventType: 'lesson_complete',
      resourceId: lessonId,
      xp: XP_LESSON_COMPLETE,
      coins: COINS_LESSON_COMPLETE,
    });
  }

  async awardQuizPass(
    tenantId: string,
    userId: string,
    quizId: string,
    score: number,
  ) {
    return this.award({
      tenantId,
      userId,
      eventType: 'quiz_pass',
      resourceId: quizId,
      score,
      xp: XP_QUIZ_PASS,
      coins: COINS_QUIZ_PASS,
    });
  }

  async award(params: {
    tenantId: string;
    userId: string;
    eventType: 'lesson_complete' | 'quiz_pass';
    resourceId?: string;
    score?: number;
    xp: number;
    coins: number;
  }) {
    const [xpRecord] = await Promise.all([
      this.ensureXp(params.tenantId, params.userId),
      this.ensureCoins(params.tenantId, params.userId),
    ]);
    const newTotalXp = xpRecord.totalXp + params.xp;
    const newLevel = this.levelFromXp(newTotalXp);

    const updatedXp = await this.prisma.userXp.update({
      where: { userId: params.userId },
      data: {
        totalXp: newTotalXp,
        currentLevel: newLevel,
      },
    });
    const updatedCoins = await this.prisma.userCoins.update({
      where: { userId: params.userId },
      data: { balance: { increment: params.coins } },
    });
    const streak = await this.updateStreak(params.tenantId, params.userId);

    const earnedBadges = await this.checkAndAwardBadges(
      params.tenantId,
      params.userId,
      params.eventType,
    );

    return {
      eventType: params.eventType,
      resourceId: params.resourceId ?? null,
      score: params.score ?? null,
      xpAwarded: params.xp,
      coinsAwarded: params.coins,
      totalXp: updatedXp.totalXp,
      currentLevel: updatedXp.currentLevel,
      coinBalance: updatedCoins.balance,
      streak: {
        currentStreak: streak.currentStreak,
        longestStreak: streak.longestStreak,
      },
      badgesEarned: earnedBadges,
    };
  }

  private levelFromXp(totalXp: number): number {
    return Math.max(1, Math.floor(totalXp / 100) + 1);
  }

  private async ensureXp(tenantId: string, userId: string) {
    return this.prisma.userXp.upsert({
      where: { userId },
      create: { tenantId, userId, totalXp: 0, currentLevel: 1 },
      update: {},
    });
  }

  private async ensureCoins(tenantId: string, userId: string) {
    return this.prisma.userCoins.upsert({
      where: { userId },
      create: { tenantId, userId, balance: 0 },
      update: {},
    });
  }

  private async ensureStreak(tenantId: string, userId: string) {
    return this.prisma.userStreak.upsert({
      where: { userId },
      create: { tenantId, userId },
      update: {},
    });
  }

  private async updateStreak(tenantId: string, userId: string) {
    const streak = await this.ensureStreak(tenantId, userId);
    const today = this.toDateOnly(new Date());

    if (!streak.lastActivityDate) {
      return this.prisma.userStreak.update({
        where: { userId },
        data: {
          currentStreak: 1,
          longestStreak: Math.max(1, streak.longestStreak),
          lastActivityDate: today,
        },
      });
    }

    const lastDate = this.toDateOnly(streak.lastActivityDate);
    const dayDiff = this.daysBetween(lastDate, today);

    if (dayDiff === 0) {
      return streak;
    }

    if (dayDiff === 1) {
      const newStreak = streak.currentStreak + 1;
      return this.prisma.userStreak.update({
        where: { userId },
        data: {
          currentStreak: newStreak,
          longestStreak: Math.max(newStreak, streak.longestStreak),
          lastActivityDate: today,
        },
      });
    }

    return this.prisma.userStreak.update({
      where: { userId },
      data: {
        currentStreak: 1,
        lastActivityDate: today,
      },
    });
  }

  private async checkAndAwardBadges(
    tenantId: string,
    userId: string,
    eventType: 'lesson_complete' | 'quiz_pass',
  ) {
    const badgeCode =
      eventType === 'lesson_complete' ? 'first_lesson' : 'first_quiz_pass';

    const badge = await this.prisma.badge.findFirst({
      where: {
        OR: [{ tenantId }, { tenantId: null }],
        code: badgeCode,
      },
    });

    if (!badge) return [];

    const existing = await this.prisma.userBadge.findUnique({
      where: {
        tenantId_userId_badgeId: {
          tenantId,
          userId,
          badgeId: badge.id,
        },
      },
    });

    if (existing) return [];

    const earned = await this.prisma.userBadge.create({
      data: {
        tenantId,
        userId,
        badgeId: badge.id,
      },
      include: {
        badge: {
          select: { id: true, code: true, name: true, iconUrl: true },
        },
      },
    });

    if (badge.xpReward > 0) {
      await this.prisma.userXp.update({
        where: { userId },
        data: { totalXp: { increment: badge.xpReward } },
      });
    }

    return [earned.badge];
  }

  private toDateOnly(date: Date): Date {
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  }

  private daysBetween(a: Date, b: Date): number {
    const msPerDay = 24 * 60 * 60 * 1000;
    return Math.round((b.getTime() - a.getTime()) / msPerDay);
  }
}
