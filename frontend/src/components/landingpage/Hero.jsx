import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  HiOutlineArrowRight, 
  HiOutlineLightningBolt, 
  HiOutlineAcademicCap, 
  HiOutlineChartBar, 
  HiOutlineCheckCircle,
  HiOutlineTrendingUp
} from "react-icons/hi";
import Badge from "../ui/Badge";

export default function Hero({ scrollToSection }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.3 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <section className="relative pt-40 pb-24 lg:pt-48 lg:pb-32 px-6 overflow-hidden bg-slate-50/30">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#011F7B]/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] bg-[#FFBA09]/5 blur-[100px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <motion.div initial="hidden" animate="visible" variants={containerVariants} className="text-left relative z-10">
          <Badge variant="primary" className="mb-4">
            <HiOutlineLightningBolt className="mr-1" /> Platform Belajar Tergokil!
          </Badge>
          
          <motion.h1 
            variants={itemVariants} 
            className="text-6xl font-bold tracking-tight text-slate-900 mb-4"
          >
            Gas Belajar,<br />
            <span className="text-amber font-bold">Gas <span className="text-primary font-bold">Lulus!</span></span>
          </motion.h1>
          
          <motion.p 
            variants={itemVariants} 
            className="text-lg text-slate-500 mb-12 max-w-lg font-medium"
          >
            Persiapkan dirimu menghadapi ujian sekolah dan seleksi kerja dengan ribuan soal terupdate, analisis mendalam, dan simulasi mirip aslinya.
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-5">
            <Link 
              to="/register" 
              className="px-10 py-3 bg-primary text-white rounded-xl text-[15px] font-bold hover:bg-amber hover:text-primary hover:shadow-2xl hover:shadow-amber/30 transition-all duration-500 flex items-center justify-center group shadow-lg shadow-primary/30"
            >
              Mulai Belajar
              <HiOutlineArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a 
              href="#tryout" 
              onClick={(e) => scrollToSection(e, 'tryout')} 
              className="px-10 py-3 bg-primary/10 border border-primary/20 text-primary rounded-xl text-[15px] font-bold hover:bg-primary hover:border-primary/20 hover:text-white transition-all duration-300 flex items-center justify-center shadow-lg shadow-primary/10"
            >
              Coba Gratis
            </a>
          </motion.div>
        </motion.div>


        <motion.div 
          initial={{ opacity: 0, x: 50 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ duration: 1, ease: "easeOut" }} 
          className="relative hidden lg:block"
        >
          {/* Main Mockup Card */}
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="relative z-10 bg-white rounded-[2.5rem] p-6 shadow-xl shadow-primary/10 border border-slate-100"
          >
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 overflow-hidden relative">
              {/* Decorative scan line effect */}
              <motion.div 
                animate={{ top: ['-10%', '110%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 right-0 h-20 bg-gradient-to-b from-transparent via-[#011F7B]/5 to-transparent pointer-events-none z-20"
              />

              <div className="flex items-center justify-between mb-8">
                <div className="h-4 w-32 bg-slate-200 rounded-full" />
                <div className="flex gap-2">
                  <div className="h-2 w-2 rounded-full bg-red-400" />
                  <div className="h-2 w-2 rounded-full bg-amber-400" />
                  <div className="h-2 w-2 rounded-full bg-emerald-400" />
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { icon: <HiOutlineAcademicCap />, color: "blue", label: "Simulasi CPNS 2026", sub: "120 Menit • 110 Soal" },
                  { icon: <HiOutlineChartBar />, color: "emerald", label: "Analisis Skor IRT", sub: "Akurasi 98% • Real-time" },
                ].map((item, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + (idx * 0.2) }}
                    className="h-24 w-full bg-white rounded-xl border border-slate-100 p-4 flex items-center gap-4 hover:border-[#011F7B]/20 transition-colors cursor-pointer group"
                  >
                    <div className={`w-12 h-12 rounded-lg bg-${item.color}-500/10 flex items-center justify-center text-${item.color}-600 group-hover:scale-110 transition-transform`}>
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-sm text-slate-800 mb-0.5">{item.label}</div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{item.sub}</div>
                    </div>
                  </motion.div>
                ))}
                
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="h-12 w-full bg-[#011F7B] rounded-xl flex items-center justify-center text-white font-semibold text-sm shadow-lg shadow-[#011F7B]/20 cursor-pointer mt-4"
                >
                  Lihat Hasil Simulasi
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Floating Elements */}
          <motion.div 
            animate={{ y: [0, 15, 0], x: [0, -5, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-6 -right-6 z-20 bg-[#011F7B] text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-white/20"
          >
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <HiOutlineCheckCircle size={18} />
            </div>
            <div>
              <div className="text-[10px] font-semibold opacity-80 uppercase leading-none mb-0.5">Status Lulus</div>
              <div className="text-xs font-semibold tracking-tight">Skor Di Atas Passing Grade</div>
            </div>
          </motion.div>

          <motion.div 
            animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute -bottom-12 -left-8 z-20 bg-white/90 backdrop-blur-md px-8 py-4 rounded-xl shadow-xl shadow-primary/10 border border-white flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-[#011F7B] flex items-center justify-center text-white shadow-lg shadow-[#011F7B]/20">
              <HiOutlineTrendingUp size={28} /> 
            </div>
            <div className="flex flex-col">
              <div className="text-xl font-bold text-[#011F7B] leading-none mb-1">98%</div>
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Tingkat Keberhasilan</div>
            </div>
          </motion.div>

          {/* Decorative Background Glows */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#011F7B]/10 rounded-full blur-3xl -z-10" />
          <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-[#FFBA09]/10 rounded-full blur-3xl -z-10" />
        </motion.div>

      </div>
    </section>
  );
}
