/**
 * EduAI port allocation — all services use unique ports.
 * @see docs/architecture/port-allocation.md
 */

export const PORTS = {
  /** Student / Teacher / Parent web portal (Next.js) */
  WEB: 3000,
  /** Platform admin CRM (Next.js) */
  ADMIN: 3002,
  /** Identity & auth API (NestJS) */
  IDENTITY: 3001,
  /** Courses, quizzes, gamification (NestJS) */
  LEARNING: 3003,
  /** AI tutor, homework, planner (NestJS) */
  AI: 3004,
  /** School ERP (NestJS) */
  ERP: 3005,
  /** Billing & subscriptions (NestJS) */
  BILLING: 3006,
  /** Expo Metro bundler (React Native dev) */
  MOBILE_METRO: 8081,
  /** PostgreSQL (Docker) */
  POSTGRES: 5433,
  /** Redis (Docker) */
  REDIS: 6379,
} as const;

export const FRONTEND_APPS = {
  web: { port: PORTS.WEB, url: `http://localhost:${PORTS.WEB}`, roles: ['student', 'teacher', 'parent'] },
  admin: { port: PORTS.ADMIN, url: `http://localhost:${PORTS.ADMIN}`, roles: ['platform_admin', 'tenant_admin', 'school_admin'] },
  mobile: { port: PORTS.MOBILE_METRO, url: `exp://localhost:${PORTS.MOBILE_METRO}`, roles: ['student', 'teacher', 'parent'] },
} as const;

export const BACKEND_SERVICES = {
  identity: { port: PORTS.IDENTITY, url: `http://localhost:${PORTS.IDENTITY}` },
  learning: { port: PORTS.LEARNING, url: `http://localhost:${PORTS.LEARNING}` },
  ai: { port: PORTS.AI, url: `http://localhost:${PORTS.AI}` },
  erp: { port: PORTS.ERP, url: `http://localhost:${PORTS.ERP}` },
  billing: { port: PORTS.BILLING, url: `http://localhost:${PORTS.BILLING}` },
} as const;

export function serviceUrl(
  key: keyof typeof BACKEND_SERVICES,
  envOverride?: string,
): string {
  return envOverride ?? BACKEND_SERVICES[key].url;
}
