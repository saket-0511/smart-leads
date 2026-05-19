import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import connectDB from './config/db';
import authRoutes from './routes/authRoutes';
import leadRoutes from './routes/leadRoutes';
import { errorHandler, notFound } from './middleware/errorHandler';

dotenv.config();

const app = express();

const PORT = Number(process.env.PORT) || 5000;

// Connect Database
connectDB();

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Root Route
app.get('/', (_req, res) => {
  res.send('Smart Leads Backend Running 🚀');
});

// Health Check Route
app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    message: 'Smart Leads API is running 🚀',
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);

// Error Handlers
app.use(notFound);
app.use(errorHandler);

// Start Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(
    `🚀 Server running on port ${PORT} in ${process.env.NODE_ENV} mode`
  );
});

export default app;