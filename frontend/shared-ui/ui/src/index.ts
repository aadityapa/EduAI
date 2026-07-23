import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export { Button, buttonVariants } from './components/button';
export type { ButtonProps } from './components/button';
export { IconButton } from './components/icon-button';
export type { IconButtonProps } from './components/icon-button';
export { Input } from './components/input';
export type { InputProps } from './components/input';
export { Textarea } from './components/textarea';
export type { TextareaProps } from './components/textarea';
export { Label } from './components/label';
export { Checkbox } from './components/checkbox';
export { RadioGroup, RadioGroupItem, Radio } from './components/radio-group';
export { Switch } from './components/switch';
export { Slider } from './components/slider';
export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
} from './components/select';
export { Combobox } from './components/combobox';
export type { ComboboxProps, ComboboxOption } from './components/combobox';
export { DatePicker } from './components/date-picker';
export type { DatePickerProps } from './components/date-picker';
export {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
  useFormField,
} from './components/form';
export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './components/card';
export { Avatar, AvatarImage, AvatarFallback } from './components/avatar';
export { Badge, badgeVariants } from './components/badge';
export type { BadgeProps } from './components/badge';
export { Chip, Tag, chipVariants } from './components/chip';
export type { ChipProps } from './components/chip';
export { Progress } from './components/progress';
export type { ProgressProps } from './components/progress';
export { ProgressBar } from './components/progress-bar';
export type { ProgressBarProps } from './components/progress-bar';
export { Spinner } from './components/spinner';
export type { SpinnerProps } from './components/spinner';
export { Skeleton } from './components/skeleton';
export { StatCard } from './components/stat-card';
export type { StatCardProps } from './components/stat-card';
export { KpiCard } from './components/kpi-card';
export type { KpiCardProps } from './components/kpi-card';
export { MasteryRing } from './components/mastery-ring';
export type { MasteryRingProps } from './components/mastery-ring';
export { ProgressRing, StreakFlame, XpCounter } from './components/domain-aliases';
export type {
  ProgressRingProps,
  StreakFlameProps,
  XpCounterProps,
} from './components/domain-aliases';
export { ProgressCard } from './components/progress-card';
export type { ProgressCardProps } from './components/progress-card';
export { EmptyState } from './components/empty-state';
export type { EmptyStateProps } from './components/empty-state';
export { ErrorState } from './components/error-state';
export type { ErrorStateProps } from './components/error-state';
export { StitchWelcomeBanner, StitchAiPromo, StitchRecentCourseCard } from './components/stitch-layout';
export { STITCH_IMAGES, STITCH_TERTIARY } from './stitch/assets';
export {
  StitchTaskList,
  StitchInsightPanel,
  StitchPageHeader,
  StitchSlaBanner,
  StitchScheduleCarousel,
  StitchToGradeList,
  StitchTeacherAiPromo,
  StitchParentKpiCard,
  StitchProgressTimeline,
} from './stitch/widgets';
export type {
  StitchTaskItem,
  StitchInsightItem,
  StitchScheduleItem,
  StitchGradeItem,
  StitchTimelineItem,
} from './stitch/widgets';
export { StitchQuizBuilderWizard } from './stitch/quiz-builder';
export { StitchTutorShell } from './stitch/tutor-shell';
export { StitchMobileBottomNav } from './stitch/mobile-nav';
export { StreakBadge } from './components/streak-badge';
export type { StreakBadgeProps } from './components/streak-badge';
export { XpBadge } from './components/xp-badge';
export type { XpBadgeProps } from './components/xp-badge';
export { CoinCounter } from './components/coin-counter';
export type { CoinCounterProps } from './components/coin-counter';
export { LanguageSwitcher } from './components/language-switcher';
export type { LanguageSwitcherProps, LocaleOption } from './components/language-switcher';
export { QuizQuestion } from './components/quiz-question';
export type { QuizQuestionProps, QuizQuestionType } from './components/quiz-question';
export { CourseCard } from './components/course-card';
export type { CourseCardProps, CourseStatus } from './components/course-card';
export { LessonCard } from './components/lesson-card';
export type { LessonCardProps, LessonStatus } from './components/lesson-card';
export { LeaderboardRow } from './components/leaderboard-row';
export type { LeaderboardRowProps } from './components/leaderboard-row';
export { BadgeShowcase } from './components/badge-showcase';
export type { BadgeShowcaseProps, ShowcaseBadge } from './components/badge-showcase';
export { AttendanceGrid } from './components/attendance-grid';
export type {
  AttendanceGridProps,
  AttendanceCell,
  AttendanceStatus,
} from './components/attendance-grid';
export { TimetableGrid } from './components/timetable-grid';
export type { TimetableGridProps, TimetableSlot } from './components/timetable-grid';
export { GradeBook } from './components/grade-book';
export type { GradeBookProps, GradeBookEntry, GradeBookColumn } from './components/grade-book';
export { FeeInvoiceCard } from './components/fee-invoice-card';
export type { FeeInvoiceCardProps, InvoiceStatus } from './components/fee-invoice-card';
export { AiTutorChatBubble, AiTutorComposer } from './components/ai-tutor-chat';
export type {
  AiTutorChatBubbleProps,
  AiTutorComposerProps,
  AiTutorMessage,
} from './components/ai-tutor-chat';
export {
  TenantThemeProvider,
  useTenantTheme,
  DEFAULT_TENANT_THEME,
} from './components/tenant-theme-provider';
export type { TenantTheme } from './components/tenant-theme-provider';
export {
  hexToHslChannels,
  normalizeHex,
  contrastingForeground,
  relativeLuminance,
} from './lib/color';

export { Separator } from './components/separator';
export { ScrollArea, ScrollBar } from './components/scroll-area';
export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from './components/tooltip';
export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor } from './components/popover';
export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from './components/dialog';
export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from './components/sheet';
export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
} from './components/dropdown-menu';
export { Tabs, TabsList, TabsTrigger, TabsContent } from './components/tabs';
export {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from './components/accordion';
export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from './components/table';
export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './components/breadcrumb';
export { Pagination } from './components/pagination';
export type { PaginationProps } from './components/pagination';
export { Stepper } from './components/stepper';
export type { StepperProps, StepperStep } from './components/stepper';
export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
} from './components/command';
export { DataTable } from './components/data-table';
export type { DataTableProps } from './components/data-table';
export { exportToCsv } from './lib/export-csv';
export type { CsvColumn } from './lib/export-csv';
export type { ColumnDef } from '@tanstack/react-table';
export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
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
} from './components/chart';
export type { ChartConfig } from './components/chart';
export { ActivityFeed } from './components/activity-feed';
export type { ActivityFeedProps, ActivityItem } from './components/activity-feed';
export { KanbanBoard } from './components/kanban-board';
export type { KanbanBoardProps, KanbanColumn, KanbanItem } from './components/kanban-board';
export { FileUploader, FileUpload } from './components/file-uploader';
export type { FileUploaderProps } from './components/file-uploader';
export { Toaster, toast } from './components/sonner';
