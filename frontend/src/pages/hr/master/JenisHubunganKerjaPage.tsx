import { Plus } from 'lucide-react';
import { jenisHubunganKerjaService } from '@/services/master.service';
import { useMasterData } from '@/hooks/useMasterData';
import MasterDataTable from '@/components/hr/master/MasterDataTable';
import MasterDataForm from '@/components/hr/master/MasterDataForm';
import type { JenisHubunganKerja, FieldConfig } from '@/types/master.types';

const columns = [
    { key: 'nama_jenis_hubungan_kerja', label: 'Nama Jenis Hubungan Kerja' },
];

const formFields: FieldConfig[] = [
    { name: 'nama_jenis_hubungan_kerja', label: 'Nama Jenis Hubungan Kerja', type: 'text', required: true },
    { name: 'keterangan', label: 'Keterangan', type: 'textarea' },
];

export default function JenisHubunganKerjaPage() {
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
    } = useMasterData<JenisHubunganKerja>(jenisHubunganKerjaService, ['master-jenis-hubungan-kerja']);

    const responseData = listQuery.data;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Jenis Hubungan Kerja</h1>
                    <p className="text-sm text-neutral-500 mt-1">Kelola data master jenis hubungan kerja</p>
                </div>
                <button
                    onClick={handleCreate}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 transition-all duration-200 cursor-pointer"
                >
                    <Plus className="w-4 h-4" />
                    Tambah Jenis Hubungan Kerja
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
                onEdit={(row) => handleEdit(row as unknown as JenisHubunganKerja)}
                onToggleStatus={(row) => handleToggleStatus(row as unknown as JenisHubunganKerja)}
            />

            <MasterDataForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                title={editingItem ? 'Edit Jenis Hubungan Kerja' : 'Tambah Jenis Hubungan Kerja'}
                fields={formFields}
                initialData={editingItem as unknown as Record<string, unknown> | undefined}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
            />
        </div>
    );
}
