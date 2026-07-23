import { describe, expect, it } from 'vitest';
import { PrometheusRegistry, recordHttpRequest, getPrometheusRegistry } from './prometheus-metrics.js';

describe('PrometheusRegistry', () => {
  it('renders counters and histogram buckets', () => {
    const reg = new PrometheusRegistry({ service: 'test-svc' });
    reg.incCounter('http_requests_total', { method: 'GET', route: '/health', status: '200' });
    reg.observeHistogram('http_request_duration_seconds', 0.042, {
      method: 'GET',
      route: '/health',
      status: '200',
    });
    const text = reg.render();
    expect(text).toContain('http_requests_total');
    expect(text).toContain('service="test-svc"');
    expect(text).toContain('http_request_duration_seconds_bucket');
    expect(text).toContain('le="0.05"');
  });

  it('recordHttpRequest writes to named registry', () => {
    recordHttpRequest('unit-svc', 'POST', '/api/v1/auth/login', 401, 0.12);
    const text = getPrometheusRegistry('unit-svc').render();
    expect(text).toContain('http_requests_total');
    expect(text).toContain('status="401"');
  });
});
