import dotenv from 'dotenv';
dotenv.config();

// Import libraries
import express, { Application, Request, Response, NextFunction } from 'express';
import session from 'express-session';
import methodOveride from 'method-override';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';

import dbConnect from './config/database';

const app = express();
const port = process.env.PORT || 3000;

// Import in app config middlewares
import limiter from './config/limiter';
import sessionOptions from './config/express-session';
import routes from './routes/routes';
import {
  requestLoggerMiddleware,
  responseLogger,
} from './middlewares/loggerMiddleware';
import errorMiddleWare from './middlewares/errorMiddleware';

// Connect database
dbConnect()
  .then(() => {
    app.listen(port, () => {
      // Only start listening to requests after database connection has been establised
      console.log(`Database connected and listening on port ${port}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });

// Configure third party middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOveride('_method'));
app.use(limiter);
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(cookieParser());

// Configure express session
app.use(session(sessionOptions));

app.use(requestLoggerMiddleware);
app.use(responseLogger);

app.use(routes);

// handle 404 Not found Requests
app.use((req: Request, res: Response, next: NextFunction) => {
  const err = new Error('Not Found');
  res.status(404).json({ message: 'Not Found' });
});

app.use(errorMiddleWare);

/*app.listen(port, () => {
  console.log(`listening for requests`);
})*/