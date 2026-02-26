import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import prisma from '../../lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '8h';

/**
 * Service untuk proses login user.
 * Melakukan validasi NIK, verifikasi password, dan generate JWT token.
 */
export async function loginService(nik: string, password: string) {
    // Validasi format NIK: harus sesuai pola XX-XXXXX
    const nikRegex = /^\d{2}-\d{5}$/;
    if (!nikRegex.test(nik)) {
        const error = new Error('Format NIK tidak valid. Gunakan format XX-XXXXX');
        (error as any).status = 400;
        throw error;
    }

    // Cari user berdasarkan NIK beserta data karyawan terkait
    const user = await prisma.user.findUnique({
        where: { nik },
        include: {
            karyawan: {
                select: {
                    nama_lengkap: true,
                    foto_karyawan: true,
                    nomor_induk_karyawan: true,
                },
            },
        },
    });

    if (!user) {
        const error = new Error('NIK atau password salah');
        (error as any).status = 401;
        throw error;
    }

    // Verifikasi password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
        const error = new Error('NIK atau password salah');
        (error as any).status = 401;
        throw error;
    }

    // Generate JWT token
    const signOptions: SignOptions = { expiresIn: JWT_EXPIRES_IN as any };
    const token = jwt.sign(
        {
            userId: user.id,
            nik: user.nik,
            role: user.role,
        },
        JWT_SECRET,
        signOptions
    );

    // Return token dan data user tanpa password_hash
    return {
        token,
        user: {
            id: user.id,
            nik: user.nik,
            role: user.role,
            karyawan: user.karyawan,
        },
    };
}

/**
 * Service untuk mengambil data profil user yang sedang login.
 */
export async function getMeService(userId: string) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            karyawan: {
                select: {
                    nama_lengkap: true,
                    foto_karyawan: true,
                    nomor_induk_karyawan: true,
                    divisi_id: true,
                    department_id: true,
                    posisi_jabatan_id: true,
                },
            },
        },
    });

    if (!user) {
        const error = new Error('User tidak ditemukan');
        (error as any).status = 404;
        throw error;
    }

    // Return data user tanpa password_hash
    const { password_hash, ...userWithoutPassword } = user;
    return userWithoutPassword;
}
