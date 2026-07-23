/**
 * Approximate USD cost per 1M tokens by model (input+output blended).
 * Used for dashboards — not for customer billing amounts.
 */

const MODEL_COST_PER_1M: Record<string, number> = {
  'gpt-4o-mini': 0.3,
  'gpt-4o': 5.0,
  'gpt-4.1-mini': 0.4,
  'gpt-4.1': 5.0,
  'gemini-1.5-flash': 0.15,
  'gemini-1.5-pro': 2.5,
  'gemini-2.0-flash': 0.2,
  'mock-v1': 0,
  stub: 0,
};

const DEFAULT_COST_PER_1M = 2.5;

export function estimateCostUsd(model: string, totalTokens: number): number {
  const key = model.toLowerCase();
  const rate =
    MODEL_COST_PER_1M[key] ??
    Object.entries(MODEL_COST_PER_1M).find(([m]) => key.includes(m))?.[1] ??
    DEFAULT_COST_PER_1M;
  return Math.round((totalTokens / 1_000_000) * rate * 1_000_000) / 1_000_000;
}

export function getModelCostRate(model: string): number {
  const key = model.toLowerCase();
  return (
    MODEL_COST_PER_1M[key] ??
    Object.entries(MODEL_COST_PER_1M).find(([m]) => key.includes(m))?.[1] ??
    DEFAULT_COST_PER_1M
  );
}

export const CHEAP_MODELS = {
  openai: 'gpt-4o-mini',
  gemini: 'gemini-1.5-flash',
  mock: 'mock-v1',
} as const;

export const PREMIUM_MODELS = {
  openai: 'gpt-4o',
  gemini: 'gemini-1.5-pro',
  mock: 'mock-v1',
} as const;
