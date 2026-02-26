import ExcelJS from 'exceljs';
import path from 'path';
import prisma from '../../../lib/prisma';
import {
    ImportPreviewResult,
    ImportPreviewRow,
    ImportExecuteResult,
    ExportQuery,
} from '../dto/import-export.dto';

// ── Tipe untuk COLUMN_MAP ──────────────────────────────────────────

interface ColumnMapEntry {
    index: number;
    excelHeader: string;
    dbField: string;
    type: 'string' | 'date' | 'number' | 'master' | 'anak' | 'saudara' | 'skip';
    masterConfig?: { model: string; nameField: string };
    anakIndex?: number;
    anakField?: string;
    saudaraIndex?: number;
    saudaraField?: string;
}

// ── Konstanta COLUMN_MAP (148 kolom) ───────────────────────────────

const COLUMN_MAP: ColumnMapEntry[] = [
    { index: 1, excelHeader: 'NOMIR INDUK KARYAWAN', dbField: 'nomor_induk_karyawan', type: 'string' },
    { index: 2, excelHeader: 'NAMA LENGKAP', dbField: 'nama_lengkap', type: 'string' },
    { index: 3, excelHeader: 'POSISI JABATAN', dbField: 'posisi_jabatan_id', type: 'master', masterConfig: { model: 'posisiJabatan', nameField: 'nama_posisi_jabatan' } },
    { index: 4, excelHeader: 'MANAGER', dbField: 'manager_id', type: 'string' },
    { index: 5, excelHeader: 'ATASAN LANGSUNG', dbField: 'atasan_langsung_id', type: 'string' },
    { index: 6, excelHeader: 'EMAIL PERUSAHAAN', dbField: 'email_perusahaan', type: 'string' },
    { index: 7, excelHeader: 'PANGKAT KATEGORI', dbField: 'kategori_pangkat_id', type: 'master', masterConfig: { model: 'kategoriPangkat', nameField: 'nama_kategori_pangkat' } },
    { index: 8, excelHeader: 'GOLONGAN', dbField: 'golongan_pangkat_id', type: 'master', masterConfig: { model: 'golongan', nameField: 'nama_golongan' } },
    { index: 9, excelHeader: 'SUB GOLONGAN', dbField: 'sub_golongan_pangkat_id', type: 'master', masterConfig: { model: 'subGolongan', nameField: 'nama_sub_golongan' } },
    { index: 10, excelHeader: 'NOMOR HANDPHONE', dbField: 'nomor_handphone', type: 'string' },
    { index: 11, excelHeader: 'JENIS KELAMIN', dbField: 'jenis_kelamin', type: 'string' },
    { index: 12, excelHeader: 'TEMPAT LAHIR', dbField: 'tempat_lahir', type: 'string' },
    { index: 13, excelHeader: 'TANGGAL LAHIR', dbField: 'tanggal_lahir', type: 'date' },
    { index: 14, excelHeader: 'JENIS HUBUNGAN KERJA', dbField: 'jenis_hubungan_kerja_id', type: 'master', masterConfig: { model: 'jenisHubunganKerja', nameField: 'nama_jenis_hubungan_kerja' } },
    { index: 15, excelHeader: 'EMAIL PRIBADI', dbField: 'email_pribadi', type: 'string' },
    { index: 16, excelHeader: 'AGAMA', dbField: 'agama', type: 'string' },
    { index: 17, excelHeader: 'GOLONGAN DARAH', dbField: 'golongan_darah', type: 'string' },
    { index: 18, excelHeader: 'NOMOR KARTU KELUARGA', dbField: 'nomor_kartu_keluarga', type: 'string' },
    { index: 19, excelHeader: 'NOMOR KTP', dbField: 'nomor_ktp', type: 'string' },
    { index: 20, excelHeader: 'NOMOR NPWP', dbField: 'nomor_npwp', type: 'string' },
    { index: 21, excelHeader: 'NOMOR BPJS', dbField: 'nomor_bpjs', type: 'string' },
    { index: 22, excelHeader: 'NO NIK KK', dbField: 'no_nik_kk', type: 'string' },
    { index: 23, excelHeader: 'STATUS PAJAK', dbField: 'status_pajak', type: 'string' },
    { index: 24, excelHeader: 'ALAMAT DOMISILI', dbField: 'alamat_domisili', type: 'string' },
    { index: 25, excelHeader: 'KOTA DOMISILI', dbField: 'kota_domisili', type: 'string' },
    { index: 26, excelHeader: 'PROVINSI DOMISILI', dbField: 'provinsi_domisili', type: 'string' },
    { index: 27, excelHeader: 'ALAMAT KTP', dbField: 'alamat_ktp', type: 'string' },
    { index: 28, excelHeader: 'KOTA KTP', dbField: 'kota_ktp', type: 'string' },
    { index: 29, excelHeader: 'PROVINSI KTP', dbField: 'provinsi_ktp', type: 'string' },
    { index: 30, excelHeader: 'NOMOR HANDPHONE 2', dbField: 'nomor_handphone_2', type: 'string' },
    { index: 31, excelHeader: 'NOMOR TELEPON RUMAH 1', dbField: 'nomor_telepon_rumah_1', type: 'string' },
    { index: 32, excelHeader: 'NOMOR TELEPON RUMAH 2', dbField: 'nomor_telepon_rumah_2', type: 'string' },
    { index: 33, excelHeader: 'STATUS PERNIKAHAN', dbField: 'status_pernikahan', type: 'string' },
    { index: 34, excelHeader: 'NAMA PASANGAN', dbField: 'nama_pasangan', type: 'string' },
    { index: 35, excelHeader: 'TANGGAL MENIKAH', dbField: 'tanggal_menikah', type: 'date' },
    { index: 36, excelHeader: 'TANGGAL CERAI', dbField: 'tanggal_cerai', type: 'date' },
    { index: 37, excelHeader: 'TANGGAL WAFAT PASANGAN', dbField: 'tanggal_wafat_pasangan', type: 'date' },
    { index: 38, excelHeader: 'PEKERJAAN PASANGAN', dbField: 'pekerjaan_pasangan', type: 'string' },
    { index: 39, excelHeader: 'JUMLAH ANAK', dbField: 'jumlah_anak', type: 'number' },
    { index: 40, excelHeader: 'NOMOR REKENING', dbField: 'nomor_rekening', type: 'string' },
    { index: 41, excelHeader: 'NAMA PEMEGANG REKENING', dbField: 'nama_pemegang_rekening', type: 'string' },
    { index: 42, excelHeader: 'NAMA BANK', dbField: 'nama_bank', type: 'string' },
    { index: 43, excelHeader: 'CABANG BANK', dbField: 'cabang_bank', type: 'string' },
    { index: 44, excelHeader: 'TANGGAL MASUK GROUP', dbField: 'tanggal_masuk_group', type: 'date' },
    { index: 45, excelHeader: 'TANGGAL MASUK', dbField: 'tanggal_masuk', type: 'date' },
    { index: 46, excelHeader: 'TANGGAL PERMANENT', dbField: 'tanggal_permanent', type: 'date' },
    { index: 47, excelHeader: 'TANGGAL KONTRAK', dbField: 'tanggal_kontrak', type: 'date' },
    { index: 48, excelHeader: 'TANGGAL AKHIR KONTRAK', dbField: 'tanggal_akhir_kontrak', type: 'date' },
    { index: 49, excelHeader: 'TANGGAL BERHENTI', dbField: 'tanggal_berhenti', type: 'date' },
    { index: 50, excelHeader: 'TINGKAT PENDIDIKAN', dbField: 'tingkat_pendidikan', type: 'string' },
    { index: 51, excelHeader: 'BIDANG STUDI', dbField: 'bidang_studi', type: 'string' },
    { index: 52, excelHeader: 'NAMA SEKOLAH', dbField: 'nama_sekolah', type: 'string' },
    { index: 53, excelHeader: 'KOTA SEKOLAH', dbField: 'kota_sekolah', type: 'string' },
    { index: 54, excelHeader: 'STATUS KELULUSAN', dbField: 'status_kelulusan', type: 'string' },
    // ── ANAK 1 (kolom 55–58) ───────────────────────────────────────
    { index: 55, excelHeader: 'NAMA ANAK 1', dbField: '', type: 'anak', anakIndex: 0, anakField: 'nama_anak' },
    { index: 56, excelHeader: 'JENIS KELAMIN ANAK 1', dbField: '', type: 'anak', anakIndex: 0, anakField: 'jenis_kelamin' },
    { index: 57, excelHeader: 'TANGGAL LAHIR ANAK 1', dbField: '', type: 'anak', anakIndex: 0, anakField: 'tanggal_lahir' },
    { index: 58, excelHeader: 'KETERANGAN ANAK 1', dbField: '', type: 'anak', anakIndex: 0, anakField: 'keterangan' },
    // ── ANAK 2 (kolom 59–62) ───────────────────────────────────────
    { index: 59, excelHeader: 'NAMA ANAK 2', dbField: '', type: 'anak', anakIndex: 1, anakField: 'nama_anak' },
    { index: 60, excelHeader: 'JENIS KELAMIN ANAK 2', dbField: '', type: 'anak', anakIndex: 1, anakField: 'jenis_kelamin' },
    { index: 61, excelHeader: 'TANGGAL LAHIR ANAK 2', dbField: '', type: 'anak', anakIndex: 1, anakField: 'tanggal_lahir' },
    { index: 62, excelHeader: 'KETERANGAN ANAK 2', dbField: '', type: 'anak', anakIndex: 1, anakField: 'keterangan' },
    // ── ANAK 3 (kolom 63–66) ───────────────────────────────────────
    { index: 63, excelHeader: 'NAMA ANAK 3', dbField: '', type: 'anak', anakIndex: 2, anakField: 'nama_anak' },
    { index: 64, excelHeader: 'JENIS KELAMIN ANAK 3', dbField: '', type: 'anak', anakIndex: 2, anakField: 'jenis_kelamin' },
    { index: 65, excelHeader: 'TANGGAL LAHIR ANAK 3', dbField: '', type: 'anak', anakIndex: 2, anakField: 'tanggal_lahir' },
    { index: 66, excelHeader: 'KETERANGAN ANAK 3', dbField: '', type: 'anak', anakIndex: 2, anakField: 'keterangan' },
    // ── ANAK 4 (kolom 67–70) ───────────────────────────────────────
    { index: 67, excelHeader: 'NAMA ANAK 4', dbField: '', type: 'anak', anakIndex: 3, anakField: 'nama_anak' },
    { index: 68, excelHeader: 'JENIS KELAMIN ANAK 4', dbField: '', type: 'anak', anakIndex: 3, anakField: 'jenis_kelamin' },
    { index: 69, excelHeader: 'TANGGAL LAHIR ANAK 4', dbField: '', type: 'anak', anakIndex: 3, anakField: 'tanggal_lahir' },
    { index: 70, excelHeader: 'KETERANGAN ANAK 4', dbField: '', type: 'anak', anakIndex: 3, anakField: 'keterangan' },
    // ── Keluarga lanjutan (kolom 71–80) ─────────────────────────────
    { index: 71, excelHeader: 'KETERANGAN PENDIDIKAN', dbField: 'keterangan_pendidikan', type: 'string' },
    { index: 72, excelHeader: 'NO DANA PENSIUN', dbField: 'no_dana_pensiun', type: 'string' },
    { index: 73, excelHeader: 'TANGGAL LAHIR PASANGAN', dbField: 'tanggal_lahir_pasangan', type: 'date' },
    { index: 74, excelHeader: 'PENDIDIKAN TERAKHIR PASANGAN', dbField: 'pendidikan_terakhir_pasangan', type: 'string' },
    { index: 75, excelHeader: 'KETERANGAN PASANGAN', dbField: 'keterangan_pasangan', type: 'string' },
    { index: 76, excelHeader: 'NAMA AYAH KANDUNG', dbField: 'nama_ayah_kandung', type: 'string' },
    { index: 77, excelHeader: 'TANGGAL LAHIR AYAH KANDUNG', dbField: 'tanggal_lahir_ayah_kandung', type: 'date' },
    { index: 78, excelHeader: 'PENDIDIKAN TERAKHIR AYAH', dbField: 'pendidikan_terakhir_ayah', type: 'string' },
    { index: 79, excelHeader: 'PEKERJAAN AYAH', dbField: 'pekerjaan_ayah', type: 'string' },
    { index: 80, excelHeader: 'KETERANGAN AYAH', dbField: 'keterangan_ayah', type: 'string' },
    // ── SAUDARA KANDUNG 1 (kolom 81–86) ────────────────────────────
    { index: 81, excelHeader: 'NAMA SAUDARA KANDUNG 1', dbField: '', type: 'saudara', saudaraIndex: 0, saudaraField: 'nama_saudara_kandung' },
    { index: 82, excelHeader: 'JENIS KELAMIN SAUDARA 1', dbField: '', type: 'saudara', saudaraIndex: 0, saudaraField: 'jenis_kelamin' },
    { index: 83, excelHeader: 'TANGGAL LAHIR SAUDARA 1', dbField: '', type: 'saudara', saudaraIndex: 0, saudaraField: 'tanggal_lahir' },
    { index: 84, excelHeader: 'PENDIDIKAN TERAKHIR SAUDARA 1', dbField: '', type: 'saudara', saudaraIndex: 0, saudaraField: 'pendidikan_terakhir' },
    { index: 85, excelHeader: 'PEKERJAAN SAUDARA 1', dbField: '', type: 'saudara', saudaraIndex: 0, saudaraField: 'pekerjaan' },
    { index: 86, excelHeader: 'KETERANGAN SAUDARA 1', dbField: '', type: 'saudara', saudaraIndex: 0, saudaraField: 'keterangan' },
    // ── SAUDARA KANDUNG 2 (kolom 87–92) ────────────────────────────
    { index: 87, excelHeader: 'NAMA SAUDARA KANDUNG 2', dbField: '', type: 'saudara', saudaraIndex: 1, saudaraField: 'nama_saudara_kandung' },
    { index: 88, excelHeader: 'JENIS KELAMIN SAUDARA 2', dbField: '', type: 'saudara', saudaraIndex: 1, saudaraField: 'jenis_kelamin' },
    { index: 89, excelHeader: 'TANGGAL LAHIR SAUDARA 2', dbField: '', type: 'saudara', saudaraIndex: 1, saudaraField: 'tanggal_lahir' },
    { index: 90, excelHeader: 'PENDIDIKAN TERAKHIR SAUDARA 2', dbField: '', type: 'saudara', saudaraIndex: 1, saudaraField: 'pendidikan_terakhir' },
    { index: 91, excelHeader: 'PEKERJAAN SAUDARA 2', dbField: '', type: 'saudara', saudaraIndex: 1, saudaraField: 'pekerjaan' },
    { index: 92, excelHeader: 'KETERANGAN SAUDARA 2', dbField: '', type: 'saudara', saudaraIndex: 1, saudaraField: 'keterangan' },
    // ── SAUDARA KANDUNG 3 (kolom 93–98) ────────────────────────────
    { index: 93, excelHeader: 'NAMA SAUDARA KANDUNG 3', dbField: '', type: 'saudara', saudaraIndex: 2, saudaraField: 'nama_saudara_kandung' },
    { index: 94, excelHeader: 'JENIS KELAMIN SAUDARA 3', dbField: '', type: 'saudara', saudaraIndex: 2, saudaraField: 'jenis_kelamin' },
    { index: 95, excelHeader: 'TANGGAL LAHIR SAUDARA 3', dbField: '', type: 'saudara', saudaraIndex: 2, saudaraField: 'tanggal_lahir' },
    { index: 96, excelHeader: 'PENDIDIKAN TERAKHIR SAUDARA 3', dbField: '', type: 'saudara', saudaraIndex: 2, saudaraField: 'pendidikan_terakhir' },
    { index: 97, excelHeader: 'PEKERJAAN SAUDARA 3', dbField: '', type: 'saudara', saudaraIndex: 2, saudaraField: 'pekerjaan' },
    { index: 98, excelHeader: 'KETERANGAN SAUDARA 3', dbField: '', type: 'saudara', saudaraIndex: 2, saudaraField: 'keterangan' },
    // ── SAUDARA KANDUNG 4 (kolom 99–104) ───────────────────────────
    { index: 99, excelHeader: 'NAMA SAUDARA KANDUNG 4', dbField: '', type: 'saudara', saudaraIndex: 3, saudaraField: 'nama_saudara_kandung' },
    { index: 100, excelHeader: 'JENIS KELAMIN SAUDARA 4', dbField: '', type: 'saudara', saudaraIndex: 3, saudaraField: 'jenis_kelamin' },
    { index: 101, excelHeader: 'TANGGAL LAHIR SAUDARA 4', dbField: '', type: 'saudara', saudaraIndex: 3, saudaraField: 'tanggal_lahir' },
    { index: 102, excelHeader: 'PENDIDIKAN TERAKHIR SAUDARA 4', dbField: '', type: 'saudara', saudaraIndex: 3, saudaraField: 'pendidikan_terakhir' },
    { index: 103, excelHeader: 'PEKERJAAN SAUDARA 4', dbField: '', type: 'saudara', saudaraIndex: 3, saudaraField: 'pekerjaan' },
    { index: 104, excelHeader: 'KETERANGAN SAUDARA 4', dbField: '', type: 'saudara', saudaraIndex: 3, saudaraField: 'keterangan' },
    // ── SAUDARA KANDUNG 5 (kolom 105–110) ──────────────────────────
    { index: 105, excelHeader: 'NAMA SAUDARA KANDUNG 5', dbField: '', type: 'saudara', saudaraIndex: 4, saudaraField: 'nama_saudara_kandung' },
    { index: 106, excelHeader: 'JENIS KELAMIN SAUDARA 5', dbField: '', type: 'saudara', saudaraIndex: 4, saudaraField: 'jenis_kelamin' },
    { index: 107, excelHeader: 'TANGGAL LAHIR SAUDARA 5', dbField: '', type: 'saudara', saudaraIndex: 4, saudaraField: 'tanggal_lahir' },
    { index: 108, excelHeader: 'PENDIDIKAN TERAKHIR SAUDARA 5', dbField: '', type: 'saudara', saudaraIndex: 4, saudaraField: 'pendidikan_terakhir' },
    { index: 109, excelHeader: 'PEKERJAAN SAUDARA 5', dbField: '', type: 'saudara', saudaraIndex: 4, saudaraField: 'pekerjaan' },
    { index: 110, excelHeader: 'KETERANGAN SAUDARA 5', dbField: '', type: 'saudara', saudaraIndex: 4, saudaraField: 'keterangan' },
    // ── Keluarga lanjutan (kolom 111–123) ───────────────────────────
    { index: 111, excelHeader: 'NAMA IBU KANDUNG', dbField: 'nama_ibu_kandung', type: 'string' },
    { index: 112, excelHeader: 'TANGGAL LAHIR IBU KANDUNG', dbField: 'tanggal_lahir_ibu_kandung', type: 'date' },
    { index: 113, excelHeader: 'PENDIDIKAN TERAKHIR IBU', dbField: 'pendidikan_terakhir_ibu', type: 'string' },
    { index: 114, excelHeader: 'PEKERJAAN IBU', dbField: 'pekerjaan_ibu', type: 'string' },
    { index: 115, excelHeader: 'KETERANGAN IBU', dbField: 'keterangan_ibu', type: 'string' },
    { index: 116, excelHeader: 'ANAK KE', dbField: 'anak_ke', type: 'number' },
    { index: 117, excelHeader: 'JUMLAH SAUDARA KANDUNG', dbField: 'jumlah_saudara_kandung', type: 'number' },
    { index: 118, excelHeader: 'NAMA AYAH MERTUA', dbField: 'nama_ayah_mertua', type: 'string' },
    { index: 119, excelHeader: 'TANGGAL LAHIR AYAH MERTUA', dbField: 'tanggal_lahir_ayah_mertua', type: 'date' },
    { index: 120, excelHeader: 'PENDIDIKAN TERAKHIR AYAH MERTUA', dbField: 'pendidikan_terakhir_ayah_mertua', type: 'string' },
    { index: 121, excelHeader: 'PEKERJAAN AYAH MERTUA', dbField: 'pekerjaan_ayah_mertua', type: 'string' },
    { index: 122, excelHeader: 'KETERANGAN AYAH MERTUA', dbField: 'keterangan_ayah_mertua', type: 'string' },
    { index: 123, excelHeader: 'NAMA IBU MERTUA', dbField: 'nama_ibu_mertua', type: 'string' },
    // ── Organisasi (kolom 124–136) ──────────────────────────────────
    { index: 124, excelHeader: 'ORGANISSASI SUB DEPARTMENT', dbField: '', type: 'skip' },
    { index: 125, excelHeader: 'DEPARTMENT', dbField: 'department_id', type: 'master', masterConfig: { model: 'department', nameField: 'nama_department' } },
    { index: 126, excelHeader: 'DIVISI', dbField: 'divisi_id', type: 'master', masterConfig: { model: 'divisi', nameField: 'nama_divisi' } },
    { index: 127, excelHeader: 'TANGGAL LAHIR IBU MERTUA', dbField: 'tanggal_lahir_ibu_mertua', type: 'date' },
    { index: 128, excelHeader: 'PENDIDIKAN TERAKHIR IBU MERTUA', dbField: 'pendidikan_terakhir_ibu_mertua', type: 'string' },
    { index: 129, excelHeader: 'PEKERJAAN IBU MERTUA', dbField: 'pekerjaan_ibu_mertua', type: 'string' },
    { index: 130, excelHeader: 'KETERANGAN IBU MERTUA', dbField: 'keterangan_ibu_mertua', type: 'string' },
    { index: 131, excelHeader: 'NAMA KONTAK DARURAT 1', dbField: 'nama_kontak_darurat_1', type: 'string' },
    { index: 132, excelHeader: 'NOMOR TELEPON KONTAK DARURAT 1', dbField: 'nomor_telepon_kontak_darurat_1', type: 'string' },
    { index: 133, excelHeader: 'HUBUNGAN KONTAK DARURAT 1', dbField: 'hubungan_kontak_darurat_1', type: 'string' },
    { index: 134, excelHeader: 'ALAMAT KONTAK DARURAT 1', dbField: 'alamat_kontak_darurat_1', type: 'string' },
    { index: 135, excelHeader: 'NAMA KONTAK DARURAT 2', dbField: 'nama_kontak_darurat_2', type: 'string' },
    { index: 136, excelHeader: 'UNIT YANG DI BAWAH', dbField: '', type: 'skip' },
    { index: 137, excelHeader: 'NOMOR TELEPON KONTAK DARURAT 2', dbField: 'nomor_telepon_kontak_darurat_2', type: 'string' },
    { index: 138, excelHeader: 'HUBUNGAN KONTAK DARURAT 2', dbField: 'hubungan_kontak_darurat_2', type: 'string' },
    { index: 139, excelHeader: 'ALAMAT KONTAK DARURAT 2', dbField: 'alamat_kontak_darurat_2', type: 'string' },
    { index: 140, excelHeader: 'POINT OF ORIGINAL', dbField: 'point_of_original', type: 'string' },
    { index: 141, excelHeader: 'LOKASI KERJA', dbField: 'lokasi_kerja_id', type: 'master', masterConfig: { model: 'lokasiKerja', nameField: 'nama_lokasi_kerja' } },
    { index: 142, excelHeader: 'STATUS KARYAWAN', dbField: 'status_karyawan_id', type: 'master', masterConfig: { model: 'statusKaryawan', nameField: 'nama_status' } },
    { index: 143, excelHeader: 'TAG', dbField: 'tag_id', type: 'master', masterConfig: { model: 'tag', nameField: 'nama_tag' } },
    { index: 144, excelHeader: 'POINT OF HIRE', dbField: 'point_of_hire', type: 'string' },
    { index: 145, excelHeader: 'UKURAN SERAGAM KERJA', dbField: 'ukuran_seragam_kerja', type: 'string' },
    { index: 146, excelHeader: 'UKURAN SEPATU KERJA', dbField: 'ukuran_sepatu_kerja', type: 'string' },
    { index: 147, excelHeader: 'SIKLUS PEMBAYARAN GAJI', dbField: 'siklus_pembayaran_gaji', type: 'string' },
    { index: 148, excelHeader: 'COSTING', dbField: 'costing', type: 'string' },
];

