import { startWorkers } from './workers.js';
import { closeJobs } from './connection.js';

async function main() {
  const workers = startWorkers();
  if (workers.length === 0) {
    process.exitCode = 1;
    return;
  }

  const shutdown = async () => {
    console.log('[jobs] shutting down workers…');
    await Promise.all(workers.map((w) => w.close()));
    await closeJobs();
    process.exit(0);
  };

  process.on('SIGINT', () => void shutdown());
  process.on('SIGTERM', () => void shutdown());
}

void main();
