import { Worker, Job } from 'bullmq';
import { redisOptions } from './queue';
import { sendEmail } from '../utils/email';


const emailWorker = new Worker(
  'email',
  async (job: Job) => {
    console.log(
      `Processing job with id ${job.id} and data ${JSON.stringify(job.data)}`
    );
    await sendEmail(job.data);
  },
  {
    connection: redisOptions,
  }
);
