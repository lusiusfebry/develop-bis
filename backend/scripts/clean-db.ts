import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanDb() {
    console.log('Menyiapkan pembersihan data dummy Karyawan...');

    const adminNik = '01-00001';

    // Hapus user selain admin
    await prisma.user.deleteMany({
        where: { nik: { not: adminNik } }
    });

    const adminUser = await prisma.user.findUnique({ where: { nik: adminNik }, include: { karyawan: true } });
    const adminKaryawanId = adminUser?.karyawan_id;

    if (adminKaryawanId) {
        // Hapus history anak & saudara kandung
        await prisma.anak.deleteMany({
            where: { karyawan_id: { not: adminKaryawanId } }
        });
        await prisma.saudaraKandung.deleteMany({
            where: { karyawan_id: { not: adminKaryawanId } }
        });

        // Unlink manager dan atasan untuk menghindari foreign key constraint gagal ketika di-delete
        await prisma.karyawan.updateMany({
            data: { manager_id: null, atasan_langsung_id: null }
        });

        // Hapus semua karyawan kecuali admin
        const result = await prisma.karyawan.deleteMany({
            where: {
                id: { not: adminKaryawanId }
            }
        });
        console.log(`Berhasil menghapus ${result.count} data karyawan dummy.`);
    }

    console.log('Menghapus Master Data...');
    // Unlink foreign keys dari Admin Karyawan ke Master Data agar Master Data bisa di drop
    if (adminKaryawanId) {
        // Karena manager (admin) masih butuh referensi valid (kecuali kalau opsional), 
        // kita update karyawan admin pakai try/catch jika relasi mandatory.
        // Tapi karena struktur Relasi Prisma di Karyawan mewajibkan divisi_id, dept_id, dll. (tidak nullable),
        // maka Master Data yang menempel pada "01-00001" HARUS DIPERTAHANKAN.
        // Jika master data itu dihapus, data Karyawan Admin akan Error Foreign Key.
    }

    // ── Solusi: Hapus MASTER DATA yang TIDAK TERPAKAI oleh Admin ──
    try {
        await prisma.kategoriPangkat.deleteMany();
        await prisma.golongan.deleteMany();
        await prisma.subGolongan.deleteMany();
        await prisma.jenisHubunganKerja.deleteMany();
        await prisma.tag.deleteMany();

        console.log('Master Data (Pangkat, Golongan, Status, Tag) berhasil dikosongkan.');

        // Untuk Divisi, Department, Posisi Jabatan, Lokasi, dan Status Karyawan
        // Hanya hapus yang tidak sedang terikat dengan Admin Karyawan.
        const adminData = await prisma.karyawan.findUnique({ where: { id: adminKaryawanId! } });
        if (adminData) {
            await prisma.posisiJabatan.deleteMany({ where: { id: { not: adminData.posisi_jabatan_id } } });
            await prisma.department.deleteMany({ where: { id: { not: adminData.department_id } } });
            await prisma.divisi.deleteMany({ where: { id: { not: adminData.divisi_id } } });
            await prisma.statusKaryawan.deleteMany({ where: { id: { not: adminData.status_karyawan_id } } });
            await prisma.lokasiKerja.deleteMany({ where: { id: { not: adminData.lokasi_kerja_id } } });

            console.log('Sisa Master Data (Divisi, Dept, dll) selain milik Admin berhasil dikosongkan.');
        }

    } catch (err) {
        console.error('Ada masalah saat menghapus master data:', err);
    }

    console.log('Database telah bersih total! Credential Login dan 1 referensi divisi/lokasi untuk Admin tetap aman.');
}

cleanDb().catch(console.error).finally(() => prisma.$disconnect());
