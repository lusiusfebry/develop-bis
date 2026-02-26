import { Router } from 'express';
import multer, { memoryStorage } from 'multer';
import { authenticate } from '../../../middlewares/auth.middleware';
import * as controller from '../controllers/import-export.controller';

// ── Konfigurasi Multer (memory storage) ────────────────────────────

const fileFilter = (
    _req: Express.Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
) => {
    if (
        file.mimetype ===
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
        cb(null, true);
    } else {
        cb(new Error('Hanya file .xlsx yang diperbolehkan'));
    }
};

const upload = multer({
    storage: memoryStorage(),
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

// ── Import Router ──────────────────────────────────────────────────

const importRouter = Router();

// Semua route dilindungi middleware authenticate
importRouter.use(authenticate);

importRouter.get('/template', controller.getTemplate);
importRouter.post('/preview', upload.single('file'), controller.preview);
importRouter.post('/execute', upload.single('file'), controller.execute);

// ── Export Router ──────────────────────────────────────────────────

const exportRouter = Router();

exportRouter.use(authenticate);

exportRouter.get('/', controller.exportData);

export { importRouter, exportRouter };
