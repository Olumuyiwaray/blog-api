import { S3Client } from '@aws-sdk/client-s3';
import { enviromentConfig } from './envConfig';



export const s3 = new S3Client({
    region: 'eu-north-1',
    credentials: {
        accessKeyId: enviromentConfig.awsAccessKey,
        secretAccessKey: enviromentConfig.awsSecretKey
    },
});
