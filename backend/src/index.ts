import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';

import connectDB from './config/db';
import authRoutes from './routes/authRoutes';
import leadRoutes from './routes/leadRoutes';
import { errorHandler, notFound } from './middleware/errorHandler';

dotenv.config();

const app = express();

const PORT = Number(process.env.PORT) || 5000;

// Middleware
app.use(cors());

app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health route
app.get('/', (_req, res) => {
  res.send('Smart Leads Backend Running 🚀');
});

app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    message: 'API running'
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);

// Errors
app.use(notFound);
app.use(errorHandler);

// Start server AFTER DB connect
const startServer = async () => {
  try {

    await connectDB();

    app.listen(PORT, '0.0.0.0', () => {

      console.log(
        `🚀 Server running on port ${PORT}`
      );

    });

  } catch (error) {

    console.error(error);

    process.exit(1);

  }
};

startServer();

export default app;