import { Request, Response, NextFunction } from 'express';
import {
    downloadTemplate,
    previewImport,
    executeImport,
    exportKaryawan,
} from '../services/import-export.service';

// ── Get Template ───────────────────────────────────────────────────

export async function getTemplate(_req: Request, res: Response, next: NextFunction) {
    try {
        const filePath = downloadTemplate();
        res.download(filePath, 'BMI-kosong.xlsx');
    } catch (error) {
        next(error);
    }
}

// ── Preview ────────────────────────────────────────────────────────

export async function preview(req: Request, res: Response, next: NextFunction) {
    try {
        if (!req.file) {
            const error: any = new Error('File Excel wajib diunggah');
            error.status = 400;
            throw error;
        }

        const result = await previewImport(req.file.buffer);

        res.json({
            success: true,
            data: result,
        });
    } catch (error) {
        next(error);
    }
}

// ── Execute ────────────────────────────────────────────────────────

export async function execute(req: Request, res: Response, next: NextFunction) {
    try {
        if (!req.file) {
            const error: any = new Error('File Excel wajib diunggah');
            error.status = 400;
            throw error;
        }

        const result = await executeImport(req.file.buffer);

        res.json({
            success: true,
            data: result,
            message: `Import selesai: ${result.berhasil} berhasil, ${result.diperbarui} diperbarui, ${result.gagal} gagal`,
        });
    } catch (error) {
        next(error);
    }
}

// ── Export Data ─────────────────────────────────────────────────────

export async function exportData(req: Request, res: Response, next: NextFunction) {
    try {
        const query = {
            divisi_id: req.query.divisi_id as string | undefined,
            department_id: req.query.department_id as string | undefined,
            status_karyawan_id: req.query.status_karyawan_id as string | undefined,
            lokasi_kerja_id: req.query.lokasi_kerja_id as string | undefined,
        };

        const buffer = await exportKaryawan(query);

        const tanggal = new Date().toISOString().slice(0, 10);
        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader(
            'Content-Disposition',
            `attachment; filename="BMI-export-${tanggal}.xlsx"`
        );
        res.send(buffer);
    } catch (error) {
        next(error);
    }
}
