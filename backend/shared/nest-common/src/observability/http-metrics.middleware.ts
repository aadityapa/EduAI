import type { NextFunction, Request, Response } from 'express';
import { recordHttpRequest } from './prometheus-metrics.js';
import { getStructuredLogger } from './structured-logger.js';

/**
 * RED metrics + structured access log for each HTTP request.
 */
export function createHttpMetricsMiddleware(serviceName: string) {
  const log = getStructuredLogger(serviceName);

  return (req: Request, res: Response, next: NextFunction) => {
    const start = process.hrtime.bigint();
    const routeHint = () => {
      // Prefer Nest route path when available; fall back to URL path (no query)
      const base = (req.route?.path as string | undefined) ?? req.path ?? req.url?.split('?')[0] ?? 'unknown';
      return String(base).replace(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi, ':id');
    };

    res.on('finish', () => {
      const durationNs = Number(process.hrtime.bigint() - start);
      const durationSeconds = durationNs / 1e9;
      const route = routeHint();
      const statusCode = res.statusCode;

      // Skip noisy scrape path from duration histograms? Still count it.
      recordHttpRequest(serviceName, req.method, route, statusCode, durationSeconds);

      if (process.env.HTTP_ACCESS_LOG !== 'false') {
        log.info('http_request', {
          method: req.method,
          path: route,
          statusCode,
          durationMs: Math.round(durationSeconds * 1000),
          traceId: (req as { traceId?: string }).traceId,
        });
      }
    });

    next();
  };
}
