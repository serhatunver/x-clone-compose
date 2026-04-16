import { ERROR_KEYS, HTTP_STATUS, type ErrorKey } from '@repo/shared';

/**
 * Base Error Handler class that extends the built-in Error
 */
export class ErrorHandler extends Error {
  public readonly errorCode: ErrorKey;
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly data?: Record<string, unknown>;

  constructor(errorCode: ErrorKey, statusCode: number, data?: Record<string, unknown>) {
    super(errorCode);
    this.name = this.constructor.name;
    this.errorCode = errorCode;
    this.statusCode = statusCode;
    this.isOperational = true; // Marks the error as a known/handled error
    this.data = data;

    // Maintains proper stack trace for where the error was thrown
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * 400 - Bad Request
 */
export class BadRequestError extends ErrorHandler {
  constructor(errorCode: ErrorKey, data?: Record<string, unknown>) {
    super(errorCode, HTTP_STATUS.BAD_REQUEST, data);
  }
}

/**
 * 401 - Unauthorized
 */
export class UnauthorizedError extends ErrorHandler {
  constructor(errorCode: ErrorKey = ERROR_KEYS.AUTH.UNAUTHORIZED, data?: Record<string, unknown>) {
    super(errorCode, HTTP_STATUS.UNAUTHORIZED, data);
  }
}

/**
 * 403 - Forbidden
 */
export class ForbiddenError extends ErrorHandler {
  constructor(errorCode: ErrorKey = ERROR_KEYS.AUTH.FORBIDDEN, data?: Record<string, unknown>) {
    super(errorCode, HTTP_STATUS.FORBIDDEN, data);
  }
}

/**
 * 404 - Not Found
 */
export class NotFoundError extends ErrorHandler {
  constructor(errorCode: ErrorKey, data?: Record<string, unknown>) {
    super(errorCode, HTTP_STATUS.NOT_FOUND, data);
  }
}

/**
 * 409 - Conflict (e.g. Email already exists)
 */
export class ConflictError extends ErrorHandler {
  constructor(errorCode: ErrorKey, data?: Record<string, unknown>) {
    super(errorCode, HTTP_STATUS.CONFLICT, data);
  }
}

/**
 * 422 - Validation Error (Zod results)
 */
export class ValidationError extends ErrorHandler {
  constructor(errorCode: ErrorKey, data?: Record<string, unknown>) {
    super(errorCode, HTTP_STATUS.UNPROCESSABLE_ENTITY, data);
  }
}

/**
 * 500 - Internal Server Error
 */
export class InternalServerError extends ErrorHandler {
  constructor(
    errorCode: ErrorKey = ERROR_KEYS.SYSTEM.INTERNAL_SERVER_ERROR,
    data?: Record<string, unknown>,
  ) {
    super(errorCode, HTTP_STATUS.INTERNAL_SERVER_ERROR, data);
  }
}
