import { z } from 'zod';

const UPPERCASE_REGEX = /[A-Z]/;
const LOWERCASE_REGEX = /[a-z]/;
const NUMBER_REGEX = /[0-9]/;
const SPECIAL_CHAR_REGEX = /[^A-Za-z0-9]/;
const CONSECUTIVE_CHARS_REGEX = /(.)\1{3,}/;

export const passwordSchema = z
  .string({ error: 'Password is required' })
  .min(10, 'Password must be at least 10 characters long.')
  .max(64, 'Password can be at most 64 characters long.')
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
      message:
        'Password must contain at least one uppercase letter, lowercase letter, number, and special character; and must not contain too many consecutive characters.',
    }
  );
// .regex(/[A-Z]/, 'Password must contain at least one uppercase letter.')
// .regex(/[a-z]/, 'Password must contain at least one lowercase letter.')
// .regex(/[0-9]/, 'Password must contain at least one number.')
// .regex(/[^A-Za-z0-9]/, 'At least one special character (.,!,?,*) is required.')
// .refine((val) => {
//   return !/(.)\1{3,}/.test(val);
// }, 'Password contains too many consecutive characters.'),
