# White Label Validation

**Date:** 2025-06-21  
**Scope:** Tenant isolation, branding, custom domains, multi-tenant schema

---

## Tenant Model

From `schema.prisma`:

```prisma
enum TenantType {
  platform | school_group | white_label | single_school | coaching_institute | franchise
}
```

| Field | Purpose |
|-------|---------|
| `slug` | Unique tenant identifier (used in `X-Tenant-Id` header) |
| `customDomain` | White-label domain support |
| `subscriptionTier` | free/starter/professional/enterprise |
| `settings` | JSON tenant configuration |
| `aiMonthlyTokenBudget` | Per-tenant AI limits |
| `maxStudents` | Enrollment cap |

---

## Branding System

### Database

`TenantBranding` model (migration `20250621120000_sprint5_branding`):
- `primaryColor`, `secondaryColor`, `accentColor`
- `logoUrl`, `faviconUrl`
- `fontFamily`, `emailFromName`
- One-to-one with Tenant

### Backend

`billing-service/src/branding/branding.service.ts`:
- `GET` branding for authenticated tenant user
- `PUT` upsert branding (tenant_admin)
- Default fallback colors if no branding record

### Frontend

- `frontend/shared-ui/ui` — `TenantThemeProvider` for dynamic theming
- Admin dashboard: `/dashboard/branding`
- Seeded demo: primary `#6366f1`, secondary `#8b5cf6`

---

## Tenant Isolation

| Layer | Mechanism | Status |
|-------|-----------|--------|
| Application | `tenantId` in JWT + query filters | ✅ All 5 services |
| RBAC | Role permissions scoped by tenant/school/class | ✅ |
| PostgreSQL RLS | 14 ERP/billing tables | ⚠️ Partial |
| API header | `X-Tenant-Id` on login and requests | ✅ |
| Subdomain routing | Documented, not verified live | ⚠️ |

### Cross-tenant test evidence

- RBAC unit tests pass (auth package)
- No automated cross-tenant integration test executed
- RLS NULL bypass documented as risk

---

## White-Label Features

| Feature | Status |
|---------|--------|
| Custom colors/fonts | ✅ |
| Logo upload | ⚠️ Schema field exists; S3 upload flow not verified |
| Custom domain | ⚠️ Schema field; DNS/CloudFront routing not tested |
| Email from name | ✅ Seeded |
| Tenant-specific content | ✅ Courses scoped by tenantId |
| Separate billing | ✅ tenant_subscriptions per tenant |
| i18n per tenant | ✅ Translation table with tenantId |

---

## Franchise / Multi-School

- `TenantType.franchise` and `school_group` supported
- `School` model with `[tenantId, code]` uniqueness
- Users assigned to schools via `UserRole.schoolId`

---

## Gaps

| Gap | Impact |
|-----|--------|
| Custom domain SSL automation untested | High for white-label customers |
| Logo CDN/CloudFront not validated | Medium |
| No tenant provisioning API (self-serve signup) | Medium |
| Branding cache invalidation | Low |
| Cross-tenant pen test | High |

---

## Recommendations

1. End-to-end test: two tenants, verify zero data leakage — **P0**
2. Test custom domain → CloudFront → tenant resolution
3. Document white-label onboarding runbook for CS team
4. Complete RLS on all tenant-scoped tables

---

## Verdict

| Launch type | Verdict |
|-------------|---------|
| Single-tenant demo / pilot school | **GO** |
| Multi-tenant white-label SaaS at scale | **NO-GO** — isolation not fully proven |

**White-label readiness score: 7/10**
