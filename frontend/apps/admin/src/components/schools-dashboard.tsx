'use client';

import { Badge, Button, Card, CardContent, CardHeader, CardTitle, KpiCard } from '@eduai/ui';
import { AlertCircle, Building2, MapPin, Plus, School, Users } from 'lucide-react';
import { PageHeader } from './page-header';
import type { SchoolRecord } from '@/lib/admin-api';

function schoolCity(address?: Record<string, unknown>): string {
  if (!address) return '—';
  const city = address.city ?? address.locality ?? address.town;
  return typeof city === 'string' ? city : '—';
}

interface SchoolsDashboardProps {
  schools: SchoolRecord[] | null;
  error?: string | null;
}

export function SchoolsDashboard({ schools, error }: SchoolsDashboardProps) {
  const items = schools ?? [];
  const totalStudents = items.reduce((sum, s) => sum + s.students, 0);
  const totalTeachers = items.reduce((sum, s) => sum + s.teachers, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="School Management"
        description="Manage schools and enrollment across your tenant"
        breadcrumbs={[{ label: 'Admin', href: '/dashboard' }, { label: 'Schools' }]}
        actions={<Button size="sm"><Plus className="mr-2 h-4 w-4" />Add School</Button>}
      />

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" /> {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <KpiCard icon={<School className="h-5 w-5" />} label="Total Schools" value={items.length} />
        <KpiCard icon={<Users className="h-5 w-5" />} label="Total Students" value={totalStudents.toLocaleString()} />
        <KpiCard icon={<Building2 className="h-5 w-5" />} label="Total Teachers" value={totalTeachers.toLocaleString()} />
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">No schools found for this tenant.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((school) => (
            <Card key={school.id} className="transition-shadow hover:shadow-md">
              <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div>
                  <CardTitle className="text-base">{school.name}</CardTitle>
                  <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />{schoolCity(school.address)} · {school.code}
                  </p>
                </div>
                <Badge variant="success">active</Badge>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div><p className="text-lg font-bold">{school.students.toLocaleString()}</p><p className="text-xs text-muted-foreground">Students</p></div>
                  <div><p className="text-lg font-bold">{school.teachers}</p><p className="text-xs text-muted-foreground">Teachers</p></div>
                  <div><p className="text-lg font-bold">{school.classCount}</p><p className="text-xs text-muted-foreground">Classes</p></div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">Analytics</Button>
                  <Button variant="outline" size="sm" className="flex-1">Manage</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
