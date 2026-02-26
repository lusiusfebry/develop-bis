-- CreateEnum
CREATE TYPE "StatusMaster" AS ENUM ('Aktif', 'TidakAktif');

-- CreateEnum
CREATE TYPE "RoleUser" AS ENUM ('Administrator', 'HR', 'Karyawan');

-- CreateEnum
CREATE TYPE "JenisKelamin" AS ENUM ('LakiLaki', 'Perempuan');

-- CreateEnum
CREATE TYPE "Agama" AS ENUM ('Islam', 'Kristen', 'Katolik', 'Hindu', 'Buddha', 'Konghucu');

-- CreateEnum
CREATE TYPE "GolonganDarah" AS ENUM ('A', 'B', 'AB', 'O');

-- CreateEnum
CREATE TYPE "StatusPernikahan" AS ENUM ('BelumMenikah', 'Menikah', 'Cerai', 'CeraiMati');

-- CreateEnum
CREATE TYPE "StatusKelulusan" AS ENUM ('Lulus', 'TidakLulus', 'SedangBerjalan');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "nik" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" "RoleUser" NOT NULL DEFAULT 'Karyawan',
    "karyawan_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "divisi" (
    "id" TEXT NOT NULL,
    "nama_divisi" TEXT NOT NULL,
    "status" "StatusMaster" NOT NULL DEFAULT 'Aktif',
    "keterangan" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "divisi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "department" (
    "id" TEXT NOT NULL,
    "nama_department" TEXT NOT NULL,
    "divisi_id" TEXT NOT NULL,
    "status" "StatusMaster" NOT NULL DEFAULT 'Aktif',
    "keterangan" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "posisi_jabatan" (
    "id" TEXT NOT NULL,
    "nama_posisi_jabatan" TEXT NOT NULL,
    "department_id" TEXT NOT NULL,
    "status" "StatusMaster" NOT NULL DEFAULT 'Aktif',
    "keterangan" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "posisi_jabatan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kategori_pangkat" (
    "id" TEXT NOT NULL,
    "nama_kategori_pangkat" TEXT NOT NULL,
    "status" "StatusMaster" NOT NULL DEFAULT 'Aktif',
    "keterangan" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kategori_pangkat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "golongan" (
    "id" TEXT NOT NULL,
    "nama_golongan" TEXT NOT NULL,
    "status" "StatusMaster" NOT NULL DEFAULT 'Aktif',
    "keterangan" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "golongan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sub_golongan" (
    "id" TEXT NOT NULL,
    "nama_sub_golongan" TEXT NOT NULL,
    "status" "StatusMaster" NOT NULL DEFAULT 'Aktif',
    "keterangan" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sub_golongan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jenis_hubungan_kerja" (
    "id" TEXT NOT NULL,
    "nama_jenis_hubungan_kerja" TEXT NOT NULL,
    "status" "StatusMaster" NOT NULL DEFAULT 'Aktif',
    "keterangan" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "jenis_hubungan_kerja_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tag" (
    "id" TEXT NOT NULL,
    "nama_tag" TEXT NOT NULL,
    "warna_tag" TEXT,
    "status" "StatusMaster" NOT NULL DEFAULT 'Aktif',
    "keterangan" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lokasi_kerja" (
    "id" TEXT NOT NULL,
    "nama_lokasi_kerja" TEXT NOT NULL,
    "alamat" TEXT,
    "status" "StatusMaster" NOT NULL DEFAULT 'Aktif',
    "keterangan" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lokasi_kerja_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "status_karyawan" (
    "id" TEXT NOT NULL,
    "nama_status" TEXT NOT NULL,
    "status" "StatusMaster" NOT NULL DEFAULT 'Aktif',
    "keterangan" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "status_karyawan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "karyawan" (
    "id" TEXT NOT NULL,
    "foto_karyawan" TEXT,
    "nama_lengkap" TEXT NOT NULL,
    "nomor_induk_karyawan" TEXT NOT NULL,
    "divisi_id" TEXT NOT NULL,
    "department_id" TEXT NOT NULL,
    "posisi_jabatan_id" TEXT NOT NULL,
    "manager_id" TEXT,
    "atasan_langsung_id" TEXT,
    "email_perusahaan" TEXT,
    "nomor_handphone" TEXT,
    "status_karyawan_id" TEXT NOT NULL,
    "lokasi_kerja_id" TEXT NOT NULL,
    "tag_id" TEXT,
    "jenis_kelamin" "JenisKelamin",
    "tempat_lahir" TEXT,
    "tanggal_lahir" TIMESTAMP(3),
    "email_pribadi" TEXT,
    "agama" "Agama",
    "golongan_darah" "GolonganDarah",
    "nomor_kartu_keluarga" TEXT,
    "nomor_ktp" TEXT,
    "nomor_npwp" TEXT,
    "nomor_bpjs" TEXT,
    "no_nik_kk" TEXT,
    "status_pajak" TEXT,
    "alamat_domisili" TEXT,
    "kota_domisili" TEXT,
    "provinsi_domisili" TEXT,
    "alamat_ktp" TEXT,
    "kota_ktp" TEXT,
    "provinsi_ktp" TEXT,
    "nomor_handphone_2" TEXT,
    "nomor_telepon_rumah_1" TEXT,
    "nomor_telepon_rumah_2" TEXT,
    "status_pernikahan" "StatusPernikahan",
    "nama_pasangan" TEXT,
    "tanggal_menikah" TIMESTAMP(3),
    "tanggal_cerai" TIMESTAMP(3),
    "tanggal_wafat_pasangan" TIMESTAMP(3),
    "pekerjaan_pasangan" TEXT,
    "jumlah_anak" INTEGER,
    "nomor_rekening" TEXT,
    "nama_pemegang_rekening" TEXT,
    "nama_bank" TEXT,
    "cabang_bank" TEXT,
    "jenis_hubungan_kerja_id" TEXT,
    "tanggal_masuk_group" TIMESTAMP(3),
    "tanggal_masuk" TIMESTAMP(3),
    "tanggal_permanent" TIMESTAMP(3),
    "tanggal_kontrak" TIMESTAMP(3),
    "tanggal_akhir_kontrak" TIMESTAMP(3),
    "tanggal_berhenti" TIMESTAMP(3),
    "tingkat_pendidikan" TEXT,
    "bidang_studi" TEXT,
    "nama_sekolah" TEXT,
    "kota_sekolah" TEXT,
    "status_kelulusan" "StatusKelulusan",
    "keterangan_pendidikan" TEXT,
    "kategori_pangkat_id" TEXT,
    "golongan_pangkat_id" TEXT,
    "sub_golongan_pangkat_id" TEXT,
    "no_dana_pensiun" TEXT,
    "nama_kontak_darurat_1" TEXT,
    "nomor_telepon_kontak_darurat_1" TEXT,
    "hubungan_kontak_darurat_1" TEXT,
    "alamat_kontak_darurat_1" TEXT,
    "nama_kontak_darurat_2" TEXT,
    "nomor_telepon_kontak_darurat_2" TEXT,
    "hubungan_kontak_darurat_2" TEXT,
    "alamat_kontak_darurat_2" TEXT,
    "point_of_original" TEXT,
    "point_of_hire" TEXT,
    "ukuran_seragam_kerja" TEXT,
    "ukuran_sepatu_kerja" TEXT,
    "lokasi_sebelumnya_id" TEXT,
    "tanggal_mutasi" TIMESTAMP(3),
    "siklus_pembayaran_gaji" TEXT,
    "costing" TEXT,
    "assign" TEXT,
    "actual" TEXT,
    "tanggal_lahir_pasangan" TIMESTAMP(3),
    "pendidikan_terakhir_pasangan" TEXT,
    "keterangan_pasangan" TEXT,
    "nama_ayah_kandung" TEXT,
    "tanggal_lahir_ayah_kandung" TIMESTAMP(3),
    "pendidikan_terakhir_ayah" TEXT,
    "pekerjaan_ayah" TEXT,
    "keterangan_ayah" TEXT,
    "nama_ibu_kandung" TEXT,
    "tanggal_lahir_ibu_kandung" TIMESTAMP(3),
    "pendidikan_terakhir_ibu" TEXT,
    "pekerjaan_ibu" TEXT,
    "keterangan_ibu" TEXT,
    "anak_ke" INTEGER,
    "jumlah_saudara_kandung" INTEGER,
    "nama_ayah_mertua" TEXT,
    "tanggal_lahir_ayah_mertua" TIMESTAMP(3),
    "pendidikan_terakhir_ayah_mertua" TEXT,
    "pekerjaan_ayah_mertua" TEXT,
    "keterangan_ayah_mertua" TEXT,
    "nama_ibu_mertua" TEXT,
    "tanggal_lahir_ibu_mertua" TIMESTAMP(3),
    "pendidikan_terakhir_ibu_mertua" TEXT,
    "pekerjaan_ibu_mertua" TEXT,
    "keterangan_ibu_mertua" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "karyawan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "anak" (
    "id" TEXT NOT NULL,
    "karyawan_id" TEXT NOT NULL,
    "nama_anak" TEXT NOT NULL,
    "jenis_kelamin" "JenisKelamin",
    "tanggal_lahir" TIMESTAMP(3),
    "keterangan" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "anak_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "saudara_kandung" (
    "id" TEXT NOT NULL,
    "karyawan_id" TEXT NOT NULL,
    "nama_saudara_kandung" TEXT NOT NULL,
    "jenis_kelamin" "JenisKelamin",
    "tanggal_lahir" TIMESTAMP(3),
    "pendidikan_terakhir" TEXT,
    "pekerjaan" TEXT,
    "keterangan" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "saudara_kandung_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_nik_key" ON "users"("nik");

-- CreateIndex
CREATE UNIQUE INDEX "users_karyawan_id_key" ON "users"("karyawan_id");

-- CreateIndex
CREATE UNIQUE INDEX "karyawan_nomor_induk_karyawan_key" ON "karyawan"("nomor_induk_karyawan");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_karyawan_id_fkey" FOREIGN KEY ("karyawan_id") REFERENCES "karyawan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "department" ADD CONSTRAINT "department_divisi_id_fkey" FOREIGN KEY ("divisi_id") REFERENCES "divisi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posisi_jabatan" ADD CONSTRAINT "posisi_jabatan_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "karyawan" ADD CONSTRAINT "karyawan_divisi_id_fkey" FOREIGN KEY ("divisi_id") REFERENCES "divisi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "karyawan" ADD CONSTRAINT "karyawan_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "karyawan" ADD CONSTRAINT "karyawan_posisi_jabatan_id_fkey" FOREIGN KEY ("posisi_jabatan_id") REFERENCES "posisi_jabatan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "karyawan" ADD CONSTRAINT "karyawan_status_karyawan_id_fkey" FOREIGN KEY ("status_karyawan_id") REFERENCES "status_karyawan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "karyawan" ADD CONSTRAINT "karyawan_lokasi_kerja_id_fkey" FOREIGN KEY ("lokasi_kerja_id") REFERENCES "lokasi_kerja"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "karyawan" ADD CONSTRAINT "karyawan_lokasi_sebelumnya_id_fkey" FOREIGN KEY ("lokasi_sebelumnya_id") REFERENCES "lokasi_kerja"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "karyawan" ADD CONSTRAINT "karyawan_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tag"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "karyawan" ADD CONSTRAINT "karyawan_jenis_hubungan_kerja_id_fkey" FOREIGN KEY ("jenis_hubungan_kerja_id") REFERENCES "jenis_hubungan_kerja"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "karyawan" ADD CONSTRAINT "karyawan_kategori_pangkat_id_fkey" FOREIGN KEY ("kategori_pangkat_id") REFERENCES "kategori_pangkat"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "karyawan" ADD CONSTRAINT "karyawan_golongan_pangkat_id_fkey" FOREIGN KEY ("golongan_pangkat_id") REFERENCES "golongan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "karyawan" ADD CONSTRAINT "karyawan_sub_golongan_pangkat_id_fkey" FOREIGN KEY ("sub_golongan_pangkat_id") REFERENCES "sub_golongan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "karyawan" ADD CONSTRAINT "karyawan_manager_id_fkey" FOREIGN KEY ("manager_id") REFERENCES "karyawan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "karyawan" ADD CONSTRAINT "karyawan_atasan_langsung_id_fkey" FOREIGN KEY ("atasan_langsung_id") REFERENCES "karyawan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anak" ADD CONSTRAINT "anak_karyawan_id_fkey" FOREIGN KEY ("karyawan_id") REFERENCES "karyawan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saudara_kandung" ADD CONSTRAINT "saudara_kandung_karyawan_id_fkey" FOREIGN KEY ("karyawan_id") REFERENCES "karyawan"("id") ON DELETE CASCADE ON UPDATE CASCADE;
