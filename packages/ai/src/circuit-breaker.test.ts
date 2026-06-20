import { describe, it, expect } from 'vitest';
import { CircuitBreaker } from './circuit-breaker.js';

describe('CircuitBreaker', () => {
  it('opens after threshold failures', async () => {
    const breaker = new CircuitBreaker({ failureThreshold: 3, resetTimeoutMs: 1000, name: 'test' });
    const fail = () => Promise.reject(new Error('fail'));

    for (let i = 0; i < 3; i++) {
      await expect(breaker.execute(fail)).rejects.toThrow('fail');
    }
    expect(breaker.getState()).toBe('open');
    await expect(breaker.execute(fail)).rejects.toThrow(/Circuit breaker open/);
  });

  it('resets after success in half-open', async () => {
    const breaker = new CircuitBreaker({ failureThreshold: 2, resetTimeoutMs: 10, name: 'test' });
    const fail = () => Promise.reject(new Error('fail'));
    const ok = () => Promise.resolve('ok');

    await expect(breaker.execute(fail)).rejects.toThrow();
    await expect(breaker.execute(fail)).rejects.toThrow();
    expect(breaker.getState()).toBe('open');

    await new Promise((r) => setTimeout(r, 15));
    await expect(breaker.execute(ok)).resolves.toBe('ok');
    expect(breaker.getState()).toBe('closed');
  });
});
