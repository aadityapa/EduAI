import IORedis from 'ioredis';
import { Queue, type ConnectionOptions } from 'bullmq';
import { QUEUE_NAMES, type QueueName } from './queues.js';

let connection: IORedis | null = null;

export function getJobsRedisUrl(): string | undefined {
  return process.env.REDIS_URL || process.env.JOBS_REDIS_URL;
}

export function createJobsConnection(): IORedis | null {
  const url = getJobsRedisUrl();
  if (!url) return null;
  if (connection) return connection;
  connection = new IORedis(url, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
  });
  return connection;
}

export function getBullConnectionOptions(): ConnectionOptions | null {
  const conn = createJobsConnection();
  if (!conn) return null;
  return conn as unknown as ConnectionOptions;
}

const queues = new Map<QueueName, Queue>();

export function getQueue(name: QueueName): Queue | null {
  const opts = getBullConnectionOptions();
  if (!opts) return null;
  let q = queues.get(name);
  if (!q) {
    q = new Queue(name, { connection: opts });
    queues.set(name, q);
  }
  return q;
}

export function isJobsEnabled(): boolean {
  return Boolean(getJobsRedisUrl()) && process.env.JOBS_ENABLED !== 'false';
}

export async function closeJobs(): Promise<void> {
  await Promise.all([...queues.values()].map((q) => q.close()));
  queues.clear();
  if (connection) {
    await connection.quit();
    connection = null;
  }
}

export { QUEUE_NAMES };
