export interface IApiResponse<T = any> {
  success: boolean;
  messageKey: string;
  data?: T;
  error?: {
    code: string;
    meta?: any;
    details?: any[];
  };
}
