'use client';

import { Badge, Button, Card, CardContent, CardHeader, CardTitle, KpiCard } from '@eduai/ui';
import { Building2, MapPin, Plus, School, Users } from 'lucide-react';
import { PageHeader } from './page-header';
import { mockSchools } from '@/lib/mock-data';

export function SchoolsDashboard() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="School Management"
        description="Manage schools, subscriptions, and tenant assignments"
        breadcrumbs={[{ label: 'Admin', href: '/dashboard' }, { label: 'Schools' }]}
        actions={<Button size="sm"><Plus className="mr-2 h-4 w-4" />Add School</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <KpiCard icon={<School className="h-5 w-5" />} label="Total Schools" value={mockSchools.length} />
        <KpiCard icon={<Users className="h-5 w-5" />} label="Total Students" value={mockSchools.reduce((s, x) => s + x.students, 0).toLocaleString()} />
        <KpiCard icon={<Building2 className="h-5 w-5" />} label="Active Tenants" value={new Set(mockSchools.map((s) => s.tenant)).size} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {mockSchools.map((school) => (
          <Card key={school.id} className="transition-shadow hover:shadow-md">
            <CardHeader className="flex flex-row items-start justify-between pb-2">
              <div>
                <CardTitle className="text-base">{school.name}</CardTitle>
                <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />{school.city}
                </p>
              </div>
              <Badge variant={school.status === 'active' ? 'success' : 'outline'}>{school.status}</Badge>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div><p className="text-lg font-bold">{school.students.toLocaleString()}</p><p className="text-xs text-muted-foreground">Students</p></div>
                <div><p className="text-lg font-bold">{school.teachers}</p><p className="text-xs text-muted-foreground">Teachers</p></div>
                <div><p className="text-lg font-bold">{school.subscription}</p><p className="text-xs text-muted-foreground">Plan</p></div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">Analytics</Button>
                <Button variant="outline" size="sm" className="flex-1">Manage</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
