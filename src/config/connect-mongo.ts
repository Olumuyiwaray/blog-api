import MongoStore from 'connect-mongo';
import { enviromentConfig } from './envConfig';

const mongoStore = MongoStore.create({
  mongoUrl: enviromentConfig.mongoUri,
  ttl: 1 * 24 * 60 * 60,
  autoRemove: 'native',
});

export default mongoStore;
