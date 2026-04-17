import type { Request } from 'express';
import { z, ZodType } from 'zod';

/**
 * Extends Express Request to include validated data from Zod schemas
 */
export type ValidatedRequest<T extends ZodType> = Omit<Request, 'validated'> & {
  validated: z.infer<T>;
};
