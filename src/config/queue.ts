import { Queue } from 'bullmq';
import { RedisOptions } from 'ioredis';

const redisOptions: RedisOptions = {
  host: 'localhost',
  port: 6379,
};

const emailQueue = new Queue('email', {
  connection: redisOptions,
});

export { emailQueue, redisOptions };
