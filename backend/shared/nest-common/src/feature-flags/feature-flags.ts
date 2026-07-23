/**
 * Lightweight feature-flag scaffolding for risky launches (Phase 11).
 *
 * Resolution order:
 * 1. process.env.FEATURE_FLAGS_JSON — `{"newCheckout":true,"aiVision":false}`
 * 2. process.env.FF_<NAME> — `true`/`false`/`1`/`0`
 * 3. defaults map
 *
 * No secrets; safe for demo. Admin UI / DB-backed flags can replace this later.
 */

export type FeatureFlagMap = Record<string, boolean>;

const DEFAULT_FLAGS: FeatureFlagMap = {
  /** Enable Chromatic publish job when token present */
  chromaticPublish: false,
  /** Gate experimental AI vision homework path */
  aiVisionHomework: true,
  /** Gate new admin analytics charts */
  adminAnalyticsV2: false,
  /** Force fail-closed auth secrets even outside production (staging drills) */
  failClosedAuthSecrets: false,
};

let cached: FeatureFlagMap | undefined;

function parseEnvJson(): FeatureFlagMap {
  const raw = process.env.FEATURE_FLAGS_JSON;
  if (!raw?.trim()) return {};
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
    const out: FeatureFlagMap = {};
    for (const [k, v] of Object.entries(parsed as Record<string, unknown>)) {
      if (typeof v === 'boolean') out[k] = v;
    }
    return out;
  } catch {
    return {};
  }
}

function parseFfEnv(name: string): boolean | undefined {
  const key = `FF_${name.replace(/([a-z])([A-Z])/g, '$1_$2').toUpperCase()}`;
  const alt = `FF_${name.toUpperCase()}`;
  const raw = process.env[key] ?? process.env[alt];
  if (raw === undefined) return undefined;
  const v = raw.trim().toLowerCase();
  if (['1', 'true', 'yes', 'on'].includes(v)) return true;
  if (['0', 'false', 'no', 'off'].includes(v)) return false;
  return undefined;
}

export function loadFeatureFlags(overrides?: FeatureFlagMap): FeatureFlagMap {
  const fromJson = parseEnvJson();
  const merged: FeatureFlagMap = { ...DEFAULT_FLAGS, ...fromJson, ...overrides };
  for (const name of Object.keys(merged)) {
    const fromEnv = parseFfEnv(name);
    if (fromEnv !== undefined) merged[name] = fromEnv;
  }
  cached = merged;
  return merged;
}

export function isFeatureEnabled(name: string, fallback = false): boolean {
  const flags = cached ?? loadFeatureFlags();
  return flags[name] ?? fallback;
}

export function resetFeatureFlagsForTests(): void {
  cached = undefined;
}

export function listFeatureFlags(): FeatureFlagMap {
  return { ...(cached ?? loadFeatureFlags()) };
}
