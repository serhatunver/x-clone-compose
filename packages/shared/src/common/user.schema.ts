import { z } from 'zod';

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
  .string({ error: 'Username is required' })
  .trim()
  .min(4, 'Username must be at least 4 characters long.')
  .max(15, 'Username can be at most 15 characters long.')
  // .regex(/^[a-z0-9_]+$/, 'Username can only contain lowercase letters, numbers and underscores.')
  // .regex(/^[a-z_]/, 'Username must start with a letter or underscore.')
  //merged regex to allow dots and hyphens but not at the start or end, and not consecutive
  .regex(
    /^[a-z_][a-z0-9_]*$/,
    'Username must start with a letter or underscore and can only contain lowercase letters, numbers, and underscores.'
  )
  .refine((val) => !RESERVED_USERNAMES.has(val.toLowerCase()), {
    message: 'This username is reserved and cannot be used.',
  });

export const emailSchema = z
  .email('Invalid email address')
  .trim()
  .toLowerCase()
  .max(255, 'Email can be at most 255 characters long.');

export const displayNameSchema = z
  .string()
  .min(1, 'Display name cannot be empty.')
  .max(30, 'Display name can be at most 30 characters long.')
  .trim()
  .regex(
    /^[a-zA-Z0-9 ]+$/,
    'Display name can only contain letters, numbers, and spaces.'
  )
  .transform((val) => val.replace(/\s+/g, ' '));
