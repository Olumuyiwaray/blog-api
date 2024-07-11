import logger from './logger';
import redis from './redis';

export const setCache = async (key: string, value: any, ttl: number) => {
  try {
    const data = JSON.stringify(value);
    await redis.set(key, data, 'EX', ttl);
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`error setting cache: ${error}`);
    } else {
      logger.error(`error setting cache: ${error}`);
    }
  }
};

export const getCache = async (key: string) => {
  try {
    const data = await redis.get(key);
    if (!data) {
      return null;
    }
    return JSON.parse(data);
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`error getting cache: ${error}`);
    } else {
      logger.error(`error getting cache: ${error}`);
    }
  }
};

