// ==========================================
// Master Data Types
// ==========================================

export type MasterStatus = 'Aktif' | 'TidakAktif';
export type SortOrder = 'asc' | 'desc';

// Interface dasar untuk semua entitas master
export interface MasterBase {
    id: string;
    status: MasterStatus;
    keterangan: string | null;
    created_at: string;
    updated_at: string;
}

// ---- Entitas Master ----

export interface Divisi extends MasterBase {
    nama_divisi: string;
}

export interface Department extends MasterBase {
    nama_department: string;
    divisi_id: string;
    nama_divisi?: string; // via relasi
}

export interface PosisiJabatan extends MasterBase {
    nama_posisi_jabatan: string;
    department_id: string;
    nama_department?: string; // via relasi
}

export interface KategoriPangkat extends MasterBase {
    nama_kategori_pangkat: string;
}

export interface Golongan extends MasterBase {
    nama_golongan: string;
}

export interface SubGolongan extends MasterBase {
    nama_sub_golongan: string;
}

export interface JenisHubunganKerja extends MasterBase {
    nama_jenis_hubungan_kerja: string;
}

export interface Tag extends MasterBase {
    nama_tag: string;
    warna_tag: string;
}

export interface LokasiKerja extends MasterBase {
    nama_lokasi_kerja: string;
    alamat: string | null;
}

export interface StatusKaryawan extends MasterBase {
    nama_status: string;
}

// ---- Query & Response ----

export interface MasterListQuery {
    page?: number;
    limit?: number;
    search?: string;
    status?: MasterStatus | '';
    sortKey?: string;
    sortOrder?: SortOrder;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

// ---- Form Field Config ----

export interface FieldConfig {
    name: string;
    label: string;
    type: 'text' | 'textarea' | 'color' | 'select';
    required?: boolean;
    options?: { value: string; label: string }[];
}
