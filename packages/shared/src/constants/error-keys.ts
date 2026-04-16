export const ERROR_KEYS = {
  SYSTEM: {
    INTERNAL_SERVER_ERROR: 'system.internal_server_error', // e.g., unhandled exceptions, database connection failure
    BAD_REQUEST: 'system.bad_request', // e.g., malformed JSON, missing required fields
    NOT_FOUND: 'system.not_found', // e.g., route not found, resource not found
    SERVICE_UNAVAILABLE: 'system.service_unavailable', // e.g., database down, third-party API failure
    MAINTENANCE: 'system.maintenance', // e.g., for scheduled downtime
    UNKNOWN_ERROR: 'system.unknown_error', // e.g., for unhandled exceptions
  },
  VALIDATION: {
    REQUIRED: 'validation.required', // e.g., username is required
    INVALID_EMAIL: 'validation.invalid_email', // e.g., during registration or login
    INVALID_URL: 'validation.invalid_url', // e.g., for profile links
    INVALID_UUID: 'validation.invalid_uuid', // e.g., for user IDs or session tokens
    TOO_SHORT: 'validation.too_short', // e.g., username must be at least 4 characters
    TOO_LONG: 'validation.too_long', // e.g., username must be at least 4 characters
    NUMERIC_ONLY: 'validation.numeric_only', // e.g., username contains invalid characters
    INVALID_FORMAT: 'validation.invalid_format', // e.g., password does not meet complexity requirements
    INVALID_DATE: 'validation.invalid_date', // e.g., date is not in ISO format
  },
  AUTH: {
    UNAUTHORIZED: 'auth.unauthorized', // e.g., trying to access a protected resource without being logged in
    FORBIDDEN: 'auth.forbidden', // e.g., trying to access a resource without proper permissions
    INVALID_CREDENTIALS: 'auth.invalid_credentials', // e.g., wrong password or email during login
    TOKEN_EXPIRED: 'auth.token_expired', // e.g., JWT expired
    TOKEN_INVALID: 'auth.token_invalid', // e.g., JWT verification failed
    USER_NOT_FOUND: 'auth.user_not_found', // e.g., during login or password reset
    USER_ALREADY_EXISTS: 'auth.user_already_exists', // e.g., during registration
    EMAIL_NOT_VERIFIED: 'auth.email_not_verified', // e.g., trying to log in without verifying email
    PASSWORD_TOO_WEAK: 'auth.password_too_weak', // e.g., during registration or password change
    PASSWORD_NO_MATCH: 'auth.password_no_match', // e.g., during password reset confirmation
    TOO_MANY_ATTEMPTS: 'auth.too_many_attempts', // e.g., after multiple failed login attempts
  },
  USER: {
    USERNAME_TAKEN: 'user.username_taken', // e.g., during registration or username update
    EMAIL_TAKEN: 'user.email_taken', // e.g., during registration or email update
    PROFILE_NOT_FOUND: 'user.profile_not_found', // e.g., trying to access a profile that doesn't exist
    UPDATE_FAILED: 'user.update_failed', // e.g., database error during profile update
    PERMISSION_DENIED: 'user.permission_denied', // e.g., trying to edit another user's profile
  },
  FILE: {
    TOO_LARGE: 'file.too_large', // e.g., file exceeds size limit
    INVALID_TYPE: 'file.invalid_type', // e.g., unsupported file format
    UPLOAD_FAILED: 'file.upload_failed', // e.g., network error during upload
    NOT_FOUND: 'file.not_found', // e.g., trying to access a file that doesn't exist
  },
  DB: {
    QUERY_FAILED: 'db.query_failed', // e.g., syntax error, connection issue
    CONCURRENCY_ERROR: 'db.concurrency_error', // e.g., version conflict
    DOCUMENT_NOT_FOUND: 'db.document_not_found', // e.g., trying to update non-existent document
    UNIQUE_CONSTRAINT: 'db.unique_constraint', // e.g., duplicate key error
  },
} as const;

export type ErrorKeyCategory = keyof typeof ERROR_KEYS;
export type ErrorKey = {
  [K in ErrorKeyCategory]: (typeof ERROR_KEYS)[K][keyof (typeof ERROR_KEYS)[K]];
}[ErrorKeyCategory];
