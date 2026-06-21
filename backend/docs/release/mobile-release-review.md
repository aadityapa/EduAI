# Mobile Release Validation

**Date:** 2025-06-21  
**App:** `@eduai/mobile` — Expo 52  
**Version:** 0.9.0 (app.json)

---

## Build Validation

```
Command: pnpm --filter @eduai/mobile build
Script:  tsc --noEmit
Result:  PASS (included in monorepo pnpm build)
```

```
Command: pnpm --filter @eduai/mobile test
Result:  PASS — 3 tests in src/__tests__/shared.test.ts
```

---

## Configuration Review

### app.json

| Field | Value | Production ready? |
|-------|-------|-------------------|
| version | 0.9.0 | ⚠️ Beta |
| bundleIdentifier (iOS) | in.eduai.mobile | ✅ |
| package (Android) | in.eduai.mobile | ✅ |
| newArchEnabled | true | ✅ |
| identityUrl | http://localhost:3001 | ❌ Dev only |
| learningUrl | http://localhost:3003 | ❌ Dev only |
| aiUrl | http://localhost:3004 | ❌ Dev only |
| erpUrl | http://localhost:3005 | ❌ Dev only |

**Blocker:** All API URLs point to localhost — must be updated for staging/production builds.

---

## Feature Coverage

| Feature | Implementation | Status |
|---------|----------------|--------|
| Student courses | `src/api/services.ts` | ✅ |
| AI tutor chat | API integration | ✅ |
| Gamification | `/gamification/me` | ✅ |
| Parent children view | `/parent/children` | ✅ |
| Teacher dashboard | `/teacher/dashboard` | ✅ |
| Role-based navigation | Expo Router layouts | ✅ |
| Offline cache | Referenced in README | ⚠️ Not verified |
| Push notifications | expo-notifications plugin | ⚠️ Config only |

---

## API Client

`apps/mobile/src/api/client.ts`:
- Bearer token auth
- `X-Tenant-Id` header support
- Centralized `API_URLS` from app.json extra

---

## App Store Readiness

Existing docs: `docs/release/app-store-readiness.md`, `docs/release/app-store/`

| Requirement | Status |
|-------------|--------|
| Privacy policy (hosted URL) | ❌ Template only |
| Terms of service (hosted URL) | ❌ Template only |
| App Store listing copy | ✅ Draft exists |
| Play Store listing copy | ✅ Draft exists |
| Screenshots | ❌ Not generated |
| Production API URLs | ❌ localhost |
| Push notification certs | ❌ Not configured |
| EAS Build profile | ⚠️ Not verified |

---

## Security

- Tokens stored via secure storage pattern (review `src/` auth context)
- No certificate pinning observed
- Deep link scheme: `eduai://`

---

## Test Coverage

- 3 unit tests (shared utilities only)
- No Detox/Maestro e2e tests
- No device farm validation

---

## Recommendations

1. Create EAS production build profile with staging/prod API URLs — **P0**
2. Configure FCM (Android) + APNs (iOS) for push — **P0 for v1.0**
3. Verify offline lesson cache with network isolation test
4. Generate App Store / Play Store screenshots
5. Publish privacy policy and terms at public HTTPS URLs
6. Add mobile e2e tests (Maestro recommended for Expo)

---

## Verdict

| Launch type | Verdict |
|-------------|---------|
| Expo Go demo / internal beta | **GO** |
| App Store / Play Store v1.0 | **NO-GO** |

**Mobile readiness score: 6/10**
