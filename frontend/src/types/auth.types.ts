export interface KaryawanSingkat {
    nama_lengkap: string;
    foto_karyawan: string | null;
    nomor_induk_karyawan: string;
}

export interface AuthUser {
    id: string;
    nik: string;
    role: string;
    karyawan: KaryawanSingkat | null;
}

export interface LoginResponse {
    token: string;
    user: AuthUser;
}

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}
