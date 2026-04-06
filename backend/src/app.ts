import express from 'express';
import type { Application, Request, Response } from 'express';
import { config } from '#/config/config.js';
import { db } from '#/lib/database.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { setupSecurity } from '#/middlewares/setupSecurity.js';
import v1Router from '#/modules/v1.routes.js';

import { loggerMiddleware } from '#/middlewares/logger.middleware.js';
import { globalErrorHandler, notFoundHandler } from '#/middlewares/error.middleware.js';

// swagger
import swaggerUi from 'swagger-ui-express';
import swaggerOutput from '../swagger_output.json' with { type: 'json' };

const app: Application = express();

// CORS, JSON parsing, URL-encoded data parsing, cookie parsing
app.use(cors({ origin: config.app.clientUrl, credentials: true }));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Security Middleware
setupSecurity(app);

app.use(loggerMiddleware);

// Routes
app.use('/api/v1', v1Router);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerOutput));

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    db: db.getDbStatus(),
    timestamp: new Date().toISOString(),
  });
});

app.use(notFoundHandler);
app.use(globalErrorHandler);

export default app;
