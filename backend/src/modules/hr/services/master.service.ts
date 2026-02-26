import prisma from '../../../lib/prisma';
import { MasterEntityConfig, MasterListQuery, PaginatedResponse } from '../dto/master.dto';

// ── Helper: Dynamic Prisma Model Access ────────────────────────────

function getModel(config: MasterEntityConfig) {
    return (prisma as any)[config.modelName];
}

// ── getMasterList ──────────────────────────────────────────────────

export async function getMasterList(
    config: MasterEntityConfig,
    query: MasterListQuery
): Promise<PaginatedResponse<any>> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const where: Record<string, any> = {};

    if (query.status) {
        where.status = query.status;
    }

    if (query.search) {
        where[config.searchField] = {
            contains: query.search,
            mode: 'insensitive',
        };
    }

    const model = getModel(config);

    const [data, total] = await Promise.all([
        model.findMany({
            where,
            skip,
            take: limit,
            orderBy: { created_at: 'desc' },
        }),
        model.count({ where }),
    ]);

    return {
        data,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
    };
}

// ── getMasterById ──────────────────────────────────────────────────

export async function getMasterById(config: MasterEntityConfig, id: string) {
    const model = getModel(config);
    const record = await model.findUnique({ where: { id } });

    if (!record) {
        const error: any = new Error('Data tidak ditemukan');
        error.status = 404;
        throw error;
    }

    return record;
}

// ── createMaster ───────────────────────────────────────────────────

export async function createMaster(
    config: MasterEntityConfig,
    data: Record<string, any>
) {
    // Validasi required fields
    const missingFields = config.requiredFields.filter(
        (field) => data[field] === undefined || data[field] === null || data[field] === ''
    );

    if (missingFields.length > 0) {
        const error: any = new Error(
            `Field berikut wajib diisi: ${missingFields.join(', ')}`
        );
        error.status = 400;
        throw error;
    }

    try {
        const model = getModel(config);
        const record = await model.create({
            data: {
                ...data,
                status: 'Aktif',
            },
        });
        return record;
    } catch (err: any) {
        if (err.code === 'P2002') {
            const error: any = new Error('Data dengan nama tersebut sudah ada');
            error.status = 409;
            throw error;
        }
        throw err;
    }
}

// ── updateMaster ───────────────────────────────────────────────────

export async function updateMaster(
    config: MasterEntityConfig,
    id: string,
    data: Record<string, any>
) {
    // Pastikan record ada
    await getMasterById(config, id);

    // Hapus field status dari data untuk mencegah perubahan status melalui PUT.
    // Perubahan status hanya diperbolehkan melalui endpoint PATCH /:id/status (toggleMasterStatus).
    const { status, ...updateData } = data;

    try {
        const model = getModel(config);
        const record = await model.update({
            where: { id },
            data: updateData,
        });
        return record;
    } catch (err: any) {
        if (err.code === 'P2002') {
            const error: any = new Error('Data dengan nama tersebut sudah ada');
            error.status = 409;
            throw error;
        }
        throw err;
    }
}

// ── toggleMasterStatus ─────────────────────────────────────────────

export async function toggleMasterStatus(config: MasterEntityConfig, id: string) {
    const current = await getMasterById(config, id);
    const newStatus = current.status === 'Aktif' ? 'TidakAktif' : 'Aktif';

    const model = getModel(config);
    const record = await model.update({
        where: { id },
        data: { status: newStatus },
    });

    return record;
}
