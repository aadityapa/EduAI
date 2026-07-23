import { BookOpen, Flame, Sparkles, TrendingUp } from 'lucide-react';
import { KpiCard, ProgressCard, Skeleton } from '@eduai/ui';

/** Joyful student dashboard loading skeleton (matches Stitch KPI + banner layout). */
export function StudentDashboardSkeleton() {
  return (
    <div className="space-y-8" aria-busy="true" aria-label="Loading dashboard">
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
  );
}

/** Dense teacher dashboard loading skeleton. */
export function TeacherDashboardSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading dashboard">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-80" />
      </div>
      <div className="grid gap-4 md:grid-cols-12">
        <Skeleton className="h-40 rounded-xl md:col-span-8" />
        <Skeleton className="h-40 rounded-xl md:col-span-4" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Skeleton className="h-24 rounded-xl" />
        <Skeleton className="h-24 rounded-xl" />
        <Skeleton className="h-24 rounded-xl" />
        <Skeleton className="h-24 rounded-xl" />
      </div>
      <div className="grid gap-4 lg:grid-cols-12">
        <Skeleton className="h-48 rounded-xl lg:col-span-7" />
        <Skeleton className="h-48 rounded-xl lg:col-span-5" />
      </div>
    </div>
  );
}

/** Calm parent dashboard loading skeleton. */
export function ParentDashboardSkeleton() {
  return (
    <div className="space-y-8" aria-busy="true" aria-label="Loading dashboard">
      <div className="space-y-2">
        <Skeleton className="h-8 w-72" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Skeleton className="h-32 rounded-2xl" />
        <Skeleton className="h-32 rounded-2xl" />
        <Skeleton className="h-32 rounded-2xl" />
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <Skeleton className="h-64 rounded-2xl lg:col-span-2" />
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    </div>
  );
}

/** Generic catalog / list page skeleton. */
export function CatalogSkeleton({ cards = 6 }: { cards?: number }) {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>
      <Skeleton className="h-12 w-full rounded-xl" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: cards }).map((_, i) => (
          <Skeleton key={i} className="h-44 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
