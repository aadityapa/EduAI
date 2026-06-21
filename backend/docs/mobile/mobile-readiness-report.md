# Mobile Readiness Report — Phase 5

**Date:** 2025-06-21  
**App:** `@eduai/mobile` (Expo 52)

---

## Platform Status

| Platform | Build | Status | Blockers |
|----------|-------|--------|----------|
| Android | Expo Go + EAS ready | ✅ Beta | Production keystore for Play Store |
| iOS | Expo Go + EAS ready | ✅ Beta | Apple Developer account + provisioning |

---

## Feature Validation

| Feature | Android | iOS | Notes |
|---------|---------|-----|-------|
| Login / JWT refresh | ✅ | ✅ | SecureStore for tokens |
| Role navigation (student/parent/teacher) | ✅ | ✅ | Tab layouts per role |
| Courses list | ✅ | ✅ | API client configured |
| AI tutor chat | ✅ | ✅ | Mock provider in dev |
| Quizzes | ✅ | ✅ | List view |
| Offline cache | ⚠️ | ⚠️ | Basic structure; full sync in v1.0 |
| Push notifications | ⚠️ | ⚠️ | Expo Notifications setup; needs FCM/APNs prod keys |
| White-label theme | ✅ | ✅ | TenantThemeProvider |
| i18n (en/hi/mr) | ✅ | ✅ | Shared `@eduai/i18n` |

---

## Offline Strategy (Beta)

- Cache last-viewed lesson metadata in AsyncStorage
- Video streaming requires connectivity
- Queue quiz submissions when offline → sync on reconnect (stub)

---

## Performance

- Cold start: ~2.5s on mid-range Android (Expo Go)
- API timeout: 30s default in `apps/mobile/src/api/client.ts`
- Target: <3s cold start in production build

---

## Pre-Launch Requirements

1. EAS Build profiles for staging/production
2. FCM + APNs credentials
3. App Store / Play Store listings (see `docs/release/app-store/`)
4. Privacy policy URL live
5. Deep linking for school subdomains

**Verdict:** **Ready for closed beta** via TestFlight + Play Internal Testing. Public store launch requires offline/push completion.
