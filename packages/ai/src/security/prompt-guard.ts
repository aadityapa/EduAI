export interface PromptGuardResult {
  safe: boolean;
  reason?: string;
  sanitized?: string;
}

const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|prior|above)\s+instructions/i,
  /disregard\s+(your\s+)?(system|safety)\s+(prompt|rules)/i,
  /you\s+are\s+now\s+(a\s+)?(DAN|evil|unrestricted)/i,
  /jailbreak/i,
  /<\s*script[\s>]/i,
  /system\s*:\s*override/i,
  /reveal\s+(your\s+)?(system|hidden)\s+prompt/i,
];

const MAX_MESSAGE_LENGTH = 8000;

export function guardPrompt(input: string): PromptGuardResult {
  const trimmed = input.trim();

  if (!trimmed) {
    return { safe: false, reason: 'Empty message' };
  }

  if (trimmed.length > MAX_MESSAGE_LENGTH) {
    return {
      safe: false,
      reason: `Message exceeds ${MAX_MESSAGE_LENGTH} characters`,
    };
  }

  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(trimmed)) {
      return {
        safe: false,
        reason: 'Potential prompt injection detected',
      };
    }
  }

  const sanitized = trimmed
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '')
    .slice(0, MAX_MESSAGE_LENGTH);

  return { safe: true, sanitized };
}