// ── DETAIL_INCLUDE (sama dengan karyawan.service.ts) ───────────────

const DETAIL_INCLUDE = {
    divisi: true,
    department: true,
    posisi_jabatan: true,
    status_karyawan: true,
    lokasi_kerja: true,
    lokasi_sebelumnya: true,
    tag: true,
    jenis_hubungan_kerja: true,
    kategori_pangkat: true,
    golongan_pangkat: true,
    sub_golongan_pangkat: true,
    manager: {
        select: {
            id: true,
            nama_lengkap: true,
            nomor_induk_karyawan: true,
        },
    },
    atasan_langsung: {
        select: {
            id: true,
            nama_lengkap: true,
            nomor_induk_karyawan: true,
        },
    },
    anak: true,
    saudara_kandung: true,
};

// ── Field wajib untuk validasi ─────────────────────────────────────

const REQUIRED_PREVIEW_FIELDS = [
    'nomor_induk_karyawan',
    'nama_lengkap',
    'divisi_id',
    'department_id',
    'posisi_jabatan_id',
    'status_karyawan_id',
    'lokasi_kerja_id',
];

// Label ramah pengguna untuk pesan error field wajib
const REQUIRED_FIELD_LABELS: Record<string, string> = {
    nomor_induk_karyawan: 'Nomor Induk Karyawan',
    nama_lengkap: 'Nama Lengkap',
    divisi_id: 'Divisi',
    department_id: 'Department',
    posisi_jabatan_id: 'Posisi Jabatan',
    status_karyawan_id: 'Status Karyawan',
    lokasi_kerja_id: 'Lokasi Kerja',
};

