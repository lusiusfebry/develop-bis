import api from './api';
import type { MasterListQuery, PaginatedResponse } from '@/types/master.types';

// ==========================================
// Generic Master Data Service Factory
// ==========================================

function createMasterService<T>(endpoint: string) {
    return {
        /** Ambil list data dengan paginasi, search, dan filter status */
        getList: async (query: MasterListQuery = {}): Promise<PaginatedResponse<T>> => {
            const params = new URLSearchParams();
            if (query.page) params.append('page', String(query.page));
            if (query.limit) params.append('limit', String(query.limit));
            if (query.search) params.append('search', query.search);
            if (query.status) params.append('status', query.status);

            const { data } = await api.get(`/api/hr/${endpoint}?${params.toString()}`);
            return data;
        },

        /** Ambil dropdown data (hanya status Aktif, limit 100) */
        getDropdown: async (): Promise<T[]> => {
            const { data } = await api.get(`/api/hr/${endpoint}?status=Aktif&limit=100`);
            return data.data ?? data;
        },

        /** Ambil detail berdasarkan ID */
        getById: async (id: string): Promise<T> => {
            const { data } = await api.get(`/api/hr/${endpoint}/${id}`);
            return data.data ?? data;
        },

        /** Buat data baru */
        create: async (payload: Partial<T>): Promise<T> => {
            const { data } = await api.post(`/api/hr/${endpoint}`, payload);
            return data.data ?? data;
        },

        /** Update data berdasarkan ID */
        update: async (id: string, payload: Partial<T>): Promise<T> => {
            const { data } = await api.put(`/api/hr/${endpoint}/${id}`, payload);
            return data.data ?? data;
        },

        /** Toggle status (Aktif ↔ TidakAktif) */
        toggleStatus: async (id: string): Promise<T> => {
            const { data } = await api.patch(`/api/hr/${endpoint}/${id}/status`);
            return data.data ?? data;
        },
    };
}

// ==========================================
// Service Instances (10 entitas)
// ==========================================

export const divisiService = createMasterService<import('@/types/master.types').Divisi>('divisi');
export const departmentService = createMasterService<import('@/types/master.types').Department>('department');
export const posisiJabatanService = createMasterService<import('@/types/master.types').PosisiJabatan>('posisi-jabatan');
export const kategoriPangkatService = createMasterService<import('@/types/master.types').KategoriPangkat>('kategori-pangkat');
export const golonganService = createMasterService<import('@/types/master.types').Golongan>('golongan');
export const subGolonganService = createMasterService<import('@/types/master.types').SubGolongan>('sub-golongan');
export const jenisHubunganKerjaService = createMasterService<import('@/types/master.types').JenisHubunganKerja>('jenis-hubungan-kerja');
export const tagService = createMasterService<import('@/types/master.types').Tag>('tag');
export const lokasiKerjaService = createMasterService<import('@/types/master.types').LokasiKerja>('lokasi-kerja');
export const statusKaryawanService = createMasterService<import('@/types/master.types').StatusKaryawan>('status-karyawan');
