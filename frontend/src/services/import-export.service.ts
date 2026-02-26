import api from './api';
import type { ImportPreviewResult, ImportExecuteResult, ExportQuery } from '../types/import-export.types';

export const importExportService = {
    downloadTemplate: async (): Promise<void> => {
        const response = await api.get('/hr/import/template', {
            responseType: 'blob'
        });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'Template_Import_Karyawan.xlsx');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    },

    previewImport: async (file: File): Promise<ImportPreviewResult> => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post('/hr/import/preview', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data.data;
    },

    executeImport: async (file: File): Promise<ImportExecuteResult> => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post('/hr/import/execute', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data.data;
    },

    exportKaryawan: async (query: ExportQuery): Promise<void> => {
        const response = await api.get('/hr/export', {
            params: query,
            responseType: 'blob'
        });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;

        const date = new Date().toISOString().split('T')[0];
        const filename = `BMI-export-${date}.xlsx`;

        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    }
};
