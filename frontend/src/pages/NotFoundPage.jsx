import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { HiOutlineArrowLeft, HiOutlineHome, HiOutlineSearch } from "react-icons/hi";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-2xl w-full text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Big 404 Visual */}
          <div className="relative mb-12">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
              className="text-[150px] md:text-[220px] font-black text-primary/5 leading-none select-none tracking-tighter"
            >
              404
            </motion.div>
            
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{ 
                  y: [0, -20, 0],
                  rotate: [12, 15, 12]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-3xl shadow-2xl shadow-primary/20 flex items-center justify-center border border-slate-50"
              >
                <div className="w-16 h-16 md:w-20 md:h-20 bg-primary rounded-2xl flex items-center justify-center shadow-inner">
                  <HiOutlineSearch size={40} className="text-white" />
                </div>
              </motion.div>
            </div>
          </div>

          <div className="space-y-4 mb-12">
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              Oops! Halaman <span className="text-primary">Hilang Jejak</span>
            </h1>
            <p className="text-slate-500 font-medium text-base md:text-lg max-w-lg mx-auto leading-relaxed px-4">
              Sepertinya rute yang kamu tuju tidak ada dalam peta kami. Jangan khawatir, kamu bisa kembali ke jalur yang benar.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 px-4">
            <Link
              to="/"
              className="w-full sm:w-auto flex items-center justify-center gap-3 bg-primary text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#011a6b] transition-all shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 group"
            >
              <HiOutlineHome size={20} />
              Ke Beranda
            </Link>
            <button
              onClick={() => window.history.back()}
              className="w-full sm:w-auto flex items-center justify-center gap-3 bg-white text-slate-600 px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all border border-slate-200 hover:scale-105 active:scale-95 group cursor-pointer"
            >
              <HiOutlineArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              Kembali
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
