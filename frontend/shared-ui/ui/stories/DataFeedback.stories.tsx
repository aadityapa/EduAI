import type { Meta, StoryObj } from '@storybook/react';
import type { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '../src/components/data-table';
import { EmptyState } from '../src/components/empty-state';
import { ErrorState } from '../src/components/error-state';
import { BookOpen } from 'lucide-react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  type ChartConfig,
} from '../src/components/chart';

type Row = { id: string; name: string; role: string };

const columns: ColumnDef<Row>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'role', header: 'Role' },
];

const data: Row[] = [
  { id: '1', name: 'Asha', role: 'Student' },
  { id: '2', name: 'Ravi', role: 'Teacher' },
  { id: '3', name: 'Meera', role: 'Parent' },
];

const chartConfig = {
  xp: { label: 'XP', color: 'hsl(var(--primary))' },
} satisfies ChartConfig;

const meta = {
  title: 'Components/DataFeedback',
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Table: Story = {
  render: () => (
    <DataTable columns={columns} data={data} searchKey="name" searchPlaceholder="Filter names" />
  ),
};

export const Empty: Story = {
  render: () => (
    <EmptyState
      icon={<BookOpen className="h-5 w-5" />}
      title="No courses yet"
      description="Enroll in a course to get started."
    />
  ),
};

export const Error: Story = {
  render: () => <ErrorState onRetry={() => undefined} />,
};

export const Chart: Story = {
  render: () => (
    <ChartContainer config={chartConfig} className="h-64 w-full max-w-lg">
      <AreaChart
        data={[
          { day: 'Mon', xp: 40 },
          { day: 'Tue', xp: 65 },
          { day: 'Wed', xp: 50 },
          { day: 'Thu', xp: 90 },
        ]}
      >
        <CartesianGrid vertical={false} />
        <XAxis dataKey="day" />
        <YAxis />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Area dataKey="xp" type="monotone" fill="var(--color-xp)" stroke="var(--color-xp)" />
      </AreaChart>
    </ChartContainer>
  ),
};
