export interface ContentFilterResult {
  allowed: boolean;
  reason?: string;
  filtered?: string;
}

const BLOCKED_PATTERNS = [
  /\b(how\s+to\s+make\s+(a\s+)?bomb)\b/i,
  /\b(self[-\s]?harm|suicide\s+method)\b/i,
  /\b(credit\s+card\s+numbers?\s+for\s+free)\b/i,
];

export function filterContent(content: string): ContentFilterResult {
  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(content)) {
      return {
        allowed: false,
        reason: 'Content blocked by safety filter',
      };
    }
  }

  return { allowed: true, filtered: content };
}
