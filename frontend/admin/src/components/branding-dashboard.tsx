'use client';

import { useMemo, useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  EmptyState,
  Input,
  Label,
} from '@eduai/ui';
import { Palette, Upload } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { ApiError } from '@/components/api-error';
import type { BrandingRecord } from '@/lib/admin-api';

interface BrandingDashboardProps {
  branding: BrandingRecord | null;
  error?: string | null;
}

export function BrandingDashboard({ branding, error }: BrandingDashboardProps) {
  const [primary, setPrimary] = useState(branding?.primaryColor ?? '#1A73E8');
  const [secondary, setSecondary] = useState(branding?.secondaryColor ?? '#9334E6');
  const [accent, setAccent] = useState(branding?.accentColor ?? '#F59E0B');
  const [fontFamily, setFontFamily] = useState(branding?.fontFamily ?? 'Inter');

  const previewStyle = useMemo(
    () =>
      ({
        '--preview-primary': primary,
        '--preview-secondary': secondary,
        '--preview-accent': accent,
        fontFamily,
      }) as React.CSSProperties,
    [primary, secondary, accent, fontFamily],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="White Label Branding"
        description="TenantBranding tokens with live theme preview (save API deferred to mutation wiring)"
        breadcrumbs={[{ label: 'Admin', href: '/dashboard' }, { label: 'Branding' }]}
        actions={
          <Button size="sm" disabled title="Persist via billing branding API in a follow-up">
            Save Changes
          </Button>
        }
      />

      {error && <ApiError title="Branding unavailable" message={error} />}

      {!error && !branding && (
        <EmptyState
          title="Using defaults"
          description="No TenantBranding record yet — editing preview with design-system defaults."
        />
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Palette className="h-4 w-4" />
              Theme Tokens
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <Label htmlFor="primary">Primary</Label>
                <div className="mt-1 flex items-center gap-2">
                  <span className="inline-block h-8 w-8 rounded-lg border" style={{ backgroundColor: primary }} />
                  <Input
                    id="primary"
                    value={primary}
                    onChange={(e) => setPrimary(e.target.value)}
                    className="font-mono text-sm"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="secondary">Secondary</Label>
                <div className="mt-1 flex items-center gap-2">
                  <span className="inline-block h-8 w-8 rounded-lg border" style={{ backgroundColor: secondary }} />
                  <Input
                    id="secondary"
                    value={secondary}
                    onChange={(e) => setSecondary(e.target.value)}
                    className="font-mono text-sm"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="accent">Accent</Label>
                <div className="mt-1 flex items-center gap-2">
                  <span className="inline-block h-8 w-8 rounded-lg border" style={{ backgroundColor: accent }} />
                  <Input
                    id="accent"
                    value={accent}
                    onChange={(e) => setAccent(e.target.value)}
                    className="font-mono text-sm"
                  />
                </div>
              </div>
            </div>
            <div>
              <Label htmlFor="font">Font Family</Label>
              <Input
                id="font"
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value)}
                className="mt-1"
              />
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
              <Input placeholder="your-school.eduai.in" className="mt-1" disabled />
              <p className="mt-1 text-xs text-muted-foreground">
                {branding?.customDomainVerified ? 'Domain verified' : 'DNS verification required'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card style={previewStyle}>
        <CardHeader>
          <CardTitle className="text-base">Live preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className="overflow-hidden rounded-xl border"
            style={{ background: 'linear-gradient(135deg, var(--preview-primary), var(--preview-secondary))' }}
          >
            <div className="space-y-3 p-6 text-white">
              <p className="text-xs uppercase tracking-widest opacity-80">Tenant portal</p>
              <h2 className="text-2xl font-bold">Welcome back</h2>
              <p className="max-w-md text-sm opacity-90">
                Preview of primary / secondary gradient and font against learner surfaces.
              </p>
              <button
                type="button"
                className="rounded-full px-4 py-2 text-sm font-semibold text-slate-900"
                style={{ backgroundColor: 'var(--preview-accent)' }}
              >
                Continue learning
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
