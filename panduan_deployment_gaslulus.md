# Panduan Deployment GasLulus 🚀 (MySQL Edition)

Dokumen ini berisi panduan langkah-demi-langkah untuk melakukan deployment platform **GasLulus** secara gratis menggunakan arsitektur terpisah (*Decoupled Architecture*) dengan database **MySQL**.

---

## 1. Persiapan Database (TiDB Cloud / Aiven)
Karena sistem menggunakan **MySQL**, TiDB Cloud adalah pilihan gratis terbaik dengan performa tinggi.

1.  Daftar di [TiDB Cloud](https://tidbcloud.com).
2.  Buat **Free Cluster** (Serverless).
3.  Pilih region terdekat (misal: **Singapore**).
4.  Dapatkan **Connection String**. Formatnya akan terlihat seperti ini:
    `mysql://[USERNAME]:[PASSWORD]@[HOST]:4000/[DATABASE_NAME]?sslaccept=strict`
5.  Simpan URL ini untuk konfigurasi Backend.

---

## 2. Deployment Backend (Render.com)
Render akan menghosting API Node.js/Express Anda.

1.  Daftar di [Render.com](https://render.com) dan hubungkan dengan akun GitHub Anda.
2.  Pilih **New > Web Service**.
3.  Hubungkan dengan repositori `gaslulus-app`.
4.  Atur **Root Directory**: `backend`.
5.  **Runtime**: `Node`.
6.  **Build Command**: `npm install && npx prisma generate`.
7.  **Start Command**: `node src/index.js`.
8.  **Environment Variables**: Tambahkan variabel berikut:
    *   `DATABASE_URL`: (URL dari TiDB Cloud tadi)
    *   `JWT_SECRET`: (Ketik string acak yang kuat)
    *   `FRONTEND_URL`: (Akan diisi setelah frontend di-deploy)
    *   `PORT`: `5000`

> [!TIP]
> Agar Render tidak "tidur", gunakan [cron-job.org](https://cron-job.org) untuk memanggil URL API Anda setiap 10-14 menit sekali secara gratis.

---

## 3. Deployment Frontend (Vercel)
Vercel akan menghosting aplikasi React/Vite Anda.

1.  Daftar di [Vercel.com](https://vercel.com).
2.  Pilih **Add New > Project**.
3.  Import repositori `gaslulus-app`.
4.  Atur **Root Directory**: `frontend`.
5.  **Build Command**: `npm run build`.
6.  **Output Directory**: `dist` (untuk Vite).
7.  **Environment Variables**:
    *   `VITE_API_URL`: (Isi dengan URL backend dari Render, contoh: `https://gaslulus-api.onrender.com/api`)

---

## 4. Penyesuaian Kode (Sangat Penting!)

### A. Konfigurasi CORS
Pastikan backend mengizinkan request dari domain frontend Anda. Di `backend/src/index.js`:
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL, // URL dari Vercel
  credentials: true
}));
```

### B. Prisma Migrations
Sebelum backend berjalan sempurna, Anda perlu memindahkan struktur database ke Cloud. Jalankan perintah ini dari terminal lokal Anda (pastikan `.env` di lokal sudah mengarah ke TiDB Cloud):
```bash
npx prisma db push
```

---

## 5. Estimasi Biaya
| Komponen | Provider | Biaya |
| :--- | :--- | :--- |
| **Frontend** | Vercel | Rp 0 (Gratis) |
| **Backend** | Render | Rp 0 (Gratis) |
| **Database** | TiDB Cloud | Rp 0 (Gratis) |
| **Domain** | Subdomain | Rp 0 (Gratis) |
| **TOTAL** | | **Rp 0 / Tahun** |

*Jika ingin menggunakan domain `.com`, Anda hanya perlu membayar sekitar **Rp 130rb - 150rb per tahun**.*

---

## 6. Urutan Deployment yang Benar
1.  Setup **Database** (TiDB Cloud).
2.  Push struktur database dengan `npx prisma db push`.
3.  Deploy **Backend** (Render).
4.  Deploy **Frontend** (Vercel).
5.  Update `FRONTEND_URL` di Render dengan URL dari Vercel.
6.  Update `VITE_API_URL` di Vercel dengan URL dari Render.

**Selesai!** Aplikasi Anda kini online dengan MySQL.
