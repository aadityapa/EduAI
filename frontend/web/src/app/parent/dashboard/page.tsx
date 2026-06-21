import Link from 'next/link';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { Bell, CalendarCheck, CreditCard, TrendingUp } from 'lucide-react';
import { DashboardShell } from '@/components/dashboard-shell';
import { ApiError } from '@/components/api-error';
import { LinkChildForm } from '@/components/link-child-form';
import { PageMotion } from '@/components/page-motion';
import { getParentChildren, LearningApiError } from '@/lib/learning-api';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  StitchPageHeader,
  StitchParentKpiCard,
  StitchProgressTimeline,
} from '@eduai/ui';

export default async function ParentDashboard() {
  const session = await auth();
  if (!session?.user) redirect('/login');
  if (!session.user.roles.includes('parent')) redirect('/dashboard');

  let children = null;
  let loadError: string | null = null;

  try {
    children = await getParentChildren();
  } catch (err) {
    loadError = err instanceof LearningApiError ? err.message : 'Failed to load linked children';
  }

  const verified = children?.filter((c) => c.status === 'verified') ?? [];
  const firstChild = verified[0];

  return (
    <DashboardShell title="Parent Dashboard" portal="parent">
      <PageMotion>
        <StitchPageHeader
          title="Family Learning Overview"
          description={
            firstChild
              ? `Viewing progress for ${firstChild.student.firstName}`
              : 'Link your child to view attendance, fees, and progress.'
          }
          action={
            firstChild ? (
              <Button asChild variant="outline" className="rounded-full">
                <Link href={`/parent/children/${firstChild.student.id}/dashboard`}>Child Dashboard</Link>
              </Button>
            ) : undefined
          }
        />

        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <StitchParentKpiCard
            icon={<CalendarCheck className="h-5 w-5" />}
            label="Attendance Rate"
            value="95%"
            description="On track for merit badge"
            trend="+2% vs last month"
            accent="primary"
          />
          <StitchParentKpiCard
            icon={<CreditCard className="h-5 w-5" />}
            label="Fee Status"
            value="Paid"
            description="Term 2 fees cleared"
            accent="tertiary"
          />
          <StitchParentKpiCard
            icon={<TrendingUp className="h-5 w-5" />}
            label="Learning Progress"
            value={verified.length ? `${verified.length} linked` : '—'}
            description="Active student profiles"
            accent="secondary"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Card className="stitch-card">
              <CardHeader>
                <CardTitle>Linked children</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {loadError && <ApiError message={loadError} />}

                {!loadError && !children?.length && (
                  <p className="text-sm text-muted-foreground">
                    No linked students yet. Use the form to connect your child&apos;s account.
                  </p>
                )}

                {children?.map((link) => {
                  const name = `${link.student.firstName} ${link.student.lastName ?? ''}`.trim();
                  return (
                    <div
                      key={link.linkId}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-xl border p-4"
                    >
                      <div>
                        <p className="font-medium">{name}</p>
                        <p className="text-sm text-muted-foreground">{link.student.email}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={link.status === 'verified' ? 'success' : 'warning'}>{link.status}</Badge>
                        {link.status === 'verified' && (
                          <>
                            <Button size="sm" asChild className="rounded-full">
                              <Link href={`/parent/children/${link.student.id}/dashboard`}>Dashboard</Link>
                            </Button>
                            <Button size="sm" variant="outline" asChild className="rounded-full">
                              <Link href={`/parent/children/${link.student.id}/report`}>Report</Link>
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <StitchProgressTimeline
              items={[
                { id: '1', title: 'Completed Algebra Unit Test', date: 'Yesterday', description: 'Score: 88%' },
                { id: '2', title: '5-day learning streak', date: 'This week', description: 'Gamification milestone' },
                { id: '3', title: 'Enrolled in Science course', date: 'Last month' },
              ]}
            />
          </div>

          <div className="space-y-6">
            <Card className="stitch-card">
              <CardHeader>
                <CardTitle>Link a child</CardTitle>
              </CardHeader>
              <CardContent>
                <LinkChildForm />
              </CardContent>
            </Card>

            <Card className="stitch-card">
              <CardHeader className="flex flex-row items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                <CardTitle>School Notifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="rounded-lg border p-3">
                  <p className="font-medium">Parent-teacher meeting scheduled</p>
                  <p className="text-muted-foreground">Friday, 4:00 PM</p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="font-medium">Fee receipt available</p>
                  <p className="text-muted-foreground">
                    <Link href="/parent/fees" className="text-primary hover:underline">
                      View fees
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </PageMotion>
    </DashboardShell>
  );
}
