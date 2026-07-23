import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../src/components/button';

const meta = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Primary action control. Supports loading, focus-visible rings, and reduced-motion (active scale disabled).',
      },
    },
  },
  args: {
    children: 'Continue',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'outline', 'ghost', 'destructive', 'accent', 'glass'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'icon'],
    },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = { args: { variant: 'default' } };
export const Secondary: Story = { args: { variant: 'secondary', children: 'AI tools' } };
export const Outline: Story = { args: { variant: 'outline', children: 'Cancel' } };
export const Destructive: Story = { args: { variant: 'destructive', children: 'Delete' } };
export const Disabled: Story = { args: { disabled: true, children: 'Unavailable' } };
export const Loading: Story = { args: { loading: true, children: 'Saving' } };

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};

export const RtlSafe: Story = {
  name: 'RTL (dir=rtl)',
  render: () => (
    <div dir="rtl" className="flex gap-3">
      <Button>متابعة</Button>
      <Button variant="outline">إلغاء</Button>
    </div>
  ),
};
