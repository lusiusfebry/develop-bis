import { Plus } from 'lucide-react';
import { tagService } from '@/services/master.service';
import { useMasterData } from '@/hooks/useMasterData';
import MasterDataTable from '@/components/hr/master/MasterDataTable';
import MasterDataForm from '@/components/hr/master/MasterDataForm';
import type { Tag, FieldConfig } from '@/types/master.types';

const columns = [
    { key: 'nama_tag', label: 'Nama Tag' },
    {
        key: 'warna_tag',
        label: 'Warna',
        render: (row: Record<string, unknown>) => {
            const warna = (row as unknown as Tag).warna_tag;
            return (
                <div className="flex items-center gap-2">
                    <div
                        className="w-5 h-5 rounded border border-white/10"
                        style={{ backgroundColor: warna }}
                    />
                    <span className="text-xs font-mono text-neutral-400">{warna}</span>
                </div>
            );
        },
    },
];

const formFields: FieldConfig[] = [
    { name: 'nama_tag', label: 'Nama Tag', type: 'text', required: true },
    { name: 'warna_tag', label: 'Warna Tag', type: 'color', required: true },
    { name: 'keterangan', label: 'Keterangan', type: 'textarea' },
];

export default function TagPage() {
    const {
        listQuery,
        search,
        setSearch,
        statusFilter,
        setStatusFilter,
        page,
        setPage,
        isFormOpen,
        setIsFormOpen,
        editingItem,
        handleCreate,
        handleEdit,
        handleToggleStatus,
        handleSubmit,
        isSubmitting,
    } = useMasterData<Tag>(tagService, ['master-tag']);

    const responseData = listQuery.data;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Tag</h1>
                    <p className="text-sm text-neutral-500 mt-1">Kelola data master tag</p>
                </div>
                <button
                    onClick={handleCreate}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 transition-all duration-200 cursor-pointer"
                >
                    <Plus className="w-4 h-4" />
                    Tambah Tag
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
                onEdit={(row) => handleEdit(row as unknown as Tag)}
                onToggleStatus={(row) => handleToggleStatus(row as unknown as Tag)}
            />

            <MasterDataForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                title={editingItem ? 'Edit Tag' : 'Tambah Tag'}
                fields={formFields}
                initialData={editingItem as unknown as Record<string, unknown> | undefined}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
            />
        </div>
    );
}
