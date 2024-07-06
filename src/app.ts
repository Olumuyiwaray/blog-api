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
import { enviromentConfig } from './config/envConfig';
import dbConnect from './config/database';

// Import in app config middlewares
import limiter from './config/limiter';
import sessionOptions from './config/express-session';
import routes from './routes/routes';
import errorMiddleWare from './middlewares/errorMiddleware';
import loggerMiddleware from './middlewares/loggerMiddleware';


const app = express();
const port = enviromentConfig.port;

// Connect database
dbConnect()
  .then(() => {
    console.log('db connected');
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
app.use(cookieParser());
app.use(compression());

// Configure express session
app.use(session(sessionOptions));

app.use(loggerMiddleware);

app.use(routes);

// handle 404 Not found Requests
app.use((req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`path ${req.originalUrl} not found`);
  res.status(404).json({ message: err.message });
});

app.use(errorMiddleWare);

app.listen(port, () => {
  console.log(`Database connected and listening on port ${port}`);
});

export default app;
