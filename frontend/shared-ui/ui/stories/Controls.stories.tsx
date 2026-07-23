import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Search } from 'lucide-react';
import { IconButton } from '../src/components/icon-button';
import { Checkbox } from '../src/components/checkbox';
import { RadioGroup, RadioGroupItem } from '../src/components/radio-group';
import { Switch } from '../src/components/switch';
import { Slider } from '../src/components/slider';
import { Label } from '../src/components/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../src/components/select';
import { Combobox } from '../src/components/combobox';
import { DatePicker } from '../src/components/date-picker';
import { Chip, Tag } from '../src/components/chip';
import { Spinner } from '../src/components/spinner';
import { Progress } from '../src/components/progress';
import { Skeleton } from '../src/components/skeleton';

const meta = {
  title: 'Components/Controls',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Form controls: checkbox, radio, switch, slider, select, combobox, date picker, chips, progress, spinner.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const IconButtonStory: Story = {
  name: 'IconButton',
  render: () => (
    <IconButton aria-label="Search">
      <Search className="h-4 w-4" />
    </IconButton>
  ),
};

export const CheckboxStory: Story = {
  name: 'Checkbox',
  render: () => (
    <div className="flex items-center gap-2">
      <Checkbox id="terms" />
      <Label htmlFor="terms">Accept terms</Label>
    </div>
  ),
};

export const RadioStory: Story = {
  name: 'Radio',
  render: () => (
    <RadioGroup defaultValue="a" className="max-w-xs">
      <div className="flex items-center gap-2">
        <RadioGroupItem value="a" id="r1" />
        <Label htmlFor="r1">Option A</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="b" id="r2" />
        <Label htmlFor="r2">Option B</Label>
      </div>
    </RadioGroup>
  ),
};

export const SwitchStory: Story = {
  name: 'Switch',
  render: () => (
    <div className="flex items-center gap-2">
      <Switch id="notify" />
      <Label htmlFor="notify">Notifications</Label>
    </div>
  ),
};

export const SliderStory: Story = {
  name: 'Slider',
  render: () => <Slider defaultValue={[40]} max={100} step={1} className="max-w-sm" aria-label="Volume" />,
};

export const SelectStory: Story = {
  name: 'Select',
  render: () => (
    <Select>
      <SelectTrigger className="w-56" aria-label="Board">
        <SelectValue placeholder="Choose board" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="cbse">CBSE</SelectItem>
        <SelectItem value="icse">ICSE</SelectItem>
        <SelectItem value="state">State board</SelectItem>
      </SelectContent>
    </Select>
  ),
};

export const ComboboxStory: Story = {
  name: 'Combobox',
  render: function ComboboxDemo() {
    const [value, setValue] = useState('');
    return (
      <Combobox
        className="w-64"
        value={value}
        onValueChange={setValue}
        placeholder="Subject"
        options={[
          { value: 'math', label: 'Mathematics' },
          { value: 'sci', label: 'Science' },
          { value: 'eng', label: 'English' },
        ]}
      />
    );
  },
};

export const DatePickerStory: Story = {
  name: 'DatePicker',
  render: function DateDemo() {
    const [date, setDate] = useState<Date | undefined>();
    return <DatePicker value={date} onChange={setDate} className="w-64" />;
  },
};

export const Chips: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Chip selected>Filterable</Chip>
      <Chip variant="primary" onRemove={() => undefined}>
        Removable
      </Chip>
      <Tag variant="success">Display tag</Tag>
    </div>
  ),
};

export const Feedback: Story = {
  render: () => (
    <div className="space-y-4 max-w-sm">
      <Spinner label="Loading content" />
      <Progress value={62} aria-label="Course progress" />
      <Skeleton className="h-10 w-full" />
    </div>
  ),
};
