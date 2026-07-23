import type { NextFunction, Request, Response } from 'express';
import { getPrometheusRegistry } from './prometheus-metrics.js';

/**
 * Expose Prometheus text at `/api/v1/metrics` (matches K8s scrape annotations).
 */
export function createMetricsEndpoint(serviceName: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const path = req.path || req.url?.split('?')[0] || '';
    if (req.method === 'GET' && (path === '/api/v1/metrics' || path === '/metrics')) {
      const body = getPrometheusRegistry(serviceName).render();
      res.setHeader('Content-Type', 'text/plain; version=0.0.4; charset=utf-8');
      res.status(200).send(body);
      return;
    }
    next();
  };
}
