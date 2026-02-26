import { Plus } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { departmentService, divisiService } from '@/services/master.service';
import { useMasterData } from '@/hooks/useMasterData';
import MasterDataTable from '@/components/hr/master/MasterDataTable';
import MasterDataForm from '@/components/hr/master/MasterDataForm';
import type { Department, FieldConfig } from '@/types/master.types';

const columns = [
    { key: 'nama_department', label: 'Nama Department' },
    {
        key: 'divisi',
        label: 'Divisi',
        render: (row: Record<string, unknown>) => {
            const nama = (row as unknown as Department).nama_divisi;
            return nama || '-';
        },
    },
];

export default function DepartmentPage() {
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
    } = useMasterData<Department>(departmentService, ['master-department']);

    // Dropdown divisi aktif untuk form
    const { data: divisiList } = useQuery({
        queryKey: ['dropdown-divisi'],
        queryFn: () => divisiService.getDropdown(),
    });

    const formFields: FieldConfig[] = [
        { name: 'nama_department', label: 'Nama Department', type: 'text', required: true },
        {
            name: 'divisi_id',
            label: 'Divisi',
            type: 'select',
            required: true,
            options: (divisiList ?? []).map((d) => ({ value: d.id, label: d.nama_divisi })),
        },
        { name: 'keterangan', label: 'Keterangan', type: 'textarea' },
    ];

    const responseData = listQuery.data;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Department</h1>
                    <p className="text-sm text-neutral-500 mt-1">Kelola data master department</p>
                </div>
                <button
                    onClick={handleCreate}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 transition-all duration-200 cursor-pointer"
                >
                    <Plus className="w-4 h-4" />
                    Tambah Department
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
                onEdit={(row) => handleEdit(row as unknown as Department)}
                onToggleStatus={(row) => handleToggleStatus(row as unknown as Department)}
            />

            <MasterDataForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                title={editingItem ? 'Edit Department' : 'Tambah Department'}
                fields={formFields}
                initialData={editingItem as unknown as Record<string, unknown> | undefined}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
            />
        </div>
    );
}
