# Tutorial Instalasi dan Menjalankan Aplikasi

Tutorial ini akan memandu Anda langkah demi langkah dalam menginstal, mengonfigurasi, dan menjalankan proyek Bebang Sistem Informasi (BIS) di lingkungan lokal Anda. Proyek ini terbagi menjadi dua bagian: **backend** (Node.js/Prisma) dan **frontend** (React/Vite).

## Persyaratan Awal (Prerequisites)

Sebelum memulai, pastikan perangkat Anda telah diinstall dengan:
1. **Node.js** (direkomendasikan versi 18.x atau yang lebih baru). Unduh dari [nodejs.org](https://nodejs.org/).
2. **Git** untuk *cloning* repositori (opsional jika sudah ada *source code* lokal).
3. **Database** (MySQL, PostgreSQL, dsb. sesuai dengan apa yang akan Anda gunakan nanti untuk Prisma).

---

## 1. Setup Backend

Bagian backend mengatur logika API, koneksi ke basis data, autentikasi, serta fitur impor/ekspor data.

### Langkah 1: Navigasi dan Instalasi Dependensi
Buka terminal dan arahkan masuk ke folder backend:
```bash
cd path/ke/develop-bis/backend
```

Jalankan perintah berikut untuk mengunduh semua modul yang diperlukan:
```bash
npm install
```

### Langkah 2: Konfigurasi File Environment (.env)
Ganti nama (atau salin) file `.env.example` ke `.env` jika tersedia. Jika tidak ada, buat file baru bernama `.env`. Di dalamnya, konfigurasikan koneksi basis data dan secret JWT Anda:

```env
# Contoh koneksi MySQL/MariaDB
DATABASE_URL="mysql://username_db:password_db@localhost:3306/db_bebang"

# Port backend berjalan
PORT=3000

# Rahasia untuk hash JWT (Penting! Buat random string yang unik)
JWT_SECRET="rahasia-kita-sangat-aman-12345"
```
*(Ubah nilai-nilai yang ada di string konfigurasi tersebut agar sesuai dengan konfigurasi server MySQL lokal atau remote Anda).*

### Langkah 3: Menyiapkan Database dan Seeding Data
Setelah `.env` dibuat, jalankan *Prisma Migration* agar *database schemas* siap digunakan:

```bash
# Men-generate Prisma client berdasar file prisma/schema.prisma
npm run db:generate

# Mensinkronisasikan struktur database (menjalankan migration)
npm run db:migrate
```

Agar aplikasi langsung memiliki Master Data, Karyawan *dummy*, dan Akun **Admin**, jalankan *seeder* bawaan:
```bash
npm run db:seed
```

### Kredensial Admin Default
Jika *seeder* di atas berhasil dijalankan (`npm run db:seed`), otomatis akan ada satu akun admin awal di database. Kredensial yang bisa digunakan untuk Login:
- **NIK**: `01-00001`
- **Password**: `admin123`

### Langkah 4: Menjalankan Backend
Untuk mode kompilasi ringan dan auto-reload (*development*), ketikkan perintah ini:
```bash
npm run dev
```
Setelah berjalan, terminal akan menampilkan konfirmasi *listening* di port yang di-setup di `.env` (misal `http://localhost:3000`).

---

## 2. Setup Frontend

Frontend adalah antarmuka interaktif bagi user (dibangun dengan React, Vite, dan Tailwind CSS).

### Langkah 1: Navigasi dan Instalasi Dependensi
Buka jendela/tab terminal layar baru dan arahkah ke subdirektori frontend:
```bash
cd path/ke/develop-bis/frontend
```

Pasang semua library frontend yang terdaftar:
```bash
npm install
```

### Langkah 2: Konfigurasi File Environment (.env)
Sama seperti backend, Anda memerlukan file `.env` di direktori `frontend`. Buatlah file tersebut:

```env
# Base URL API yang terhubung dengan backend
# Ganti port "3000" jika Anda mengubah PORT config backend
VITE_API_URL=http://localhost:3000/api
```

### Langkah 3: Menjalankan Frontend
Gunakan perintah vite dev untuk me*run* *local development server* aplikasi react:
```bash
npm run dev
```

Anda akan menerima prompt port *default*, biasanya di URL: `http://localhost:5173`. Klik link tersebut atau copy-paste ke peramban (browser) pilihan Anda.

---

## 3. Login ke Aplikasi

Setelah backend URL dan frontend URL sama-sama berjalan:
1. Akses aplikasi frontend di URL (contoh: `http://localhost:5173`). Anda akan diarahkan ke halaman `/login`.
2. Masukkan kredensial administrator default yang dihasilkan oleh langkah *seed*:
   - NIK: `01-00001`
   - Password: `admin123`
3. Klik Masuk. Anda telah sukses mengakses dashboard sistem BIS!
