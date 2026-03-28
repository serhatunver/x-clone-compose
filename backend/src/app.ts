import express from 'express';
import type { Application, Request, Response } from 'express';
import { config } from '#/config/config.js';
import { db } from '#/database/database.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { setupSecurity } from '#/middleware/setupSecurity.js';
import v1Router from '#/modules/v1.routes.js';

import { loggerMiddleware } from '#/middleware/logger.middleware.js';
import { globalErrorHandler, notFoundHandler } from '#/middleware/errorHandler.js';

// swagger
import swaggerUi from 'swagger-ui-express';
import swaggerOutput from '../swagger_output.json' with { type: 'json' };

const app: Application = express();

// CORS, JSON parsing, URL-encoded data parsing, cookie parsing
app.use(cors({ origin: config.cors.origin, credentials: config.cors.credentials }));
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
