import { Request, Response, NextFunction } from 'express';
import { loginService, getMeService } from './auth.service';

/**
 * Handler untuk login user.
 * POST /api/auth/login
 */
export async function login(req: Request, res: Response, next: NextFunction) {
    try {
        const { nik, password } = req.body;

        // Validasi input
        if (!nik || !password) {
            res.status(400).json({
                success: false,
                message: 'NIK dan password wajib diisi',
            });
            return;
        }

        const result = await loginService(nik, password);

        res.status(200).json({
            success: true,
            data: {
                token: result.token,
                user: result.user,
            },
        });
    } catch (error: any) {
        error.status = error.status || 401;
        next(error);
    }
}

/**
 * Handler untuk logout user.
 * POST /api/auth/logout
 * JWT bersifat stateless, cukup return pesan sukses.
 */
export async function logout(_req: Request, res: Response) {
    res.status(200).json({
        success: true,
        message: 'Logout berhasil',
    });
}

/**
 * Handler untuk mengambil data user yang sedang login.
 * GET /api/auth/me
 */
export async function me(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            res.status(401).json({
                success: false,
                message: 'User tidak terautentikasi',
            });
            return;
        }

        const user = await getMeService(userId);

        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error: any) {
        next(error);
    }
}
