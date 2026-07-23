import type { Meta, StoryObj } from '@storybook/react';

const swatches = [
  { name: 'primary', varName: '--primary', hex: '#1A73E8' },
  { name: 'primary-deep', varName: '--primary-deep', hex: '#005BBF' },
  { name: 'secondary / tertiary', varName: '--secondary', hex: '#9334E6' },
  { name: 'success', varName: '--success', hex: '#34A853' },
  { name: 'warning', varName: '--warning', hex: '#F59E0B' },
  { name: 'destructive', varName: '--destructive', hex: '#D93025' },
  { name: 'info', varName: '--info', hex: '#0EA5E9' },
  { name: 'xp', varName: '--xp', hex: 'gold' },
  { name: 'streak', varName: '--streak', hex: 'orange' },
] as const;

function TokenSwatch({ name, varName }: { name: string; varName: string }) {
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-border bg-card p-3 shadow-sm">
      <div
        className="h-16 w-full rounded-md border border-border"
        style={{ backgroundColor: `hsl(var(${varName}))` }}
      />
      <div className="text-sm font-medium text-foreground">{name}</div>
      <code className="text-caption text-muted-foreground">{varName}</code>
    </div>
  );
}

function FoundationsDemo() {
  return (
    <div className="space-y-10 p-2">
      <section className="space-y-3">
        <h2 className="text-h3 font-display">Color</h2>
        <p className="text-body-sm text-muted-foreground">
          Stitch-aligned semantic tokens. Switch theme in the toolbar to verify light / dark /
          high-contrast.
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {swatches.map((s) => (
            <TokenSwatch key={s.varName} name={s.name} varName={s.varName} />
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-h3 font-display">Surfaces</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-border bg-background p-4 text-sm">bg / background</div>
          <div className="rounded-lg border border-border bg-surface p-4 text-sm">surface</div>
          <div className="rounded-lg border border-border bg-surface-elevated p-4 text-sm shadow-md">
            surface-elevated
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-h3 font-display">Typography</h2>
        <div className="space-y-2 rounded-lg border border-border bg-card p-4">
          <p className="text-display font-display">Display</p>
          <p className="text-h1">Heading 1</p>
          <p className="text-h2">Heading 2</p>
          <p className="text-h3">Heading 3</p>
          <p className="text-body">Body — The quick brown fox. शिक्षा और शिक्षा (Devanagari sample).</p>
          <p className="text-label">Label</p>
          <p className="text-caption">Caption / helper</p>
          <p className="font-mono text-code">code: const xp = 120;</p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-h3 font-display">Motion</h2>
        <p className="text-body-sm text-muted-foreground">
          Durations: 120 / 200 / 320ms. Respects <code>prefers-reduced-motion</code>.
        </p>
        <div className="flex flex-wrap gap-3">
          <div className="rounded-lg bg-primary px-4 py-2 text-primary-foreground transition-transform duration-fast hover:scale-105 ease-spring">
            fast 120ms
          </div>
          <div className="rounded-lg bg-secondary px-4 py-2 text-secondary-foreground transition-transform duration-normal hover:scale-105">
            normal 200ms
          </div>
          <div className="rounded-lg bg-success px-4 py-2 text-success-foreground transition-transform duration-slow hover:scale-105">
            slow 320ms
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-h3 font-display">Elevation & radius</h2>
        <div className="flex flex-wrap gap-4">
          <div className="rounded-sm bg-card p-4 shadow-sm">radius-sm + shadow-sm</div>
          <div className="rounded-lg bg-card p-4 shadow-md">radius + shadow-md</div>
          <div className="rounded-xl bg-card p-4 shadow-lg">radius-xl + shadow-lg</div>
        </div>
      </section>
    </div>
  );
}

const meta = {
  title: 'Foundations/Tokens',
  component: FoundationsDemo,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Semantic design tokens for EduAI. Source: `globals.css` + `tailwind-preset.ts`.',
      },
    },
  },
} satisfies Meta<typeof FoundationsDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
