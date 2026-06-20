import { AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@eduai/ui';

interface ApiErrorProps {
  title?: string;
  message?: string;
}

export function ApiError({
  title = 'Something went wrong',
  message = 'We could not load this content right now. Please try again later.',
}: ApiErrorProps) {
  return (
    <Card className="border-destructive/30 bg-destructive/5">
      <CardContent className="flex items-start gap-3 p-6">
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" aria-hidden="true" />
        <div>
          <p className="font-medium text-destructive">{title}</p>
          <p className="mt-1 text-sm text-muted-foreground">{message}</p>
        </div>
      </CardContent>
    </Card>
  );
}
