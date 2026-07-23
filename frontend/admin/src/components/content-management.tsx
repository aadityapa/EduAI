'use client';

import { useMemo } from 'react';
import type { ColumnDef, CsvColumn } from '@eduai/ui';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  DataTable,
  EmptyState,
  FileUploader,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@eduai/ui';
import { BookOpen, FileText, Plus, Video } from 'lucide-react';
import { PageHeader } from './page-header';
import { ApiError } from '@/components/api-error';
import type { CourseRecord } from '@/lib/admin-api';

interface ContentManagementProps {
  courses?: CourseRecord[] | null;
  error?: string | null;
}

export function ContentManagement({ courses, error }: ContentManagementProps) {
  const items = courses ?? [];

  const columns: ColumnDef<CourseRecord>[] = useMemo(
    () => [
      { accessorKey: 'title', header: 'Course' },
      {
        id: 'subject',
        header: 'Subject',
        cell: ({ row }) => row.original.subject?.name ?? row.original.subject?.code ?? '—',
      },
      {
        id: 'board',
        header: 'Board',
        cell: ({ row }) => row.original.board?.code ?? '—',
      },
      {
        accessorKey: 'classLevel',
        header: 'Class',
        cell: ({ row }) => row.original.classLevel ?? '—',
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => row.original.status ?? 'published',
      },
    ],
    [],
  );

  const exportColumns: CsvColumn<CourseRecord>[] = [
    { header: 'Title', accessor: (r) => r.title },
    { header: 'Subject', accessor: (r) => r.subject?.name ?? '' },
    { header: 'Board', accessor: (r) => r.board?.code ?? '' },
    { header: 'Class', accessor: (r) => r.classLevel ?? '' },
    { header: 'Status', accessor: (r) => r.status ?? '' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Content Management"
        description="Published courses from learning-service — full CMS deferred to content-service"
        breadcrumbs={[{ label: 'Admin', href: '/dashboard' }, { label: 'Content' }]}
        actions={
          <Button size="sm" disabled title="Authoring UI deferred">
            <Plus className="me-2 h-4 w-4" />
            New Course
          </Button>
        }
      />

      {error && <ApiError title="Content unavailable" message={error} />}

      <Tabs defaultValue="courses">
        <TabsList>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="videos">Video Library</TabsTrigger>
          <TabsTrigger value="notes">Notes Library</TabsTrigger>
          <TabsTrigger value="media">Media Manager</TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="mt-6">
          {!error && items.length === 0 ? (
            <EmptyState
              icon={<BookOpen className="h-5 w-5" />}
              title="No published courses"
              description="Seed learning-service catalog or publish courses to populate this table."
            />
          ) : (
            !error && (
              <DataTable
                columns={columns}
                data={items}
                searchKey="title"
                searchPlaceholder="Search courses…"
                exportable
                exportFilename="courses"
                exportColumns={exportColumns}
              />
            )
          )}
        </TabsContent>

        <TabsContent value="videos" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Video className="h-4 w-4" />
                Video Library
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FileUploader accept="video/*" label="Upload video" description="MP4, WebM up to 500MB" />
              <p className="mt-3 text-xs text-muted-foreground">
                Upload persistence requires content-service (scaffold) — UI only for now.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="h-4 w-4" />
                Notes Library
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FileUploader accept=".pdf,.doc,.docx" label="Upload notes" description="PDF, DOCX up to 10MB" multiple />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="media" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <BookOpen className="h-4 w-4" />
                Media Manager
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FileUploader accept="image/*,video/*,.pdf" label="Upload media" description="Images, videos, documents" multiple />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
