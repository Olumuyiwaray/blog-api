import dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });

import { Worker, Job } from 'bullmq';
import { sendEmail } from '../utils/email';
import redis from './redis';

const emailWorker = new Worker(
  'email',
  async (job: Job) => {
    console.log(
      `Processing job with id ${job.id} and name ${JSON.stringify(job.name)}`
    );
    await sendEmail(job.data);
  },
  {
    connection: redis,
  }
);

emailWorker.on('completed', (job) => {
  console.log(`Job ${job.id} has been completed`);
});

emailWorker.on('failed', (job, err) => {
  console.log(
    `Job ${job ? job.id : undefined} failed with error: ${err.message}`
  );
});
