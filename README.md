# GasLulus 🚀

GasLulus adalah platform simulasi dan latihan ujian online (Tryout) interaktif untuk jenjang SD, SMP, SMA, dan CPNS. Aplikasi ini dilengkapi dengan dashboard analitik performa, fitur penanda soal (bookmarks), fitur anti-cheat, serta kemudahan bagi admin untuk melakukan impor soal secara massal menggunakan file Excel.

---

## 🌟 Fitur Utama

- **Pilihan Mode Ujian**: 
  - **Simulasi Lengkap**: Ujian dengan durasi dan passing score sesuai standar.
  - **Latihan Mapel**: Latihan soal terfokus per mata pelajaran untuk menguji pemahaman.
- **Dashboard Analitik**: Grafik statistik nilai rata-rata, persentase kelulusan, jumlah pengerjaan, dan riwayat aktivitas ujian terbaru.
- **Sistem Anti-Cheat**: Deteksi perpindahan tab/jendela browser saat ujian berlangsung untuk menjaga integritas hasil.
- **Bank Soal / Bookmark**: Simpan soal-soal sulit untuk dipelajari kembali kapan saja.
- **Bulk Import Soal**: Admin dapat mengunggah puluhan hingga ratusan soal secara instan menggunakan template Excel.
- **Keamanan Akun**: Autentikasi aman menggunakan JWT (Local Login) dan integrasi Google OAuth, dilengkapi fitur Lupa Password melalui verifikasi email SMTP Gmail.

---

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js (Express.js)
- **Database ORM**: Prisma Client
- **Database**: MySQL / MariaDB
- **Validation**: Zod
- **Libraries**: ExcelJS / XLSX (Parsing Excel), Nodemailer (SMTP Email), BcryptJS, JWT

### Frontend
- **Framework**: React.js (Vite)
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Icons & UI Elements**: React Icons, SweetAlert2, React Hot Toast

---

## 📋 Prasyarat Sistem

Sebelum menginstal, pastikan Anda telah memasang:
- **Node.js** (Versi 18 ke atas)
- **NPM** (Bawaan Node.js)
- **MySQL / MariaDB** (Misal menggunakan XAMPP, Laragon, atau MySQL installer lokal)

---

## 🚀 Panduan Instalasi Lokal

Ikuti langkah-langkah di bawah ini untuk menjalankan aplikasi GasLulus di komputer lokal Anda.

### Langkah 1: Clone Repository
Clone repository ini dari GitHub:
```bash
git clone https://github.com/hasyimsw/gaslulus-app.git
cd gaslulus-app
```

---

### Langkah 2: Konfigurasi Database
1. Pastikan server MySQL / MariaDB Anda sudah aktif.
2. Buka aplikasi manajemen database Anda (phpMyAdmin, DBeaver, TablePlus, dll.).
3. Buat database baru bernama **`gaslulus_db`**:
   ```sql
   CREATE DATABASE gaslulus_db;
   ```

---

### Langkah 3: Setup & Jalankan Backend

1. **Masuk ke direktori backend:**
   ```bash
   cd backend
   ```

2. **Instal Dependensi:**
   ```bash
   npm install
   ```

3. **Konfigurasi Environment Variable (`.env`):**
   Buat file `.env` di dalam folder `backend/` dan sesuaikan nilainya:
   ```env
   PORT=5000
   DATABASE_URL="mysql://username:password@localhost:3306/gaslulus_db"
   JWT_SECRET=supersecretkeygaslulus2026
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173

   # Konfigurasi SMTP (Untuk Fitur Lupa Password)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=465
   SMTP_USER=email-anda@gmail.com
   SMTP_PASS=app-password-gmail-anda
   SMTP_FROM="GasLulus Support" <email-anda@gmail.com>
   ```
   *Catatan: Untuk `SMTP_PASS`, gunakan **App Password** dari Google Akun Anda, bukan password email biasa.*

