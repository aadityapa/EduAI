import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../src/components/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../src/components/dialog';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../src/components/sheet';
import { Popover, PopoverContent, PopoverTrigger } from '../src/components/popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../src/components/tooltip';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../src/components/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../src/components/accordion';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../src/components/breadcrumb';
import { Pagination } from '../src/components/pagination';
import { Stepper } from '../src/components/stepper';
import { useState } from 'react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../src/components/command';

const meta = {
  title: 'Components/OverlaysNav',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Dialog, Sheet, Popover, Tooltip, Tabs, Accordion, Breadcrumbs, Pagination, Stepper, Command palette.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const DialogStory: Story = {
  name: 'Dialog',
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm enrollment</DialogTitle>
          <DialogDescription>You can leave this course anytime.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const SheetStory: Story = {
  name: 'Sheet',
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open drawer</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
          <SheetDescription>Narrow the course list.</SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  ),
};

export const PopoverTooltip: Story = {
  render: () => (
    <div className="flex gap-4">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Popover</Button>
        </PopoverTrigger>
        <PopoverContent>Quick info without leaving the page.</PopoverContent>
      </Popover>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost">Hover me</Button>
          </TooltipTrigger>
          <TooltipContent>Tooltip tip</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  ),
};

export const TabsAccordion: Story = {
  render: () => (
    <div className="max-w-lg space-y-6">
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="grades">Grades</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">Overview content</TabsContent>
        <TabsContent value="grades">Grades content</TabsContent>
      </Tabs>
      <Accordion type="single" collapsible>
        <AccordionItem value="1">
          <AccordionTrigger>What is XP?</AccordionTrigger>
          <AccordionContent>Experience points earned by completing lessons.</AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  ),
};

export const BreadcrumbsPaginationStepper: Story = {
  render: function NavDemo() {
    const [page, setPage] = useState(2);
    return (
      <div className="space-y-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Courses</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Algebra</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Pagination page={page} pageCount={8} onPageChange={setPage} />
        <Stepper
          currentStep={1}
          steps={[
            { id: '1', label: 'Details' },
            { id: '2', label: 'Questions' },
            { id: '3', label: 'Review' },
          ]}
        />
      </div>
    );
  },
};

export const CommandPalette: Story = {
  render: function CmdDemo() {
    const [open, setOpen] = useState(true);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open ⌘K</Button>
        <CommandDialog open={open} onOpenChange={setOpen}>
          <CommandInput placeholder="Jump to…" />
          <CommandList>
            <CommandEmpty>No results.</CommandEmpty>
            <CommandGroup heading="Pages">
              <CommandItem onSelect={() => setOpen(false)}>Dashboard</CommandItem>
              <CommandItem onSelect={() => setOpen(false)}>Courses</CommandItem>
            </CommandGroup>
          </CommandList>
        </CommandDialog>
      </>
    );
  },
};