// ── Helper: getCellValue ───────────────────────────────────────────

function getCellValue(cell: ExcelJS.Cell): string {
    if (cell === null || cell === undefined) return '';
    const value = cell.value;
    if (value === null || value === undefined) return '';
    if (typeof value === 'object' && 'result' in value) return String((value as any).result ?? '');
    if (typeof value === 'object' && 'text' in value) return String((value as any).text ?? '');
    if (value instanceof Date) return value.toISOString();
    return String(value).trim();
}

// ── Helper: resolveMasterData ──────────────────────────────────────

async function resolveMasterData(
    model: string,
    nameField: string,
    value: string,
    extraData?: Record<string, any>
): Promise<string> {
    const prismaModel = (prisma as any)[model];
    if (!prismaModel) {
        throw new Error(`Model Prisma "${model}" tidak ditemukan`);
    }

    const record = await prismaModel.upsert({
        where: { [nameField]: value },
        create: { [nameField]: value, status: 'Aktif', ...extraData },
        update: {},
    });

    return record.id;
}

// ── Helper: parseExcelBuffer ───────────────────────────────────────

async function parseExcelBuffer(buffer: Buffer): Promise<ExcelJS.Row[]> {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer as any);

    const sheet = workbook.getWorksheet('Masterdata');
    if (!sheet) {
        const error: any = new Error('Sheet "Masterdata" tidak ditemukan dalam file Excel');
        error.status = 400;
        throw error;
    }

    const rows: ExcelJS.Row[] = [];
    sheet.eachRow((row, rowNumber) => {
        if (rowNumber >= 2) {
            rows.push(row);
        }
    });

    return rows;
}

