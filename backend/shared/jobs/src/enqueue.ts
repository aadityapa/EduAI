import { getQueue, isJobsEnabled } from './connection.js';
import {
  QUEUE_NAMES,
  type AiBatchJobPayload,
  type EmailJobPayload,
  type MockTestJobPayload,
  type QpgJobPayload,
} from './queues.js';

export type EnqueueResult = {
  queued: true;
  jobId: string;
  queue: string;
};

export type EnqueueSkipped = {
  queued: false;
  reason: 'jobs_disabled' | 'redis_unavailable';
};

async function enqueue<T extends object>(
  queueName: (typeof QUEUE_NAMES)[keyof typeof QUEUE_NAMES],
  name: string,
  data: T,
): Promise<EnqueueResult | EnqueueSkipped> {
  if (!isJobsEnabled()) {
    return { queued: false, reason: 'jobs_disabled' };
  }
  const queue = getQueue(queueName);
  if (!queue) {
    return { queued: false, reason: 'redis_unavailable' };
  }
  const job = await queue.add(name, data, {
    removeOnComplete: 100,
    removeOnFail: 200,
    attempts: 3,
    backoff: { type: 'exponential', delay: 2000 },
  });
  return { queued: true, jobId: String(job.id), queue: queueName };
}

export function enqueueEmail(payload: EmailJobPayload) {
  return enqueue(QUEUE_NAMES.email, 'send-email', payload);
}

export function enqueueQpg(payload: QpgJobPayload) {
  return enqueue(QUEUE_NAMES.qpg, 'generate-qpg', payload);
}

export function enqueueMockTest(payload: MockTestJobPayload) {
  return enqueue(QUEUE_NAMES.mockTest, 'generate-mock-test', payload);
}

export function enqueueAiBatch(payload: AiBatchJobPayload) {
  return enqueue(QUEUE_NAMES.aiBatch, 'ai-batch', payload);
}
