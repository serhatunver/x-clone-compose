import { z } from 'zod';

const RESERVED_USERNAMES = new Set([
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

const UPPERCASE_REGEX = /[A-Z]/;
const LOWERCASE_REGEX = /[a-z]/;
const NUMBER_REGEX = /[0-9]/;
const SPECIAL_CHAR_REGEX = /[^A-Za-z0-9]/;
const CONSECUTIVE_CHARS_REGEX = /(.)\1{3,}/;

const passwordSchema = z
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
    },
  );
// .regex(/[A-Z]/, 'Password must contain at least one uppercase letter.')
// .regex(/[a-z]/, 'Password must contain at least one lowercase letter.')
// .regex(/[0-9]/, 'Password must contain at least one number.')
// .regex(/[^A-Za-z0-9]/, 'At least one special character (.,!,?,*) is required.')
// .refine((val) => {
//   return !/(.)\1{3,}/.test(val);
// }, 'Password contains too many consecutive characters.'),

export const registerSchema = z.object({
  body: z.object({
    username: z
      .string({ error: 'Username is required' })
      .trim()
      .min(4, 'Username must be at least 4 characters long.')
      .max(15, 'Username can be at most 15 characters long.')
      // .regex(/^[a-z0-9_]+$/, 'Username can only contain lowercase letters, numbers and underscores.')
      // .regex(/^[a-z_]/, 'Username must start with a letter or underscore.')
      //merged regex to allow dots and hyphens but not at the start or end, and not consecutive
      .regex(
        /^[a-z_][a-z0-9_]*$/,
        'Username must start with a letter or underscore and can only contain lowercase letters, numbers, and underscores.',
      )
      .refine((val) => !RESERVED_USERNAMES.has(val.toLowerCase()), {
        message: 'This username is reserved and cannot be used.',
      }),

    email: z
      .email('Invalid email address')
      .trim()
      .toLowerCase()
      .max(255, 'Email can be at most 255 characters long.'),

    password: passwordSchema,
  }),
});

export const loginSchema = z.object({
  body: z
    .object({
      identifier: z.string().trim().min(1, 'Username or email is required').max(255),
      password: z.string().min(1, 'Password is required').max(64),
    })
    .refine(
      (data) => {
        const isEmail = data.identifier.includes('@');
        if (isEmail) {
          return z.email().safeParse(data.identifier).success;
        }
        return data.identifier.length <= 15;
      },
      {
        message: 'Please enter a valid username or email address.',
        path: ['identifier'],
      },
    ),
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.email('Invalid email address').trim().toLowerCase(),
  }),
});

export const resetPasswordSchema = z.object({
  params: z.object({
    token: z.string().min(1, 'Token is required'),
  }),
  body: z
    .object({
      password: passwordSchema,
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ['confirmPassword'],
    }),
});

export type RegisterInput = z.infer<typeof registerSchema>['body'];
export type LoginInput = z.infer<typeof loginSchema>['body'];
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>['body'];
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>['body'];
