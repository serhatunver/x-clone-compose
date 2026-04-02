/**
 * Base Error Handler class that extends the built-in Error
 */
export class ErrorHandler extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly data?: Record<string, unknown>;

  constructor(message: string, statusCode: number, data?: Record<string, unknown>) {
    super(message);
    this.name = this.constructor.name;
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
  constructor(message: string, data?: Record<string, unknown>) {
    super(message, 400, data);
  }
}

/**
 * 401 - Unauthorized
 */
export class UnauthorizedError extends ErrorHandler {
  constructor(message = 'Unauthorized access', data?: Record<string, unknown>) {
    super(message, 401, data);
  }
}

/**
 * 403 - Forbidden
 */
export class ForbiddenError extends ErrorHandler {
  constructor(message = 'Forbidden access', data?: Record<string, unknown>) {
    super(message, 403, data);
  }
}

/**
 * 404 - Not Found
 */
export class NotFoundError extends ErrorHandler {
  constructor(message = 'Resource not found', data?: Record<string, unknown>) {
    super(message, 404, data);
  }
}

/**
 * 409 - Conflict (e.g. Email already exists)
 */
export class ConflictError extends ErrorHandler {
  constructor(message: string, data?: Record<string, unknown>) {
    super(message, 409, data);
  }
}

/**
 * 422 - Validation Error (Zod results)
 */
export class ValidationError extends ErrorHandler {
  constructor(message: string, data?: Record<string, unknown>) {
    super(message, 422, data);
  }
}

/**
 * 500 - Internal Server Error
 */
export class InternalServerError extends ErrorHandler {
  constructor(message = 'Internal server error', data?: Record<string, unknown>) {
    super(message, 500, data);
  }
}
