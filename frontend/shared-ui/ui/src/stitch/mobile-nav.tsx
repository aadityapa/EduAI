'use client';

import { BookOpen, Home, LayoutDashboard, Sparkles, Trophy } from 'lucide-react';
import { cn } from '../lib/utils';

const tabs = [
  { href: '/student/dashboard', label: 'Home', icon: LayoutDashboard },
  { href: '/student/courses', label: 'Courses', icon: BookOpen },
  { href: '/student/ai/tutor', label: 'Tutor', icon: Sparkles },
  { href: '/student/hub', label: 'Hub', icon: Home },
  { href: '/student/gamification', label: 'XP', icon: Trophy },
];

/** Mobile bottom nav — eduai_student_dashboard_mobile */
export function StitchMobileBottomNav({
  activePath,
  className,
}: {
  activePath: string;
  className?: string;
}) {
  return (
    <nav
      className={cn(
        'fixed bottom-0 left-0 right-0 z-40 flex border-t bg-background/95 backdrop-blur-md md:hidden',
        className,
      )}
    >
      {tabs.map(({ href, label, icon: Icon }) => {
        const active = activePath === href || activePath.startsWith(`${href}/`);
        return (
          <a
            key={href}
            href={href}
            className={cn(
              'flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-medium',
              active ? 'text-primary' : 'text-muted-foreground',
            )}
          >
            <Icon className="h-5 w-5" />
            {label}
          </a>
        );
      })}
    </nav>
  );
}
