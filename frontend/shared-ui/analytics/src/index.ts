/** Analytics event tracking — Sprint 3+ implementation */
export interface AnalyticsEvent {
  name: string;
  tenantId: string;
  userId?: string;
  properties?: Record<string, unknown>;
}

export function trackEvent(_event: AnalyticsEvent): void {
  // Stub for Sprint 1
}
