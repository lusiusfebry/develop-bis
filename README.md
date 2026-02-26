# Bebang Sistem Informasi (BIS)

Bebang Sistem Informasi (BIS) adalah aplikasi berbasis web yang dikembangkan menggunakan stack modern (React + Node.js) untuk mengelola data operasional dan sumber daya manusia (HR).

## 🚀 Teknologi yang Digunakan

### Frontend
- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS v4
- **Komponen UI**: shadcn/ui + Radix UI
- **Routing**: React Router DOM
- **State Management & Data Fetching**: React Query (@tanstack/react-query)
- **Icons**: Lucide React
- **Lainnya**: Axios, class-variance-authority, clsx, tailwind-merge

### Backend
- **Framework & Runtime**: Node.js + Express
- **Bahasa**: TypeScript
- **ORM**: Prisma
- **Autentikasi**: JSON Web Token (JWT) + bcrypt
- **Lainnya**: CORS, dotenv, multer (untuk upload file), exceljs (untuk import/export Excel)

## 📦 Fitur Utama

- **Autentikasi & Otorisasi**: Sistem login yang aman dengan JWT.
- **Manajemen Karyawan (HR)**: CRUD data karyawan, pencarian, dan pemfilteran terintegrasi dengan data master.
- **Master Data Management**: Mengelola data rujukan seperti Divisi, Department, Posisi Jabatan, Status Karyawan, Lokasi Kerja, dll.
- **Import & Export Data**: Kemampuan untuk mengunggah dan mengunduh data karyawan dalam format Excel (.xlsx), dilengkapi dengan validasi data sebelum diimpor dan filter kustom saat diekspor.

## 🛠️ Persyaratan Sistem

Pastikan Anda telah menginstal perangkat lunak berikut sebelum menjalankan proyek ini:
- [Node.js](https://nodejs.org/) (versi 18 atau lebih baru direkomendasikan)
- [npm](https://www.npmjs.com/) (biasanya sudah termasuk dengan instalasi Node.js)
- Database (seperti MySQL atau PostgreSQL, sesuai dengan konfigurasi Prisma di backend)

## 🏃 Panduan Menjalankan Aplikasi Secara Lokal

Proyek ini menggunakan monorepo terpisah untuk frontend dan backend.

### 1. Setup Backend

Buka terminal dan arahkan ke direktori `backend`:

```bash
cd backend
```

Instal dependensi:

```bash
npm install
```

Salin file `.env.example` ke `.env` (jika ada) dan sesuaikan variabel environtment-nya, terutama `DATABASE_URL` dan `JWT_SECRET`:

```bash
# Contoh isi .env
DATABASE_URL="mysql://user:password@localhost:3306/db_name"
PORT=3000
JWT_SECRET="rahasia-kita"
```

Generate Prisma client dan jalankan migrasi database:

```bash
npm run db:generate
npm run db:migrate
```

*(Opsional)* Jalankan file seeder untuk mengisi data awal:

```bash
npm run db:seed
```

Jalankan server aplikasi di mode development:

```bash
npm run dev
```

Backend akan berjalan default pada `http://localhost:3000`.

### 2. Setup Frontend

Buka terminal baru dan arahkan ke direktori `frontend`:

```bash
cd frontend
```

Instal dependensi:

```bash
npm install
```

Salin file `.env.example` ke `.env` (jika ada) dan konfigurasikan URL API backend Anda:

```bash
# Contoh isi .env
VITE_API_URL=http://localhost:3000/api
```

Jalankan aplikasi React di mode development:

```bash
npm run dev
```

Frontend akan berjalan dan dapat diakses biasanya melalui `http://localhost:5173`.

## 📜 Skrip Tambahan

### Frontend
- `npm run build`: Membangun (compile) frontend untuk production.
- `npm run lint`: Menjalankan ESLint untuk mengecek potensi masalah pada kode.
- `npm run preview`: Melihat preview dari *production build* secara lokal.

### Backend
- `npm run build`: Mengompilasi kode TypeScript ke JavaScript di dalam folder `dist`.
- `npm run start`: Menjalankan server dari hasil kompilasi *production build*.

---

*Catatan: Dokumentasi dan penulisan kode dalam proyek ini secara eksklusif menggunakan Bahasa Indonesia kecuali untuk penamaan variabel, fungsi teknis, maupun syntax bawaan yang memang menggunakan bahasa aslinya (Inggris).*
