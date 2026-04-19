export const ERROR_KEYS = {
  SYSTEM: {
    INTERNAL_SERVER_ERROR: 'system.internal_server_error', // e.g., unhandled exceptions, database connection failure
    BAD_REQUEST: 'system.bad_request', // e.g., malformed JSON, missing required fields
    NOT_FOUND: 'system.not_found', // e.g., route not found, resource not found
    SERVICE_UNAVAILABLE: 'system.service_unavailable', // e.g., database down, third-party API failure
    MAINTENANCE: 'system.maintenance', // e.g., for scheduled downtime
    UNKNOWN_ERROR: 'system.unknown_error', // e.g., for unhandled exceptions
    RATE_LIMIT_EXCEEDED: 'system.rate_limit_exceeded', // e.g., when a user exceeds the allowed number of requests
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
    SESSION_EXPIRED: 'auth.session_expired', // e.g., session cookie expired
    USER_NOT_FOUND: 'auth.user_not_found', // e.g., during login or password reset
    USER_ALREADY_EXISTS: 'auth.user_already_exists', // e.g., during registration
    EMAIL_NOT_VERIFIED: 'auth.email_not_verified', // e.g., trying to log in without verifying email
    EMAIL_ALREADY_VERIFIED: 'auth.email_already_verified', // e.g., trying to verify an already verified email
    ACCOUNT_SUSPENDED: 'auth.account_suspended', // e.g., trying to log in to a suspended account
    ACCOUNT_DEACTIVATED: 'auth.account_deactivated', // e.g., trying to interact with a deactivated account
    VERIFICATION_EMAIL_SENT: 'auth.verification_email_sent', // e.g., after resending verification email
    PASSWORD_RESET_EMAIL_SENT: 'auth.password_reset_email_sent', // e.g., after requesting password reset
    TOO_MANY_ATTEMPTS: 'auth.too_many_attempts', // e.g., after exceeding login attempts
    INVALID_TOKEN: 'auth.invalid_token', // e.g., during email verification or password reset
  },
  USER: {
    USER_NOT_FOUND: 'user.user_not_found', // e.g., trying to access a user that doesn't exist
    USERNAME_TAKEN: 'user.username_taken', // e.g., during registration or username update
    EMAIL_TAKEN: 'user.email_taken', // e.g., during registration or email update
    UPDATE_FAILED: 'user.update_failed', // e.g., database error during profile update
    PROFILE_NOT_FOUND: 'user.profile_not_found', // e.g., trying to access a profile that doesn't exist
    PERMISSION_DENIED: 'user.permission_denied', // e.g., trying to edit another user's profile
    ACCOUNT_SUSPENDED: 'user.account_suspended', // e.g., trying to preview a suspended account
  },
  POST: {
    POST_NOT_FOUND: 'post.post_not_found', // e.g., trying to access a post that doesn't exist
    CREATE_FAILED: 'post.create_failed', // e.g., database error during post creation
    UPDATE_FAILED: 'post.update_failed', // e.g., database error during post update
    DELETE_FAILED: 'post.delete_failed', // e.g., database error during post deletion
    PERMISSION_DENIED: 'post.permission_denied', // e.g., trying to edit or delete another user's post
  },
  FOLLOW: {
    CANNOT_FOLLOW_SELF: 'follow.cannot_follow_self', // e.g., trying to follow oneself
    USER_NOT_FOUND: 'follow.user_not_found', // e.g., trying to follow a user that doesn't exist
    FOLLOW_FAILED: 'follow.follow_failed', // e.g., database error during follow action
    UNFOLLOW_FAILED: 'follow.unfollow_failed', // e.g., database error during unfollow action
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
