// ── Interface & Type Definitions untuk Karyawan ───────────────────

export interface KaryawanListQuery {
    page?: number;
    limit?: number;
    search?: string;
    divisi_id?: string;
    department_id?: string;
    status_karyawan_id?: string;
}

export interface AnakInput {
    nama_anak: string;
    jenis_kelamin?: 'LakiLaki' | 'Perempuan';
    tanggal_lahir?: string;
    keterangan?: string;
}

export interface SaudaraKandungInput {
    nama_saudara_kandung: string;
    jenis_kelamin?: 'LakiLaki' | 'Perempuan';
    tanggal_lahir?: string;
    pendidikan_terakhir?: string;
    pekerjaan?: string;
    keterangan?: string;
}

export interface CreateKaryawanInput {
    // Bagian Head (wajib)
    nama_lengkap: string;
    nomor_induk_karyawan: string;
    divisi_id: string;
    department_id: string;
    posisi_jabatan_id: string;
    status_karyawan_id: string;
    lokasi_kerja_id: string;

    // Bagian Head (opsional)
    manager_id?: string;
    atasan_langsung_id?: string;
    email_perusahaan?: string;
    nomor_handphone?: string;
    tag_id?: string;

    // Tab Personal Information
    jenis_kelamin?: 'LakiLaki' | 'Perempuan';
    tempat_lahir?: string;
    tanggal_lahir?: string;
    email_pribadi?: string;
    agama?: 'Islam' | 'Kristen' | 'Katolik' | 'Hindu' | 'Buddha' | 'Konghucu';
    golongan_darah?: 'A' | 'B' | 'AB' | 'O';
    nomor_kartu_keluarga?: string;
    nomor_ktp?: string;
    nomor_npwp?: string;
    nomor_bpjs?: string;
    no_nik_kk?: string;
    status_pajak?: string;
    alamat_domisili?: string;
    kota_domisili?: string;
    provinsi_domisili?: string;
    alamat_ktp?: string;
    kota_ktp?: string;
    provinsi_ktp?: string;
    nomor_handphone_2?: string;
    nomor_telepon_rumah_1?: string;
    nomor_telepon_rumah_2?: string;
    status_pernikahan?: 'BelumMenikah' | 'Menikah' | 'Cerai' | 'CeraiMati';
    nama_pasangan?: string;
    tanggal_menikah?: string;
    tanggal_cerai?: string;
    tanggal_wafat_pasangan?: string;
    pekerjaan_pasangan?: string;
    jumlah_anak?: number;
    nomor_rekening?: string;
    nama_pemegang_rekening?: string;
    nama_bank?: string;
    cabang_bank?: string;

    // Tab Informasi HR
    jenis_hubungan_kerja_id?: string;
    tanggal_masuk_group?: string;
    tanggal_masuk?: string;
    tanggal_permanent?: string;
    tanggal_kontrak?: string;
    tanggal_akhir_kontrak?: string;
    tanggal_berhenti?: string;
    tingkat_pendidikan?: string;
    bidang_studi?: string;
    nama_sekolah?: string;
    kota_sekolah?: string;
    status_kelulusan?: 'Lulus' | 'TidakLulus' | 'SedangBerjalan';
    keterangan_pendidikan?: string;
    kategori_pangkat_id?: string;
    golongan_pangkat_id?: string;
    sub_golongan_pangkat_id?: string;
    no_dana_pensiun?: string;
    nama_kontak_darurat_1?: string;
    nomor_telepon_kontak_darurat_1?: string;
    hubungan_kontak_darurat_1?: string;
    alamat_kontak_darurat_1?: string;
    nama_kontak_darurat_2?: string;
    nomor_telepon_kontak_darurat_2?: string;
    hubungan_kontak_darurat_2?: string;
    alamat_kontak_darurat_2?: string;
    point_of_original?: string;
    point_of_hire?: string;
    ukuran_seragam_kerja?: string;
    ukuran_sepatu_kerja?: string;
    lokasi_sebelumnya_id?: string;
    tanggal_mutasi?: string;
    siklus_pembayaran_gaji?: string;
    costing?: string;
    assign?: string;
    actual?: string;

    // Tab Informasi Keluarga
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
    anak_ke?: number;
    jumlah_saudara_kandung?: number;
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

    // Nested data
    anak?: AnakInput[];
    saudara_kandung?: SaudaraKandungInput[];
}

export interface UpdateKaryawanInput extends Partial<CreateKaryawanInput> { }
