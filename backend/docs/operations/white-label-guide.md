# White Label Guide

## Overview

EduAI supports white-label deployments for schools, coaching institutes, and franchises via the `tenant_branding` table and `TenantThemeProvider`.

## Configuration

### Database Fields

| Field | Purpose |
|-------|---------|
| `logo_url` | Header logo |
| `primary_color` | Main brand color |
| `secondary_color` | Secondary UI color |
| `accent_color` | CTAs, highlights |
| `font_family` | Web + mobile typography |
| `favicon_url` | Browser tab icon |
| `email_from_name` | Transactional email sender |
| `email_header_html` / `email_footer_html` | Email templates |
| `mobile_app_name` | App display name |
| `custom_domain_verified` | DNS verification flag |

### API

```bash
# Get branding
GET /api/v1/branding
Authorization: Bearer <token>

# Update branding
PATCH /api/v1/branding
{ "primaryColor": "#1e40af", "logoUrl": "https://..." }
```

### Web Integration

```tsx
import { TenantThemeProvider } from '@eduai/ui';

<TenantThemeProvider theme={{ primaryColor: '#1e40af', appName: 'My School' }}>
  {children}
</TenantThemeProvider>
```

### Mobile Integration

```tsx
import { ThemeProvider } from '../src/theme/ThemeProvider';
// Fetches branding on login, applies to tab bar and headers
```

## Custom Domains

1. Set `tenants.custom_domain` (e.g. `learn.myschool.in`)
2. Add CNAME to CloudFront distribution (Terraform output)
3. Verify via DNS TXT record
4. Set `custom_domain_verified = true`

## Admin UI

`/dashboard/branding` in admin app for visual configuration.