// ── Helper: mapRowToPreview ────────────────────────────────────────

function mapRowToPreview(
    row: ExcelJS.Row,
    rowNumber: number
): ImportPreviewRow {
    const errors: string[] = [];
    const warnings: string[] = [];
    const data: Record<string, any> = { rowNumber };

    const anakList: Record<string, any>[] = [];
    const saudaraList: Record<string, any>[] = [];

    for (const col of COLUMN_MAP) {
        const cellValue = getCellValue(row.getCell(col.index));
        if (!cellValue) continue;

        switch (col.type) {
            case 'skip':
                break;
            case 'string':
                data[col.dbField] = cellValue;
                break;
            case 'number': {
                const num = Number(cellValue);
                if (isNaN(num)) {
                    warnings.push(`Kolom "${col.excelHeader}" bukan angka valid: "${cellValue}"`);
                } else {
                    data[col.dbField] = num;
                }
                break;
            }
            case 'date': {
                const dateVal = new Date(cellValue);
                if (isNaN(dateVal.getTime())) {
                    warnings.push(`Kolom "${col.excelHeader}" bukan tanggal valid: "${cellValue}"`);
                } else {
                    data[col.dbField] = cellValue;
                }
                break;
            }
            case 'master':
                // Untuk preview, simpan nama saja (bukan resolve ID)
                data[col.dbField] = cellValue;
                break;
            case 'anak':
                if (col.anakIndex !== undefined && col.anakField) {
                    if (!anakList[col.anakIndex]) anakList[col.anakIndex] = {};
                    anakList[col.anakIndex][col.anakField] = cellValue;
                }
                break;
            case 'saudara':
                if (col.saudaraIndex !== undefined && col.saudaraField) {
                    if (!saudaraList[col.saudaraIndex]) saudaraList[col.saudaraIndex] = {};
                    saudaraList[col.saudaraIndex][col.saudaraField] = cellValue;
                }
                break;
        }
    }

    // Validasi field wajib
    for (const field of REQUIRED_PREVIEW_FIELDS) {
        if (!data[field]) {
            const label = REQUIRED_FIELD_LABELS[field] || field;
            errors.push(`Field "${label}" wajib diisi`);
        }
    }

    // Simpan anak & saudara yang valid ke data preview
    const validAnak = anakList.filter((a) => a && a.nama_anak);
    const validSaudara = saudaraList.filter((s) => s && s.nama_saudara_kandung);
    if (validAnak.length > 0) data.anak = validAnak;
    if (validSaudara.length > 0) data.saudara_kandung = validSaudara;

    return {
        ...data,
        rowNumber,
        errors,
        warnings,
        isValid: errors.length === 0,
    } as ImportPreviewRow;
}

