import { Plus } from 'lucide-react';
import { kategoriPangkatService } from '@/services/master.service';
import { useMasterData } from '@/hooks/useMasterData';
import MasterDataTable from '@/components/hr/master/MasterDataTable';
import MasterDataForm from '@/components/hr/master/MasterDataForm';
import type { KategoriPangkat, FieldConfig } from '@/types/master.types';

const columns = [
    { key: 'nama_kategori_pangkat', label: 'Nama Kategori Pangkat', sortable: true },
];

const formFields: FieldConfig[] = [
    { name: 'nama_kategori_pangkat', label: 'Nama Kategori Pangkat', type: 'text', required: true },
    { name: 'keterangan', label: 'Keterangan', type: 'textarea' },
];

export default function KategoriPangkatPage() {
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
    } = useMasterData<KategoriPangkat>(kategoriPangkatService, ['master-kategori-pangkat']);

    const responseData = listQuery.data;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Kategori Pangkat</h1>
                    <p className="text-sm text-muted-foreground/80 mt-1">Kelola data master kategori pangkat</p>
                </div>
                <button
                    onClick={handleCreate}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 transition-all duration-200 cursor-pointer"
                >
                    <Plus className="w-4 h-4" />
                    Tambah Kategori Pangkat
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
                onEdit={(row) => handleEdit(row as unknown as KategoriPangkat)}
                onToggleStatus={(row) => handleToggleStatus(row as unknown as KategoriPangkat)}
                sortKey={sortKey}
                sortOrder={sortOrder}
                onSortChange={handleSortChange}
            />

            <MasterDataForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                title={editingItem ? 'Edit Kategori Pangkat' : 'Tambah Kategori Pangkat'}
                fields={formFields}
                initialData={editingItem as unknown as Record<string, unknown> | undefined}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
            />
        </div>
    );
}
