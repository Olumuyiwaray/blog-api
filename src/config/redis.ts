import { Redis, RedisOptions } from 'ioredis';
import enviromentConfig from './envConfig';

const redis =
  process.env.NODE_ENV !== 'development'
    ? new Redis(enviromentConfig.redisUrl) // Use connection URL directly
    : new Redis({
        host: 'localhost', // Fallback host
        port: 6379, // Fallback port
        maxRetriesPerRequest: null,
      });

export default redis;
