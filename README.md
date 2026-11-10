# TK Ceria — React + TypeScript dan Node.js + Express

## Kebutuhan
- Node.js versi LTS
- VS Code

## 1. Jalankan backend
Buka terminal:
```bash
cd backend
npm install
npm run dev
```
Backend berjalan di http://localhost:5000

## 2. Jalankan frontend
Buka terminal kedua:
```bash
cd frontend
npm install
npm run dev
```
Buka alamat yang ditampilkan Vite, biasanya http://localhost:5173

## Fitur
- Halaman beranda/dashboard, login, register, kegiatan, pendiri, dan guru.
- Backend Express dengan endpoint `/api/auth`, `/api/kegiatan`, `/api/pendiri`, `/api/guru`.
- Data contoh disimpan di folder `backend/data` dalam format JSON.
- Password di-hash menggunakan bcryptjs dan login menggunakan JWT.
- Menambah/menghapus kegiatan lewat API memerlukan token login.

## Catatan
- Data siswa/guru dan statistik di dashboard masih contoh, bukan data sekolah sungguhan.
- Akun dibuat melalui halaman Register. Setelah registrasi, login menggunakan email dan password tersebut.
- Untuk deployment sungguhan, gunakan database (MySQL/PostgreSQL), HTTPS, secret JWT dari environment, validasi tambahan, dan role admin. File JSON cocok untuk latihan lokal, bukan penggunaan banyak pengguna secara bersamaan.
- Endpoint `POST /api/kegiatan` dan `DELETE /api/kegiatan/:id` membutuhkan header `Authorization: Bearer TOKEN`.
