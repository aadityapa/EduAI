export type CircuitState = 'closed' | 'open' | 'half-open';

export interface CircuitBreakerOptions {
  failureThreshold?: number;
  resetTimeoutMs?: number;
  name?: string;
}

export class CircuitBreaker {
  private failures = 0;
  private lastFailureAt = 0;
  private state: CircuitState = 'closed';

  constructor(private readonly options: CircuitBreakerOptions = {}) {}

  getState(): CircuitState {
    this.refreshState();
    return this.state;
  }

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    this.refreshState();

    if (this.state === 'open') {
      throw new Error(
        `Circuit breaker open for ${this.options.name ?? 'provider'} — try again later`,
      );
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private refreshState() {
    const threshold = this.options.failureThreshold ?? 5;
    const resetMs = this.options.resetTimeoutMs ?? 30_000;

    if (this.state === 'open' && Date.now() - this.lastFailureAt >= resetMs) {
      this.state = 'half-open';
      this.failures = 0;
    }
  }

  private onSuccess() {
    this.failures = 0;
    this.state = 'closed';
  }

  private onFailure() {
    const threshold = this.options.failureThreshold ?? 5;
    this.failures += 1;
    this.lastFailureAt = Date.now();
    if (this.failures >= threshold) {
      this.state = 'open';
    }
  }
}
