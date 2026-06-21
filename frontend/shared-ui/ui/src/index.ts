import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export { Button, buttonVariants } from './components/button';
export { Input } from './components/input';
export { Label } from './components/label';
export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './components/card';
export { Avatar, AvatarImage, AvatarFallback } from './components/avatar';
export { Badge } from './components/badge';
export { ProgressBar } from './components/progress-bar';
export type { ProgressBarProps } from './components/progress-bar';
export { StatCard } from './components/stat-card';
export type { StatCardProps } from './components/stat-card';
export { KpiCard } from './components/kpi-card';
export type { KpiCardProps } from './components/kpi-card';
export { StitchWelcomeBanner, StitchAiPromo } from './components/stitch-layout';
export { StreakBadge } from './components/streak-badge';
export type { StreakBadgeProps } from './components/streak-badge';
export { XpBadge } from './components/xp-badge';
export type { XpBadgeProps } from './components/xp-badge';
export { LanguageSwitcher } from './components/language-switcher';
export type { LanguageSwitcherProps, LocaleOption } from './components/language-switcher';
export { QuizQuestion } from './components/quiz-question';
export type { QuizQuestionProps, QuizQuestionType } from './components/quiz-question';
export { CourseCard } from './components/course-card';
export type { CourseCardProps, CourseStatus } from './components/course-card';
export { LeaderboardRow } from './components/leaderboard-row';
export type { LeaderboardRowProps } from './components/leaderboard-row';
export { TenantThemeProvider, useTenantTheme } from './components/tenant-theme-provider';
export type { TenantTheme } from './components/tenant-theme-provider';

export { Skeleton } from './components/skeleton';
export { Separator } from './components/separator';
export { ScrollArea, ScrollBar } from './components/scroll-area';
export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from './components/tooltip';
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
export { FileUploader } from './components/file-uploader';
export type { FileUploaderProps } from './components/file-uploader';
export { Toaster, toast } from './components/sonner';
