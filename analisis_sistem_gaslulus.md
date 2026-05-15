# Laporan Analisis Teknis & Audit Sistem GasLulus

Dokumen ini berisi analisis menyeluruh terhadap codebase platform GasLulus, mencakup sisi Admin dan User, serta temuan teknis dan saran pengembangan ke depan.

---

## 1. Analisis Arsitektur Backend (Node.js + Prisma)

### Struktur & Logic
- **Pola Controller-Route**: Pemisahan logic sudah sangat baik dan terorganisir.
- **ORM (Prisma)**: Penggunaan Prisma sudah optimal dan bersih.
  - *Status*: Redundansi penanganan `BigInt` telah diperbaiki. Seluruh controller kini mengandalkan patch global `BigInt.prototype.toJSON` di `index.js`, sehingga kode menjadi lebih ringkas dan maintainable.
- **Keamanan (Middleware)**: Proteksi rute menggunakan JWT dan pengecekan role (`authorizeAdmin`) sudah diimplementasikan dengan benar.

### Temuan & Anomali (Backend)
- **Logika Pengacakan Soal**: 
  - *Status*: **Fixed**. Implementasi *Fisher-Yates Shuffle* (atau pengacakan array) telah ditambahkan pada `getExamQuestions` dan `getPracticeQuestions`. Soal kini muncul secara acak setiap kali ujian/latihan dimulai.
- **Submit Latihan (Practice)**: 
  - *Status*: **Improved**. Sistem `submitPractice` kini secara dinamis mendeteksi `examId` asli dari soal-soal yang dikerjakan. Hasil latihan tidak lagi dipaksakan menempel pada satu ID simulasi saja, melainkan mengikuti sumber paket soal aslinya.

---

## 2. Analisis Arsitektur Frontend (React + Vite + Zustand)

### UI/UX & Desain
- **Estetika**: Sudah sangat premium dengan gaya *Modern Minimalist*. Konsistensi warna Navy & Amber terjaga dengan baik.
- **State Management**: Zustand digunakan dengan sangat efisien untuk `authStore`, memudahkan manajemen sesi secara global.

### Temuan & Anomali (Frontend)
- **Exam Page (Logic Complexity)**: 
  - *Status*: **Fixed & Refactored**. File `ExamPage.jsx` telah dipecah menjadi beberapa sub-komponen modular: `ExamTimer`, `ExamQuestion`, dan `ExamSidebar`. Hal ini meningkatkan *readability* dan memudahkan pemeliharaan kode.
- **Loading States**: 
  - *Status*: **Fixed**. Halaman `HistoryPage` dan `BookmarkPage` kini telah dilengkapi dengan *premium skeleton loading* yang mengikuti struktur kartu data asli, memberikan transisi yang jauh lebih halus.

---

## 3. Analisis Sisi Admin

### Fitur Saat Ini
- Manajemen Paket Ujian (CRUD).
- Manajemen Soal (CRUD dengan dukungan 5 opsi A-E).
- Statistik Dasar (Jumlah User, Ujian, Hasil).

### Temuan & Anomali (Admin)
- **Role Management**: 
  - *Status*: **Fixed**. Antarmuka "Manajemen User" telah ditambahkan ke Dashboard Admin.
  - *Keamanan*: Fitur pengubahan role (USER <-> ADMIN) telah diproteksi secara *hardcoded* di backend sehingga **hanya email owner (`hasyimsriewahyudi@gmail.com`)** yang memiliki otoritas untuk mempromosikan user lain menjadi Admin.
- **Statistik Lanjutan**: Statistik admin masih sangat dasar. Belum ada grafik tren pendaftaran atau rata-rata skor per kategori.

---

## 4. Temuan "Aneh" & Bug Potensial

1.  **Google User "Lock-out"**: User yang mendaftar via Google tidak memiliki password (`null`). Jika sistem lupa password diimplementasikan di masa depan, harus ada proteksi agar Google User tidak bisa melakukan "reset password" karena akan merusak alur OAuth. (Saat ini sudah ditangani dengan baik di backend).
2.  **Hardcoded Character Codes**: Di halaman ujian, konversi label opsi menggunakan `String.fromCharCode(65 + i)`. Ini sangat efisien untuk 5 opsi (A-E), namun pastikan jumlah opsi di database tidak pernah melebihi 26 (batas alfabet).
3.  **Port Conflict**: Seperti yang ditemukan sebelumnya, proses backend sering kali "nyangkut" di port 5000 jika tidak dimatikan dengan benar saat menggunakan Nodemon.

---

## 5. Saran Pengembangan Strategis

1.  **Batch Upload Soal**: Admin saat ini harus input satu per satu. Sangat disarankan menambahkan fitur **Import via Excel/CSV** untuk mempercepat pengisian konten.
2.  **Analisis Performa User**: Tambahkan fitur grafik perkembangan skor bagi user agar mereka merasa lebih termotivasi.
3.  **Sistem Notifikasi**: Implementasi integrasi email (seperti Resend yang tadi dibahas) tidak hanya untuk lupa password, tapi juga untuk laporan hasil tryout mingguan.
4.  **Database Indexing**: Seiring bertambahnya data `Result`, pastikan kolom `userId` dan `examId` pada tabel `results` memiliki indeks yang baik untuk kecepatan query statistik.

---

**Kesimpulan**: Platform GasLulus secara teknis sudah sangat solid dan menggunakan stack modern yang *scalable*. Fokus selanjutnya sebaiknya pada **Automation (Admin side)** dan **Gamification (User side)**.
