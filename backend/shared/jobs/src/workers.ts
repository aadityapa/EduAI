import { Worker, type Processor } from 'bullmq';
import { getBullConnectionOptions, isJobsEnabled } from './connection.js';
import { QUEUE_NAMES, type QueueName } from './queues.js';

/**
 * Scaffold processors — replace with real email/QPG/AI handlers in later phases.
 * Workers log and acknowledge; they do not call external providers yet.
 */
const stubProcessor =
  (label: string): Processor =>
  async (job) => {
    console.log(`[jobs:${label}] processed job=${job.id} name=${job.name}`);
    return { ok: true, jobId: job.id, at: new Date().toISOString() };
  };

export function startWorkers(queues: QueueName[] = Object.values(QUEUE_NAMES)): Worker[] {
  if (!isJobsEnabled()) {
    console.warn('[jobs] Workers not started — set REDIS_URL and JOBS_ENABLED!=false');
    return [];
  }
  const connection = getBullConnectionOptions();
  if (!connection) {
    console.warn('[jobs] No Redis connection for workers');
    return [];
  }

  return queues.map((name) => {
    const label = name.replace(/^eduai-/, '');
    const worker = new Worker(name, stubProcessor(label), {
      connection,
      concurrency: Number(process.env.JOBS_CONCURRENCY ?? 2),
    });
    worker.on('failed', (job, err) => {
      console.error(`[jobs:${label}] failed job=${job?.id}`, err.message);
    });
    console.log(`[jobs] worker listening on ${name}`);
    return worker;
  });
}
