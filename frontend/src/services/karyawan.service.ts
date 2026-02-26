import api from './api';
import type {
    KaryawanListQuery,
    KaryawanListResponse,
    KaryawanDetail,
    CreateKaryawanInput
} from '../types/karyawan.types';

export const karyawanService = {
    async getList(query?: KaryawanListQuery): Promise<KaryawanListResponse> {
        const response = await api.get('/api/hr/karyawan', { params: query });

        // Ensure returning in { data, meta } format as defined in KaryawanListResponse
        if (response.data.meta) {
            return {
                data: response.data.data,
                meta: response.data.meta
            };
        }

        // Fallback backward compatibility format
        return {
            data: response.data.data.data || response.data.data,
            meta: {
                total: response.data.data.total || 0,
                page: response.data.data.page || 1,
                limit: response.data.data.limit || 10,
                totalPages: response.data.data.totalPages || 1
            }
        };
    },

    async getById(id: string): Promise<KaryawanDetail> {
        const response = await api.get(`/api/hr/karyawan/${id}`);
        return response.data.data;
    },

    async create(data: CreateKaryawanInput): Promise<KaryawanDetail> {
        const response = await api.post('/api/hr/karyawan', data);
        return response.data.data;
    },

    async update(id: string, data: Partial<CreateKaryawanInput>): Promise<KaryawanDetail> {
        const response = await api.put(`/api/hr/karyawan/${id}`, data);
        return response.data.data;
    },

    async uploadFoto(id: string, file: File): Promise<{ foto_karyawan: string }> {
        const formData = new FormData();
        formData.append('foto', file);

        const response = await api.post(`/api/hr/karyawan/${id}/foto`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data.data;
    },

    async getQr(id: string): Promise<{ qr_url: string }> {
        const response = await api.get(`/api/hr/karyawan/${id}/qr`);
        return response.data.data;
    },

    // Kept for backward compatibility if used somewhere else
    async getKaryawanStats(): Promise<{ total: number }> {
        const response = await api.get('/api/hr/karyawan', {
            params: { limit: 1 },
        });

        const total = response.data.meta?.total || response.data.data?.total || 0;
        return { total };
    },
};
