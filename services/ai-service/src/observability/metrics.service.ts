import { Injectable } from '@nestjs/common';

interface Counter {
  value: number;
  labels: Record<string, string>;
}

@Injectable()
export class MetricsService {
  private readonly counters = new Map<string, Counter>();

  increment(name: string, labels: Record<string, string> = {}, amount = 1): void {
    const key = `${name}:${JSON.stringify(labels)}`;
    const existing = this.counters.get(key);
    if (existing) {
      existing.value += amount;
    } else {
      this.counters.set(key, { value: amount, labels });
    }
  }

  getPrometheusMetrics(): string {
    const lines: string[] = [];
    for (const [key, counter] of this.counters) {
      const name = key.split(':')[0];
      const labelStr = Object.entries(counter.labels)
        .map(([k, v]) => `${k}="${v}"`)
        .join(',');
      lines.push(`# TYPE ${name} counter`);
      lines.push(`${name}{${labelStr}} ${counter.value}`);
    }
    return lines.join('\n');
  }

  recordRequest(feature: string, status: 'success' | 'error', durationMs: number): void {
    this.increment('ai_requests_total', { feature, status });
    this.increment('ai_request_duration_ms_sum', { feature }, durationMs);
  }
}
