# Analisis Komprehensif GasLulus Web App

Dokumen ini berisi hasil analisis mendetail terkait arsitektur, flow fitur, serta temuan *bug* dan celah kerentanan (vulnerability) pada aplikasi GasLulus, dari sisi Frontend maupun Backend.

---

## 1. Fitur Autentikasi (Login, Register, Lupa Password)
**Status Umum: Sangat Baik (Aman)**
- **Register**: Validasi input (Zod) berjalan dengan baik. Password di-*hash* menggunakan `bcryptjs` (salt 12 rounds) sebelum disimpan. Terdapat proteksi duplikasi email.
- **Login**: Autentikasi menggunakan JWT. Terdapat perlindungan *edge-case* yang sangat baik, yaitu menolak akun yang terdaftar via Google (`provider === 'GOOGLE'`) untuk login menggunakan password biasa.
- **Google OAuth**: Integrasi menggunakan verifikasi token sisi server (memanggil `googleapis.com/oauth2/v3/userinfo`). Ini merupakan standar keamanan yang solid.
- **Lupa Password**: Menggunakan token kriptografis `crypto.randomBytes(32)` yang memiliki *expiry time* (1 jam). Jika SMTP gagal (saat development), sistem melakukan *fallback* dengan mencetak link ke console. Sangat ramah untuk lingkungan *development*.
- **Keamanan Minor**: Endpoint `forgotPassword` tidak membocorkan apakah email terdaftar atau tidak (*No Email Enumeration Vulnerability*), sistem selalu mengembalikan pesan sukses terlepas dari ada/tidaknya email di database.

## 2. Fitur Ujian (Tryout / Simulasi / Latihan)
**Status Umum: Baik, namun terdapat celah keamanan dan logika bisnis.**

### Temuan Bug (Backend)
1. **[DEAD CODE] Bug pada Fallback Latihan (Practice Exam) — ✅ DIPERBAIKI**
   - **Lokasi**: `backend/src/controllers/exam.controller.js` (Fungsi `submitPractice`).
   - **Masalah Sebelumnya**: Terdapat logika pengecekan di mana jika simulasi referensi tidak ditemukan, sistem me-return respon HTTP `404` secara instan, membuat kode *fallback* di bawahnya menjadi *Dead Code*.
   - **Status Saat Ini**: Telah diperbaiki. Sistem sekarang akan mencoba mencari *fallback* ID Ujian secara keseluruhan terlebih dahulu, dan hanya mengembalikan error 404 jika seluruh pencarian data tidak ditemukan.

### Celah Keamanan (Vulnerability / Anti-Cheat)
1. **Manipulasi Durasi Pengerjaan (Time Spoofing) — ✅ DIPERBAIKI**
   - **Lokasi**: `frontend/src/pages/ExamPage.jsx` & Backend `submitExam`.
   - **Masalah Sebelumnya**: Penghitungan `durationUsed` murni dilakukan di sisi *client/frontend*. Pengguna yang nakal dapat memodifikasi *payload* JSON saat submit untuk memanipulasi durasi pengerjaan.
   - **Status Saat Ini**: Telah diperbaiki. Backend kini telah mengimplementasikan *In-Memory Session Map* (`backend/src/lib/session.js`). Saat ujian dimulai, server mencatat *timestamp* yang akurat, dan saat pengumpulan, server menghitung durasi independen berdasarkan memori internalnya. Modifikasi durasi pada *payload client* kini akan ditimpa/diabaikan oleh kalkulasi valid dari server.

2. **Sistem Anti-Cheat yang Lemah — ⚠️ PERLU PENINGKATAN**
   - **Lokasi**: `frontend/src/pages/ExamPage.jsx` (baris 71-89).
   - **Masalah**: Logika *Anti-Cheat* mendeteksi jika siswa berpindah tab (*visibilitychange*). Namun, sistem hanya menampilkan peringatan (SweetAlert) tanpa benar-benar memberikan penalti, membatalkan ujian, atau mencatat pelanggaran di database.
   - **Dampak**: Siswa dapat dengan mudah berpindah tab untuk mencari jawaban di Google, mengabaikan peringatan SweetAlert, lalu melanjutkan ujian.

## 3. Manajemen Skema Database (Terkait CPNS)
**Status Umum: Kurang mendukung aturan spesifik BKN.**

1. **Limitasi Skema Soal TKP (Tes Karakteristik Pribadi)**
   - **Masalah**: Pada ujian CPNS sesungguhnya, soal TKP tidak memiliki jawaban salah-benar absolut. Kelima opsi (A-E) memiliki rentang nilai/bobot (5, 4, 3, 2, 1). Saat ini, skema tabel `QuestionOption` hanya memiliki kolom `isCorrect` (Boolean).
   - **Dampak**: Sistem saat ini memaksa soal TKP dinilai seperti soal biasa (1 jawaban benar = nilai penuh, jawaban lain = 0). Ini membuat tryout CPNS tidak akurat secara *grading*.
   - **Solusi**: Modifikasi skema Prisma `QuestionOption` dengan menambahkan kolom `weight` atau `score` bertipe integer opsional, dan mengubah logika perhitungan `totalCorrect` di backend menjadi agregasi nilai `weight`.

## 4. UI / UX & Performa Frontend
**Status Umum: Premium dan Sangat Baik.**

1. **Pagination**: Implementasi pagination baik di halaman *Admin* maupun *History* kini sudah seragam, responsif, dinamis, dan memiliki pencegahan navigasi halaman kosong (clamping).
2. **Kinerja / State**: Penggunaan state React dan `localStorage` untuk menyimpan sesi ujian (`practice_session_...`) sangat membantu jika pengguna tidak sengaja menutup browser (jawaban tidak hilang). 
3. **Optimasi**: Halaman `ResultPage.jsx` menangani data secara efisien dengan menggunakan akordion (buka-tutup) untuk *Pembahasan Soal*. Ini mencegah halaman menjadi sangat panjang dan lambat di-render di perangkat seluler jika ada 100+ soal.

---

### 📋 Kesimpulan & Rekomendasi Prioritas Perbaikan

1. ~~**Segera hapus *early return 404*** pada baris 265 di `exam.controller.js` agar mekanisme *fallback* pencarian ID Ujian Latihan dapat bekerja.~~ *(Telah Diselesaikan)*
2. ~~Pertimbangkan untuk memindahkan logika penghitungan waktu dari Frontend (React) ke Backend (Node.js/Redis) untuk mencegah siswa memalsukan kecepatan mengerjakan ujian.~~ *(Telah Diselesaikan)*
3. Jika platform ini difokuskan untuk CPNS, merombak database untuk **mendukung bobot poin per opsi (1-5)** pada soal TKP adalah sesuatu yang sangat krusial agar simulasi dirasa otentik.
4. Pertimbangkan untuk memperketat sistem *Anti-Cheat* di Frontend/Backend (misalnya membatalkan ujian otomatis jika siswa keluar layar/tab lebih dari 3 kali).
