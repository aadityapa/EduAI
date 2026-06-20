# App Store Readiness

## Android (Google Play)

### Checklist
- [ ] Package: `in.eduai.mobile`
- [ ] Adaptive icon (1024×1024)
- [ ] Feature graphic (1024×500)
- [ ] Screenshots: phone (min 2), tablet (optional)
- [ ] Privacy policy URL
- [ ] Content rating questionnaire
- [ ] Target API level 34+

### Build

```bash
cd apps/mobile
eas build --platform android --profile production
eas submit --platform android
```

## iOS (App Store)

### Checklist
- [ ] Bundle ID: `in.eduai.mobile`
- [ ] App icon (1024×1024)
- [ ] Screenshots: 6.7", 6.5", 5.5" iPhone
- [ ] App Store description (4000 chars)
- [ ] Privacy nutrition labels
- [ ] Push notification entitlement

### Build

```bash
eas build --platform ios --profile production
eas submit --platform ios
```

## Store Assets Guide

| Asset | Size | Location |
|-------|------|----------|
| App icon | 1024×1024 PNG | `apps/mobile/assets/icon.png` |
| Splash | 1284×2778 | `apps/mobile/assets/splash.png` |
| Screenshots | Device-specific | `docs/release/store-assets/` |

## Deployment Guide

1. Configure EAS project: `eas init`
2. Set production API URLs in `app.json` extra
3. Build with `--profile production`
4. Submit via EAS Submit or manual upload
5. Staged rollout: 10% → 50% → 100%

## Beta Testing

- **Android:** Internal testing track via Play Console
- **iOS:** TestFlight with up to 10,000 testers

## Compliance

- COPPA: Parent consent for users under 13
- GDPR: Data export/deletion via identity-service
- India DPDP: Data localization in ap-south-1
