export const RESPONSE_KEYS = {
  SUCCESS: {
    SYSTEM: {
      HEALTH_CHECK_PASSED: 'success.system.health_check_passed',
    },
    AUTH: {
      LOGIN: 'success.auth.login',
      REGISTER: 'success.auth.register',
      LOGOUT: 'success.auth.logout',
      GET_ME: 'success.auth.get_me',
      VERIFICATION_EMAIL_SENT: 'success.auth.verification_email_sent',
      PASSWORD_RESET_EMAIL_SENT: 'success.auth.password_reset_email_sent',
      PASSWORD_CHANGED: 'success.auth.password_changed',
      EMAIL_VERIFIED: 'success.auth.email_verified',
      SESSION_REFRESHED: 'success.auth.session_refreshed',
      ACCOUNT_DELETED: 'success.auth.account_deleted',
      ACCOUNT_SUSPENDED: 'success.auth.account_suspended',
      ACCOUNT_REACTIVATED: 'success.auth.account_reactivated',
    },
    USER: {
      FETCHED: 'success.user.fetched',
      UPDATED: 'success.user.updated',
      DELETED: 'success.user.deleted',
      PROFILE_IMAGE_UPDATED: 'success.user.profile_image_updated',
    },
    POST: {
      CREATED: 'success.post.created',
      FETCHED: 'success.post.fetched',
      UPDATED: 'success.post.updated',
      DELETED: 'success.post.deleted',
      LIKED: 'success.post.liked',
      UNLIKED: 'success.post.unliked',
    },
    FOLLOW: {
      FOLLOWED: 'success.follow.followed',
      UNFOLLOWED: 'success.follow.unfollowed',
    },
    FILE: {
      UPLOADED: 'success.file.uploaded',
      DELETED: 'success.file.deleted',
    },
  },
  ERROR: {
    SYSTEM: {
      INTERNAL_SERVER_ERROR: 'error.system.internal_server_error',
      BAD_REQUEST: 'error.system.bad_request',
      NOT_FOUND: 'error.system.not_found',
      CONFLICT: 'error.system.conflict',
      SERVICE_UNAVAILABLE: 'error.system.service_unavailable',
      MAINTENANCE: 'error.system.maintenance',
      UNKNOWN_ERROR: 'error.system.unknown_error',
      RATE_LIMIT_EXCEEDED: 'error.system.rate_limit_exceeded',
    },
    VALIDATION: {
      VALIDATION_FAILED: 'error.validation.validation_failed',
      REQUIRED: 'error.validation.required',
      INVALID_EMAIL: 'error.validation.invalid_email',
      INVALID_URL: 'error.validation.invalid_url',
      INVALID_UUID: 'error.validation.invalid_uuid',
      TOO_SHORT: 'error.validation.too_short',
      TOO_LONG: 'error.validation.too_long',
      NUMERIC_ONLY: 'error.validation.numeric_only',
      INVALID_FORMAT: 'error.validation.invalid_format',
      INVALID_DATE: 'error.validation.invalid_date',
      PASSWORDS_DO_NOT_MATCH: 'error.validation.passwords_do_not_match',
      USERNAME_RESERVED: 'error.validation.username_reserved',
      INVALID_USERNAME_FORMAT: 'error.validation.invalid_username_format',
      INVALID_PASSWORD_FORMAT: 'error.validation.invalid_password_format',
      INVALID_DISPLAY_NAME_FORMAT:
        'error.validation.invalid_display_name_format',
    },
    AUTH: {
      UNAUTHORIZED: 'error.auth.unauthorized',
      FORBIDDEN: 'error.auth.forbidden',
      INVALID_CREDENTIALS: 'error.auth.invalid_credentials',
      TOKEN_EXPIRED: 'error.auth.token_expired',
      TOKEN_INVALID: 'error.auth.token_invalid',
      SESSION_EXPIRED: 'error.auth.session_expired',
      USER_NOT_FOUND: 'error.auth.user_not_found',
      USER_ALREADY_EXISTS: 'error.auth.user_already_exists',
      EMAIL_NOT_VERIFIED: 'error.auth.email_not_verified',
      EMAIL_ALREADY_VERIFIED: 'error.auth.email_already_verified',
      ACCOUNT_SUSPENDED: 'error.auth.account_suspended',
      ACCOUNT_DEACTIVATED: 'error.auth.account_deactivated',
      INVALID_ACCOUNT_STATUS: 'error.auth.invalid_account_status',
      TOO_MANY_ATTEMPTS: 'error.auth.too_many_attempts',
      INVALID_TOKEN: 'error.auth.invalid_token',
      PASSWORD_RESET_FAILED: 'error.auth.password_reset_failed',
    },
    USER: {
      USER_NOT_FOUND: 'error.user.user_not_found',
      USERNAME_TAKEN: 'error.user.username_taken',
      EMAIL_TAKEN: 'error.user.email_taken',
      UPDATE_FAILED: 'error.user.update_failed',
      PROFILE_NOT_FOUND: 'error.user.profile_not_found',
      PERMISSION_DENIED: 'error.user.permission_denied',
      ACCOUNT_SUSPENDED: 'error.user.account_suspended',
    },
    POST: {
      POST_NOT_FOUND: 'error.post.post_not_found',
      CREATE_FAILED: 'error.post.create_failed',
      UPDATE_FAILED: 'error.post.update_failed',
      DELETE_FAILED: 'error.post.delete_failed',
      PERMISSION_DENIED: 'error.post.permission_denied',
    },
    FOLLOW: {
      CANNOT_FOLLOW_SELF: 'error.follow.cannot_follow_self',
      USER_NOT_FOUND: 'error.follow.user_not_found',
      FOLLOW_FAILED: 'error.follow.follow_failed',
      UNFOLLOW_FAILED: 'error.follow.unfollow_failed',
    },
    FILE: {
      TOO_LARGE: 'error.file.too_large',
      INVALID_TYPE: 'error.file.invalid_type',
      UPLOAD_FAILED: 'error.file.upload_failed',
      NOT_FOUND: 'error.file.not_found',
    },
    DB: {
      QUERY_FAILED: 'error.db.query_failed',
      CONCURRENCY_ERROR: 'error.db.concurrency_error',
      DOCUMENT_NOT_FOUND: 'error.db.document_not_found',
      UNIQUE_CONSTRAINT: 'error.db.unique_constraint',
    },
  },
} as const;

export type ResponseType = keyof typeof RESPONSE_KEYS;

export type SuccessCategory = keyof typeof RESPONSE_KEYS.SUCCESS;
export type SuccessKey = {
  [K in SuccessCategory]: (typeof RESPONSE_KEYS.SUCCESS)[K][keyof (typeof RESPONSE_KEYS.SUCCESS)[K]];
}[SuccessCategory];

export type ErrorCategory = keyof typeof RESPONSE_KEYS.ERROR;
export type ErrorKey = {
  [K in ErrorCategory]: (typeof RESPONSE_KEYS.ERROR)[K][keyof (typeof RESPONSE_KEYS.ERROR)[K]];
}[ErrorCategory];

export type ResponseKey = SuccessKey | ErrorKey;
