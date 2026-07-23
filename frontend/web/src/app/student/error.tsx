'use client';

import { PortalError } from '@/components/portal-error';

export default function StudentError(props: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <PortalError {...props} />;
}
