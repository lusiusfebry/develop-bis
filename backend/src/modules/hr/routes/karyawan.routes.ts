import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { authenticate } from '../../../middlewares/auth.middleware';
import * as controller from '../controllers/karyawan.controller';

// ── Konfigurasi Multer ─────────────────────────────────────────────

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, path.join(__dirname, '../../../../uploads'));
    },
    filename: (_req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    },
});

const fileFilter = (
    _req: Express.Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Hanya file JPEG, JPG, dan PNG yang diperbolehkan'));
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// ── Router ─────────────────────────────────────────────────────────

const router = Router();

// Semua route dilindungi middleware authenticate
router.use(authenticate);

// Route spesifik harus didefinisikan sebelum route /:id
router.get('/', controller.list);
router.post('/', controller.create);
router.get('/:id/qr', controller.getQr);
router.post('/:id/foto', upload.single('foto'), controller.uploadFoto);
router.get('/:id', controller.getOne);
router.put('/:id', controller.update);

export default router;
