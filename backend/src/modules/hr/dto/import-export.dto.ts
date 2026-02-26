// ── Interface & Type Definitions untuk Import/Export ───────────────

export interface ImportPreviewRow {
    rowNumber: number;
    nomor_induk_karyawan?: string;
    nama_lengkap?: string;
    posisi_jabatan?: string;
    department?: string;
    divisi?: string;
    status_karyawan?: string;
    lokasi_kerja?: string;
    errors: string[];
    warnings: string[];
    isValid: boolean;
    [key: string]: any;
}

export interface ImportPreviewResult {
    rows: ImportPreviewRow[];
    summary: {
        total: number;
        valid: number;
        invalid: number;
    };
}

export interface ImportExecuteResult {
    berhasil: number;
    diperbarui: number;
    gagal: number;
    errors: Array<{
        rowNumber: number;
        nik: string;
        pesan: string;
    }>;
}

export interface ExportQuery {
    divisi_id?: string;
    department_id?: string;
    status_karyawan_id?: string;
    lokasi_kerja_id?: string;
}
