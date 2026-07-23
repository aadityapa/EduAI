/** Exponential backoff retry for transient network / 5xx failures. */

export type RetryOptions = {
  /** Max attempts including the first try. Default 3. */
  retries?: number;
  /** Initial delay in ms. Default 300. */
  baseDelayMs?: number;
  /** Cap delay in ms. Default 4000. */
  maxDelayMs?: number;
  /** Return false to skip retry for this error. */
  shouldRetry?: (error: unknown, attempt: number) => boolean;
  /** Injected sleep (tests). */
  sleep?: (ms: number) => Promise<void>;
};

export function defaultShouldRetry(error: unknown): boolean {
  if (error && typeof error === 'object' && 'status' in error) {
    const status = (error as { status: number }).status;
    if (status === 408 || status === 429 || status >= 500) return true;
    if (status >= 400 && status < 500) return false;
  }
  // Network / parse failures have no status
  return true;
}

export function backoffDelay(attempt: number, baseDelayMs: number, maxDelayMs: number): number {
  const exp = Math.min(maxDelayMs, baseDelayMs * 2 ** Math.max(0, attempt - 1));
  const jitter = Math.floor(Math.random() * Math.min(100, baseDelayMs));
  return Math.min(maxDelayMs, exp + jitter);
}

export async function withRetry<T>(fn: () => Promise<T>, options: RetryOptions = {}): Promise<T> {
  const retries = options.retries ?? 3;
  const baseDelayMs = options.baseDelayMs ?? 300;
  const maxDelayMs = options.maxDelayMs ?? 4000;
  const shouldRetry = options.shouldRetry ?? defaultShouldRetry;
  const sleep = options.sleep ?? ((ms: number) => new Promise((r) => setTimeout(r, ms)));

  let lastError: unknown;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt >= retries || !shouldRetry(error, attempt)) throw error;
      await sleep(backoffDelay(attempt, baseDelayMs, maxDelayMs));
    }
  }
  throw lastError;
}
