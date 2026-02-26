import { Router } from 'express';
import { createMasterRouter } from './master.routes';
import karyawanRouter from './karyawan.routes';
import {
    divisiConfig,
    departmentConfig,
    posisiJabatanConfig,
    kategoriPangkatConfig,
    golonganConfig,
    subGolonganConfig,
    jenisHubunganKerjaConfig,
    tagConfig,
    lokasiKerjaConfig,
    statusKaryawanConfig,
} from '../dto/master.dto';

const router = Router();

// ── Mount Karyawan Router ──────────────────────────────────────────

router.use('/karyawan', karyawanRouter);

// ── Mount 10 Master Data Routers ───────────────────────────────────

router.use('/divisi', createMasterRouter(divisiConfig));
router.use('/department', createMasterRouter(departmentConfig));
router.use('/posisi-jabatan', createMasterRouter(posisiJabatanConfig));
router.use('/kategori-pangkat', createMasterRouter(kategoriPangkatConfig));
router.use('/golongan', createMasterRouter(golonganConfig));
router.use('/sub-golongan', createMasterRouter(subGolonganConfig));
router.use('/jenis-hubungan-kerja', createMasterRouter(jenisHubunganKerjaConfig));
router.use('/tag', createMasterRouter(tagConfig));
router.use('/lokasi-kerja', createMasterRouter(lokasiKerjaConfig));
router.use('/status-karyawan', createMasterRouter(statusKaryawanConfig));

export default router;
