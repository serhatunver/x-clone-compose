import { config } from '#/config/config.js';
import { AppError } from '#/lib/utils/AppError.js';
import type { Request, Response, NextFunction, ErrorRequestHandler } from 'express';

export const globalErrorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  let statusCode = 500;
  let status = 'error';
  let message = 'Internal Server Error';
  let stack = undefined;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    status = err.status;
    message = err.message;
    stack = err.stack;
  } else if (err instanceof Error) {
    message = err.message;
    stack = err.stack;
  }

  req.log.error({
    msg: message,
    stack: stack,
    path: req.originalUrl,
    method: req.method,
    statusCode,
  });

  res.status(statusCode).json({
    status,
    message,
    ...(config.app.isDevelopment && { stack }),
  });
};

// 404 Not Found Handler
export const notFoundHandler = (req: Request, _res: Response, next: NextFunction) => {
  const error = new AppError(`Can't find ${req.originalUrl} on this server!`, 404);
  next(error);
};
