import type { Request, Response, NextFunction } from 'express';
import { type ZodType, ZodError } from 'zod';
import { AppError } from '#/lib/utils/AppError.js';

export const validate =
  (schema: ZodType) => async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const parsed = await schema.parseAsync({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        body: req.body,
        query: req.query,
        params: req.params,
      });

      Object.assign(req, parsed);

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const message = error.issues
          .map((i) => `${i.path.slice(1).join('.')}: ${i.message}`)
          .join(', ');
        return next(new AppError(message, 400));
      }
      next(error);
    }
  };
