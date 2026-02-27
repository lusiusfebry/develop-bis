import { useState, useEffect, type ReactNode } from 'react';
import { Search, Pencil, ToggleLeft, ToggleRight, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, ChevronsUpDown, Inbox } from 'lucide-react';
import type { MasterStatus, SortOrder } from '@/types/master.types';
import { toast } from 'sonner';

export interface ColumnDef {
    key: string;
    label: string;
    sortable?: boolean;
    render?: (row: Record<string, unknown>) => ReactNode;
}

interface MasterDataTableProps {
    columns: ColumnDef[];
    data: Record<string, unknown>[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    isLoading: boolean;
    search: string;
    onSearchChange: (value: string) => void;
    statusFilter: MasterStatus | '';
    onStatusFilterChange: (value: MasterStatus | '') => void;
    onPageChange: (page: number) => void;
    onEdit: (row: Record<string, unknown>) => void;
    onToggleStatus: (row: Record<string, unknown>) => void;
    sortKey?: string;
    sortOrder?: SortOrder;
    onSortChange?: (key: string) => void;
}

export default function MasterDataTable({
    columns,
    data,
    total,
    page,
    limit,
    totalPages,
    isLoading,
    search,
    onSearchChange,
    statusFilter,
    onStatusFilterChange,
    onPageChange,
    onEdit,
    onToggleStatus,
    sortKey,
    sortOrder,
    onSortChange,
}: MasterDataTableProps) {
    const [localSearch, setLocalSearch] = useState(search);

    // Debounce search input 300ms
    useEffect(() => {
        const timer = setTimeout(() => {
            onSearchChange(localSearch);
        }, 300);
        return () => clearTimeout(timer);
    }, [localSearch, onSearchChange]);

    // Sync external search changes
    useEffect(() => {
        setLocalSearch(search);
    }, [search]);

    const startRow = (page - 1) * limit + 1;
    const endRow = Math.min(page * limit, total);

    // Render ikon sort pada header
    const renderSortIcon = (colKey: string) => {
        if (sortKey === colKey) {
            return sortOrder === 'asc' ? (
                <ChevronUp className="w-3.5 h-3.5 text-indigo-400" />
            ) : (
                <ChevronDown className="w-3.5 h-3.5 text-indigo-400" />
            );
        }
        return <ChevronsUpDown className="w-3.5 h-3.5 text-neutral-600" />;
    };

    // Kolom lengkap: kolom data + Status + Aksi
    const allColumns: ColumnDef[] = [
        ...columns,
        {
            key: '_status',
            label: 'Status',
            render: (row) => {
                const status = row.status as MasterStatus;
                return (
                    <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status === 'Aktif'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                            : 'bg-red-500/15 text-red-400 border border-red-500/20'
                            }`}
                    >
                        <span
                            className={`w-1.5 h-1.5 rounded-full ${status === 'Aktif' ? 'bg-emerald-400' : 'bg-red-400'
                                }`}
                        />
                        {status === 'Aktif' ? 'Aktif' : 'Tidak Aktif'}
                    </span>
                );
            },
        },
        {
            key: '_actions',
            label: 'Aksi',
            render: (row) => {
                const status = row.status as MasterStatus;
                return (
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => onEdit(row)}
                            title="Edit"
                            className="p-2 rounded-lg text-muted-foreground hover:text-indigo-400 hover:bg-indigo-500/10 transition-all duration-200 cursor-pointer"
                        >
                            <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                            onClick={() => {
                                const pesan =
                                    status === 'Aktif'
                                        ? 'Apakah Anda yakin ingin menonaktifkan data ini?'
                                        : 'Apakah Anda yakin ingin mengaktifkan data ini?';

                                toast(pesan, {
                                    action: {
                                        label: 'Ya, Lanjutkan',
                                        onClick: () => {
                                            onToggleStatus(row);
                                            toast.success(`Data berhasil di${status === 'Aktif' ? 'nonaktifkan' : 'aktifkan'}`);
                                        },
                                    }
                                });
                            }}
                            title={status === 'Aktif' ? 'Nonaktifkan' : 'Aktifkan'}
                            className={`p-2 rounded-lg transition-all duration-200 cursor-pointer ${status === 'Aktif'
                                ? 'text-emerald-400 hover:text-red-400 hover:bg-red-500/10'
                                : 'text-red-400 hover:text-emerald-400 hover:bg-emerald-500/10'
                                }`}
                        >
                            {status === 'Aktif' ? (
                                <ToggleRight className="w-5 h-5" />
                            ) : (
                                <ToggleLeft className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                );
            },
        },
    ];

    return (
        <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                {/* Search */}
                <div className="relative flex-1 w-full sm:max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/80" />
                    <input
                        type="text"
                        placeholder="Cari data..."
                        value={localSearch}
                        onChange={(e) => setLocalSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-card/50 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground/80 focus:outline-none focus:border-border/80 focus:ring-1 focus:ring-ring/50 transition-all duration-300 hover:border-border hover:bg-accent/50"
                    />
                </div>

                {/* Status Filter */}
                <select
                    value={statusFilter}
                    onChange={(e) => onStatusFilterChange(e.target.value as MasterStatus | '')}
                    className="px-4 py-2.5 rounded-2xl bg-card/50 border border-border/50 text-sm text-foreground focus:outline-none focus:border-border/80 focus:ring-1 focus:ring-ring/50 transition-all duration-300 hover:border-border hover:bg-accent/50 cursor-pointer"
                >
                    <option value="" className="bg-[#0a0a0f]">Semua Status</option>
                    <option value="Aktif" className="bg-[#0a0a0f]">Aktif</option>
                    <option value="TidakAktif" className="bg-[#0a0a0f]">Tidak Aktif</option>
                </select>
            </div>

            {/* Table */}
            <div className="rounded-2xl border border-border/50 bg-black/20 backdrop-blur-xl shadow-xl overflow-hidden">
                <div className="overflow-x-auto max-h-[65vh] overflow-y-auto">
                    <table className="w-full text-sm">
                        <thead className="sticky top-0 z-10">
                            <tr className="bg-black/40 backdrop-blur-md border-b border-border/50">
                                {allColumns.map((col) => {
                                    const isSortable = col.sortable !== false && !col.key.startsWith('_');
                                    const isActive = sortKey === col.key;

                                    return (
                                        <th
                                            key={col.key}
                                            className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider whitespace-nowrap ${isActive ? 'text-indigo-300' : 'text-muted-foreground'
                                                }`}
                                        >
                                            {isSortable && onSortChange ? (
                                                <button
                                                    type="button"
                                                    onClick={() => onSortChange(col.key)}
                                                    className="inline-flex items-center gap-1.5 hover:text-indigo-400 transition-colors duration-150 cursor-pointer"
                                                >
                                                    {col.label}
                                                    {renderSortIcon(col.key)}
                                                </button>
                                            ) : (
                                                col.label
                                            )}
                                        </th>
                                    );
                                })}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {isLoading ? (
                                // Loading Skeleton
                                Array.from({ length: 5 }).map((_, rowIdx) => (
                                    <tr key={`skeleton-${rowIdx}`}>
                                        {allColumns.map((col) => (
                                            <td key={col.key} className="px-4 py-3">
                                                <div className="h-4 w-24 rounded bg-card/50 animate-pulse" />
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : data.length === 0 ? (
                                // Empty State
                                <tr>
                                    <td colSpan={allColumns.length} className="px-4 py-16 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-12 h-12 rounded-xl bg-card/50 flex items-center justify-center">
                                                <Inbox className="w-6 h-6 text-neutral-600" />
                                            </div>
                                            <p className="text-muted-foreground/80 text-sm">Belum ada data</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                // Data Rows
                                data.map((row, rowIdx) => (
                                    <tr
                                        key={(row.id as string) || rowIdx}
                                        className="even:bg-white/[0.02] hover:bg-white/[0.04] transition-colors duration-150"
                                    >
                                        {allColumns.map((col) => (
                                            <td key={col.key} className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                                                {col.render ? col.render(row) : (row[col.key] as ReactNode) ?? '-'}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            {!isLoading && total > 0 && (
                <div className="flex items-center justify-between text-sm">
                    <p className="text-muted-foreground/80">
                        Menampilkan {startRow}–{endRow} dari {total} data
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => onPageChange(page - 1)}
                            disabled={page <= 1}
                            className="p-2 rounded-lg bg-card/50 border border-border/50 text-muted-foreground hover:text-foreground hover:bg-accent/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <span className="px-3 py-1.5 rounded-lg bg-indigo-500/15 text-indigo-300 text-xs font-medium border border-indigo-500/20">
                            {page} / {totalPages}
                        </span>
                        <button
                            onClick={() => onPageChange(page + 1)}
                            disabled={page >= totalPages}
                            className="p-2 rounded-lg bg-card/50 border border-border/50 text-muted-foreground hover:text-foreground hover:bg-accent/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
