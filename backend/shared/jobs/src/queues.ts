/** BullMQ queue names for EduAI background work. */
export const QUEUE_NAMES = {
  email: 'eduai-email',
  qpg: 'eduai-qpg',
  mockTest: 'eduai-mock-test',
  aiBatch: 'eduai-ai-batch',
} as const;

export type QueueName = (typeof QUEUE_NAMES)[keyof typeof QUEUE_NAMES];

export type EmailJobPayload = {
  to: string;
  subject: string;
  template: string;
  vars?: Record<string, string>;
  tenantId?: string;
};

export type QpgJobPayload = {
  tenantId: string;
  userId: string;
  subject: string;
  topic: string;
  classLevel: number;
  count: number;
  difficulty?: string;
  questionTypes?: string[];
};

export type MockTestJobPayload = {
  tenantId: string;
  userId: string;
  subject: string;
  topic: string;
  classLevel: number;
  questionCount: number;
  durationMinutes?: number;
  difficulty?: string;
};

export type AiBatchJobPayload = {
  tenantId: string;
  userId: string;
  feature: string;
  items: unknown[];
};
