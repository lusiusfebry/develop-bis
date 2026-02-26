// ── Interface & Type Definitions ───────────────────────────────────

export interface MasterEntityConfig {
    modelName: string;
    searchField: string;
    requiredFields: string[];
}

export interface MasterListQuery {
    page?: number;
    limit?: number;
    search?: string;
    status?: 'Aktif' | 'TidakAktif';
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

// ── 10 Config Objects ──────────────────────────────────────────────

export const divisiConfig: MasterEntityConfig = {
    modelName: 'divisi',
    searchField: 'nama_divisi',
    requiredFields: ['nama_divisi'],
};

export const departmentConfig: MasterEntityConfig = {
    modelName: 'department',
    searchField: 'nama_department',
    requiredFields: ['nama_department', 'divisi_id'],
};

export const posisiJabatanConfig: MasterEntityConfig = {
    modelName: 'posisiJabatan',
    searchField: 'nama_posisi_jabatan',
    requiredFields: ['nama_posisi_jabatan', 'department_id'],
};

export const kategoriPangkatConfig: MasterEntityConfig = {
    modelName: 'kategoriPangkat',
    searchField: 'nama_kategori_pangkat',
    requiredFields: ['nama_kategori_pangkat'],
};

export const golonganConfig: MasterEntityConfig = {
    modelName: 'golongan',
    searchField: 'nama_golongan',
    requiredFields: ['nama_golongan'],
};

export const subGolonganConfig: MasterEntityConfig = {
    modelName: 'subGolongan',
    searchField: 'nama_sub_golongan',
    requiredFields: ['nama_sub_golongan'],
};

export const jenisHubunganKerjaConfig: MasterEntityConfig = {
    modelName: 'jenisHubunganKerja',
    searchField: 'nama_jenis_hubungan_kerja',
    requiredFields: ['nama_jenis_hubungan_kerja'],
};

export const tagConfig: MasterEntityConfig = {
    modelName: 'tag',
    searchField: 'nama_tag',
    requiredFields: ['nama_tag', 'warna_tag'],
};

export const lokasiKerjaConfig: MasterEntityConfig = {
    modelName: 'lokasiKerja',
    searchField: 'nama_lokasi_kerja',
    requiredFields: ['nama_lokasi_kerja'],
};

export const statusKaryawanConfig: MasterEntityConfig = {
    modelName: 'statusKaryawan',
    searchField: 'nama_status',
    requiredFields: ['nama_status'],
};
