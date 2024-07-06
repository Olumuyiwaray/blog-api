import { Queue } from 'bullmq';
import { RedisOptions } from 'ioredis';

const redisOptions: RedisOptions = {
  host: '127.0.0.1',
  port: 6379,
};

const emailQueue = new Queue('email', {
  connection: redisOptions,
});

export { emailQueue, redisOptions };
