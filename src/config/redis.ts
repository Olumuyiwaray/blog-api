import { Redis, RedisOptions } from 'ioredis';

const redisOptions: RedisOptions = {
  host: 'localhost',
  port: 6379,
  maxRetriesPerRequest: null,
};

const redis = new Redis(redisOptions);

export default redis;
