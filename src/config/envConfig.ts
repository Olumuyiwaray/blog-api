import { getEnvVariable } from '../lib/utils';

const enviromentConfig = {
  port: parseInt(getEnvVariable('PORT'), 10) || 3000,
  jwtSecret: getEnvVariable('JWT_SECRET'),
  mongoUri: getEnvVariable('MONGO_URI_DEV'),
  sessionSecret: getEnvVariable('SESSION_SECRET'),
  awsAccessKey: getEnvVariable('AWS_ACCESS_KEY'),
  awsSecretKey: getEnvVariable('AWS_SECRET_KEY'),
  awsBucket: getEnvVariable('AWS_BUCKET'),
  nodemailerEmail: getEnvVariable('NODE_MAILER_EMAIL'),
  nodemailerPassword: getEnvVariable('NODE_MAILER_PASSWORD'),
  nodemailerHost: getEnvVariable('NODE_MAILER_HOST'),
  nodemailerPort: parseInt(getEnvVariable('NODE_MAILER_PORT'), 10),
  nodemailerService: getEnvVariable('NODE_MAILER_SERVICE'),
  redisUrl: getEnvVariable('REDIS_URL'),
};

if (process.env.NODE_ENV === 'production') {
  enviromentConfig.mongoUri = getEnvVariable('MONGO_URI_PRODUCTION');
}

export default enviromentConfig;
