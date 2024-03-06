import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const scryptAsync = promisify(scrypt);

/**
 * Function to hash any plain string
 * @param text Plain string to convert into a hash
 * @returns Hashed version of the string
 */
export async function hashText(text: string) {
  const salt = randomBytes(10).toString('hex');
  const buf = (await scryptAsync(text, salt, 64)) as Buffer;

  return `${buf.toString('hex')}.${salt}`;
}

/**
 * Function to check if a plain string is equal to a hashed string
 * @param storedHash The hashed version of a string
 * @param supplied Plain string to compare against the hash
 * @returns Whether or not both strings match
 */
export async function compareHash(storedHash: string, supplied: string) {
  const [hashedText, salt] = storedHash.split('.');
  if (!hashedText || !salt) return false;

  const buf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  const keyBuffer = Buffer.from(hashedText, 'hex');
  const match = timingSafeEqual(buf, keyBuffer);

  return match;
}
