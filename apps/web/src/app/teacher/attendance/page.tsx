import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { DashboardShell } from '@/components/dashboard-shell';
import { AttendanceMarker } from '@/components/attendance-marker';

export default async function TeacherAttendancePage() {
  const session = await auth();
  if (!session?.user) redirect('/login');
  if (!session.user.roles.includes('teacher')) redirect('/dashboard');

  return (
    <DashboardShell title="Mark Attendance" portal="teacher">
      <AttendanceMarker />
    </DashboardShell>
  );
}
