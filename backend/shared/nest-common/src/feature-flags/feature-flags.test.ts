import { afterEach, describe, expect, it } from 'vitest';
import {
  isFeatureEnabled,
  loadFeatureFlags,
  resetFeatureFlagsForTests,
} from './feature-flags.js';

describe('feature flags', () => {
  afterEach(() => {
    delete process.env.FEATURE_FLAGS_JSON;
    delete process.env.FF_ADMIN_ANALYTICS_V2;
    resetFeatureFlagsForTests();
  });

  it('loads defaults', () => {
    const flags = loadFeatureFlags();
    expect(flags.aiVisionHomework).toBe(true);
    expect(flags.adminAnalyticsV2).toBe(false);
  });

  it('overrides from FEATURE_FLAGS_JSON', () => {
    process.env.FEATURE_FLAGS_JSON = JSON.stringify({ adminAnalyticsV2: true });
    resetFeatureFlagsForTests();
    expect(isFeatureEnabled('adminAnalyticsV2')).toBe(true);
  });

  it('overrides from FF_* env', () => {
    process.env.FF_ADMIN_ANALYTICS_V2 = 'true';
    resetFeatureFlagsForTests();
    loadFeatureFlags();
    expect(isFeatureEnabled('adminAnalyticsV2')).toBe(true);
  });
});
