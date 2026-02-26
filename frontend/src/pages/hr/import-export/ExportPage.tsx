import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FileDown, DownloadCloud, AlertCircle } from 'lucide-react';
import { importExportService } from '../../../services/import-export.service';
import type { ExportQuery } from '../../../types/import-export.types';
import type { Divisi, Department, StatusKaryawan, LokasiKerja } from '../../../types/master.types';
import { divisiService, departmentService, statusKaryawanService, lokasiKerjaService } from '../../../services/master.service';

export default function ExportPage() {
    const [query, setQuery] = useState<ExportQuery>({});
    const [isExporting, setIsExporting] = useState(false);

    // Queries for dropdown options
    const { data: divisiOptions = [] } = useQuery({
        queryKey: ['divisi-dropdown'],
        queryFn: () => divisiService.getDropdown(),
    });

    const { data: departmentOptions = [] } = useQuery({
        queryKey: ['department-dropdown'],
        queryFn: () => departmentService.getDropdown(),
    });

    const { data: statusOptions = [] } = useQuery({
        queryKey: ['statusKaryawan-dropdown'],
        queryFn: () => statusKaryawanService.getDropdown(),
    });

    const { data: lokasiOptions = [] } = useQuery({
        queryKey: ['lokasiKerja-dropdown'],
        queryFn: () => lokasiKerjaService.getDropdown(),
    });

    const handleExport = async () => {
        try {
            setIsExporting(true);
            await importExportService.exportKaryawan(query);
        } catch (error) {
            console.error('Error exporting data:', error);
            alert('Gagal mendownload data. Silakan coba lagi.');
        } finally {
            setIsExporting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value } = e.target;
        setQuery((prev) => ({
            ...prev,
            [name]: value || undefined,
        }));
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-white">Export Data Karyawan</h1>
            </div>

            <div className="bg-[#13131a] rounded-xl border border-white/5 overflow-hidden">
                <div className="p-6 border-b border-white/5 bg-white/5">
                    <div className="flex items-start space-x-4">
                        <div className="p-3 bg-indigo-500/20 rounded-lg shrink-0">
                            <DownloadCloud className="w-6 h-6 text-indigo-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-medium text-white mb-1">Download Format Excel</h2>
                            <p className="text-gray-400 text-sm">
                                Gunakan filter di bawah jika Anda hanya ingin mendownload sebagian data karyawan.
                                Kosongkan semua filter untuk mendownload seluruh data karyawan Bintang Motor.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 flex items-start space-x-3">
                        <AlertCircle className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                        <p className="text-sm text-blue-300">
                            Semua filter bersifat opsional. Data yang diexport mencakup seluruh informasi karyawan
                            seperti data personal, informasi pekerjaan, dan struktur gaji jika Anda memiliki hak akses.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Tanggal Mulai</label>
                            <input
                                type="date"
                                name="tanggal_mulai"
                                value={query.tanggal_mulai || ''}
                                onChange={handleChange}
                                className="w-full bg-[#0a0a0f] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Tanggal Selesai</label>
                            <input
                                type="date"
                                name="tanggal_selesai"
                                value={query.tanggal_selesai || ''}
                                onChange={handleChange}
                                className="w-full bg-[#0a0a0f] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Divisi</label>
                            <select
                                name="divisi_id"
                                value={query.divisi_id || ''}
                                onChange={handleChange}
                                className="w-full bg-[#0a0a0f] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                            >
                                <option value="">Semua Divisi</option>
                                {divisiOptions.map((opt: Divisi) => (
                                    <option key={opt.id} value={opt.id}>
                                        {opt.nama_divisi}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Department</label>
                            <select
                                name="department_id"
                                value={query.department_id || ''}
                                onChange={handleChange}
                                className="w-full bg-[#0a0a0f] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                                disabled={!!query.divisi_id && departmentOptions.filter((d: Department) => d.divisi_id === query.divisi_id).length === 0}
                            >
                                <option value="">Semua Department</option>
                                {departmentOptions
                                    .filter((opt: Department) => !query.divisi_id || opt.divisi_id === query.divisi_id)
                                    .map((opt: Department) => (
                                        <option key={opt.id} value={opt.id}>
                                            {opt.nama_department}
                                        </option>
                                    ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Status Karyawan</label>
                            <select
                                name="status_karyawan_id"
                                value={query.status_karyawan_id || ''}
                                onChange={handleChange}
                                className="w-full bg-[#0a0a0f] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                            >
                                <option value="">Semua Status</option>
                                {statusOptions.map((opt: StatusKaryawan) => (
                                    <option key={opt.id} value={opt.id}>
                                        {opt.nama_status}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Lokasi Kerja</label>
                            <select
                                name="lokasi_kerja_id"
                                value={query.lokasi_kerja_id || ''}
                                onChange={handleChange}
                                className="w-full bg-[#0a0a0f] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                            >
                                <option value="">Semua Lokasi</option>
                                {lokasiOptions.map((opt: LokasiKerja) => (
                                    <option key={opt.id} value={opt.id}>
                                        {opt.nama_lokasi_kerja}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="pt-6 mt-6 border-t border-white/5 flex justify-end">
                        <button
                            onClick={handleExport}
                            disabled={isExporting}
                            className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg flex items-center space-x-2 font-medium transition-colors"
                        >
                            {isExporting ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                    <span>Sedang Menyiapkan...</span>
                                </>
                            ) : (
                                <>
                                    <FileDown className="w-5 h-5" />
                                    <span>Download Excel BMI</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
