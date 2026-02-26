import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Start seeding...');

    // 1. Seed Divisi
    const divisiNames = ['Operasional', 'Keuangan', 'Sumber Daya Manusia'];
    const divisis = [];
    for (const nama of divisiNames) {
        const res = await prisma.divisi.upsert({
            where: { nama_divisi: nama },
            update: { nama_divisi: nama },
            create: {
                nama_divisi: nama
            },
        });
        divisis.push(res);
    }
    console.log('✅ Divisi seeded');

    // 2. Seed Department
    const operasional = divisis.find(d => d.nama_divisi === 'Operasional');
    const keuangan = divisis.find(d => d.nama_divisi === 'Keuangan');
    const sdm = divisis.find(d => d.nama_divisi === 'Sumber Daya Manusia');

    const deptData = [
        { nama: 'Produksi', divisi_id: operasional?.id },
        { nama: 'Akuntansi', divisi_id: keuangan?.id },
        { nama: 'Rekrutmen', divisi_id: sdm?.id },
    ];

    const departments = [];
    for (const d of deptData) {
        const res = await prisma.department.upsert({
            where: { nama_department: d.nama },
            update: { nama_department: d.nama, divisi_id: d.divisi_id! },
            create: {
                nama_department: d.nama,
                divisi_id: d.divisi_id!
            },
        });
        departments.push(res);
    }
    console.log('✅ Department seeded');

    // 3. Seed PosisiJabatan
    const produksi = departments.find(d => d.nama_department === 'Produksi');
    const akuntansi = departments.find(d => d.nama_department === 'Akuntansi');
    const rekrutmen = departments.find(d => d.nama_department === 'Rekrutmen');

    const posisiData = [
        { nama: 'Manager Produksi', dept_id: produksi?.id },
        { nama: 'Staff Produksi', dept_id: produksi?.id },
        { nama: 'Manager Keuangan', dept_id: akuntansi?.id },
        { nama: 'Staff Akuntansi', dept_id: akuntansi?.id },
        { nama: 'Staff HR', dept_id: rekrutmen?.id },
    ];

    for (const p of posisiData) {
        await prisma.posisiJabatan.upsert({
            where: { nama_posisi_jabatan: p.nama },
            update: { nama_posisi_jabatan: p.nama, department_id: p.dept_id! },
            create: {
                nama_posisi_jabatan: p.nama,
                department_id: p.dept_id!
            },
        });
    }
    console.log('✅ PosisiJabatan seeded');

    // 4. Seed Pangkat & Golongan
    const pangkatData = ['Staf', 'Supervisor', 'Manajer'];
    for (const p of pangkatData) {
        await prisma.kategoriPangkat.upsert({
            where: { nama_kategori_pangkat: p },
            update: { nama_kategori_pangkat: p },
            create: { nama_kategori_pangkat: p }
        });
    }

    const golData = ['I', 'II', 'III'];
    for (const g of golData) {
        await prisma.golongan.upsert({
            where: { nama_golongan: g },
            update: { nama_golongan: g },
            create: { nama_golongan: g }
        });
    }

    const subGolData = ['A', 'B', 'C'];
    for (const s of subGolData) {
        await prisma.subGolongan.upsert({
            where: { nama_sub_golongan: s },
            update: { nama_sub_golongan: s },
            create: { nama_sub_golongan: s }
        });
    }
    console.log('✅ Pangkat/Golongan seeded');

    // 5. Seed Misc Masters
    const hubData = ['Karyawan Tetap', 'Karyawan Kontrak', 'Magang'];
    for (const h of hubData) {
        await prisma.jenisHubunganKerja.upsert({
            where: { nama_jenis_hubungan_kerja: h },
            update: { nama_jenis_hubungan_kerja: h },
            create: { nama_jenis_hubungan_kerja: h }
        });
    }

    const tagData = [
        { nama: 'Prioritas', warna: '#EF4444' },
        { nama: 'Baru', warna: '#22C55E' },
    ];
    for (const t of tagData) {
        await prisma.tag.upsert({
            where: { nama_tag: t.nama },
            update: { nama_tag: t.nama, warna_tag: t.warna },
            create: { nama_tag: t.nama, warna_tag: t.warna }
        });
    }

    const lokasiData = [
        { nama: 'Kantor Pusat Jakarta', alamat: 'Jakarta' },
        { nama: 'Site Taliabu', alamat: 'Pulau Taliabu' },
    ];
    for (const l of lokasiData) {
        await prisma.lokasiKerja.upsert({
            where: { nama_lokasi_kerja: l.nama },
            update: { nama_lokasi_kerja: l.nama, alamat: l.alamat },
            create: { nama_lokasi_kerja: l.nama, alamat: l.alamat }
        });
    }

    const statusData = ['Aktif', 'Tidak Aktif', 'Cuti'];
    for (const s of statusData) {
        await prisma.statusKaryawan.upsert({
            where: { nama_status: s },
            update: { nama_status: s },
            create: { nama_status: s }
        });
    }
    console.log('✅ Master data lainnya seeded');

    // 6. Seed Karyawan
    const masterRef = {
        divisi: (await prisma.divisi.findFirst({ where: { nama_divisi: 'Operasional' } }))!,
        dept: (await prisma.department.findFirst({ where: { nama_department: 'Produksi' } }))!,
        posisi: (await prisma.posisiJabatan.findFirst({ where: { nama_posisi_jabatan: 'Manager Produksi' } }))!,
        status: (await prisma.statusKaryawan.findFirst({ where: { nama_status: 'Aktif' } }))!,
        lokasi: (await prisma.lokasiKerja.findFirst({ where: { nama_lokasi_kerja: 'Kantor Pusat Jakarta' } }))!,
    };

    const karyawanSamples = [
        { nik: '01-00001', nama: 'Admin Utama' },
        { nik: '01-00002', nama: 'Budi Santoso' },
        { nik: '01-00003', nama: 'Siti Aminah' },
        { nik: '01-00004', nama: 'Dewi Lestari' },
        { nik: '01-00005', nama: 'Eko Prasetyo' },
    ];

    for (const k of karyawanSamples) {
        await prisma.karyawan.upsert({
            where: { nomor_induk_karyawan: k.nik },
            update: { nama_lengkap: k.nama },
            create: {
                nomor_induk_karyawan: k.nik,
                nama_lengkap: k.nama,
                divisi_id: masterRef.divisi.id,
                department_id: masterRef.dept.id,
                posisi_jabatan_id: masterRef.posisi.id,
                status_karyawan_id: masterRef.status.id,
                lokasi_kerja_id: masterRef.lokasi.id,
                jenis_kelamin: 'LakiLaki',
                tanggal_masuk: new Date(),
            }
        });
    }
    console.log('✅ Karyawan seeded');

    // Hierarchy
    const adminK = await prisma.karyawan.findUnique({ where: { nomor_induk_karyawan: '01-00001' } });
    if (adminK) {
        await prisma.karyawan.updateMany({
            where: { nomor_induk_karyawan: { in: ['01-00002', '01-00003', '01-00004', '01-00005'] } },
            data: { manager_id: adminK.id, atasan_langsung_id: adminK.id }
        });
    }

    // 7. User Admin
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await prisma.user.upsert({
        where: { nik: '01-00001' },
        update: { password_hash: hashedPassword, role: 'Administrator' },
        create: {
            nik: '01-00001',
            password_hash: hashedPassword,
            role: 'Administrator',
            karyawan_id: adminK?.id
        }
    });
    console.log('✅ User admin seeded');

    console.log('🏁 Done!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
