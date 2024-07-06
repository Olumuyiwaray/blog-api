import session, { SessionOptions } from 'express-session';
import mongoStore from './connect-mongo';
import { enviromentConfig } from './envConfig';

const sessionOptions: SessionOptions = {
  secret: enviromentConfig.sessionSecret,
  resave: false,
  saveUninitialized: true,
  store: mongoStore,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24,
  },
};

export default sessionOptions;
