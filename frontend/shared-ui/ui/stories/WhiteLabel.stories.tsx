import type { Meta, StoryObj } from '@storybook/react';
import {
  DEFAULT_TENANT_THEME,
  TenantThemeProvider,
  useTenantTheme,
} from '../src/components/tenant-theme-provider';
import { Button } from '../src/components/button';

function BrandPreview() {
  const theme = useTenantTheme();
  return (
    <div className="space-y-4 rounded-xl border border-border bg-card p-6 shadow-md">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
          {theme.appName.slice(0, 2).toUpperCase()}
        </div>
        <div>
          <p className="text-h5 font-semibold">{theme.appName}</p>
          <p className="text-caption">White-label preview from TenantBranding</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button>Primary CTA</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
      </div>
      <dl className="grid grid-cols-2 gap-2 text-caption text-muted-foreground sm:grid-cols-3">
        <div>
          <dt>Primary</dt>
          <dd className="font-mono text-foreground">{theme.primaryColor}</dd>
        </div>
        <div>
          <dt>Secondary</dt>
          <dd className="font-mono text-foreground">{theme.secondaryColor}</dd>
        </div>
        <div>
          <dt>Accent</dt>
          <dd className="font-mono text-foreground">{theme.accentColor}</dd>
        </div>
      </dl>
    </div>
  );
}

function WhiteLabelDemo({
  primaryColor,
  secondaryColor,
  accentColor,
  appName,
}: {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  appName: string;
}) {
  return (
    <TenantThemeProvider theme={{ primaryColor, secondaryColor, accentColor, appName }}>
      <BrandPreview />
    </TenantThemeProvider>
  );
}

const meta = {
  title: 'Foundations/WhiteLabel',
  component: WhiteLabelDemo,
  tags: ['autodocs'],
  args: {
    primaryColor: DEFAULT_TENANT_THEME.primaryColor,
    secondaryColor: DEFAULT_TENANT_THEME.secondaryColor,
    accentColor: DEFAULT_TENANT_THEME.accentColor,
    appName: 'EduAI Demo School',
  },
} satisfies Meta<typeof WhiteLabelDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultBrand: Story = {};

export const EmeraldSchool: Story = {
  args: {
    primaryColor: '#047857',
    secondaryColor: '#7C3AED',
    accentColor: '#F59E0B',
    appName: 'Emerald Academy',
  },
};
