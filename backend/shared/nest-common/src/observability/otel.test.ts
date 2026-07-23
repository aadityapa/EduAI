import { describe, expect, it } from 'vitest';
import { mintTraceContext, parseTraceparent } from './otel.js';

describe('otel W3C helpers', () => {
  it('parses valid traceparent and mints child span', () => {
    const parent = '00-0af7651916cd43dd8448eb211c80319c-b7ad6b7169203331-01';
    const ctx = parseTraceparent(parent);
    expect(ctx?.traceId).toBe('0af7651916cd43dd8448eb211c80319c');
    expect(ctx?.spanId).toHaveLength(16);
    expect(ctx?.traceparent.startsWith('00-0af7651916cd43dd8448eb211c80319c-')).toBe(true);
  });

  it('rejects invalid traceparent', () => {
    expect(parseTraceparent('garbage')).toBeUndefined();
    expect(parseTraceparent('00-00000000000000000000000000000000-b7ad6b7169203331-01')).toBeUndefined();
  });

  it('mints a fresh context', () => {
    const ctx = mintTraceContext();
    expect(ctx.traceId).toHaveLength(32);
    expect(ctx.spanId).toHaveLength(16);
  });
});
