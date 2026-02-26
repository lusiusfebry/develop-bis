import { Request, Response, NextFunction } from 'express';
import jwt, { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET as string;

interface JwtPayload {
    userId: string;
    nik: string;
    role: string;
}

/**
 * Middleware untuk autentikasi JWT.
 * Memverifikasi token dari header Authorization dan meng-attach payload ke req.user.
 */
export function authenticate(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    // Cek keberadaan dan format header Authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({
            success: false,
            message: 'Token tidak ditemukan',
        });
        return;
    }

    const token = authHeader.split(' ')[1];

    try {
        // Verifikasi token
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

        // Attach payload ke request
        req.user = {
            userId: decoded.userId,
            nik: decoded.nik,
            role: decoded.role,
        };

        next();
    } catch (error) {
        if (error instanceof TokenExpiredError) {
            res.status(401).json({
                success: false,
                message: 'Token telah kedaluwarsa',
            });
            return;
        }

        if (error instanceof JsonWebTokenError) {
            res.status(401).json({
                success: false,
                message: 'Token tidak valid',
            });
            return;
        }

        next(error);
    }
}
