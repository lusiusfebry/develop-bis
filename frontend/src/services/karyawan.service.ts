import api from './api';

export const karyawanService = {
    async getKaryawanStats(): Promise<{ total: number }> {
        const response = await api.get('/api/hr/karyawan', {
            params: { limit: 1 },
        });

        return { total: response.data.data.total };
    },
};
