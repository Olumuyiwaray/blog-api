import MongoStore from 'connect-mongo';
import enviromentConfig from './envConfig';
import mongoose from 'mongoose';

console.log(enviromentConfig.mongoUri);
const mongoStore = MongoStore.create({
  mongoUrl: enviromentConfig.mongoUri,
  ttl: 1 * 24 * 60 * 60,
  autoRemove: 'native',
});

export default mongoStore;
