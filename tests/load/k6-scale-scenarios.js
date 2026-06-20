/**
 * Scale scenario configs — run against staging with adequate infrastructure.
 * Example: k6 run --env SCENARIO=5000 tests/load/k6-scale-scenarios.js
 */
import http from 'k6/http';
import { check, sleep } from 'k6';

const SCENARIO = __ENV.SCENARIO || '500';
const BASE = __ENV.BASE_URL || 'http://localhost:3001';

const targets = {
  '500': { vus: 500, duration: '5m' },
  '1000': { vus: 1000, duration: '5m' },
  '5000': { vus: 5000, duration: '10m' },
  '10000': { vus: 10000, duration: '15m' },
};

const selected = targets[SCENARIO] || targets['500'];

export const options = {
  vus: selected.vus,
  duration: selected.duration,
  thresholds: {
    http_req_failed: ['rate<0.10'],
    http_req_duration: ['p(95)<3000'],
  },
};

export default function () {
  const res = http.get(`${BASE}/api/v1/health`);
  check(res, { 'health ok': (r) => r.status === 200 });
  sleep(1);
}
