import express from 'express';
import { Express } from 'express';
import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user: {
        userId: string;
        username: string;
      };
      file?: Express.Multer.File & Express.MulterS3.File
    }
  }
}