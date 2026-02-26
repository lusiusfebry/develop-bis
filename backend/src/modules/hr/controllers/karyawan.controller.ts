import { Request, Response, NextFunction } from 'express';
import {
    getKaryawanList,
    getKaryawanById,
    createKaryawan,
    updateKaryawan,
    uploadFotoKaryawan,
    getKaryawanQr,
} from '../services/karyawan.service';

// ── List ───────────────────────────────────────────────────────────

export async function list(req: Request, res: Response, next: NextFunction) {
    try {
        const query = {
            page: req.query.page ? Number(req.query.page) : undefined,
            limit: req.query.limit ? Number(req.query.limit) : undefined,
            search: req.query.search as string | undefined,
            divisi_id: req.query.divisi_id as string | undefined,
            department_id: req.query.department_id as string | undefined,
            status_karyawan_id: req.query.status_karyawan_id as string | undefined,
        };

        const result = await getKaryawanList(query);

        res.json({
            success: true,
            data: result.data,
            meta: {
                total: result.total,
                page: result.page,
                limit: result.limit,
                totalPages: result.totalPages,
            },
        });
    } catch (error) {
        next(error);
    }
}

// ── Get One ────────────────────────────────────────────────────────

export async function getOne(req: Request, res: Response, next: NextFunction) {
    try {
        const id = req.params.id as string;
        const result = await getKaryawanById(id);

        res.json({
            success: true,
            data: result,
        });
    } catch (error) {
        next(error);
    }
}

// ── Create ─────────────────────────────────────────────────────────

export async function create(req: Request, res: Response, next: NextFunction) {
    try {
        const result = await createKaryawan(req.body);

        res.status(201).json({
            success: true,
            data: result,
            message: 'Data karyawan berhasil dibuat',
        });
    } catch (error) {
        next(error);
    }
}

// ── Update ─────────────────────────────────────────────────────────

export async function update(req: Request, res: Response, next: NextFunction) {
    try {
        const id = req.params.id as string;
        const result = await updateKaryawan(id, req.body);

        res.json({
            success: true,
            data: result,
            message: 'Data karyawan berhasil diperbarui',
        });
    } catch (error) {
        next(error);
    }
}

// ── Upload Foto ────────────────────────────────────────────────────

export async function uploadFoto(req: Request, res: Response, next: NextFunction) {
    try {
        if (!req.file) {
            const error: any = new Error('File foto wajib diunggah');
            error.status = 400;
            throw error;
        }

        const id = req.params.id as string;
        const result = await uploadFotoKaryawan(id, req.file.filename);

        res.json({
            success: true,
            data: result,
            message: 'Foto karyawan berhasil diunggah',
        });
    } catch (error) {
        next(error);
    }
}

// ── Get QR ─────────────────────────────────────────────────────────

export async function getQr(req: Request, res: Response, next: NextFunction) {
    try {
        const id = req.params.id as string;
        const result = await getKaryawanQr(id);

        res.json({
            success: true,
            data: result,
        });
    } catch (error) {
        next(error);
    }
}
