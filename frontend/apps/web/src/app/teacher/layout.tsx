import { Providers } from '@/components/providers';

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  return <Providers>{children}</Providers>;
}
