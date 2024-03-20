import crypto from 'crypto';

export const genSalt = async (): Promise<string> => {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(16, (err, buffer) => {
      if (err) {
        reject(err);
      } else {
        resolve(buffer.toString('hex'));
      }
    });
  });
};

export const hashPassword = async (
  password: string,
  salt: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(password, salt, 10000, 64, 'sha512', (err, derivedKey) => {
      if (err) {
        reject(err);
      } else {
        resolve(derivedKey.toString('hex'));
      }
    });
  });
};

export const comparePassword = async (
  password: string,
  hashedPassword: string,
  salt: string
): Promise<boolean> => {
  const hashedInputPassword = await hashPassword(password, salt);
  return hashedInputPassword === hashedPassword;
};
