import { z } from 'zod';
import { Types } from 'mongoose';

export const followParamsSchema = z.object({
  params: z.object({
    id: z.string().refine((val) => Types.ObjectId.isValid(val), {
      message: 'Invalid User ID format',
    }),
  }),
});

export type FollowParams = z.infer<typeof followParamsSchema>['params'];
