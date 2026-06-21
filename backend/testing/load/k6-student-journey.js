import http from 'k6/http';
import { check, sleep } from 'k6';
import { SharedArray } from 'k6/data';
import { Rate, Trend } from 'k6/metrics';

const errorRate = new Rate('errors');
const loginDuration = new Trend('login_duration');
const courseDuration = new Trend('course_access_duration');
const quizDuration = new Trend('quiz_submit_duration');
const aiDuration = new Trend('ai_tutor_duration');

const BASE = __ENV.BASE_URL || 'http://localhost:3001';
const LEARNING = __ENV.LEARNING_URL || 'http://localhost:3003';
const AI = __ENV.AI_URL || 'http://localhost:3004';
const TENANT = __ENV.TENANT_ID || 'demo-tenant';
const PASSWORD = __ENV.TEST_PASSWORD || 'Demo1234!';

const users = new SharedArray('students', function () {
  const count = Number(__ENV.USER_POOL_SIZE || 50);
  return Array.from({ length: count }, (_, i) => ({
    email: `student${(i % 10) + 1}@demo.eduai.in`,
  }));
});

export const options = {
  scenarios: {
    smoke_500: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '1m', target: 100 },
        { duration: '3m', target: 500 },
        { duration: '1m', target: 0 },
      ],
      gracefulRampDown: '30s',
      exec: 'studentJourney',
      tags: { scenario: '500_vu' },
    },
    stress_1000: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '2m', target: 250 },
        { duration: '3m', target: 1000 },
        { duration: '1m', target: 0 },
      ],
      gracefulRampDown: '30s',
      exec: 'studentJourney',
      tags: { scenario: '1000_vu' },
      startTime: '6m',
    },
  },
  thresholds: {
    http_req_failed: ['rate<0.05'],
    http_req_duration: ['p(95)<2000'],
    login_duration: ['p(95)<1500'],
    course_access_duration: ['p(95)<1000'],
    errors: ['rate<0.05'],
  },
};

function login(email) {
  const start = Date.now();
  const res = http.post(
    `${BASE}/api/v1/auth/login`,
    JSON.stringify({ email, password: PASSWORD }),
    {
      headers: {
        'Content-Type': 'application/json',
        'X-Tenant-Id': TENANT,
      },
      tags: { name: 'login' },
    },
  );
  loginDuration.add(Date.now() - start);
  const ok = check(res, {
    'login status 200': (r) => r.status === 200,
    'login has token': (r) => !!r.json('data.accessToken'),
  });
  errorRate.add(!ok);
  if (!ok) return null;
  return res.json('data.accessToken');
}

export function studentJourney() {
  const user = users[(__VU - 1) % users.length];
  const token = login(user.email);
  if (!token) {
    sleep(1);
    return;
  }

  const authHeaders = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
    'X-Tenant-Id': TENANT,
  };

  const courseStart = Date.now();
  const courses = http.get(`${LEARNING}/api/v1/courses`, {
    headers: authHeaders,
    tags: { name: 'courses_list' },
  });
  courseDuration.add(Date.now() - courseStart);
  errorRate.add(!check(courses, { 'courses 200': (r) => r.status === 200 }));

  const quizStart = Date.now();
  const quizzes = http.get(`${LEARNING}/api/v1/quizzes`, {
    headers: authHeaders,
    tags: { name: 'quizzes_list' },
  });
  quizDuration.add(Date.now() - quizStart);
  errorRate.add(!check(quizzes, { 'quizzes 200': (r) => r.status === 200 }));

  const aiStart = Date.now();
  const tutor = http.post(
    `${AI}/api/v1/tutor/chat`,
    JSON.stringify({ message: 'Explain photosynthesis briefly' }),
    { headers: authHeaders, tags: { name: 'ai_tutor' } },
  );
  aiDuration.add(Date.now() - aiStart);
  errorRate.add(!check(tutor, { 'tutor 200/201': (r) => r.status === 200 || r.status === 201 }));

  sleep(Math.random() * 2 + 0.5);
}
