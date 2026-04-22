import { config } from '#/config/config.js';
import { ErrorHandler, NotFoundError } from '#/lib/errors/index.js';
import { RESPONSE_KEYS, HTTP_STATUS, type ErrorKey } from '@repo/shared';
import type { Request, Response, NextFunction, ErrorRequestHandler } from 'express';

/**
 * Global Error Handler Middleware
 */
export const globalErrorHandler: ErrorRequestHandler = (
  err,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  // Default values for unknown errors
  let statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR;
  let messageKey: ErrorKey = RESPONSE_KEYS.ERROR.SYSTEM.INTERNAL_SERVER_ERROR;
  let meta: Record<string, unknown> | undefined = undefined;
  const errorName = err instanceof Error ? err.name : 'UnknownError';
  const stack = err instanceof Error ? err.stack : undefined;

  // If it's one of our custom ErrorHandler classes
  if (err instanceof ErrorHandler) {
    statusCode = err.statusCode;
    messageKey = err.messageKey;
    meta = err.meta;
  }

  req.log.error({
    key: messageKey,
    path: req.originalUrl,
    method: req.method,
    statusCode,
    meta,
    stack,
  });

  // Response for the client
  res.status(statusCode).json({
    success: false,
    messageKey,
    error: {
      code: errorName,
      meta,
      ...(config.app.isDevelopment && { stack }),
    },
  });
};

/**
 * 404 Not Found Handler
 */
export const notFoundHandler = (req: Request, _res: Response, next: NextFunction) => {
  const error = new NotFoundError(RESPONSE_KEYS.ERROR.SYSTEM.NOT_FOUND, {
    path: req.originalUrl,
    method: req.method,
  });
  next(error);
};
