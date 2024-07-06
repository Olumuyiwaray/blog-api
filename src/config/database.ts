import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { enviromentConfig } from './envConfig';

const dbConnect = async () => {
  try {
    const mongoUri = enviromentConfig.mongoUri;
    mongoose.connect(mongoUri);
  } catch (error) {
    console.log(error);
  }
};

export default dbConnect;
