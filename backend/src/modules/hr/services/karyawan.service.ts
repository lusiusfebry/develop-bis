import prisma from '../../../lib/prisma';
import {
    KaryawanListQuery,
    CreateKaryawanInput,
    UpdateKaryawanInput,
} from '../dto/karyawan.dto';
import { PaginatedResponse } from '../dto/master.dto';

// ── Field wajib untuk create ───────────────────────────────────────

const REQUIRED_FIELDS = [
    'nama_lengkap',
    'nomor_induk_karyawan',
    'divisi_id',
    'department_id',
    'posisi_jabatan_id',
    'status_karyawan_id',
    'lokasi_kerja_id',
];

// ── Helper: Konversi string tanggal menjadi DateTime ───────────────

const DATE_FIELDS = [
    'tanggal_lahir',
    'tanggal_menikah',
    'tanggal_cerai',
    'tanggal_wafat_pasangan',
    'tanggal_masuk_group',
    'tanggal_masuk',
    'tanggal_permanent',
    'tanggal_kontrak',
    'tanggal_akhir_kontrak',
    'tanggal_berhenti',
    'tanggal_mutasi',
    'tanggal_lahir_pasangan',
    'tanggal_lahir_ayah_kandung',
    'tanggal_lahir_ibu_kandung',
    'tanggal_lahir_ayah_mertua',
    'tanggal_lahir_ibu_mertua',
];

function convertDateFields(data: Record<string, any>): Record<string, any> {
    const result = { ...data };
    for (const field of DATE_FIELDS) {
        if (result[field] && typeof result[field] === 'string') {
            result[field] = new Date(result[field]);
        }
    }
    return result;
}

// ── Include untuk list (ringkas) ───────────────────────────────────

const LIST_INCLUDE = {
    divisi: true,
    department: true,
    posisi_jabatan: true,
    status_karyawan: true,
    lokasi_kerja: true,
    tag: true,
};

// ── Include untuk detail (lengkap) ─────────────────────────────────

const DETAIL_INCLUDE = {
    divisi: true,
    department: true,
    posisi_jabatan: true,
    status_karyawan: true,
    lokasi_kerja: true,
    lokasi_sebelumnya: true,
    tag: true,
    jenis_hubungan_kerja: true,
    kategori_pangkat: true,
    golongan_pangkat: true,
    sub_golongan_pangkat: true,
    manager: {
        select: {
            id: true,
            nama_lengkap: true,
            nomor_induk_karyawan: true,
        },
    },
    atasan_langsung: {
        select: {
            id: true,
            nama_lengkap: true,
            nomor_induk_karyawan: true,
        },
    },
    anak: true,
    saudara_kandung: true,
};

// ── getKaryawanList ────────────────────────────────────────────────

export async function getKaryawanList(
    query: KaryawanListQuery
): Promise<PaginatedResponse<any>> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const where: Record<string, any> = {};

    if (query.divisi_id) {
        where.divisi_id = query.divisi_id;
    }

    if (query.department_id) {
        where.department_id = query.department_id;
    }

    if (query.status_karyawan_id) {
        where.status_karyawan_id = query.status_karyawan_id;
    }

    if (query.search) {
        where.OR = [
            { nama_lengkap: { contains: query.search, mode: 'insensitive' } },
            { nomor_induk_karyawan: { contains: query.search, mode: 'insensitive' } },
        ];
    }

    const [data, total] = await Promise.all([
        prisma.karyawan.findMany({
            where,
            skip,
            take: limit,
            orderBy: { created_at: 'desc' },
            include: LIST_INCLUDE,
        }),
        prisma.karyawan.count({ where }),
    ]);

    return {
        data,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
    };
}

// ── getKaryawanById ────────────────────────────────────────────────

export async function getKaryawanById(id: string) {
    const record = await prisma.karyawan.findUnique({
        where: { id },
        include: DETAIL_INCLUDE,
    });

    if (!record) {
        const error: any = new Error('Data karyawan tidak ditemukan');
        error.status = 404;
        throw error;
    }

    return record;
}

// ── createKaryawan ─────────────────────────────────────────────────

