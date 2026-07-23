import type { Meta, StoryObj } from '@storybook/react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../src/components/button';
import { Input } from '../src/components/input';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../src/components/form';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  name: z.string().min(2, 'Name is required'),
});

type FormValues = z.infer<typeof schema>;

const meta = {
  title: 'Components/Form',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'react-hook-form + zod helpers (FormField, FormControl, FormMessage). Wire labels via props for i18n.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Basic: Story = {
  render: function FormDemo() {
    const form = useForm<FormValues>({
      resolver: zodResolver(schema),
      defaultValues: { email: '', name: '' },
    });

    return (
      <Form {...form}>
        <form
          className="max-w-sm space-y-4"
          onSubmit={form.handleSubmit(() => undefined)}
          noValidate
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Student name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="you@school.edu" {...field} />
                </FormControl>
                <FormDescription>Used for login and notifications.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    );
  },
};
