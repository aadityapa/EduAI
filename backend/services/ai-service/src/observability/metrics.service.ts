import { Injectable } from '@nestjs/common';
import { getPrometheusRegistry } from '@eduai/nest-common';

/**
 * AI-specific counters; HTTP RED metrics come from nest-common middleware.
 * Both share the `ai-service` Prometheus registry scraped at /api/v1/metrics.
 */
@Injectable()
export class MetricsService {
  private readonly registry = getPrometheusRegistry('ai-service');

  increment(name: string, labels: Record<string, string> = {}, amount = 1): void {
    this.registry.incCounter(name, labels, amount);
  }

  getPrometheusMetrics(): string {
    return this.registry.render();
  }

  recordRequest(feature: string, status: 'success' | 'error', durationMs: number): void {
    this.increment('ai_requests_total', { feature, status });
    this.registry.observeHistogram(
      'ai_request_duration_ms',
      durationMs,
      { feature },
      [50, 100, 250, 500, 1000, 2000, 4000, 8000, 16000],
    );
  }
}
