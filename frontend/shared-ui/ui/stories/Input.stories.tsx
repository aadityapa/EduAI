import type { Meta, StoryObj } from '@storybook/react';
import { Input } from '../src/components/input';
import { Label } from '../src/components/label';
import { Textarea } from '../src/components/textarea';

const meta = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Text fields with error / disabled states. Pair with Label + FormMessage for a11y.',
      },
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { placeholder: 'Email address' },
};

export const Disabled: Story = {
  args: { placeholder: 'Disabled', disabled: true },
};

export const Error: Story = {
  render: () => (
    <div className="space-y-2 max-w-sm">
      <Label htmlFor="email-err">Email</Label>
      <Input id="email-err" error errorMessageId="email-err-msg" defaultValue="not-an-email" />
      <p id="email-err-msg" className="text-sm text-destructive" role="alert">
        Enter a valid email address.
      </p>
    </div>
  ),
};

export const TextareaDefault: Story = {
  name: 'Textarea',
  render: () => <Textarea placeholder="Write a note…" className="max-w-md" />,
};
