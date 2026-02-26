import { Request, Response, NextFunction } from 'express';
import { MasterEntityConfig } from '../dto/master.dto';
import {
    getMasterList,
    getMasterById,
    createMaster,
    updateMaster,
    toggleMasterStatus,
} from '../services/master.service';

// ── Factory Function ───────────────────────────────────────────────

export function createMasterController(config: MasterEntityConfig) {
    return {
        // ── List ───────────────────────────────────────────────────
        async list(req: Request, res: Response, next: NextFunction) {
            try {
                const query = {
                    page: req.query.page ? Number(req.query.page) : undefined,
                    limit: req.query.limit ? Number(req.query.limit) : undefined,
                    search: req.query.search as string | undefined,
                    status: req.query.status as 'Aktif' | 'TidakAktif' | undefined,
                };

                const result = await getMasterList(config, query);

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
        },

        // ── Get One ────────────────────────────────────────────────
        async getOne(req: Request, res: Response, next: NextFunction) {
            try {
                const id = req.params.id as string;
                const result = await getMasterById(config, id);

                res.json({
                    success: true,
                    data: result,
                });
            } catch (error) {
                next(error);
            }
        },

        // ── Create ─────────────────────────────────────────────────
        async create(req: Request, res: Response, next: NextFunction) {
            try {
                const result = await createMaster(config, req.body);

                res.status(201).json({
                    success: true,
                    data: result,
                    message: 'Data berhasil dibuat',
                });
            } catch (error) {
                next(error);
            }
        },

        // ── Update ─────────────────────────────────────────────────
        async update(req: Request, res: Response, next: NextFunction) {
            try {
                const id = req.params.id as string;
                const result = await updateMaster(config, id, req.body);

                res.json({
                    success: true,
                    data: result,
                    message: 'Data berhasil diperbarui',
                });
            } catch (error) {
                next(error);
            }
        },

        // ── Toggle Status ──────────────────────────────────────────
        async toggleStatus(req: Request, res: Response, next: NextFunction) {
            try {
                const id = req.params.id as string;
                const result = await toggleMasterStatus(config, id);

                res.json({
                    success: true,
                    data: result,
                    message: 'Status berhasil diubah',
                });
            } catch (error) {
                next(error);
            }
        },
    };
}
