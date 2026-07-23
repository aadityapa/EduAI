/**
 * Lightweight security anomaly hooks for login / auth events.
 * Phase 9: in-memory + optional Redis counter; alert sink is pluggable.
 */

export type AnomalySeverity = 'low' | 'medium' | 'high' | 'critical';

export interface AnomalyEvent {
  type: string;
  tenantId?: string;
  userId?: string;
  ip?: string;
  severity: AnomalySeverity;
  detail?: Record<string, unknown>;
  at: string;
}

export type AnomalySink = (event: AnomalyEvent) => void | Promise<void>;

const defaultSink: AnomalySink = (event) => {
  if (event.severity === 'high' || event.severity === 'critical') {
    console.warn('[EduAI anomaly]', JSON.stringify(event));
  }
};

let sink: AnomalySink = defaultSink;

const failCounts = new Map<string, { count: number; windowStart: number }>();

export function setAnomalySink(next: AnomalySink): void {
  sink = next;
}

export function resetAnomalyStateForTests(): void {
  failCounts.clear();
  sink = defaultSink;
}

export async function emitAnomaly(
  partial: Omit<AnomalyEvent, 'at'> & { at?: string },
): Promise<void> {
  const event: AnomalyEvent = {
    ...partial,
    at: partial.at ?? new Date().toISOString(),
  };
  await sink(event);
}

/**
 * Track failed logins per email+IP. Emits high-severity anomaly after threshold.
 */
export async function recordFailedLogin(opts: {
  tenantId: string;
  email: string;
  ip?: string;
  threshold?: number;
  windowMs?: number;
}): Promise<{ count: number; anomalous: boolean }> {
  const threshold = opts.threshold ?? 5;
  const windowMs = opts.windowMs ?? 15 * 60 * 1000;
  const key = `${opts.tenantId}:${opts.email.toLowerCase()}:${opts.ip ?? 'unknown'}`;
  const now = Date.now();
  const cur = failCounts.get(key);
  if (!cur || now - cur.windowStart > windowMs) {
    failCounts.set(key, { count: 1, windowStart: now });
    return { count: 1, anomalous: false };
  }
  cur.count += 1;
  const anomalous = cur.count >= threshold;
  if (anomalous) {
    await emitAnomaly({
      type: 'auth.login.bruteforce_suspected',
      tenantId: opts.tenantId,
      ip: opts.ip,
      severity: 'high',
      detail: { email: opts.email, failCount: cur.count },
    });
  }
  return { count: cur.count, anomalous };
}

export function clearFailedLogin(opts: {
  tenantId: string;
  email: string;
  ip?: string;
}): void {
  const key = `${opts.tenantId}:${opts.email.toLowerCase()}:${opts.ip ?? 'unknown'}`;
  failCounts.delete(key);
}