// ── previewImport ──────────────────────────────────────────────────

export async function previewImport(buffer: Buffer): Promise<ImportPreviewResult> {
    const rows = await parseExcelBuffer(buffer);

    const previewRows: ImportPreviewRow[] = [];
    const nikSet = new Set<string>();

    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const rowNumber = i + 2; // Baris 1 = header
        const preview = mapRowToPreview(row, rowNumber);

        // Cek duplikat NIK dalam file
        if (preview.nomor_induk_karyawan) {
            if (nikSet.has(preview.nomor_induk_karyawan)) {
                preview.warnings.push(`NIK "${preview.nomor_induk_karyawan}" duplikat dalam file`);
            }
            nikSet.add(preview.nomor_induk_karyawan);
        }

        previewRows.push(preview);
    }

    const valid = previewRows.filter((r) => r.isValid).length;
    const invalid = previewRows.filter((r) => !r.isValid).length;

    return {
        rows: previewRows,
        summary: {
            total: previewRows.length,
            valid,
            invalid,
        },
    };
}

// ── executeImport ──────────────────────────────────────────────────

export async function executeImport(buffer: Buffer): Promise<ImportExecuteResult> {
    const rows = await parseExcelBuffer(buffer);

    let berhasil = 0;
    let diperbarui = 0;
    let gagal = 0;
    const errors: Array<{ rowNumber: number; nik: string; pesan: string }> = [];

    // Cache untuk master data agar tidak query berulang
    const masterCache = new Map<string, string>();

    // Proses per batch 50 baris
    const BATCH_SIZE = 50;
    for (let batchStart = 0; batchStart < rows.length; batchStart += BATCH_SIZE) {
        const batch = rows.slice(batchStart, batchStart + BATCH_SIZE);

        for (let i = 0; i < batch.length; i++) {
            const row = batch[i];
            const rowNumber = batchStart + i + 2;
            const nik = getCellValue(row.getCell(1));

            try {
                // Validasi field wajib sebelum proses (reuse REQUIRED_PREVIEW_FIELDS)
                const requiredFieldErrors: string[] = [];
                for (const reqField of REQUIRED_PREVIEW_FIELDS) {
                    const colDef = COLUMN_MAP.find((c) => c.dbField === reqField);
                    if (!colDef) continue;
                    const cellVal = getCellValue(row.getCell(colDef.index));
                    if (!cellVal) {
                        const label = REQUIRED_FIELD_LABELS[reqField] || reqField;
                        requiredFieldErrors.push(`${label} wajib diisi`);
                    }
                }
                if (requiredFieldErrors.length > 0) {
                    gagal++;
                    errors.push({
                        rowNumber,
                        nik: nik || '',
                        pesan: requiredFieldErrors.join('; '),
                    });
                    continue;
                }

                const karyawanData: Record<string, any> = {};
                const anakList: Record<string, any>[] = [];
                const saudaraList: Record<string, any>[] = [];

                // Resolve divisi terlebih dahulu (untuk FK dependency)
                let resolvedDivisiId: string | undefined;
                const divisiCol = COLUMN_MAP.find((c) => c.dbField === 'divisi_id');
                if (divisiCol) {
                    const divisiValue = getCellValue(row.getCell(divisiCol.index));
                    if (divisiValue && divisiCol.masterConfig) {
                        const cacheKey = `${divisiCol.masterConfig.model}:${divisiValue}`;
                        if (masterCache.has(cacheKey)) {
                            resolvedDivisiId = masterCache.get(cacheKey)!;
                        } else {
                            resolvedDivisiId = await resolveMasterData(
                                divisiCol.masterConfig.model,
                                divisiCol.masterConfig.nameField,
                                divisiValue
                            );
                            masterCache.set(cacheKey, resolvedDivisiId);
                        }
                        karyawanData['divisi_id'] = resolvedDivisiId;
                    }
                }

                // Resolve department (butuh divisi_id untuk FK)
                let resolvedDepartmentId: string | undefined;
                const deptCol = COLUMN_MAP.find((c) => c.dbField === 'department_id');
                if (deptCol) {
                    const deptValue = getCellValue(row.getCell(deptCol.index));
                    if (deptValue && deptCol.masterConfig) {
                        const cacheKey = `${deptCol.masterConfig.model}:${deptValue}`;
                        if (masterCache.has(cacheKey)) {
                            resolvedDepartmentId = masterCache.get(cacheKey)!;
                        } else {
                            resolvedDepartmentId = await resolveMasterData(
                                deptCol.masterConfig.model,
                                deptCol.masterConfig.nameField,
                                deptValue,
                                resolvedDivisiId ? { divisi_id: resolvedDivisiId } : undefined
                            );
                            masterCache.set(cacheKey, resolvedDepartmentId);
                        }
                        karyawanData['department_id'] = resolvedDepartmentId;
                    }
                }

                // Iterasi semua kolom lainnya
                for (const col of COLUMN_MAP) {
                    // Skip kolom yang sudah di-handle
                    if (col.dbField === 'divisi_id' || col.dbField === 'department_id') continue;

                    const cellValue = getCellValue(row.getCell(col.index));
                    if (!cellValue) continue;

                    switch (col.type) {
                        case 'skip':
                            break;
                        case 'string':
                            // Manager & atasan langsung: resolve by NIK
                            if (col.dbField === 'manager_id' || col.dbField === 'atasan_langsung_id') {
                                const refKaryawan = await prisma.karyawan.findUnique({
                                    where: { nomor_induk_karyawan: cellValue },
                                    select: { id: true },
                                });
                                if (refKaryawan) {
                                    karyawanData[col.dbField] = refKaryawan.id;
                                }
                            } else {
                                karyawanData[col.dbField] = cellValue;
                            }
                            break;
                        case 'number': {
                            const num = Number(cellValue);
                            if (!isNaN(num)) {
                                karyawanData[col.dbField] = num;
                            }
                            break;
                        }
                        case 'date': {
                            const dateVal = new Date(cellValue);
                            if (!isNaN(dateVal.getTime())) {
                                karyawanData[col.dbField] = dateVal;
                            }
                            break;
                        }
                        case 'master': {
                            if (!col.masterConfig) break;
                            const cacheKey = `${col.masterConfig.model}:${cellValue}`;
                            let masterId: string;
                            if (masterCache.has(cacheKey)) {
                                masterId = masterCache.get(cacheKey)!;
                            } else {
                                // PosisiJabatan butuh department_id
                                const extra: Record<string, any> = {};
                                if (col.masterConfig.model === 'posisiJabatan' && resolvedDepartmentId) {
                                    extra.department_id = resolvedDepartmentId;
                                }
                                masterId = await resolveMasterData(
                                    col.masterConfig.model,
                                    col.masterConfig.nameField,
                                    cellValue,
                                    Object.keys(extra).length > 0 ? extra : undefined
                                );
                                masterCache.set(cacheKey, masterId);
                            }
                            karyawanData[col.dbField] = masterId;
                            break;
                        }
                        case 'anak':
                            if (col.anakIndex !== undefined && col.anakField) {
                                if (!anakList[col.anakIndex]) anakList[col.anakIndex] = {};
                                if (col.anakField === 'tanggal_lahir') {
                                    const d = new Date(cellValue);
                                    if (!isNaN(d.getTime())) anakList[col.anakIndex][col.anakField] = d;
                                } else {
                                    anakList[col.anakIndex][col.anakField] = cellValue;
                                }
                            }
                            break;
                        case 'saudara':
                            if (col.saudaraIndex !== undefined && col.saudaraField) {
                                if (!saudaraList[col.saudaraIndex]) saudaraList[col.saudaraIndex] = {};
                                if (col.saudaraField === 'tanggal_lahir') {
                                    const d = new Date(cellValue);
                                    if (!isNaN(d.getTime())) saudaraList[col.saudaraIndex][col.saudaraField] = d;
                                } else {
                                    saudaraList[col.saudaraIndex][col.saudaraField] = cellValue;
                                }
                            }
                            break;
                    }
                }

                // Validasi NIK sudah dilakukan di awal via REQUIRED_PREVIEW_FIELDS

                // Filter anak & saudara yang valid
                const validAnak = anakList.filter((a) => a && a.nama_anak);
                const validSaudara = saudaraList.filter((s) => s && s.nama_saudara_kandung);

                // Cek apakah karyawan sudah ada
                const existing = await prisma.karyawan.findUnique({
                    where: { nomor_induk_karyawan: nik },
                    select: { id: true },
                });

                await prisma.$transaction(async (tx) => {
                    if (existing) {
                        // Update karyawan
                        await tx.anak.deleteMany({ where: { karyawan_id: existing.id } });
                        await tx.saudaraKandung.deleteMany({ where: { karyawan_id: existing.id } });

                        await tx.karyawan.update({
                            where: { id: existing.id },
                            data: {
                                ...karyawanData,
                                ...(validAnak.length > 0 && {
                                    anak: { create: validAnak as any },
                                }),
                                ...(validSaudara.length > 0 && {
                                    saudara_kandung: { create: validSaudara as any },
                                }),
                            },
                        });
                    } else {
                        // Create karyawan baru
                        await tx.karyawan.create({
                            data: {
                                ...karyawanData,
                                ...(validAnak.length > 0 && {
                                    anak: { create: validAnak as any },
                                }),
                                ...(validSaudara.length > 0 && {
                                    saudara_kandung: { create: validSaudara as any },
                                }),
                            } as any,
                        });
                    }
                });

                if (existing) {
                    diperbarui++;
                } else {
                    berhasil++;
                }
            } catch (err: any) {
                gagal++;
                errors.push({
                    rowNumber,
                    nik: nik || '',
                    pesan: err.message || 'Terjadi kesalahan tidak diketahui',
                });
            }
        }
    }

    return { berhasil, diperbarui, gagal, errors };
}

