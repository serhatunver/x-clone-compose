import { RESPONSE_KEYS, HTTP_STATUS, type ErrorKey } from '@repo/shared';

/**
 * Base Error Handler class that extends the built-in Error
 */
export class ErrorHandler extends Error {
  public readonly messageKey: ErrorKey;
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly meta?: Record<string, unknown>;

  constructor(messageKey: ErrorKey, statusCode: number, meta?: Record<string, unknown>) {
    super(messageKey);
    this.name = this.constructor.name || 'Error';
    this.messageKey = messageKey;
    this.statusCode = statusCode;
    this.isOperational = true; // Marks the error as a known/handled error
    this.meta = meta;

    // Maintains proper stack trace for where the error was thrown
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * 400 - Bad Request
 */
export class BadRequestError extends ErrorHandler {
  constructor(
    messageKey: ErrorKey = RESPONSE_KEYS.ERROR.SYSTEM.BAD_REQUEST,
    meta?: Record<string, unknown>,
  ) {
    super(messageKey, HTTP_STATUS.BAD_REQUEST, meta);
  }
}

/**
 * 401 - Unauthorized
 */
export class UnauthorizedError extends ErrorHandler {
  constructor(
    messageKey: ErrorKey = RESPONSE_KEYS.ERROR.AUTH.UNAUTHORIZED,
    meta?: Record<string, unknown>,
  ) {
    super(messageKey, HTTP_STATUS.UNAUTHORIZED, meta);
  }
}

/**
 * 403 - Forbidden
 */
export class ForbiddenError extends ErrorHandler {
  constructor(
    messageKey: ErrorKey = RESPONSE_KEYS.ERROR.AUTH.FORBIDDEN,
    meta?: Record<string, unknown>,
  ) {
    super(messageKey, HTTP_STATUS.FORBIDDEN, meta);
  }
}

/**
 * 404 - Not Found
 */
export class NotFoundError extends ErrorHandler {
  constructor(
    messageKey: ErrorKey = RESPONSE_KEYS.ERROR.SYSTEM.NOT_FOUND,
    meta?: Record<string, unknown>,
  ) {
    super(messageKey, HTTP_STATUS.NOT_FOUND, meta);
  }
}

/**
 * 409 - Conflict (e.g. Email already exists)
 */
export class ConflictError extends ErrorHandler {
  constructor(
    messageKey: ErrorKey = RESPONSE_KEYS.ERROR.SYSTEM.CONFLICT,
    meta?: Record<string, unknown>,
  ) {
    super(messageKey, HTTP_STATUS.CONFLICT, meta);
  }
}

/**
 * 422 - Validation Error (Zod results)
 */
export class ValidationError extends ErrorHandler {
  constructor(
    messageKey: ErrorKey = RESPONSE_KEYS.ERROR.VALIDATION.VALIDATION_FAILED,
    meta?: Record<string, unknown>,
  ) {
    super(messageKey, HTTP_STATUS.UNPROCESSABLE_ENTITY, meta);
  }
}

/**
 * 500 - Internal Server Error
 */
export class InternalServerError extends ErrorHandler {
  constructor(
    messageKey: ErrorKey = RESPONSE_KEYS.ERROR.SYSTEM.INTERNAL_SERVER_ERROR,
    meta?: Record<string, unknown>,
  ) {
    super(messageKey, HTTP_STATUS.INTERNAL_SERVER_ERROR, meta);
  }
}
