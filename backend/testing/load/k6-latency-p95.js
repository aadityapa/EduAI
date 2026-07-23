/**
 * Phase 8 latency proof — target p95 < 250ms on non-AI read paths.
 *
 * Prerequisites: identity + learning running; seed demo users; Redis optional (cache helps).
 *
 *   k6 run backend/testing/load/k6-latency-p95.js
 *   k6 run -e BASE_URL=http://localhost:3001 -e LEARNING_URL=http://localhost:3003 \
 *     backend/testing/load/k6-latency-p95.js
 */
import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { SharedArray } from 'k6/data';
import { Rate, Trend } from 'k6/metrics';

const errorRate = new Rate('errors');
const healthTrend = new Trend('health_duration', true);
const loginTrend = new Trend('login_duration', true);
const coursesTrend = new Trend('courses_duration', true);
const hubTrend = new Trend('hub_duration', true);

const BASE = __ENV.BASE_URL || 'http://localhost:3001';
const LEARNING = __ENV.LEARNING_URL || 'http://localhost:3003';
const TENANT = __ENV.TENANT_ID || 'demo-tenant';
const PASSWORD = __ENV.TEST_PASSWORD || 'Demo1234!';

const users = new SharedArray('students', function () {
  const count = Number(__ENV.USER_POOL_SIZE || 20);
  return Array.from({ length: count }, (_, i) => ({
    email: `student${(i % 10) + 1}@demo.eduai.in`,
  }));
});

export const options = {
  scenarios: {
    latency_proof: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '30s', target: 20 },
        { duration: '2m', target: 50 },
        { duration: '30s', target: 0 },
      ],
      gracefulRampDown: '15s',
      exec: 'latencyJourney',
    },
  },
  thresholds: {
    http_req_failed: ['rate<0.05'],
    // Program DoD: p95 < 250ms for non-AI API under target load
    http_req_duration: ['p(95)<250'],
    health_duration: ['p(95)<100'],
    courses_duration: ['p(95)<250'],
    hub_duration: ['p(95)<250'],
    // Login includes JWT issue — allow slightly higher but still tight
    login_duration: ['p(95)<400'],
    errors: ['rate<0.05'],
  },
};

function authHeaders(token) {
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
    'X-Tenant-Id': TENANT,
  };
}

export function latencyJourney() {
  group('health', () => {
    const start = Date.now();
    const res = http.get(`${BASE}/api/v1/health`, { tags: { name: 'health' } });
    healthTrend.add(Date.now() - start);
    const ok = check(res, { 'health 200': (r) => r.status === 200 });
    errorRate.add(!ok);
  });

  const user = users[(__VU - 1) % users.length];
  let token = null;

  group('login', () => {
    const start = Date.now();
    const res = http.post(
      `${BASE}/api/v1/auth/login`,
      JSON.stringify({ email: user.email, password: PASSWORD }),
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Tenant-Id': TENANT,
        },
        tags: { name: 'login' },
      },
    );
    loginTrend.add(Date.now() - start);
    const ok = check(res, {
      'login 200': (r) => r.status === 200,
      'has token': (r) => !!r.json('data.accessToken'),
    });
    errorRate.add(!ok);
    if (ok) token = res.json('data.accessToken');
  });

  if (!token) {
    sleep(1);
    return;
  }

  const headers = authHeaders(token);

  group('courses_catalog', () => {
    const start = Date.now();
    const res = http.get(`${LEARNING}/api/v1/courses`, {
      headers,
      tags: { name: 'courses_list' },
    });
    coursesTrend.add(Date.now() - start);
    errorRate.add(!check(res, { 'courses 200': (r) => r.status === 200 }));
  });

  group('learning_hub', () => {
    const start = Date.now();
    const res = http.get(`${LEARNING}/api/v1/hub`, {
      headers,
      tags: { name: 'hub' },
    });
    hubTrend.add(Date.now() - start);
    errorRate.add(!check(res, { 'hub 200': (r) => r.status === 200 }));
  });

  // Second catalog hit should benefit from Redis/memory curriculum cache
  group('courses_catalog_cached', () => {
    const start = Date.now();
    const res = http.get(`${LEARNING}/api/v1/courses`, {
      headers,
      tags: { name: 'courses_list_cached' },
    });
    coursesTrend.add(Date.now() - start);
    errorRate.add(!check(res, { 'courses cached 200': (r) => r.status === 200 }));
  });

  sleep(0.3 + Math.random() * 0.4);
}
