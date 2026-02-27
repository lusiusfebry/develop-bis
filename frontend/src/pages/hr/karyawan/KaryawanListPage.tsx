import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search, Plus, Eye, Inbox, ChevronLeft, ChevronRight, User } from 'lucide-react';
import { Combobox } from '@/components/ui/combobox';
import { karyawanService } from '@/services/karyawan.service';
import { divisiService, departmentService, statusKaryawanService } from '@/services/master.service';

export default function KaryawanListPage() {
    const navigate = useNavigate();

    // Query States
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [search, setSearch] = useState('');
    const [localSearch, setLocalSearch] = useState('');
    const [divisiId, setDivisiId] = useState('');
    const [departmentId, setDepartmentId] = useState('');
    const [statusId, setStatusId] = useState('');

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setSearch(localSearch);
            setPage(1); // Reset page on new search
        }, 300);
        return () => clearTimeout(timer);
    }, [localSearch]);

    // Fetch Master Data Dropdowns
    const { data: divisiList = [] } = useQuery({
        queryKey: ['divisi-dropdown'],
        queryFn: () => divisiService.getDropdown()
    });

    const { data: departmentList = [] } = useQuery({
        queryKey: ['department-dropdown'],
        queryFn: () => departmentService.getDropdown()
    });

    const { data: statusList = [] } = useQuery({
        queryKey: ['status-karyawan-dropdown'],
        queryFn: () => statusKaryawanService.getDropdown()
    });

    // Fetch Karyawan List
    const { data, isLoading } = useQuery({
        queryKey: ['karyawan-list', { search, divisi_id: divisiId, department_id: departmentId, status_karyawan_id: statusId, page, limit }],
        queryFn: () => karyawanService.getList({
            search,
            divisi_id: divisiId || undefined,
            department_id: departmentId || undefined,
            status_karyawan_id: statusId || undefined,
            page,
            limit
        })
    });

    const karyawanList = data?.data || [];
    const meta = data?.meta || { total: 0, page: 1, limit: 10, totalPages: 1 };

    const startRow = (meta.page - 1) * meta.limit + 1;
    const endRow = Math.min(meta.page * meta.limit, meta.total);

    const columns = [
        { key: 'no', label: 'No' },
        { key: 'foto', label: 'Foto' },
        { key: 'nama_lengkap', label: 'Nama Lengkap' },
        { key: 'nik', label: 'NIK' },
        { key: 'divisi', label: 'Divisi' },
        { key: 'department', label: 'Department' },
        { key: 'posisi', label: 'Posisi Jabatan' },
        { key: 'status', label: 'Status' },
        { key: 'lokasi', label: 'Lokasi Kerja' },
        { key: 'aksi', label: 'Aksi' }
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Data Karyawan</h1>
                    <p className="text-muted-foreground text-sm mt-1">Kelola data seluruh karyawan perusahaan</p>
                </div>
                <button
                    onClick={() => navigate('/hr/karyawan/baru')}
                    className="flex items-center gap-2 px-4 py-2.5 bg-accent/50 hover:bg-accent/80 border border-border/50 hover:border-border/80 text-foreground rounded-2xl text-sm font-medium transition-all duration-300 cursor-pointer shadow-sm active:scale-95"
                >
                    <Plus className="w-4 h-4" />
                    Tambah Karyawan
                </button>
            </div>

            <div className="space-y-4">
                {/* Filters */}
                <div className="flex flex-col sm:flex-row items-center gap-3">
                    {/* Search */}
                    <div className="relative flex-1 w-full sm:max-w-xs">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/80" />
                        <input
                            type="text"
                            placeholder="Cari nama atau NIK..."
                            value={localSearch}
                            onChange={(e) => setLocalSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-card border border-border/50 text-sm text-white placeholder:text-muted-foreground/80 focus:outline-none focus:border-border/80 focus:ring-1 focus:ring-ring/50 transition-all duration-300 hover:border-border hover:bg-accent"
                        />
                    </div>

                    {/* Divisi */}
                    <div className="w-full sm:w-48">
                        <Combobox
                            value={divisiId}
                            onChange={(val) => { setDivisiId(val); setPage(1); }}
                            options={divisiList
                                .filter((d: { status: string }) => d.status === 'Aktif')
                                .map((d: { id: string; nama_divisi: string }) => ({ value: d.id, label: d.nama_divisi }))}
                            placeholder="Semua Divisi"
                            allowClear
                        />
                    </div>

                    {/* Department */}
                    <div className="w-full sm:w-48">
                        <Combobox
                            value={departmentId}
                            onChange={(val) => { setDepartmentId(val); setPage(1); }}
                            options={departmentList
                                .filter((d: { status: string }) => d.status === 'Aktif')
                                .map((d: { id: string; nama_department: string }) => ({ value: d.id, label: d.nama_department }))}
                            placeholder="Semua Department"
                            allowClear
                        />
                    </div>

                    {/* Status */}
                    <div className="w-full sm:w-48">
                        <Combobox
                            value={statusId}
                            onChange={(val) => { setStatusId(val); setPage(1); }}
                            options={statusList
                                .filter((s: { status: string }) => s.status === 'Aktif')
                                .map((s: { id: string; nama_status: string }) => ({ value: s.id, label: s.nama_status }))}
                            placeholder="Semua Status"
                            allowClear
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="rounded-2xl border border-border/50 bg-black/20 backdrop-blur-xl shadow-xl overflow-hidden">
                    <div className="overflow-x-auto max-h-[65vh] overflow-y-auto">
                        <table className="w-full text-sm">
                            <thead className="sticky top-0 z-10">
                                <tr className="bg-black/40 backdrop-blur-md border-b border-border/50">
                                    {columns.map((col) => (
                                        <th key={col.key} className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                                            {col.label}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {isLoading ? (
                                    Array.from({ length: 5 }).map((_, rowIdx) => (
                                        <tr key={`skeleton-${rowIdx}`}>
                                            {columns.map((col) => (
                                                <td key={col.key} className="px-4 py-3">
                                                    <div className="h-4 w-24 rounded bg-card animate-pulse" />
                                                </td>
                                            ))}
                                        </tr>
                                    ))
                                ) : karyawanList.length === 0 ? (
                                    <tr>
                                        <td colSpan={columns.length} className="px-4 py-16 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="w-12 h-12 rounded-xl bg-card flex items-center justify-center">
                                                    <Inbox className="w-6 h-6 text-neutral-600" />
                                                </div>
                                                <p className="text-muted-foreground/80 text-sm">Belum ada karyawan yang sesuai</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    karyawanList.map((row: {
                                        id: string;
                                        foto_karyawan: string | null;
                                        nama_lengkap: string;
                                        nomor_induk_karyawan: string;
                                        divisi: { nama_divisi: string } | null;
                                        department: { nama_department: string } | null;
                                        posisi_jabatan: { nama_posisi_jabatan: string } | null;
                                        status_karyawan: { nama_status: string } | null;
                                        lokasi_kerja: { nama_lokasi_kerja: string } | null;
                                    }, index: number) => (
                                        <tr key={row.id} className="even:bg-white/[0.02] hover:bg-white/[0.04] transition-colors duration-150">
                                            <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                                                {startRow + index}
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                                                {row.foto_karyawan ? (
                                                    <img
                                                        src={row.foto_karyawan}
                                                        alt={row.nama_lengkap}
                                                        className="w-8 h-8 rounded-full object-cover bg-accent/50"
                                                    />
                                                ) : (
                                                    <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center">
                                                        <User className="w-4 h-4" />
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{row.nama_lengkap}</td>
                                            <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{row.nomor_induk_karyawan}</td>
                                            <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{row.divisi?.nama_divisi || '-'}</td>
                                            <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{row.department?.nama_department || '-'}</td>
                                            <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{row.posisi_jabatan?.nama_posisi_jabatan || '-'}</td>
                                            <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                                                {row.status_karyawan ? (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-500/15 text-indigo-300 border border-indigo-500/20">
                                                        {row.status_karyawan.nama_status}
                                                    </span>
                                                ) : '-'}
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{row.lokasi_kerja?.nama_lokasi_kerja || '-'}</td>
                                            <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                                                <button
                                                    onClick={() => navigate(`/hr/karyawan/${row.id}`)}
                                                    title="Lihat Detail"
                                                    className="p-2 rounded-lg text-muted-foreground hover:text-indigo-400 hover:bg-indigo-500/10 transition-all duration-200 cursor-pointer"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination */}
                {!isLoading && meta.total > 0 && (
                    <div className="flex items-center justify-between text-sm">
                        <p className="text-muted-foreground/80">
                            Menampilkan {startRow}–{endRow} dari {meta.total} karyawan
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={meta.page <= 1}
                                className="p-2 rounded-lg bg-card border border-border/50 text-muted-foreground hover:text-white hover:bg-accent disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <span className="px-3 py-1.5 rounded-lg bg-indigo-500/15 text-indigo-300 text-xs font-medium border border-indigo-500/20">
                                {meta.page} / {meta.totalPages}
                            </span>
                            <button
                                onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))}
                                disabled={meta.page >= meta.totalPages}
                                className="p-2 rounded-lg bg-card border border-border/50 text-muted-foreground hover:text-white hover:bg-accent disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
