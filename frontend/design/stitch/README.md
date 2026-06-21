# Stitch design assets (single folder)

All Google Stitch exports and generated mobile specs live here.

## Structure

- `manifest.json` — maps each screen HTML file to web/mobile app routes
- `eduai_*` — imported web/admin/student HTML from Stitch export
- `mobile/eduai_mobile_*` — generated mobile screen specs (HTML + DESIGN.md)
- `generate-mobile-screens.mjs` — regenerate mobile HTML specs

## Sync from Stitch project (live)

Project: [Stitch EduAI](https://stitch.withgoogle.com/projects/17256885408366407754)

```bash
pnpm stitch:fetch          # download all screens from Stitch API
pnpm stitch:consolidate    # copy into frontend/design/stitch/from-api/
```

Screens land in `backend/docs/design/stitch-screens/` then `frontend/design/stitch/from-api/`.

## Import from external zip/folder

If you have a fresh export at `g:\stitch_eduai_platform`:

```powershell
pnpm stitch:import
```

Or manually:

```powershell
robocopy "g:\stitch_eduai_platform" "frontend\design\stitch" /E
node frontend/design/stitch/generate-mobile-screens.mjs
```

## Regenerate mobile specs only

```bash
pnpm stitch:mobile:generate
```

## Mobile app implementation

Expo app (`frontend/mobile`) uses Stitch tokens and components:

- `src/theme/tokens.ts` — `#005bbf` primary, `#8621d9` tertiary
- `src/components/stitch.tsx` — MobileHeader, MetricChip, AiHero, CourseCarousel, StitchTabBar

Run mobile dev:

```bash
pnpm dev:mobile
```

Demo login: `student@demo.eduai.in` / `Demo1234!` (backend on `:3001`)
