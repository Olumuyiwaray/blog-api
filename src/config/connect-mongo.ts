import MongoStore from 'connect-mongo';

const mongoStore = MongoStore.create({
  mongoUrl: process.env.MONGO_URI,
  ttl: 1 * 24 * 60 * 60,
  autoRemove: 'native',
});

export default mongoStore;
