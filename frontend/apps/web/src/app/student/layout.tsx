import { Providers } from '@/components/providers';

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return <Providers>{children}</Providers>;
}
