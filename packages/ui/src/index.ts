import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export { Button, buttonVariants } from './components/button';
export { Input } from './components/input';
export { Label } from './components/label';
export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './components/card';
export { Avatar, AvatarImage, AvatarFallback } from './components/avatar';
export { Badge } from './components/badge';
export { ProgressBar } from './components/progress-bar';
export type { ProgressBarProps } from './components/progress-bar';
export { StatCard } from './components/stat-card';
export type { StatCardProps } from './components/stat-card';
export { StreakBadge } from './components/streak-badge';
export type { StreakBadgeProps } from './components/streak-badge';
export { XpBadge } from './components/xp-badge';
export type { XpBadgeProps } from './components/xp-badge';
export { LanguageSwitcher } from './components/language-switcher';
export type { LanguageSwitcherProps, LocaleOption } from './components/language-switcher';
export { QuizQuestion } from './components/quiz-question';
export type { QuizQuestionProps, QuizQuestionType } from './components/quiz-question';
export { CourseCard } from './components/course-card';
export type { CourseCardProps, CourseStatus } from './components/course-card';
export { LeaderboardRow } from './components/leaderboard-row';
export type { LeaderboardRowProps } from './components/leaderboard-row';
export { TenantThemeProvider, useTenantTheme } from './components/tenant-theme-provider';
export type { TenantTheme } from './components/tenant-theme-provider';
