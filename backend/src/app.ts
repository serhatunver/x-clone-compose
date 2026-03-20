import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectMongo from './db/connectMongo.js';
import userRoutes from './users/routes.js';
import postRoutes from './posts/routes.js';
import authRoutes from './auth/routes.js';
import followsRoutes from './follows/routes.js';

// swagger
import swaggerUi from 'swagger-ui-express';
import swaggerOutput from '../swagger_output.json' with { type: 'json' };
// import swaggerUi from 'swagger-ui-express';
// import swaggerDocument from './swagger';

const app = express();
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  }),
);
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/v1/user', userRoutes);
app.use('/api/v1/post', postRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/follows', followsRoutes);

// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// auto for now
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerOutput));

// Health check endpoint
app.get('/health', async (req, res) => {
  const dbState = mongoose.connection.readyState; // 1 = connected
  const dbStatus = dbState === 1 ? 'connected' : 'disconnected';
  res.status(200).json({
    status: 'ok',
    db: dbStatus,
    timestamp: new Date().toISOString(),
  });
});

const PORT: number = parseInt(process.env.PORT || '3000', 10);

async function startServer() {
  try {
    await connectMongo();
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to connect to MongoDB', error);
    process.exit(1);
  }
}

startServer();
