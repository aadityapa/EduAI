'use client';

import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button, Card, CardContent, CardHeader, CardTitle, ProgressBar } from '@eduai/ui';
import { Calendar, Loader2, Sparkles } from 'lucide-react';
import { useLocale } from '@/components/locale-provider';

const AI_BASE = process.env.NEXT_PUBLIC_AI_SERVICE_URL ?? 'http://localhost:3004';

interface StudyPlanDay {
  day: string;
  focus: string;
  tasks: string[];
  durationMinutes: number;
}

interface StudyPlan {
  summary: string;
  weeklyHours: number;
  schedule: StudyPlanDay[];
  tips: string[];
}

export function StudyPlanner() {
  const { data: session } = useSession();
  const { t } = useLocale();
  const [subjects, setSubjects] = useState('Mathematics, Science');
  const [goals, setGoals] = useState('Prepare for mid-term exams');
  const [hours, setHours] = useState(10);
  const [examDate, setExamDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<StudyPlan | null>(null);
  const [savedPlans, setSavedPlans] = useState<
    Array<{ conversationId: string; title: string | null; plan: StudyPlan | null }>
  >([]);

  const loadPlans = useCallback(async () => {
    if (!session?.user?.accessToken) return;
    const res = await fetch(`${AI_BASE}/api/v1/planner/plans`, {
      headers: { Authorization: `Bearer ${session.user.accessToken}` },
    });
    if (res.ok) {
      const json = await res.json();
      setSavedPlans(json.data ?? []);
    }
  }, [session?.user?.accessToken]);

  useEffect(() => {
    void loadPlans();
  }, [loadPlans]);

  async function generate() {
    if (!session?.user?.accessToken) return;
    setLoading(true);
    try {
      const res = await fetch(`${AI_BASE}/api/v1/planner/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.user.accessToken}`,
        },
        body: JSON.stringify({
          subjects: subjects.split(',').map((s) => s.trim()),
          goals,
          availableHoursPerWeek: hours,
          examDate: examDate || undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message ?? 'Failed');
      setPlan(json.data.plan);
      void loadPlans();
    } catch {
      setPlan(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            {t('ai.planner.title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <label className="space-y-1 text-sm">
            {t('ai.planner.subjects')}
            <input
              value={subjects}
              onChange={(e) => setSubjects(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2"
            />
          </label>
          <label className="space-y-1 text-sm">
            {t('ai.planner.hours')}
            <input
              type="number"
              min={1}
              max={40}
              value={hours}
              onChange={(e) => setHours(Number(e.target.value))}
              className="w-full rounded-lg border border-border bg-background px-3 py-2"
            />
          </label>
          <label className="space-y-1 text-sm md:col-span-2">
            {t('ai.planner.goals')}
            <input
              value={goals}
              onChange={(e) => setGoals(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2"
            />
          </label>
          <label className="space-y-1 text-sm">
            {t('ai.planner.examDate')}
            <input
              type="date"
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2"
            />
          </label>
          <div className="flex items-end">
            <Button onClick={generate} disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {t('ai.planner.generate')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {plan && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>{t('ai.planner.summary')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{plan.summary}</p>
              <p className="mt-2 text-sm">
                {t('ai.planner.weeklyHours')}: {plan.weeklyHours}h
              </p>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {plan.schedule.map((day, i) => (
              <Card key={i} className="glass-card">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Calendar className="h-4 w-4" />
                    {day.day}
                  </CardTitle>
                  <p className="text-sm text-primary">{day.focus}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    {day.tasks.map((task, j) => (
                      <li key={j}>• {task}</li>
                    ))}
                  </ul>
                  <p className="mt-2 text-xs">{day.durationMinutes} min</p>
                  <ProgressBar value={Math.min(day.durationMinutes, 120)} max={120} className="mt-2" />
                </CardContent>
              </Card>
            ))}
          </div>

          {plan.tips.length > 0 && (
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>{t('ai.planner.tips')}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 text-sm text-muted-foreground">
                  {plan.tips.map((tip, i) => (
                    <li key={i}>{tip}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </motion.div>
      )}

      {savedPlans.length > 0 && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>{t('ai.planner.history')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {savedPlans.map((p) => (
                <li key={p.conversationId} className="rounded-lg bg-muted/50 px-3 py-2">
                  {p.title}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
