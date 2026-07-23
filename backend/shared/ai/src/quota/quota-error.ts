export interface QuotaUpsellDetails {
  code: 'AI_QUOTA_EXCEEDED';
  used: number;
  budget: number;
  remaining: number;
  resetAt: string;
  tier?: string;
  /** Suggested product action for clients */
  action: 'upsell' | 'queue' | 'retry_later';
  upgradeHint: string;
  queueSuggested: boolean;
  retryAfterSeconds: number;
}

export class QuotaExceededError extends Error {
  readonly details: QuotaUpsellDetails;
  readonly statusCode = 429;

  constructor(details: Omit<QuotaUpsellDetails, 'code'>) {
    super('Daily AI token quota exceeded');
    this.name = 'QuotaExceededError';
    this.details = { code: 'AI_QUOTA_EXCEEDED', ...details };
  }
}
