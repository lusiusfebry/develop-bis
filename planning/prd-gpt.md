Berikut adalah dokumen **PRD (Product Requirement Document)** yang komprehensif untuk pengembangan aplikasi sesuai dengan:

* PT Prima Sarana Gemilang
* Nama Sistem: **Bebang Sistem Informasi (BIS)**
* Database: **develop-bis**
* Referensi:

  * 01_rencana_sistem.md
  * 02_modul_hr_v2.md
  * 08_relasi_dengan_sheet_excel.md
  * BMI-kosong.xlsx
* Pendekatan: **Spec Driven Development (SDD)**
* UI: **Trending Web Design 2026**
* Master Data & Profil Karyawan: **Wajib**

---

# 📘 PRD.md

# Bebang Sistem Informasi (BIS)

## Modul: Human Resources (Phase 1 – Core Foundation)

---

# 1. Executive Summary

## 1.1 Latar Belakang

Bebang Sistem Informasi (BIS) adalah aplikasi enterprise web progresif yang dikembangkan sebagai pusat pelayanan data karyawan di lingkungan PT Prima Sarana Gemilang site Taliabu.

Sistem dirancang untuk:

* Mengelola >500 karyawan
* Menjadi pusat data HR
* Terintegrasi dengan modul lain (Inventory, Mess, Building, Access Right)
* Mendukung scale-up ke cloud

Fokus fase pertama adalah **Modul Human Resources** sebagai fondasi sistem.

---

# 2. Product Vision

Membangun sistem HR modern, profesional, scalable, dan compliant untuk industri pertambangan dengan standar UX enterprise 2026.

---

# 3. Scope Produk (Phase 1)

## 3.1 In Scope

✅ Login System (NIK Based)
✅ Welcome Page
✅ Modul Human Resources
✅ Master Data (Wajib)
✅ Profil Karyawan (Wajib)
✅ Import Excel (BMI Template)
✅ Export Data
✅ QR Code Generator
✅ Upload Foto & Dokumen
✅ Audit Trail
✅ Role & Access Ready (integrasi modul UARM)

## 3.2 Out of Scope (Phase Selanjutnya)

❌ Payroll
❌ Attendance
❌ Performance Management
❌ ESS (Employee Self Service)

---

# 4. Target User

| Role            | Deskripsi             |
| --------------- | --------------------- |
| HR Admin        | Input dan kelola data |
| HR Manager      | Monitoring & approval |
| Department Head | View data             |
| IT Admin        | System configuration  |

---

# 5. Arsitektur Sistem

## 5.1 Struktur Folder (Mandatory)

```
/backend
  /modules
    /human-resources
      /master-data
      /employee-profile
      /import-export
/frontend
  /modules
    /human-resources
/database
/docs
```

## 5.2 Tech Stack

* Frontend: Next.js (App Router)
* Backend: Node.js (NestJS atau Express modular)
* Database: PostgreSQL
* DB Name: `develop-bis`
* Storage: Local file storage (phase 1)
* ORM: Prisma / TypeORM
* Authentication: JWT

---

# 6. Database Specification

## 6.1 Database Name

```
develop-bis
```

## 6.2 Credential (Development Only)

* user: postgres
* password: 123456789

---

# 7. Functional Requirements

# 7.1 Login System

### Flow:

Login Page → Welcome Page → Module

### Requirement:

* Username: nomor_induk_karyawan (format: xx-xxxxx)
* Password:

  * Dev: seeded password
  * Production: managed by User Access Right Module
* No hardcoded data
* Data berasal dari database

### Validation:

* NIK wajib ada di tabel employee
* Status karyawan harus aktif
* Account harus aktif

---

# 8. Modul Human Resources

---

# 8.1 MASTER DATA (WAJIB)

Semua master data:

* CRUD
* Status Aktif/Tidak Aktif
* Tidak boleh dihapus jika sudah direferensikan

## Master Data Entities:

1. Divisi
2. Department
3. Posisi Jabatan
4. Kategori Pangkat
5. Golongan
6. Sub Golongan
7. Jenis Hubungan Kerja
8. Tag
9. Lokasi Kerja
10. Status Karyawan

### General Rules:

* Default status: Aktif
* Dropdown hanya menampilkan status Aktif
* Semua dropdown support search

---

# 8.2 PROFIL KARYAWAN (WAJIB)

## Struktur:

### HEAD SECTION

Berisi:

* Foto
* Nama
* NIK
* Divisi
* Department
* Manager
* Atasan
* Posisi
* Email
* Status
* Lokasi
* Tag

### DETAIL SECTION (Tabbed)

