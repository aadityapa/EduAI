import { Card, CardContent, CardHeader, CardTitle } from '@eduai/ui';

interface AdminListPageProps {
  title: string;
  description?: string;
  items: unknown[] | null;
  error?: string | null;
  renderItem: (item: Record<string, unknown>, index: number) => React.ReactNode;
}

export function AdminListPage({ title, description, items, error, renderItem }: AdminListPageProps) {
  return (
    <div>
      <h1 className="text-2xl font-semibold">{title}</h1>
      {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      {error && (
        <Card className="mt-6 border-destructive/30">
          <CardContent className="p-4 text-sm text-destructive">{error}</CardContent>
        </Card>
      )}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>{items?.length ?? 0} records</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {!items?.length && !error && (
            <p className="text-sm text-muted-foreground">No records found.</p>
          )}
          {items?.map((item, i) => renderItem(item as Record<string, unknown>, i))}
        </CardContent>
      </Card>
    </div>
  );
}
