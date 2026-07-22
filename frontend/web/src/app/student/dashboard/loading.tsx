import { DashboardShell } from '@/components/dashboard-shell';
import { KpiCard, ProgressCard, Skeleton } from '@eduai/ui';
import { BookOpen, Flame, Sparkles, TrendingUp } from 'lucide-react';

export default function StudentDashboardLoading() {
  return (
    <DashboardShell title="Student Dashboard" portal="student">
      <div className="space-y-8">
        <Skeleton className="h-56 w-full rounded-xl md:h-64" />

        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <KpiCard icon={<Sparkles className="h-5 w-5" />} label="Total XP" value="—" loading />
          <KpiCard icon={<Flame className="h-5 w-5" />} label="Current Streak" value="—" loading />
          <KpiCard icon={<BookOpen className="h-5 w-5" />} label="Active Courses" value="—" loading />
          <KpiCard icon={<TrendingUp className="h-5 w-5" />} label="Lessons Completed" value="—" loading />
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          <ProgressCard title="Course Mastery" value={0} loading />
          <ProgressCard title="Streak Momentum" value={0} loading />
        </section>

        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-40 rounded-xl" />
          <Skeleton className="h-40 rounded-xl" />
          <Skeleton className="h-40 rounded-xl" />
        </div>
      </div>
    </DashboardShell>
  );
}
