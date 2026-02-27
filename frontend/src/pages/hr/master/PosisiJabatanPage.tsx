import { Plus } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { posisiJabatanService, departmentService } from '@/services/master.service';
import { useMasterData } from '@/hooks/useMasterData';
import MasterDataTable from '@/components/hr/master/MasterDataTable';
import MasterDataForm from '@/components/hr/master/MasterDataForm';
import type { PosisiJabatan, FieldConfig } from '@/types/master.types';

const columns = [
    { key: 'nama_posisi_jabatan', label: 'Nama Posisi Jabatan', sortable: true },
    {
        key: 'department',
        label: 'Department',
        render: (row: Record<string, unknown>) => {
            const nama = (row as unknown as PosisiJabatan).nama_department;
            return nama || '-';
        },
    },
];

export default function PosisiJabatanPage() {
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
    } = useMasterData<PosisiJabatan>(posisiJabatanService, ['master-posisi-jabatan']);

    // Dropdown department aktif untuk form
    const { data: departmentList } = useQuery({
        queryKey: ['dropdown-department'],
        queryFn: () => departmentService.getDropdown(),
    });

    const formFields: FieldConfig[] = [
        { name: 'nama_posisi_jabatan', label: 'Nama Posisi Jabatan', type: 'text', required: true },
        {
            name: 'department_id',
            label: 'Department',
            type: 'select',
            required: true,
            options: (departmentList ?? []).map((d) => ({ value: d.id, label: d.nama_department })),
        },
        { name: 'keterangan', label: 'Keterangan', type: 'textarea' },
    ];

    const responseData = listQuery.data;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Posisi Jabatan</h1>
                    <p className="text-sm text-muted-foreground/80 mt-1">Kelola data master posisi jabatan</p>
                </div>
                <button
                    onClick={handleCreate}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 transition-all duration-200 cursor-pointer"
                >
                    <Plus className="w-4 h-4" />
                    Tambah Posisi Jabatan
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
                onEdit={(row) => handleEdit(row as unknown as PosisiJabatan)}
                onToggleStatus={(row) => handleToggleStatus(row as unknown as PosisiJabatan)}
                sortKey={sortKey}
                sortOrder={sortOrder}
                onSortChange={handleSortChange}
            />

            <MasterDataForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                title={editingItem ? 'Edit Posisi Jabatan' : 'Tambah Posisi Jabatan'}
                fields={formFields}
                initialData={editingItem as unknown as Record<string, unknown> | undefined}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
            />
        </div>
    );
}
