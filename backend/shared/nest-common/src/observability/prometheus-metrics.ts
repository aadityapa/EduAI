/**
 * Lightweight Prometheus text exposition for RED metrics.
 * Avoids prom-client dependency while matching alerting-rules.yml metric names.
 */

const DEFAULT_BUCKETS = [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10];

function labelsKey(labels: Record<string, string>): string {
  return Object.keys(labels)
    .sort()
    .map((k) => `${k}=${labels[k]}`)
    .join(',');
}

function formatLabels(labels: Record<string, string>): string {
  const entries = Object.entries(labels);
  if (entries.length === 0) return '';
  return `{${entries.map(([k, v]) => `${k}="${escapeLabel(v)}"`).join(',')}}`;
}

function escapeLabel(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n');
}

export class PrometheusRegistry {
  private readonly counters = new Map<string, Map<string, { labels: Record<string, string>; value: number }>>();
  private readonly histograms = new Map<
    string,
    Map<string, { labels: Record<string, string>; buckets: number[]; counts: number[]; sum: number; count: number }>
  >();
  private readonly gauges = new Map<string, Map<string, { labels: Record<string, string>; value: number }>>();

  constructor(private readonly defaultLabels: Record<string, string> = {}) {}

  incCounter(name: string, labels: Record<string, string> = {}, amount = 1): void {
    const merged = { ...this.defaultLabels, ...labels };
    const byKey = this.counters.get(name) ?? new Map();
    const key = labelsKey(merged);
    const existing = byKey.get(key);
    if (existing) {
      existing.value += amount;
    } else {
      byKey.set(key, { labels: merged, value: amount });
    }
    this.counters.set(name, byKey);
  }

  observeHistogram(
    name: string,
    value: number,
    labels: Record<string, string> = {},
    buckets: number[] = DEFAULT_BUCKETS,
  ): void {
    const merged = { ...this.defaultLabels, ...labels };
    const byKey = this.histograms.get(name) ?? new Map();
    const key = labelsKey(merged);
    let existing = byKey.get(key);
    if (!existing) {
      existing = {
        labels: merged,
        buckets: [...buckets],
        counts: buckets.map(() => 0),
        sum: 0,
        count: 0,
      };
      byKey.set(key, existing);
    }
    existing.sum += value;
    existing.count += 1;
    for (let i = 0; i < existing.buckets.length; i++) {
      const boundary = existing.buckets[i];
      if (boundary !== undefined && value <= boundary) {
        existing.counts[i] = (existing.counts[i] ?? 0) + 1;
      }
    }
    this.histograms.set(name, byKey);
  }

  setGauge(name: string, value: number, labels: Record<string, string> = {}): void {
    const merged = { ...this.defaultLabels, ...labels };
    const byKey = this.gauges.get(name) ?? new Map();
    byKey.set(labelsKey(merged), { labels: merged, value });
    this.gauges.set(name, byKey);
  }

  render(): string {
    const lines: string[] = [];

    for (const [name, series] of this.counters) {
      lines.push(`# TYPE ${name} counter`);
      for (const { labels, value } of series.values()) {
        lines.push(`${name}${formatLabels(labels)} ${value}`);
      }
    }

    for (const [name, series] of this.gauges) {
      lines.push(`# TYPE ${name} gauge`);
      for (const { labels, value } of series.values()) {
        lines.push(`${name}${formatLabels(labels)} ${value}`);
      }
    }

    for (const [name, series] of this.histograms) {
      lines.push(`# TYPE ${name} histogram`);
      for (const entry of series.values()) {
        let cumulative = 0;
        for (let i = 0; i < entry.buckets.length; i++) {
          cumulative += entry.counts[i] ?? 0;
          const le = String(entry.buckets[i]);
          lines.push(
            `${name}_bucket${formatLabels({ ...entry.labels, le })} ${cumulative}`,
          );
        }
        lines.push(
          `${name}_bucket${formatLabels({ ...entry.labels, le: '+Inf' })} ${entry.count}`,
        );
        lines.push(`${name}_sum${formatLabels(entry.labels)} ${entry.sum}`);
        lines.push(`${name}_count${formatLabels(entry.labels)} ${entry.count}`);
      }
    }

    return `${lines.join('\n')}\n`;
  }
}

const registries = new Map<string, PrometheusRegistry>();

export function getPrometheusRegistry(serviceName: string): PrometheusRegistry {
  let reg = registries.get(serviceName);
  if (!reg) {
    reg = new PrometheusRegistry({ service: serviceName });
    registries.set(serviceName, reg);
  }
  return reg;
}

/** Record one HTTP request for RED dashboards / alerting-rules.yml */
export function recordHttpRequest(
  serviceName: string,
  method: string,
  route: string,
  statusCode: number,
  durationSeconds: number,
): void {
  const registry = getPrometheusRegistry(serviceName);
  const status = String(statusCode);
  const labels = { method: method.toUpperCase(), route, status };
  registry.incCounter('http_requests_total', labels);
  registry.observeHistogram('http_request_duration_seconds', durationSeconds, {
    method: method.toUpperCase(),
    route,
    status,
  });
}
