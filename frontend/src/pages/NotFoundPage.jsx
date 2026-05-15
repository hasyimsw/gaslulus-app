import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { HiOutlineArrowLeft, HiOutlineSearch } from "react-icons/hi";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8 relative"
        >
          <div className="text-[120px] font-black text-[#011F7B]/10 leading-none select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 bg-[#011F7B] rounded-3xl rotate-12 flex items-center justify-center shadow-xl shadow-[#011F7B]/30 animate-pulse">
              <HiOutlineSearch size={40} className="text-white -rotate-12" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-2xl font-extrabold text-slate-900 mb-3">
            Halaman Tidak Ditemukan
          </h1>
          <p className="text-slate-500 font-medium mb-8 leading-relaxed">
            Maaf, halaman yang kamu cari tidak tersedia atau telah dipindahkan ke alamat lain.
          </p>

          <Link
            to="/"
            className="btn btn-primary px-8 py-3.5 shadow-xl shadow-[#011F7B]/20 group"
          >
            <HiOutlineArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            Kembali ke Beranda
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-12"
        >
          <img
            src="/logo.webp"
            alt="GasLulus Logo"
            className="h-8 mx-auto opacity-30 grayscale"
          />
        </motion.div>
      </div>
    </div>
  );
}
