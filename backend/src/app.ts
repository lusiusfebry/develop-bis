import dotenv from 'dotenv';
dotenv.config();

// ── Startup Environment Check ──────────────────────────────────────
if (!process.env.JWT_SECRET) {
    throw new Error(
        '❌ FATAL: Environment variable JWT_SECRET belum di-set. ' +
        'Server tidak dapat berjalan tanpa JWT_SECRET. ' +
        'Pastikan JWT_SECRET sudah dikonfigurasi di file .env atau environment variables.'
    );
}

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import authRoutes from './modules/auth/auth.routes';

const app = express();
const PORT = process.env.PORT || 3000;

// ── Middleware Global ──────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Route Placeholder ──────────────────────────────────────────────
app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date() });
});

// ── Auth Routes ────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);

// ── Global Error Handler ───────────────────────────────────────────
interface AppError extends Error {
    status?: number;
}

app.use((err: AppError, _req: Request, res: Response, _next: NextFunction) => {
    console.error('❌ Error:', err.message);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
    });
});

// ── Start Server ───────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
    console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
});
