import Link from 'next/link';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { DashboardShell } from '@/components/dashboard-shell';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@eduai/ui';

export default async function QuizBuilderPage() {
  const session = await auth();
  if (!session?.user) redirect('/login');
  if (!session.user.roles.includes('teacher')) redirect('/dashboard');

  return (
    <DashboardShell title="Quiz Builder" portal="teacher">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Build Quizzes from AI-Generated Questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Use the AI Question Generator to create MCQ questions, then save them to a quiz for your class.
          </p>
          <Button asChild>
            <Link href="/teacher/ai/generator">Open AI Question Generator</Link>
          </Button>
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
