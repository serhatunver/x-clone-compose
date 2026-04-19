import { z } from 'zod';
import { RESPONSE_KEYS } from '@repo/shared';

const V = RESPONSE_KEYS.ERROR.VALIDATION;

const UPPERCASE_REGEX = /[A-Z]/;
const LOWERCASE_REGEX = /[a-z]/;
const NUMBER_REGEX = /[0-9]/;
const SPECIAL_CHAR_REGEX = /[^A-Za-z0-9]/;
const CONSECUTIVE_CHARS_REGEX = /(.)\1{3,}/;

export const passwordSchema = z
  .string({ error: V.REQUIRED })
  .min(10, V.TOO_SHORT)
  .max(64, V.TOO_LONG)
  .refine(
    (val) => {
      const hasUpper = UPPERCASE_REGEX.test(val);
      const hasLower = LOWERCASE_REGEX.test(val);
      const hasNumber = NUMBER_REGEX.test(val);
      const hasSpecial = SPECIAL_CHAR_REGEX.test(val);
      const noRepeat = !CONSECUTIVE_CHARS_REGEX.test(val);

      return hasUpper && hasLower && hasNumber && hasSpecial && noRepeat;
    },
    {
      error: V.INVALID_PASSWORD_FORMAT,
      path: ['password'],
    }
  );
// .regex(/[A-Z]/, 'Password must contain at least one uppercase letter.')
// .regex(/[a-z]/, 'Password must contain at least one lowercase letter.')
// .regex(/[0-9]/, 'Password must contain at least one number.')
// .regex(/[^A-Za-z0-9]/, 'At least one special character (.,!,?,*) is required.')
// .refine((val) => {
//   return !/(.)\1{3,}/.test(val);
// }, 'Password contains too many consecutive characters.'),

export const RESERVED_USERNAMES = new Set([
  'admin',
  'root',
  'support',
  'help',
  'api',
  'test',
  'static',
  'dev',
  'account',
  'settings',
  'profile',
  'sys',
  'moderator',
]);

export const usernameSchema = z
  .string({ error: V.REQUIRED })
  .trim()
  .min(4, V.TOO_SHORT)
  .max(15, V.TOO_LONG)
  // .regex(/^[a-z0-9_]+$/, 'Username can only contain lowercase letters, numbers and underscores.')
  // .regex(/^[a-z_]/, 'Username must start with a letter or underscore.')
  //merged regex to allow dots and hyphens but not at the start or end, and not consecutive
  .regex(/^[a-z_][a-z0-9_]*$/, V.INVALID_USERNAME_FORMAT)
  .refine((val) => !RESERVED_USERNAMES.has(val.toLowerCase()), {
    error: V.USERNAME_RESERVED,
    path: ['username'],
  });

export const emailSchema = z
  .email({ error: V.INVALID_EMAIL })
  .trim()
  .toLowerCase()
  .max(255, V.TOO_LONG);

export const displayNameSchema = z
  .string()
  .min(1, V.REQUIRED)
  .max(30, V.TOO_LONG)
  .trim()
  .regex(/^[a-zA-Z0-9 ]+$/, V.INVALID_DISPLAY_NAME_FORMAT)
  .transform((val) => val.replace(/\s+/g, ' '));
