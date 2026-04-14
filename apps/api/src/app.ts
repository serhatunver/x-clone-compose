import express from 'express';
import type { Application, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import hpp from 'hpp';
import compression from 'compression';

// Config & Utils
import { config } from '#/config/config.js';
import { db } from '#/lib/database.js';
import v1Router from '#/modules/v1.routes.js';

// Middlewares
import { loggerMiddleware } from '#/middlewares/logger.middleware.js';
import { globalErrorHandler, notFoundHandler } from '#/middlewares/error.middleware.js';
import { generalLimiter, speedLimiter } from '#/middlewares/rate-limit.middleware.js';

// Swagger
import swaggerUi from 'swagger-ui-express';
import swaggerOutput from '../swagger_output.json' with { type: 'json' };

const app: Application = express();

// Security Middlewares
app.use(helmet());
app.use(cors({ origin: config.app.clientUrl, credentials: true }));
app.use(compression());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());
app.use(hpp());

// Logging & Rate Limit
app.use(loggerMiddleware);
if (!config.app.isDevelopment) {
  app.use(generalLimiter, speedLimiter);
}

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

// Error Handling
app.use(notFoundHandler);
app.use(globalErrorHandler);

export default app;
