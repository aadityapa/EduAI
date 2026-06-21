import { cn } from '../lib/utils';
import type { ReactNode } from 'react';

interface StitchWelcomeBannerProps {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

/** Stitch-inspired hero banner for dashboard pages */
export function StitchWelcomeBanner({
  title,
  description,
  action,
  className,
}: StitchWelcomeBannerProps) {
  return (
    <div
      className={cn(
        'stitch-welcome-banner relative overflow-hidden rounded-2xl p-6 text-white md:p-8',
        className,
      )}
    >
      <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">{title}</h2>
          {description && <p className="mt-1 max-w-xl text-sm text-white/85 md:text-base">{description}</p>}
        </div>
        {action}
      </div>
    </div>
  );
}

interface StitchAiPromoProps {
  title: string;
  description: string;
  href: string;
  linkLabel?: string;
}

export function StitchAiPromo({ title, description, href, linkLabel = 'Open AI Tutor' }: StitchAiPromoProps) {
  return (
    <a
      href={href}
      className="stitch-ai-promo group block rounded-2xl p-6 text-white transition-transform hover:scale-[1.01]"
    >
      <p className="text-xs font-medium uppercase tracking-widest text-white/70">AI Powered</p>
      <h3 className="mt-2 text-xl font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-white/85">{description}</p>
      <span className="mt-4 inline-flex items-center text-sm font-medium underline-offset-4 group-hover:underline">
        {linkLabel} →
      </span>
    </a>
  );
}
