import { hashPassword, comparePassword, genSalt } from '../../../utils/password';

describe('hash password', () => {
  it('should resolve with a string of length 128 when password and salt are provided', async () => {
    const password = 'password123';
    const salt = 'salt123';
    const hashedPassword = await hashPassword(password, salt);
    expect(hashedPassword.length).toBe(128);
  });

  it('should resolve with a different string when the password changes', async () => {
    const password1 = 'password123';
    const password2 = 'password456';
    const salt = 'salt123';
    const hashedPassword1 = await hashPassword(password1, salt);
    const hashedPassword2 = await hashPassword(password2, salt);
    expect(hashedPassword1).not.toBe(hashedPassword2);
  });

  it('should resolve with a different string when the salt changes', async () => {
    const password = 'password123';
    const salt1 = 'salt123';
    const salt2 = 'salt456';
    const hashedPassword1 = await hashPassword(password, salt1);
    const hashedPassword2 = await hashPassword(password, salt2);
    expect(hashedPassword1).not.toBe(hashedPassword2);
  });

  it('should reject with an error when password is an empty string', async () => {
    const password = '';
    const salt = 'salt123';
    await expect(hashPassword(password, salt)).rejects.toThrow();
  });

  it('should reject with an error when salt is an empty string', async () => {
    const password = 'password123';
    const salt = '';
    await expect(hashPassword(password, salt)).rejects.toThrow();
  });
});

describe('Compare password', () => {
  it('should return true when the input password matches the hashed password', async () => {
    const password = 'password123';
    const salt = 'salt123';
    const hashedPassword = await hashPassword(password, salt);

    const result = await comparePassword(password, hashedPassword, salt);

    expect(result).toBe(true);
  });

  it('should return false when the input password does not match the hashed password', async () => {
    const password = 'password123';
    const salt = 'salt123';
    const hashedPassword = await hashPassword(password, salt);

    const result = await comparePassword('wrongpassword', hashedPassword, salt);

    expect(result).toBe(false);
  });

  it('should throw an error when the input password is empty', async () => {
    const password = '';
    const salt = 'salt123';
    const hashedPassword = await hashPassword('password123', salt);

    await expect(comparePassword(password, hashedPassword, salt)).rejects.toThrow('Password and salt must not be empty.');
  });

  it('should throw an error when the hashed password is empty', async () => {
    const password = 'password123';
    const salt = 'salt123';
    const hashedPassword = await hashPassword(password, salt);

    await expect(comparePassword(password, '', salt)).rejects.toThrow('Hashed password must not be empty.');
  });

  it('should throw an error when the salt is empty', async () => {
    const password = 'password123';
    const salt = '';
    const hashedPassword = await hashPassword(password, 'salt123');

    await expect(comparePassword(password, hashedPassword, salt)).rejects.toThrow('Password and salt must not be empty.');
  });
});

describe('generate salt function', () => {
  it('should return a string of length 32', async () => {
    const salt = await genSalt();
    expect(salt.length).toBe(32);
  });

  it('should return different strings on subsequent calls', async () => {
    const salt1 = await genSalt();
    const salt2 = await genSalt();
    expect(salt1).not.toBe(salt2);
  });

})