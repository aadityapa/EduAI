'use client';

import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label } from '@eduai/ui';
import { Palette, Upload } from 'lucide-react';
import { PageHeader } from '@/components/page-header';

export function BrandingDashboard() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="White Label Branding"
        description="Customize logos, colors, fonts, domains, and email templates per tenant"
        breadcrumbs={[{ label: 'Admin', href: '/dashboard' }, { label: 'Branding' }]}
        actions={<Button size="sm">Save Changes</Button>}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Palette className="h-4 w-4" />Theme Tokens
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <Label>Primary</Label>
                <div className="mt-1 flex items-center gap-2">
                  <span className="inline-block h-8 w-8 rounded-lg bg-primary" />
                  <Input defaultValue="#6D28D9" className="font-mono text-sm" />
                </div>
              </div>
              <div>
                <Label>Secondary</Label>
                <div className="mt-1 flex items-center gap-2">
                  <span className="inline-block h-8 w-8 rounded-lg bg-secondary" />
                  <Input defaultValue="#8B5CF6" className="font-mono text-sm" />
                </div>
              </div>
              <div>
                <Label>Accent</Label>
                <div className="mt-1 flex items-center gap-2">
                  <span className="inline-block h-8 w-8 rounded-lg bg-accent" />
                  <Input defaultValue="#22C55E" className="font-mono text-sm" />
                </div>
              </div>
            </div>
            <div>
              <Label>Font Family</Label>
              <Input defaultValue="Inter" className="mt-1" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Logo & Assets</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex h-32 items-center justify-center rounded-lg border-2 border-dashed">
              <div className="text-center">
                <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">Upload logo (SVG, PNG)</p>
              </div>
            </div>
            <div>
              <Label>Custom Domain</Label>
              <Input defaultValue="demo.eduai.in" className="mt-1" />
              <p className="mt-1 text-xs text-muted-foreground">DNS verification required</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
