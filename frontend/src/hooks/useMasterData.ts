import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { MasterStatus, MasterListQuery, PaginatedResponse } from '@/types/master.types';

interface MasterService<T> {
    getList: (query: MasterListQuery) => Promise<PaginatedResponse<T>>;
    create: (data: Partial<T>) => Promise<T>;
    update: (id: string, data: Partial<T>) => Promise<T>;
    toggleStatus: (id: string) => Promise<T>;
}

export function useMasterData<T extends { id: string }>(
    service: MasterService<T>,
    queryKey: string[]
) {
    const queryClient = useQueryClient();

    // State untuk filter & pagination
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<MasterStatus | ''>('');
    const [page, setPage] = useState(1);
    const limit = 10;

    // State untuk form
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<T | null>(null);

    // Query list data
    const listQuery = useQuery({
        queryKey: [...queryKey, { search, status: statusFilter, page, limit }],
        queryFn: () => service.getList({ search, status: statusFilter, page, limit }),
    });

    // Mutations
    const createMutation = useMutation({
        mutationFn: (data: Partial<T>) => service.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
            setIsFormOpen(false);
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<T> }) => service.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
            setIsFormOpen(false);
            setEditingItem(null);
        },
    });

    const toggleStatusMutation = useMutation({
        mutationFn: (id: string) => service.toggleStatus(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
        },
    });

    // Handlers
    const handleCreate = useCallback(() => {
        setEditingItem(null);
        setIsFormOpen(true);
    }, []);

    const handleEdit = useCallback((item: T) => {
        setEditingItem(item);
        setIsFormOpen(true);
    }, []);

    const handleToggleStatus = useCallback(
        (item: T) => {
            toggleStatusMutation.mutate(item.id);
        },
        [toggleStatusMutation]
    );

    const handleSubmit = useCallback(
        async (data: Record<string, unknown>) => {
            if (editingItem) {
                await updateMutation.mutateAsync({ id: editingItem.id, data: data as Partial<T> });
            } else {
                await createMutation.mutateAsync(data as Partial<T>);
            }
        },
        [editingItem, updateMutation, createMutation]
    );

    // Reset page ke 1 saat search/filter berubah
    const handleSearchChange = useCallback((value: string) => {
        setSearch(value);
        setPage(1);
    }, []);

    const handleStatusFilterChange = useCallback((value: MasterStatus | '') => {
        setStatusFilter(value);
        setPage(1);
    }, []);

    return {
        // Query
        listQuery,

        // Filter & Pagination
        search,
        setSearch: handleSearchChange,
        statusFilter,
        setStatusFilter: handleStatusFilterChange,
        page,
        setPage,

        // Form
        isFormOpen,
        setIsFormOpen,
        editingItem,
        setEditingItem,

        // Mutations
        createMutation,
        updateMutation,
        toggleStatusMutation,

        // Handlers
        handleCreate,
        handleEdit,
        handleToggleStatus,
        handleSubmit,

        // Computed
        isSubmitting: createMutation.isPending || updateMutation.isPending,
    };
}
