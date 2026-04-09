import { z } from 'zod';
import { Types } from 'mongoose';

export const getPostSchema = z.object({
  params: z.object({
    postId: z
      .string({ error: 'Post ID is required' })
      .refine((value) => Types.ObjectId.isValid(value), {
        message: 'Invalid Post ID',
      }),
  }),
});

export type GetPostInput = z.infer<typeof getPostSchema>['params'];

export const createPostSchema = z.object({
  body: z.object({
    content: z
      .string({ error: 'Content is required' })
      .min(1, { error: 'Content cannot be empty' }),
  }),
});

export type CreatePostInput = z.infer<typeof createPostSchema>['body'];

export const updatePostSchema = z.object({
  params: z.object({
    postId: z.string({ error: 'Post ID is required' }),
  }),
  body: z.object({
    content: z
      .string({ error: 'Content is required' })
      .min(1, { error: 'Content cannot be empty' }),
  }),
});

export interface UpdatePostInput {
  params: z.infer<typeof updatePostSchema>['params'];
  body: z.infer<typeof updatePostSchema>['body'];
}

export const likeUnlikePostSchema = z.object({
  params: z.object({
    postId: z.string({ error: 'Post ID is required' }),
  }),
});

export type LikeUnlikePostInput = z.infer<typeof likeUnlikePostSchema>['params'];
