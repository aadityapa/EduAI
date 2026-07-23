import { describe, expect, it } from 'vitest';
import { QUEUE_NAMES } from './queues.js';
import { isJobsEnabled } from './connection.js';

describe('@eduai/jobs', () => {
  it('exports stable queue names', () => {
    expect(QUEUE_NAMES.qpg).toBe('eduai-qpg');
    expect(QUEUE_NAMES.email).toBe('eduai-email');
  });

  it('reports disabled when no redis url', () => {
    const prev = process.env.REDIS_URL;
    delete process.env.REDIS_URL;
    delete process.env.JOBS_REDIS_URL;
    expect(isJobsEnabled()).toBe(false);
    if (prev !== undefined) process.env.REDIS_URL = prev;
  });
});
