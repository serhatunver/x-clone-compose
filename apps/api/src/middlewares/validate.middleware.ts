import type { Request, Response, NextFunction } from 'express';
import { type ZodType, ZodError } from 'zod';
import { ValidationError } from '#/lib/errors/index.js';
import { RESPONSE_KEYS } from '@repo/shared';

export const validate =
  (schema: ZodType) => async (req: Request, _res: Response, next: NextFunction) => {
    try {
      req.validated = await schema.parseAsync({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        body: req.body,
        query: req.query,
        params: req.params,
      });

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const details = error.issues.map((issue) => {
          const field = issue.path.length > 1 ? issue.path.slice(1).join('.') : issue.path[0];

          const messageKey = issue.message.includes('.')
            ? issue.message
            : `error.validation.${issue.code}`;

          const { code: _code, path: _path, message: _message, ...rest } = issue;

          return {
            field,
            messageKey,
            ...rest,
          };
        });

        return next(
          new ValidationError(RESPONSE_KEYS.ERROR.VALIDATION.INVALID_FORMAT, {
            details,
          }),
        );
      }
      next(error);
    }
  };
