'use client';

import * as React from 'react';
import * as RechartsPrimitive from 'recharts';
import { cn } from '../lib/utils';

export type ChartConfig = Record<
  string,
  { label?: React.ReactNode; color?: string }
>;

const ChartContext = React.createContext<{ config: ChartConfig } | null>(null);

function useChart() {
  const context = React.useContext(ChartContext);
  if (!context) throw new Error('useChart must be used within a ChartContainer');
  return context;
}

const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'> & {
    config: ChartConfig;
    children: React.ComponentProps<typeof RechartsPrimitive.ResponsiveContainer>['children'];
  }
>(({ id, className, children, config, ...props }, ref) => {
  const uniqueId = React.useId();
  const chartId = `chart-${id || uniqueId.replace(/:/g, '')}`;

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-chart={chartId}
        ref={ref}
        className={cn(
          'flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke="#ccc"]]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke="#fff"]]:stroke-transparent [&_.recharts-layer]:outline-none [&_.recharts-polar-grid_[stroke="#ccc"]]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke="#ccc"]]:stroke-border [&_.recharts-sector[stroke="#fff"]]:stroke-transparent [&_.recharts-sector]:outline-none [&_.recharts-surface]:outline-none',
          className,
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>{children}</RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
});
ChartContainer.displayName = 'ChartContainer';

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(([, c]) => c.color);
  if (!colorConfig.length) return null;

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(config)
          .filter(([, c]) => c.color)
          .map(
            ([key, itemConfig]) =>
              `[data-chart=${id}] { --color-${key}: ${itemConfig.color}; }`,
          )
          .join('\n'),
      }}
    />
  );
};

const ChartTooltip = RechartsPrimitive.Tooltip;

const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'> & {
    active?: boolean;
    payload?: Array<{
      name?: string;
      value?: number;
      dataKey?: string;
      color?: string;
      payload?: Record<string, unknown>;
    }>;
    label?: string;
    hideLabel?: boolean;
    indicator?: 'line' | 'dot' | 'dashed';
    nameKey?: string;
    labelKey?: string;
    labelFormatter?: (label: string, payload: unknown[]) => React.ReactNode;
    labelClassName?: string;
    formatter?: (value: unknown, name: unknown, item: unknown, index: number, payload: unknown) => React.ReactNode;
    color?: string;
  }
>(
  (
    {
      active,
      payload,
      className,
      indicator = 'dot',
      hideLabel = false,
      label,
      labelFormatter,
      labelClassName,
      formatter,
      color,
      nameKey,
      labelKey,
    },
    ref,
  ) => {
    const { config } = useChart();

    if (!active || !payload?.length) return null;

    return (
      <div
        ref={ref}
        className={cn(
          'grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl',
          className,
        )}
      >
        {!hideLabel && label && (
          <div className={cn('font-medium', labelClassName)}>
            {labelFormatter ? labelFormatter(label, payload) : label}
          </div>
        )}
        <div className="grid gap-1.5">
          {payload.map((item: (typeof payload)[number], index: number) => {
            const key = `${nameKey || item.name || item.dataKey || 'value'}`;
            const itemConfig = config[key];
            const fill = item.payload && typeof item.payload.fill === 'string' ? item.payload.fill : undefined;
            const indicatorColor = color || fill || item.color;

            return (
              <div key={item.dataKey} className="flex w-full items-center gap-2">
                {indicator === 'dot' && (
                  <div
                    className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
                    style={{ backgroundColor: indicatorColor }}
                  />
                )}
                <div className="flex flex-1 justify-between leading-none">
                  <span className="text-muted-foreground">
                    {itemConfig?.label || item.name}
                  </span>
                  <span className="font-mono font-medium tabular-nums text-foreground">
                    {formatter
                      ? formatter(item.value, item.name, item, index, item.payload)
                      : item.value?.toLocaleString()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  },
);
ChartTooltipContent.displayName = 'ChartTooltipContent';

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartStyle,
};

export {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';
