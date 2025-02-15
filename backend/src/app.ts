import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectMongo from './db/connectMongo';
import userRoutes from './users/routes';
import postRoutes from './posts/routes';
import authRoutes from './auth/routes';

// swagger
import swaggerUi from 'swagger-ui-express';
import swaggerOutput from '../swagger_output.json';
// import swaggerDocument from './swagger';

const app = express();
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/v1/user', userRoutes);
app.use('/api/v1/post', postRoutes);
app.use('/api/v1/auth', authRoutes);

// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// auto for now
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerOutput));

app.get('/', (req, res) => {
  res.send('Hello world');
});

app.listen(3000, '0.0.0.0', async () => {
  await connectMongo();
  console.log('Server is running on port 3000');
});
