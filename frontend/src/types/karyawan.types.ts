export interface AnakData {
    id?: string;
    nama_anak: string;
    jenis_kelamin?: 'Laki-Laki' | 'Perempuan';
    tanggal_lahir?: string;
    keterangan?: string;
}

export interface SaudaraKandungData {
    id?: string;
    nama_saudara_kandung: string;
    jenis_kelamin?: 'Laki-Laki' | 'Perempuan';
    tanggal_lahir?: string;
    pendidikan_terakhir?: string;
    pekerjaan?: string;
    keterangan?: string;
}

export interface KaryawanListItem {
    id: string;
    nama_lengkap: string;
    nomor_induk_karyawan: string;
    foto_karyawan: string | null;
    divisi: { id: string; nama_divisi: string } | null;
    department: { id: string; nama_department: string } | null;
    posisi_jabatan: { id: string; nama_posisi_jabatan: string } | null;
    status_karyawan: { id: string; nama_status: string } | null;
    lokasi_kerja: { id: string; nama_lokasi_kerja: string } | null;
    tag: { id: string; nama_tag: string; warna_tag: string } | null;
}

export interface CreateKaryawanInput {
    // 1. Biodata Karyawan
    nama_lengkap: string;
    jenis_kelamin?: 'Laki-Laki' | 'Perempuan';
    tempat_lahir?: string;
    tanggal_lahir?: string;
    email_pribadi?: string;

    // 2. Identifikasi
    agama?: string;
    golongan_darah?: string;
    nomor_kartu_keluarga?: string;
    nomor_ktp?: string;
    nomor_npwp?: string;
    nomor_bpjs?: string;
    no_nik_kk?: string;
    status_pajak?: string;

    // 3. Alamat Domisili
    alamat_domisili?: string;
    kota_domisili?: string;
    provinsi_domisili?: string;

    // 4. Alamat KTP
    alamat_ktp?: string;
    kota_ktp?: string;
    provinsi_ktp?: string;

    // 5. Informasi Kontak
    nomor_handphone_1?: string;
    nomor_handphone_2?: string;
    nomor_telepon_rumah_1?: string;
    nomor_telepon_rumah_2?: string;

    // 6. Status Pernikahan & Anak
    status_pernikahan?: string;
    nama_pasangan?: string;
    tanggal_menikah?: string;
    tanggal_cerai?: string;
    tanggal_wafat_pasangan?: string;
    pekerjaan_pasangan?: string;
    jumlah_anak?: number;

    // 7. Rekening Bank
    nomor_rekening?: string;
    nama_pemegang_rekening?: string;
    nama_bank?: string;
    cabang_bank?: string;

    // --- TAB 2: Informasi HR ---
    // 1. Kepegawaian
    nomor_induk_karyawan: string;
    posisi_jabatan_id?: string;
    angkatan?: string;
    divisi_id?: string;
    department_id?: string;
    email_perusahaan?: string;
    manager_id?: string;
    atasan_langsung_id?: string;

    // 2. Kontrak
    jenis_hubungan_kerja_id?: string;
    tanggal_bergabung?: string;
    tanggal_mulai_kontrak?: string;
    tanggal_akhir_kontrak?: string;
    tanggal_pengangkatan?: string;
    tanggal_berhenti?: string;
    tanggal_keluar?: string;

    // 3. Pendidikan
    tingkat_pendidikan?: string;
    bidang_studi?: string;
    nama_sekolah?: string;
    kota_sekolah?: string;
    status_kelulusan?: string;
    keterangan_pendidikan?: string;

    // 4. Pangkat & Golongan
    kategori_pangkat_id?: string;
    golongan_id?: string;
    sub_golongan_id?: string;
    no_dana_pensiun?: string;

    // 5. Kontak Darurat
    nama_kontak_darurat_1?: string;
    hubungan_kontak_darurat_1?: string;
    no_telepon_darurat_1?: string;
    keterangan_kontak_darurat_1?: string;
    nama_kontak_darurat_2?: string;
    hubungan_kontak_darurat_2?: string;
    no_telepon_darurat_2?: string;
    keterangan_kontak_darurat_2?: string;

    // 6. POO / POH
    point_of_original?: string;
    point_of_hire?: string;

    // 7. Lain-lain
    ukuran_seragam_kerja?: string;
    ukuran_sepatu_kerja?: string;

    // 8. Pergerakan Karyawan
    lokasi_kerja_id?: string;
    lokasi_sebelumnya_id?: string;
    tanggal_mutasi?: string;

    // 9. Costing
    siklus_pembayaran_gaji?: string;
    costing?: string;
    assign?: string;
    actual?: string;

    // 10. Status & Tag
    status_karyawan_id?: string;
    tag_id?: string;

    // --- TAB 3: Informasi Keluarga ---
    tanggal_lahir_pasangan?: string;
    pendidikan_terakhir_pasangan?: string;
    keterangan_pasangan?: string;

    nama_ayah_kandung?: string;
    tanggal_lahir_ayah_kandung?: string;
    pendidikan_terakhir_ayah?: string;
    pekerjaan_ayah?: string;
    keterangan_ayah?: string;

    nama_ibu_kandung?: string;
    tanggal_lahir_ibu_kandung?: string;
    pendidikan_terakhir_ibu?: string;
    pekerjaan_ibu?: string;
    keterangan_ibu?: string;

    nama_ayah_mertua?: string;
    tanggal_lahir_ayah_mertua?: string;
    pendidikan_terakhir_ayah_mertua?: string;
    pekerjaan_ayah_mertua?: string;
    keterangan_ayah_mertua?: string;

    nama_ibu_mertua?: string;
    tanggal_lahir_ibu_mertua?: string;
    pendidikan_terakhir_ibu_mertua?: string;
    pekerjaan_ibu_mertua?: string;
    keterangan_ibu_mertua?: string;

    anak_ke?: number;
    jumlah_saudara_kandung?: number;

    // Relational Arrays
    anak?: AnakData[];
    saudara_kandung?: SaudaraKandungData[];
}

export interface KaryawanDetail extends CreateKaryawanInput {
    id: string;
    foto_karyawan: string | null;
    created_at: string;
    updated_at: string;

    // Relasi Objek untuk tampilan
    divisi?: { id: string; nama_divisi: string } | null;
    department?: { id: string; nama_department: string } | null;
    posisi_jabatan?: { id: string; nama_posisi_jabatan: string } | null;
    status_karyawan?: { id: string; nama_status: string } | null;
    lokasi_kerja?: { id: string; nama_lokasi_kerja: string } | null;
    kategori_pangkat?: { id: string; nama_kategori_pangkat: string } | null;
    golongan?: { id: string; nama_golongan: string } | null;
    sub_golongan?: { id: string; nama_sub_golongan: string } | null;
    jenis_hubungan_kerja?: { id: string; nama_jenis_hubungan_kerja: string } | null;
    lokasi_sebelumnya?: { id: string; nama_lokasi_kerja: string } | null;
    manager?: { id: string; nama_lengkap: string } | null;
    atasan_langsung?: { id: string; nama_lengkap: string } | null;
    tag?: { id: string; nama_tag: string; warna_tag: string } | null;
}

export interface KaryawanListQuery {
    page?: number;
    limit?: number;
    search?: string;
    divisi_id?: string;
    department_id?: string;
    status_karyawan_id?: string;
}

export interface KaryawanListResponse {
    data: KaryawanListItem[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}
