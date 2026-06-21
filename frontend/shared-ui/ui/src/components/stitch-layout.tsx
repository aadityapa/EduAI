import { cn } from '../lib/utils';
import type { ReactNode } from 'react';
import { Brain, Sparkles } from 'lucide-react';
import { ProgressBar } from './progress-bar';

interface StitchWelcomeBannerProps {
  title: string;
  description?: string;
  action?: ReactNode;
  imageUrl?: string;
  className?: string;
}

/** Stitch hero banner — image background with gradient overlay */
export function StitchWelcomeBanner({
  title,
  description,
  action,
  imageUrl,
  className,
}: StitchWelcomeBannerProps) {
  return (
    <section
      className={cn(
        'relative flex h-56 items-center overflow-hidden rounded-xl border border-border/50 shadow-sm md:h-64',
        !imageUrl && 'stitch-welcome-banner',
        className,
      )}
    >
      {imageUrl && (
        <>
          <img
            src={imageUrl}
            alt=""
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/25 to-transparent" />
        </>
      )}
      {!imageUrl && <div className="stitch-welcome-banner-overlay absolute inset-0" aria-hidden="true" />}
      <div className="relative z-10 flex w-full flex-col gap-4 p-6 text-white md:flex-row md:items-center md:justify-between md:p-8">
        <div className="max-w-md space-y-1">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">{title}</h2>
          {description && <p className="text-sm text-white/90 md:text-base">{description}</p>}
        </div>
        {action}
      </div>
    </section>
  );
}

interface StitchAiPromoProps {
  title: string;
  description: string;
  href: string;
  linkLabel?: string;
  imageUrl?: string;
  className?: string;
}

/** Stitch bento AI tutor promo card */
export function StitchAiPromo({
  title,
  description,
  href,
  linkLabel = 'Try Now',
  imageUrl,
  className,
}: StitchAiPromoProps) {
  return (
    <div
      className={cn(
        'stitch-card flex h-full flex-col overflow-hidden border border-border/30 transition-shadow hover:shadow-md',
        className,
      )}
    >
      <div className="group relative h-48 overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt=""
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="stitch-ai-promo h-full w-full" />
        )}
        <div className="absolute inset-0 bg-[#9334E6]/20 backdrop-blur-[2px]" />
      </div>
      <div className="flex flex-1 flex-col space-y-3 p-6">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-[#9334E6] p-1 text-white">
            <Brain className="h-4 w-4" aria-hidden="true" />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#9334E6]">Premium Feature</span>
        </div>
        <h4 className="text-lg font-bold leading-tight">{title}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
        <div className="mt-auto pt-2">
          <a
            href={href}
            className="inline-flex w-full items-center justify-center rounded-full bg-[#9334E6] py-3 text-sm font-bold text-white shadow-lg shadow-[#9334E6]/30 transition-all hover:-translate-y-0.5 hover:shadow-[#9334E6]/50"
          >
            {linkLabel}
          </a>
        </div>
      </div>
    </div>
  );
}

interface StitchRecentCourseCardProps {
  href: string;
  subject: string;
  title: string;
  progress: number;
  accent?: 'primary' | 'secondary' | 'tertiary';
  className?: string;
}

const accentStyles = {
  primary: 'bg-primary/10 text-primary',
  secondary: 'bg-success/10 text-success',
  tertiary: 'bg-[#9334E6]/10 text-[#9334E6]',
} as const;

/** Compact course card from Stitch student dashboard */
export function StitchRecentCourseCard({
  href,
  subject,
  title,
  progress,
  accent = 'primary',
  className,
}: StitchRecentCourseCardProps) {
  return (
    <a
      href={href}
      className={cn(
        'stitch-card flex flex-col border border-border/30 p-4 transition-transform hover:-translate-y-1 hover:shadow-md',
        className,
      )}
    >
      <div
        className={cn(
          'mb-4 flex h-24 items-center justify-center rounded-lg',
          accentStyles[accent],
        )}
      >
        <Sparkles className="h-10 w-10 opacity-40" aria-hidden="true" />
      </div>
      <h5 className="font-bold">{subject}</h5>
      <p className="mb-4 text-xs text-muted-foreground">{title}</p>
      <div className="mt-auto">
        <ProgressBar value={progress} showPercentage variant="lesson" size="sm" />
      </div>
    </a>
  );
}
