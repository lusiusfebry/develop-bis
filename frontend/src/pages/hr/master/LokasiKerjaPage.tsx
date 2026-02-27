import { Plus } from 'lucide-react';
import { lokasiKerjaService } from '@/services/master.service';
import { useMasterData } from '@/hooks/useMasterData';
import MasterDataTable from '@/components/hr/master/MasterDataTable';
import MasterDataForm from '@/components/hr/master/MasterDataForm';
import type { LokasiKerja, FieldConfig } from '@/types/master.types';

const columns = [
    { key: 'nama_lokasi_kerja', label: 'Nama Lokasi Kerja', sortable: true },
    {
        key: 'alamat',
        label: 'Alamat',
        render: (row: Record<string, unknown>) => {
            const alamat = (row as unknown as LokasiKerja).alamat;
            return (
                <span className="max-w-xs truncate block" title={alamat ?? ''}>
                    {alamat || '-'}
                </span>
            );
        },
    },
];

const formFields: FieldConfig[] = [
    { name: 'nama_lokasi_kerja', label: 'Nama Lokasi Kerja', type: 'text', required: true },
    { name: 'alamat', label: 'Alamat', type: 'textarea' },
    { name: 'keterangan', label: 'Keterangan', type: 'textarea' },
];

export default function LokasiKerjaPage() {
    const {
        listQuery,
        search,
        setSearch,
        statusFilter,
        setStatusFilter,
        page,
        setPage,
        sortKey,
        sortOrder,
        handleSortChange,
        isFormOpen,
        setIsFormOpen,
        editingItem,
        handleCreate,
        handleEdit,
        handleToggleStatus,
        handleSubmit,
        isSubmitting,
    } = useMasterData<LokasiKerja>(lokasiKerjaService, ['master-lokasi-kerja']);

    const responseData = listQuery.data;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Lokasi Kerja</h1>
                    <p className="text-sm text-muted-foreground/80 mt-1">Kelola data master lokasi kerja</p>
                </div>
                <button
                    onClick={handleCreate}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 transition-all duration-200 cursor-pointer"
                >
                    <Plus className="w-4 h-4" />
                    Tambah Lokasi Kerja
                </button>
            </div>

            <MasterDataTable
                columns={columns}
                data={(responseData?.data ?? []) as unknown as Record<string, unknown>[]}
                total={responseData?.total ?? 0}
                page={responseData?.page ?? page}
                limit={responseData?.limit ?? 10}
                totalPages={responseData?.totalPages ?? 1}
                isLoading={listQuery.isLoading}
                search={search}
                onSearchChange={setSearch}
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
                onPageChange={setPage}
                onEdit={(row) => handleEdit(row as unknown as LokasiKerja)}
                onToggleStatus={(row) => handleToggleStatus(row as unknown as LokasiKerja)}
                sortKey={sortKey}
                sortOrder={sortOrder}
                onSortChange={handleSortChange}
            />

            <MasterDataForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                title={editingItem ? 'Edit Lokasi Kerja' : 'Tambah Lokasi Kerja'}
                fields={formFields}
                initialData={editingItem as unknown as Record<string, unknown> | undefined}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
            />
        </div>
    );
}