1. Personal Information
2. Informasi HR
3. Informasi Keluarga

---

## 8.2.1 QR Code

* Generate dari nomor_induk_karyawan
* Format: PNG
* Tersimpan di storage
* Bisa di download
* Bisa ditampilkan di profile

---

## 8.2.2 Upload Dokumen

Support:

* JPG
* PNG
* PDF
* Max 5MB per file

Disimpan:

```
/storage/employees/{nik}/
```

---

# 9. Import & Export System (Excel Based)

## 9.1 File Template

Template menggunakan:

```
BMI-kosong.xlsx
```

## 9.2 Mapping Rules

Referensi:

* Sheet: "header excel vs master data"
* Sheet: "header excel vs profil karyawan"

## 9.3 Import Engine Rules

* Tidak menggunakan data mock
* Semua data masuk database
* Validasi:

  * Master data harus ada atau dibuat otomatis
  * Duplicate NIK ditolak
  * Format tanggal valid
  * Field referensi wajib cocok

## 9.4 Mapping Handling

Karena:

> Beberapa field profil mereferensikan kolom Excel yang sama

Sistem harus:

* Mendukung multi-field mapping
* Menggunakan transform layer
* Menyimpan raw import log

---

## 9.5 Import Flow

Upload → Validation → Preview → Confirm → Insert DB

---

## 9.6 Export

Support:

* Export per karyawan
* Export massal
* Format: Excel & CSV

---

# 10. Non-Functional Requirements

## 10.1 Performance

* Support 500+ karyawan
* Query response < 500ms
* Pagination mandatory

## 10.2 Security

* JWT Auth
* Role-based Access
* Audit log:

  * create
  * update
  * delete
  * import

## 10.3 Data Integrity

* Foreign key constraint
* Soft delete
* Transactional import

---

# 11. UI/UX Specification

## Design: Trending Web Design 2026

Karakteristik:

* Clean Minimal Layout
* Soft glassmorphism
* Subtle gradient background
* Rounded 2xl border radius
* Micro-interaction hover
* Smooth transition
* Sticky header
* Left vertical navigation
* Dark/Light mode
* Responsive

## UX Standard:

* Enterprise ready
* Professional
* Tidak ramai
* Bahasa Indonesia penuh

---

# 12. Spec Driven Development Structure

Setiap fitur harus memiliki:

```
/docs/specs/
  HR-MASTER-DATA-SPEC.md
  HR-PROFILE-SPEC.md
  HR-IMPORT-SPEC.md
  HR-QR-SPEC.md
```

Setiap spec wajib berisi:

* Objective
* Database schema
* API contract
* Validation rule
* Error handling
* Acceptance Criteria

---

# 13. API Structure (Example)

## Master Divisi

GET /api/hr/divisi
POST /api/hr/divisi
PUT /api/hr/divisi/{id}
DELETE /api/hr/divisi/{id}

## Employee

GET /api/hr/employees
POST /api/hr/employees
PUT /api/hr/employees/{id}
GET /api/hr/employees/{id}/qr

---

# 14. Audit Trail

Table: audit_logs

Fields:

* id
* user_id
* module
* action
* old_value
* new_value
* timestamp

---

# 15. Data Storage Rules

* Semua profil karyawan wajib tersimpan di database
* Tidak boleh menyimpan data statis
* Tidak boleh hardcoded

---

# 16. Seed Data (Development Only)

Seed:

* 1 HR Admin
* 1 IT Admin
* 3 contoh divisi
* 3 contoh department
* 3 posisi jabatan

---

# 17. Risk & Mitigation

| Risk                      | Mitigation              |
| ------------------------- | ----------------------- |
| Excel tidak sesuai format | Validation layer        |
| Duplicate data            | Unique constraint       |
| Master data kosong        | Enforce master creation |
| Data besar                | Pagination & indexing   |

---

# 18. Acceptance Criteria

✔ Master Data CRUD berjalan
✔ Profil Karyawan lengkap sesuai spec
✔ QR Code otomatis generate
✔ Import BMI template berhasil
✔ Tidak ada data hardcoded
✔ UI modern 2026 style
✔ Audit trail aktif
✔ Database develop-bis berjalan normal

---

# 19. Future Ready

Struktur mendukung integrasi ke:

* Inventory
* Mess Management
* Building Management
* User Access Right Management

---

# 20. Kesimpulan

Modul Human Resources adalah fondasi utama Bebang Sistem Informasi.
Master Data dan Profil Karyawan adalah komponen wajib dan tidak dapat dinegosiasikan.

Dokumen ini menjadi acuan tunggal pengembangan berbasis Spec Driven Development.

---

