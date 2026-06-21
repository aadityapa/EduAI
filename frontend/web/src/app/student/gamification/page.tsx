import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { Award, Sparkles } from 'lucide-react';
import { DashboardShell } from '@/components/dashboard-shell';
import { ApiError } from '@/components/api-error';
import { PageMotion } from '@/components/page-motion';
import { getGamification, getLeaderboard, LearningApiError } from '@/lib/learning-api';
import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  LeaderboardRow,
  StitchPageHeader,
  StatCard,
  StreakBadge,
  XpBadge,
} from '@eduai/ui';

export default async function GamificationPage() {
  const session = await auth();
  if (!session?.user) redirect('/login');
  if (!session.user.roles.includes('student')) redirect('/dashboard');

  let gamification = null;
  let leaderboard = null;
  let loadError: string | null = null;

  try {
    [gamification, leaderboard] = await Promise.all([getGamification(), getLeaderboard()]);
  } catch (err) {
    loadError = err instanceof LearningApiError ? err.message : 'Failed to load gamification data';
  }

  return (
    <DashboardShell title="Achievements" portal="student">
      <PageMotion>
        <div className="space-y-6">
          <StitchPageHeader title="Achievements & Leaderboard" description="Track XP, streaks, badges, and rank." />
          {loadError && <ApiError message={loadError} />}

          <div className="grid gap-4 md:grid-cols-3">
            <StatCard
              icon={<Sparkles className="h-5 w-5" />}
              label="Total XP"
              value={gamification?.xp.totalXp ?? '—'}
              description={
                gamification ? `Level ${gamification.xp.currentLevel}` : undefined
              }
            />
            <StatCard
              icon={<Award className="h-5 w-5" />}
              label="Coins"
              value={gamification?.coins.balance ?? '—'}
            />
            <StatCard
              icon={<Sparkles className="h-5 w-5" />}
              label="Day streak"
              value={
                gamification ? (
                  <StreakBadge days={gamification.streak.currentStreak} showIcon={false} />
                ) : (
                  '—'
                )
              }
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="stitch-card">
              <CardHeader>
                <CardTitle>Badges</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {!gamification?.badges.length ? (
                  <p className="text-sm text-muted-foreground">
                    Complete lessons and quizzes to earn badges.
                  </p>
                ) : (
                  gamification.badges.map((entry) => (
                    <div
                      key={entry.id}
                      className="flex items-start gap-3 rounded-lg border p-3"
                    >
                      <Badge variant="outline">{entry.badge.category ?? 'Badge'}</Badge>
                      <div>
                        <p className="font-medium">{entry.badge.name}</p>
                        {entry.badge.description && (
                          <p className="text-sm text-muted-foreground">
                            {entry.badge.description}
                          </p>
                        )}
                        <p className="mt-1 text-xs text-muted-foreground">
                          Earned {new Date(entry.earnedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            <Card className="stitch-card">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Leaderboard</CardTitle>
                {gamification && <XpBadge xp={gamification.xp.totalXp} size="sm" />}
              </CardHeader>
              <CardContent className="space-y-2">
                {!leaderboard?.length ? (
                  <p className="text-sm text-muted-foreground">No leaderboard data yet.</p>
                ) : (
                  leaderboard.map((entry) => {
                    const name =
                      `${entry.user.firstName} ${entry.user.lastName ?? ''}`.trim();
                    return (
                      <LeaderboardRow
                        key={entry.userId}
                        rank={entry.rank}
                        name={name}
                        xp={entry.totalXp}
                        avatarUrl={entry.user.avatarUrl ?? undefined}
                        isCurrentUser={entry.userId === session.user.id}
                        subtitle={`Level ${entry.currentLevel}`}
                      />
                    );
                  })
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </PageMotion>
    </DashboardShell>
  );
}
