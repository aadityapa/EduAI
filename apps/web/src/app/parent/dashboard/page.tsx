import Link from 'next/link';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { DashboardShell } from '@/components/dashboard-shell';
import { ApiError } from '@/components/api-error';
import { LinkChildForm } from '@/components/link-child-form';
import { PageMotion } from '@/components/page-motion';
import { getParentChildren, LearningApiError } from '@/lib/learning-api';
import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from '@eduai/ui';

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

  return (
    <DashboardShell title="Parent Dashboard" portal="parent">
      <PageMotion>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Link a child</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-muted-foreground">
                Enter your child&apos;s school email to request a parent-student link.
              </p>
              <LinkChildForm />
            </CardContent>
          </Card>

          <Card className="glass-card">
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
                const name =
                  `${link.student.firstName} ${link.student.lastName ?? ''}`.trim();
                return (
                  <div
                    key={link.linkId}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-4"
                  >
                    <div>
                      <p className="font-medium">{name}</p>
                      <p className="text-sm text-muted-foreground">{link.student.email}</p>
                      {link.student.classLevel != null && (
                        <p className="text-xs text-muted-foreground">
                          Class {link.student.classLevel}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={link.status === 'verified' ? 'success' : 'warning'}>
                        {link.status}
                      </Badge>
                      {link.status === 'verified' && (
                        <>
                          <Button size="sm" asChild>
                            <Link href={`/parent/children/${link.student.id}/dashboard`}>
                              Dashboard
                            </Link>
                          </Button>
                          <Button size="sm" variant="outline" asChild>
                            <Link href={`/parent/children/${link.student.id}/report`}>
                              Report
                            </Link>
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </PageMotion>
    </DashboardShell>
  );
}
