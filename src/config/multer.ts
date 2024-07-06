import multer from 'multer';
import multerS3 from 'multer-s3';
import { s3 } from './aws';
import { enviromentConfig } from './envConfig';

const storage = multerS3({
  s3: s3,
  bucket: enviromentConfig.awsBucket,
  contentType: multerS3.AUTO_CONTENT_TYPE,
  metadata(req, file, callback) {
    callback(null, { fieldName: file.fieldname });
  },
  key(req, file, callback) {
    const folder =
      file.fieldname === 'profile_image' ? 'profile_images' : 'blog_images';
    const filename = `${file.originalname}_${Date.now()}`;
    callback(null, `${folder}/${filename}`);
  },
});

const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5, // 5 MB file size limit
  },
  fileFilter: fileFilter,
});

export default upload;
