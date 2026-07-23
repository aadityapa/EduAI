import { describe, expect, it, vi } from 'vitest';
import { TraceIdMiddleware } from './trace-id.middleware.js';

describe('TraceIdMiddleware', () => {
  it('propagates W3C traceparent', () => {
    const mw = new TraceIdMiddleware();
    const req = {
      headers: {
        traceparent: '00-0af7651916cd43dd8448eb211c80319c-b7ad6b7169203331-01',
      },
    } as never;
    const res = { setHeader: vi.fn() };
    const next = vi.fn();
    mw.use(req, res as never, next);
    expect((req as { traceId?: string }).traceId).toBe('0af7651916cd43dd8448eb211c80319c');
    expect(res.setHeader).toHaveBeenCalledWith('traceparent', expect.stringContaining('0af7651916cd43dd8448eb211c80319c'));
    expect(next).toHaveBeenCalled();
  });

  it('mints id when no headers', () => {
    const mw = new TraceIdMiddleware();
    const req = { headers: {} } as never;
    const res = { setHeader: vi.fn() };
    mw.use(req, res as never, vi.fn());
    expect((req as { traceId?: string }).traceId).toBeTruthy();
  });
});
