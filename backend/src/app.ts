import express from 'express';
import { config } from '#/config/config.js';
import { db } from '#/database/database.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { setupSecurity } from '#/middleware/security.js';
import userRoutes from '#/users/routes.js';
import postRoutes from '#/posts/routes.js';
import authRoutes from '#/auth/routes.js';
import followsRoutes from '#/follows/routes.js';

// swagger
import swaggerUi from 'swagger-ui-express';
import swaggerOutput from '../swagger_output.json' with { type: 'json' };

const app = express();

setupSecurity(app);

// CORS, JSON parsing, URL-encoded data parsing, cookie parsing
app.use(cors({ origin: config.cors.origin, credentials: config.cors.credentials }));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/post', postRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/follows', followsRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerOutput));

// Health check
app.get('/health', async (req, res) => {
  res.status(200).json({
    status: 'ok',
    db: db.getDbStatus(),
    timestamp: new Date().toISOString(),
  });
});

export default app;
