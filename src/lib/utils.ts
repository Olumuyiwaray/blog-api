import crypto from 'crypto';

export const getEnvVariable = (key: string) => {
  if (typeof process.env[key] === undefined) {
    throw new Error(`Environment variable ${key} is not set.`);
  }

  return process.env[key] as string;
};

export const generateToken = () => {
  return crypto
    .randomBytes(Math.ceil(20 / 2))
    .toString('hex')
    .slice(0, 20);
};

export const constructEmail = (
  message: string,
  verificationLink: string,
  label: string
) => {
  return `<h3>${message}</h3>
    <a style="background-color: blue;
     text-align: center; color: white;
      text-decoration: none; padding:
       5px; border: none; border-radius: 3px;"
        href=${verificationLink}>
         ${label}
         </a>`;
};
