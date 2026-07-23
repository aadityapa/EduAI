import { describe, expect, it } from 'vitest';
import { classifyIntent } from './classifier.js';
import { estimateCostUsd } from '../pricing.js';
import { AiRouter } from '../router.js';

describe('classifyIntent', () => {
  it('routes greetings to cheap tier', () => {
    const result = classifyIntent('Hello!');
    expect(result.tier).toBe('cheap');
  });

  it('routes explain prompts to premium', () => {
    const result = classifyIntent('Explain step by step how photosynthesis works');
    expect(result.tier).toBe('premium');
    expect(result.intent).toBe('explanation');
  });

  it('routes homework feature to premium', () => {
    const result = classifyIntent('2x+3=7', 'homework');
    expect(result.tier).toBe('premium');
  });

  it('routes short definitions to cheap', () => {
    const result = classifyIntent('What is gravity?');
    expect(result.tier).toBe('cheap');
  });
});

describe('estimateCostUsd', () => {
  it('returns zero for mock model', () => {
    expect(estimateCostUsd('mock-v1', 10_000)).toBe(0);
  });

  it('estimates gpt-4o-mini cost', () => {
    const cost = estimateCostUsd('gpt-4o-mini', 1_000_000);
    expect(cost).toBe(0.3);
  });
});

describe('AiRouter production mock gating', () => {
  it('refuses mock in production without AI_ALLOW_MOCK', () => {
    const prev = process.env.AI_ALLOW_MOCK;
    delete process.env.AI_ALLOW_MOCK;
    const router = new AiRouter({
      nodeEnv: 'production',
      allowMockFallback: undefined,
    });
    expect(router.getActiveProviders()).toEqual([]);
    if (prev !== undefined) process.env.AI_ALLOW_MOCK = prev;
  });

  it('allows mock in production when AI_ALLOW_MOCK=true', () => {
    const prev = process.env.AI_ALLOW_MOCK;
    process.env.AI_ALLOW_MOCK = 'true';
    const router = new AiRouter({ nodeEnv: 'production' });
    expect(router.getActiveProviders()).toContain('mock');
    if (prev === undefined) delete process.env.AI_ALLOW_MOCK;
    else process.env.AI_ALLOW_MOCK = prev;
  });
});
