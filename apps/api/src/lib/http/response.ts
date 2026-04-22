import type { Response } from 'express';
import { HTTP_STATUS, type IApiResponse } from '@repo/shared';

export const sendResponse = <T>(
  res: Response,
  messageKey: string,
  data?: T,
  statusCode: number = HTTP_STATUS.OK,
) => {
  const response: IApiResponse<T> = {
    success: true,
    messageKey,
    data,
  };

  return res.status(statusCode).json(response);
};