export async function createKaryawan(data: CreateKaryawanInput) {
    // Validasi required fields
    const missingFields = REQUIRED_FIELDS.filter(
        (field) =>
            (data as any)[field] === undefined ||
            (data as any)[field] === null ||
            (data as any)[field] === ''
    );

    if (missingFields.length > 0) {
        const error: any = new Error(
            `Field berikut wajib diisi: ${missingFields.join(', ')}`
        );
        error.status = 400;
        throw error;
    }

    // Validasi jumlah anak dan saudara kandung
    if (data.anak && data.anak.length > 4) {
        const error: any = new Error('Jumlah anak maksimal 4');
        error.status = 400;
        throw error;
    }

    if (data.saudara_kandung && data.saudara_kandung.length > 5) {
        const error: any = new Error('Jumlah saudara kandung maksimal 5');
        error.status = 400;
        throw error;
    }

    // Pisahkan nested data dari data karyawan
    const { anak, saudara_kandung, ...karyawanData } = data;

    // Konversi field tanggal
    const convertedData = convertDateFields(karyawanData as Record<string, any>);

    // Konversi tanggal di nested data anak
    const convertedAnak = (anak ?? []).map((a) => {
        const result: Record<string, any> = { ...a };
        if (result.tanggal_lahir && typeof result.tanggal_lahir === 'string') {
            result.tanggal_lahir = new Date(result.tanggal_lahir);
        }
        return result;
    });

    // Konversi tanggal di nested data saudara kandung
    const convertedSaudara = (saudara_kandung ?? []).map((s) => {
        const result: Record<string, any> = { ...s };
        if (result.tanggal_lahir && typeof result.tanggal_lahir === 'string') {
            result.tanggal_lahir = new Date(result.tanggal_lahir);
        }
        return result;
    });

    try {
        const record = await prisma.karyawan.create({
            data: {
                ...convertedData,
                anak: { create: convertedAnak as any },
                saudara_kandung: { create: convertedSaudara as any },
            } as any,
            include: DETAIL_INCLUDE,
        });
        return record;
    } catch (err: any) {
        if (err.code === 'P2002') {
            const error: any = new Error('NIK sudah terdaftar');
            error.status = 409;
            throw error;
        }
        throw err;
    }
}

// ── updateKaryawan ─────────────────────────────────────────────────

export async function updateKaryawan(id: string, data: UpdateKaryawanInput) {
    // Pastikan karyawan ada
    await getKaryawanById(id);

    // Pisahkan nested data dari data karyawan
    const { anak, saudara_kandung, ...karyawanData } = data;

    // Konversi field tanggal
    const convertedData = convertDateFields(karyawanData as Record<string, any>);

    // Validasi jumlah anak dan saudara kandung
    if (anak && anak.length > 4) {
        const error: any = new Error('Jumlah anak maksimal 4');
        error.status = 400;
        throw error;
    }

    if (saudara_kandung && saudara_kandung.length > 5) {
        const error: any = new Error('Jumlah saudara kandung maksimal 5');
        error.status = 400;
        throw error;
    }

    // Konversi tanggal di nested data anak
    const convertedAnak = anak
        ? anak.map((a) => {
            const result: Record<string, any> = { ...a };
            if (result.tanggal_lahir && typeof result.tanggal_lahir === 'string') {
                result.tanggal_lahir = new Date(result.tanggal_lahir);
            }
            return result;
        })
        : undefined;

    // Konversi tanggal di nested data saudara kandung
    const convertedSaudara = saudara_kandung
        ? saudara_kandung.map((s) => {
            const result: Record<string, any> = { ...s };
            if (result.tanggal_lahir && typeof result.tanggal_lahir === 'string') {
                result.tanggal_lahir = new Date(result.tanggal_lahir);
            }
            return result;
        })
        : undefined;

    try {
        // Gunakan transaction untuk replace strategy
        const record = await prisma.$transaction(async (tx) => {
            // Hapus anak lama jika data anak disertakan
            if (convertedAnak !== undefined) {
                await tx.anak.deleteMany({ where: { karyawan_id: id } });
            }

            // Hapus saudara kandung lama jika data saudara disertakan
            if (convertedSaudara !== undefined) {
                await tx.saudaraKandung.deleteMany({ where: { karyawan_id: id } });
            }

            // Update karyawan + nested create baru
            const updated = await tx.karyawan.update({
                where: { id },
                data: {
                    ...convertedData,
                    ...(convertedAnak !== undefined && {
                        anak: { create: convertedAnak as any },
                    }),
                    ...(convertedSaudara !== undefined && {
                        saudara_kandung: { create: convertedSaudara as any },
                    }),
                },
                include: DETAIL_INCLUDE,
            });

            return updated;
        });

        return record;
    } catch (err: any) {
        if (err.code === 'P2002') {
            const error: any = new Error('NIK sudah terdaftar');
            error.status = 409;
            throw error;
        }
        throw err;
    }
}

// ── uploadFotoKaryawan ─────────────────────────────────────────────

export async function uploadFotoKaryawan(id: string, filename: string) {
    // Pastikan karyawan ada
    await getKaryawanById(id);

    const record = await prisma.karyawan.update({
        where: { id },
        data: { foto_karyawan: `/uploads/${filename}` },
        include: DETAIL_INCLUDE,
    });

    return record;
}

// ── getKaryawanQr ──────────────────────────────────────────────────

export async function getKaryawanQr(id: string) {
    const karyawan = await getKaryawanById(id);

    return {
        nomor_induk_karyawan: karyawan.nomor_induk_karyawan,
    };
}
