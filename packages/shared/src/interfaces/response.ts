export interface IApiValidationErrorDetail {
  field: string;
  messageKey: string;
  [key: string]: any;
}

export interface IApiResponse<T = any> {
  success: boolean;
  messageKey: string;
  data?: T;
  error?: {
    code: string;
    meta?: any;
    details?: IApiValidationErrorDetail[];
  };
}