4. **Sinkronisasi Database dengan Prisma:**
   Pecahkan/buat tabel database dengan schema Prisma yang sudah ada:
   ```bash
   # Generate Prisma Client
   npm run prisma:generate

   # Push schema langsung ke database MySQL
   npm run prisma:push
   ```

5. **Jalankan Backend Server:**
   ```bash
   npm run dev
   ```
   Server backend akan berjalan di **`http://localhost:5000`**.

---

### Langkah 4: Setup & Jalankan Frontend

1. **Buka terminal baru, dan masuk ke direktori frontend:**
   ```bash
   cd ../frontend
   ```

2. **Instal Dependensi:**
   ```bash
   npm install
   ```

3. **Konfigurasi Environment Variable (`.env`):**
   Buat file `.env` di dalam folder `frontend/` dan isi Client ID Google OAuth Anda (opsional jika menggunakan Google Login):
   ```env
   VITE_GOOGLE_CLIENT_ID=client-id-google-oauth-anda.apps.googleusercontent.com
   ```

4. **Jalankan Frontend Dev Server:**
   ```bash
   npm run dev
   ```
   Aplikasi frontend akan berjalan di **`http://localhost:5173`**.

---

## 📊 Cara Mengimpor Soal (Bulk Import)

GasLulus mendukung impor soal otomatis menggunakan file Excel. Anda bisa menggunakan file template Excel yang disediakan di web atau membuatnya dengan generator template:

1. **Generate Template Excel Baru:**
   Di direktori `backend/`, jalankan script berikut untuk membuat file template Excel:
   ```bash
   node generate-template.js
   ```
   File template **`Template_Soal_GasLulus.xlsx`** akan dihasilkan secara otomatis di dalam folder `frontend/public/`.

2. **Gunakan Data Seed yang Tersedia:**
   Terdapat beberapa contoh paket latihan soal siap pakai (berisi 25 soal tingkat kesulitan MEDIUM per pelajaran) dalam format Excel di folder `backend/seed/`:
   - `Soal_Latihan_SD_English_25Medium.xlsx`
   - `Soal_Latihan_SD_IPA_25Medium.xlsx`
   - `Soal_Latihan_SD_IPS_25Medium.xlsx`
   - `Soal_Latihan_SD_Math_25Medium.xlsx`
   - `Soal_Latihan_SD_PPKn_25Medium.xlsx`

3. **Cara Impor ke Database:**
   - Masuk ke akun Admin di aplikasi GasLulus.
   - Buat paket Ujian (Exam) baru terlebih dahulu di menu dashboard Admin.
   - Pada halaman detail Ujian tersebut, klik tombol **"Impor Soal Excel"** dan unggah file Excel dari data seed di atas atau template yang telah diisi.

---

## 📂 Struktur Folder Proyek

```
gaslulus-app/
├── backend/
│   ├── prisma/             # Schema database Prisma
│   ├── seed/               # File Excel (.xlsx) untuk seed data latihan soal
│   ├── src/
│   │   ├── controllers/    # Logika endpoint API
│   │   ├── middlewares/    # Middleware autentikasi, error, multer, dll.
│   │   ├── routes/         # Definisi rute Express API
│   │   ├── validators/     # Skema validasi request (Zod)
│   │   └── index.js        # Entrypoint server backend
│   ├── .env                # Env file backend
│   └── generate-template.js# Script pembuat template Excel
├── frontend/
│   ├── public/             # File static frontend (termasuk template excel)
│   ├── src/
│   │   ├── components/     # Komponen UI reusable (cards, badges, buttons, dll.)
│   │   ├── lib/            # Client library (Axios interceptor)
│   │   ├── pages/          # Halaman aplikasi React (Dashboard, Exam, Hasil, Profil, dll.)
│   │   └── store/          # Global State Management (Zustand)
│   ├── .env                # Env file frontend
│   └── vite.config.js      # Konfigurasi bundler Vite & API Proxy
└── README.md               # Dokumentasi utama proyek
```