// ── downloadTemplate ───────────────────────────────────────────────

export function downloadTemplate(): string {
    return path.resolve(__dirname, '../../../assets/templates/BMI-kosong.xlsx');
}

// ── exportKaryawan ─────────────────────────────────────────────────

export async function exportKaryawan(query: ExportQuery): Promise<Buffer> {
    const where: Record<string, any> = {};

    if (query.divisi_id) where.divisi_id = query.divisi_id;
    if (query.department_id) where.department_id = query.department_id;
    if (query.status_karyawan_id) where.status_karyawan_id = query.status_karyawan_id;
    if (query.lokasi_kerja_id) where.lokasi_kerja_id = query.lokasi_kerja_id;

    const karyawanList = await prisma.karyawan.findMany({
        where,
        include: DETAIL_INCLUDE,
        orderBy: { created_at: 'desc' },
    });

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Masterdata');

    // Header row
    const headers = COLUMN_MAP.map((col) => col.excelHeader);
    sheet.addRow(headers);

    // Style header
    const headerRow = sheet.getRow(1);
    headerRow.font = { bold: true };
    headerRow.alignment = { horizontal: 'center' };

    // Data rows
    for (const karyawan of karyawanList) {
        const rowData: any[] = [];

        for (const col of COLUMN_MAP) {
            switch (col.type) {
                case 'skip':
                    rowData.push('');
                    break;
                case 'string':
                case 'number':
                    if (col.dbField === 'manager_id') {
                        rowData.push((karyawan as any).manager?.nomor_induk_karyawan ?? '');
                    } else if (col.dbField === 'atasan_langsung_id') {
                        rowData.push((karyawan as any).atasan_langsung?.nomor_induk_karyawan ?? '');
                    } else {
                        rowData.push((karyawan as any)[col.dbField] ?? '');
                    }
                    break;
                case 'date': {
                    const dateValue = (karyawan as any)[col.dbField];
                    rowData.push(dateValue ? new Date(dateValue) : '');
                    break;
                }
                case 'master': {
                    // Ambil nama dari relasi
                    if (!col.masterConfig) {
                        rowData.push('');
                        break;
                    }
                    const relationMap: Record<string, string> = {
                        posisi_jabatan_id: 'posisi_jabatan',
                        kategori_pangkat_id: 'kategori_pangkat',
                        golongan_pangkat_id: 'golongan_pangkat',
                        sub_golongan_pangkat_id: 'sub_golongan_pangkat',
                        jenis_hubungan_kerja_id: 'jenis_hubungan_kerja',
                        department_id: 'department',
                        divisi_id: 'divisi',
                        lokasi_kerja_id: 'lokasi_kerja',
                        status_karyawan_id: 'status_karyawan',
                        tag_id: 'tag',
                    };
                    const relation = relationMap[col.dbField];
                    if (relation && (karyawan as any)[relation]) {
                        rowData.push((karyawan as any)[relation][col.masterConfig.nameField] ?? '');
                    } else {
                        rowData.push('');
                    }
                    break;
                }
                case 'anak': {
                    const anakArr = (karyawan as any).anak ?? [];
                    const idx = col.anakIndex ?? 0;
                    const field = col.anakField ?? '';
                    if (anakArr[idx]) {
                        const val = anakArr[idx][field];
                        rowData.push(val instanceof Date ? val : (val ?? ''));
                    } else {
                        rowData.push('');
                    }
                    break;
                }
                case 'saudara': {
                    const saudaraArr = (karyawan as any).saudara_kandung ?? [];
                    const idx = col.saudaraIndex ?? 0;
                    const field = col.saudaraField ?? '';
                    if (saudaraArr[idx]) {
                        const val = saudaraArr[idx][field];
                        rowData.push(val instanceof Date ? val : (val ?? ''));
                    } else {
                        rowData.push('');
                    }
                    break;
                }
            }
        }

        sheet.addRow(rowData);
    }

    const arrayBuffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(arrayBuffer) as Buffer;
}
