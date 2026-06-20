# Component Documentation — EduAI UI v2

**Package:** `@eduai/ui`

---

## KpiCard

Enterprise KPI metric card with optional trend indicator and skeleton loading.

```tsx
<KpiCard
  icon={<Users className="h-5 w-5" />}
  label="Total Students"
  value="24,850"
  trend={{ value: 12.4, label: 'vs last month' }}
  loading={false}
/>
```

**Props:** `icon`, `label`, `value`, `description?`, `trend?`, `loading?`

---

## DataTable

TanStack Table wrapper with search, pagination, row selection, and skeleton rows.

```tsx
<DataTable
  columns={columns}
  data={users}
  searchKey="email"
  searchPlaceholder="Search by email…"
  loading={loading}
  onRowClick={(row) => openDrawer(row)}
  pageSize={10}
/>
```

**Requires:** `@tanstack/react-table` column definitions.

---

## ChartContainer

Recharts wrapper with CSS variable theming.

```tsx
<ChartContainer config={chartConfig} className="h-[280px]">
  <AreaChart data={data}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="month" />
    <YAxis />
    <ChartTooltip content={<ChartTooltipContent />} />
    <Area dataKey="students" stroke="var(--color-students)" fill="var(--color-students)" />
  </AreaChart>
</ChartContainer>
```

---

## Command Palette

Built on `cmdk` + Dialog. Used in admin shell for ⌘K navigation.

```tsx
<CommandDialog open={open} onOpenChange={setOpen}>
  <CommandInput placeholder="Search…" />
  <CommandList>
    <CommandEmpty>No results.</CommandEmpty>
    <CommandGroup heading="Pages">
      <CommandItem onSelect={() => router.push('/dashboard')}>Dashboard</CommandItem>
    </CommandGroup>
  </CommandList>
</CommandDialog>
```

---

## Sheet (Drawer)

Side panel for user details, filters, etc.

```tsx
<Sheet open={open} onOpenChange={setOpen}>
  <SheetContent>
    <SheetHeader>
      <SheetTitle>User Details</SheetTitle>
    </SheetHeader>
    {/* content */}
  </SheetContent>
</Sheet>
```

---

## ActivityFeed

Timeline component for audit logs and user activity.

```tsx
<ActivityFeed
  items={[
    { id: '1', title: 'User login', description: 'admin@demo.eduai.in', timestamp: '2 min ago', type: 'info' },
  ]}
/>
```

---

## KanbanBoard

Pipeline/kanban view for CRM and support tickets.

```tsx
<KanbanBoard
  columns={[
    { id: 'new', title: 'New', items: [{ id: '1', title: 'Lead', tags: ['Hot'] }] },
  ]}
  onItemClick={(item, columnId) => {}}
/>
```

---

## FileUploader

Drag-and-drop file upload shell.

```tsx
<FileUploader
  accept="video/*"
  multiple
  label="Upload video"
  onFilesSelected={(files) => {}}
/>
```

---

## Toast (Sonner)

```tsx
import { toast, Toaster } from '@eduai/ui';

// In layout:
<Toaster richColors closeButton position="top-right" />

// Usage:
toast.success('Export started');
toast.error('Failed to save');
```

---

## Admin Shell Components

Located in `apps/admin/src/components/`:

| Component | Purpose |
|-----------|---------|
| `admin-shell.tsx` | Enterprise layout shell |
| `command-palette.tsx` | ⌘K navigation |
| `page-header.tsx` | Breadcrumbs + title + actions |
| `dashboard-overview.tsx` | Main KPI dashboard |
| `user-management.tsx` | Advanced user table + drawer |

---

## Accessibility Checklist

- [x] Focus visible rings on all interactive elements
- [x] `aria-label` on icon buttons
- [x] `aria-current="page"` on active nav links
- [x] Keyboard navigation in Command palette
- [x] `role="feed"` on ActivityFeed
- [x] `prefers-reduced-motion` respected in CSS
