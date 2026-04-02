import { config } from '#/config/config.js';
import { ErrorHandler, NotFoundError } from '#/lib/utils/error.handler.js';
import type { Request, Response, NextFunction, ErrorRequestHandler } from 'express';

/**
 * Global Error Handler Middleware
 */
export const globalErrorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  // Default values for unknown errors
  let statusCode = 500;
  let message = 'Internal Server Error';
  let data: Record<string, unknown> | undefined = undefined;
  const stack = err instanceof Error ? err.stack : undefined;

  // If it's one of our custom ErrorHandler classes
  if (err instanceof ErrorHandler) {
    statusCode = err.statusCode;
    message = err.message;
    data = err.data; // (Zod details)
  } else if (err instanceof Error) {
    message = err.message;
  }

  req.log.error({
    msg: message,
    stack: stack,
    path: req.originalUrl,
    method: req.method,
    statusCode,
    data, // Include extra details in logs
  });

  // Response for the client
  res.status(statusCode).json({
    status: `${statusCode}`.startsWith('4') ? 'fail' : 'error',
    message,
    ...(data && { data }), // Send Zod details etc. if they exist
    ...(config.app.isDevelopment && { stack }), // Only send stack trace in dev
  });
};

/**
 * 404 Not Found Handler
 */
export const notFoundHandler = (req: Request, _res: Response, next: NextFunction) => {
  const error = new NotFoundError(`Can't find ${req.originalUrl} on this server!`);
  next(error);
};
