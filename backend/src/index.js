// Trigger nodemon restart
import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import examRoutes from './routes/exam.routes.js';
import questionRoutes from './routes/question.routes.js';
import resultRoutes from './routes/result.routes.js';
import bookmarkRoutes from './routes/bookmark.routes.js';
import adminRoutes from './routes/admin.routes.js';
import { errorHandler } from './middlewares/error.middleware.js';

// BigInt Serialization Patch (Required for JSON.stringify to handle BigInt)
if (!BigInt.prototype.toJSON) {
  BigInt.prototype.toJSON = function() {
    return this.toString();
  };
}

const app = express();

// Validate Environment Variables
const REQUIRED_ENV = ['DATABASE_URL', 'JWT_SECRET'];
REQUIRED_ENV.forEach(env => {
  if (!process.env[env]) {
    console.error(`❌ FATAL: Missing required environment variable: ${env}`);
    process.exit(1);
  }
});

const PORT = process.env.PORT || 5000;

// 1. Security Middlewares (Must be first)
app.use(helmet({
  crossOriginOpenerPolicy: { policy: "unsafe-none" },
}));
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://gaslulus.com'] // Update with real domain in prod
    : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
}));

// 2. Parser Middlewares
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// 3. Rate Limiting
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { success: false, message: 'Terlalu banyak request. Coba lagi dalam 15 menit.' },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100, // Ditingkatkan agar tidak mengganggu testing
  message: { success: false, message: 'Terlalu banyak percobaan akses. Coba lagi dalam 15 menit.' },
});

app.use(generalLimiter);

// Routes
// Gunakan authLimiter hanya jika diperlukan, atau berikan batas yang lebih tinggi
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/results', resultRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'GasLulus API is running!', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route tidak ditemukan' });
});

// Global error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 GasLulus Backend running on http://localhost:${PORT}`);
  console.log(`📦 Environment: ${process.env.NODE_ENV}`);
});

export default app;
