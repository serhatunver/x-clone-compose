import { pinoHttp } from 'pino-http';
import { randomUUID } from 'node:crypto';
import { logger } from '#/lib/utils/logger.js';
import type { IncomingMessage, ServerResponse } from 'http';

export const loggerMiddleware = pinoHttp({
  logger,
  genReqId: (req: IncomingMessage, res: ServerResponse) => {
    const id = req.headers['x-request-id'] ?? randomUUID();
    res.setHeader('X-Request-Id', id);
    return id;
  },
  customSuccessMessage: (req, res) => `${req.method} ${req.url} - ${res.statusCode}`,
  customErrorMessage: (req, res, err) =>
    `${req.method} ${req.url} - ${res.statusCode} - ${err.message}`,
});
