import { Providers } from '@/components/providers';

export default function ParentLayout({ children }: { children: React.ReactNode }) {
  return <Providers>{children}</Providers>;
}
