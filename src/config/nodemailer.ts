import nodemailer from 'nodemailer';
import { enviromentConfig } from './envConfig';

const transporter = nodemailer.createTransport({
  host: enviromentConfig.nodemailerHost,
  port: enviromentConfig.nodemailerPort,
  service: enviromentConfig.nodemailerService,
  secure: true,
  auth: {
    user: enviromentConfig.nodemailerEmail,
    pass: enviromentConfig.nodemailerPassword,
  },
});

export default transporter;
