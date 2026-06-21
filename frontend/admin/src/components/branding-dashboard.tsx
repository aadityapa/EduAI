'use client';

import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label } from '@eduai/ui';
import { AlertCircle, Palette, Upload } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import type { BrandingRecord } from '@/lib/admin-api';

interface BrandingDashboardProps {
  branding: BrandingRecord | null;
  error?: string | null;
}

export function BrandingDashboard({ branding, error }: BrandingDashboardProps) {
  const primary = branding?.primaryColor ?? '#6366f1';
  const secondary = branding?.secondaryColor ?? '#8b5cf6';
  const accent = branding?.accentColor ?? '#f59e0b';
  const fontFamily = branding?.fontFamily ?? 'Inter';

  return (
    <div className="space-y-6">
      <PageHeader
        title="White Label Branding"
        description="Customize logos, colors, fonts, domains, and email templates per tenant"
        breadcrumbs={[{ label: 'Admin', href: '/dashboard' }, { label: 'Branding' }]}
        actions={<Button size="sm">Save Changes</Button>}
      />

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" /> {error}
        </div>
      )}

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
                  <span className="inline-block h-8 w-8 rounded-lg" style={{ backgroundColor: primary }} />
                  <Input defaultValue={primary} className="font-mono text-sm" />
                </div>
              </div>
              <div>
                <Label>Secondary</Label>
                <div className="mt-1 flex items-center gap-2">
                  <span className="inline-block h-8 w-8 rounded-lg" style={{ backgroundColor: secondary }} />
                  <Input defaultValue={secondary} className="font-mono text-sm" />
                </div>
              </div>
              <div>
                <Label>Accent</Label>
                <div className="mt-1 flex items-center gap-2">
                  <span className="inline-block h-8 w-8 rounded-lg" style={{ backgroundColor: accent }} />
                  <Input defaultValue={accent} className="font-mono text-sm" />
                </div>
              </div>
            </div>
            <div>
              <Label>Font Family</Label>
              <Input defaultValue={fontFamily} className="mt-1" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Logo & Assets</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex h-32 items-center justify-center rounded-lg border-2 border-dashed">
              {branding?.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={branding.logoUrl} alt="Tenant logo" className="max-h-24 max-w-full object-contain" />
              ) : (
                <div className="text-center">
                  <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">Upload logo (SVG, PNG)</p>
                </div>
              )}
            </div>
            <div>
              <Label>Custom Domain</Label>
              <Input placeholder="your-school.eduai.in" className="mt-1" />
              <p className="mt-1 text-xs text-muted-foreground">
                {branding?.customDomainVerified ? 'Domain verified' : 'DNS verification required'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
