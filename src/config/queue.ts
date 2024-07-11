import { Queue } from 'bullmq';
import redis from './redis';

const emailQueue = new Queue('email', {
  connection: redis,
});

const addJobToQueue = (emailData: {
  to: string;
  subject: string;
  body: string;
}) => {
  emailQueue.add('sendEmail', emailData, {
    attempts: 3, // Retry 3 times if the job fails
    backoff: {
      type: 'fixed',
      delay: 5000, // Wait 5 seconds before retrying
    },
  });
};

export default addJobToQueue;
