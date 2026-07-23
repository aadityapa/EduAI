'use client';

import { useMemo } from 'react';
import type { ColumnDef, CsvColumn } from '@eduai/ui';
import { Badge, Button, DataTable, EmptyState, KpiCard } from '@eduai/ui';
import { Building2, Plus, School, Users } from 'lucide-react';
import { PageHeader } from './page-header';
import { ApiError } from '@/components/api-error';
import type { SchoolRecord } from '@/lib/admin-api';
import { formatNumber } from '@/lib/format';

function schoolCity(address?: Record<string, unknown>): string {
  if (!address) return '—';
  const city = address.city ?? address.locality ?? address.town;
  return typeof city === 'string' ? city : '—';
}

interface SchoolsDashboardProps {
  schools: SchoolRecord[] | null;
  error?: string | null;
}

type SchoolRow = {
  id: string;
  name: string;
  code: string;
  city: string;
  students: number;
  teachers: number;
  classes: number;
};

export function SchoolsDashboard({ schools, error }: SchoolsDashboardProps) {
  const rows: SchoolRow[] = useMemo(
    () =>
      (schools ?? []).map((s) => ({
        id: s.id,
        name: s.name,
        code: s.code,
        city: schoolCity(s.address),
        students: s.students,
        teachers: s.teachers,
        classes: s.classCount,
      })),
    [schools],
  );

  const totalStudents = rows.reduce((sum, s) => sum + s.students, 0);
  const totalTeachers = rows.reduce((sum, s) => sum + s.teachers, 0);

  const columns: ColumnDef<SchoolRow>[] = [
    { accessorKey: 'name', header: 'School' },
    { accessorKey: 'code', header: 'Code' },
    { accessorKey: 'city', header: 'City' },
    {
      accessorKey: 'students',
      header: 'Students',
      cell: ({ row }) => formatNumber(row.original.students),
    },
    { accessorKey: 'teachers', header: 'Teachers' },
    { accessorKey: 'classes', header: 'Classes' },
    {
      id: 'status',
      header: 'Status',
      cell: () => <Badge variant="success">active</Badge>,
    },
  ];

  const exportColumns: CsvColumn<SchoolRow>[] = [
    { header: 'Name', accessor: (r) => r.name },
    { header: 'Code', accessor: (r) => r.code },
    { header: 'City', accessor: (r) => r.city },
    { header: 'Students', accessor: (r) => r.students },
    { header: 'Teachers', accessor: (r) => r.teachers },
    { header: 'Classes', accessor: (r) => r.classes },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="School Management"
        description="Manage schools and enrollment across your tenant"
        breadcrumbs={[{ label: 'Admin', href: '/dashboard' }, { label: 'Schools' }]}
        actions={
          <Button size="sm">
            <Plus className="me-2 h-4 w-4" />
            Add School
          </Button>
        }
      />

      {error && <ApiError title="Schools unavailable" message={error} />}

      <div className="grid gap-3 sm:grid-cols-3">
        <KpiCard icon={<School className="h-5 w-5" />} label="Total Schools" value={rows.length} />
        <KpiCard icon={<Users className="h-5 w-5" />} label="Total Students" value={formatNumber(totalStudents)} />
        <KpiCard icon={<Building2 className="h-5 w-5" />} label="Total Teachers" value={formatNumber(totalTeachers)} />
      </div>

      {!error && rows.length === 0 ? (
        <EmptyState
          icon={<School className="h-5 w-5" />}
          title="No schools found"
          description="Schools appear when ERP is running and seeded for this tenant."
        />
      ) : (
        !error && (
          <DataTable
            columns={columns}
            data={rows}
            searchKey="name"
            searchPlaceholder="Search schools…"
            exportable
            exportFilename="schools"
            exportColumns={exportColumns}
          />
        )
      )}
    </div>
  );
}
