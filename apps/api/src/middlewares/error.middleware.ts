import { config } from '#/config/config.js';
import { ErrorHandler, NotFoundError } from '#/lib/utils/error.handler.js';
import { ERROR_KEYS, HTTP_STATUS, type ErrorKey } from '@repo/shared';
import type { Request, Response, NextFunction, ErrorRequestHandler } from 'express';

/**
 * Global Error Handler Middleware
 */
export const globalErrorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  // Default values for unknown errors
  let statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR;
  let errorCode: ErrorKey = ERROR_KEYS.SYSTEM.INTERNAL_SERVER_ERROR;
  let data: Record<string, unknown> | undefined = undefined;
  let errorMessage = 'Unknown Error';
  const stack = err instanceof Error ? err.stack : undefined;

  // If it's one of our custom ErrorHandler classes
  if (err instanceof ErrorHandler) {
    statusCode = err.statusCode;
    errorCode = err.errorCode;
    data = err.data;
    errorMessage = err.message;
  } else if (err instanceof Error) {
    errorMessage = err.message;
  }

  req.log.error({
    code: errorCode,
    path: req.originalUrl,
    method: req.method,
    statusCode,
    data,
    stack,
  });

  // Response for the client
  res.status(statusCode).json({
    success: false,
    error: {
      code: errorCode,
      ...(data && { data }),
      ...(config.app.isDevelopment && {
        message: errorMessage,
        stack,
      }),
    },
  });
};

/**
 * 404 Not Found Handler
 */
export const notFoundHandler = (req: Request, _res: Response, next: NextFunction) => {
  const error = new NotFoundError(ERROR_KEYS.SYSTEM.NOT_FOUND, {
    path: req.originalUrl,
    method: req.method,
  });
  next(error);
};
