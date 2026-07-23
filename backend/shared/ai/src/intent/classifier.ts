/**
 * Lightweight rule-based intent classification for model tier routing.
 * Prefer real quotas/routing over ML intent — vector/embedding classifiers are a Phase 8+ follow-up.
 */

export type AiIntent =
  | 'greeting'
  | 'simple_qa'
  | 'explanation'
  | 'problem_solve'
  | 'generation'
  | 'planning'
  | 'vision'
  | 'creative';

export type ModelTier = 'cheap' | 'premium';

export interface IntentClassification {
  intent: AiIntent;
  tier: ModelTier;
  confidence: number;
  reason: string;
}

const PREMIUM_FEATURES = new Set([
  'question-gen',
  'mock-test',
  'homework',
  'planner',
  'vision',
]);

const PREMIUM_PATTERNS = [
  /\b(explain|why|how does|step[- ]by[- ]step|derive|prove|detailed)\b/i,
  /\b(generate|create|write|compose|design)\b/i,
  /\b(compare|contrast|analyse|analyze|evaluate)\b/i,
  /\b(solve|equation|integral|proof|theorem)\b/i,
];

const CHEAP_PATTERNS = [
  /^(hi|hello|hey|namaste|thanks|thank you|ok|okay)\b/i,
  /\b(what is|define|definition of|meaning of)\b/i,
  /\b(yes|no|true|false)\b/i,
];

export function classifyIntent(
  message: string,
  feature?: string,
): IntentClassification {
  const text = message.trim();
  const featureKey = feature?.toLowerCase();

  if (featureKey === 'vision' || featureKey === 'homework') {
    return {
      intent: featureKey === 'vision' ? 'vision' : 'problem_solve',
      tier: 'premium',
      confidence: 0.9,
      reason: `feature:${featureKey}`,
    };
  }

  if (featureKey && PREMIUM_FEATURES.has(featureKey)) {
    return {
      intent: featureKey === 'planner' ? 'planning' : 'generation',
      tier: 'premium',
      confidence: 0.85,
      reason: `feature:${featureKey}`,
    };
  }

  if (!text || text.length < 8) {
    return {
      intent: 'greeting',
      tier: 'cheap',
      confidence: 0.7,
      reason: 'short_message',
    };
  }

  for (const pattern of CHEAP_PATTERNS) {
    if (pattern.test(text) && text.length < 120) {
      return {
        intent: pattern.source.includes('hi|hello') ? 'greeting' : 'simple_qa',
        tier: 'cheap',
        confidence: 0.75,
        reason: 'cheap_pattern',
      };
    }
  }

  for (const pattern of PREMIUM_PATTERNS) {
    if (pattern.test(text)) {
      const intent: AiIntent = /\b(generate|create|write)\b/i.test(text)
        ? 'generation'
        : /\b(solve|equation)\b/i.test(text)
          ? 'problem_solve'
          : 'explanation';
      return {
        intent,
        tier: 'premium',
        confidence: 0.8,
        reason: 'premium_pattern',
      };
    }
  }

  // Longer open-ended tutor turns get premium; short Q&A stays cheap
  if (text.length > 280) {
    return {
      intent: 'explanation',
      tier: 'premium',
      confidence: 0.65,
      reason: 'long_message',
    };
  }

  return {
    intent: 'simple_qa',
    tier: 'cheap',
    confidence: 0.6,
    reason: 'default',
  };
}
