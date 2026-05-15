import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { HiOutlineCheckCircle } from "react-icons/hi";
import Badge from "../ui/Badge";

export default function TryoutPreview() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6 } }
  };

  return (
    <section id="tryout" className="px-6 py-32 bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Left Side: Mockup Interface (Animated) */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="order-2 lg:order-1"
          >
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="bg-white rounded-[2.5rem] p-4 shadow-xl shadow-primary/10 border border-white" 
            >
              <div className="bg-slate-50 rounded-[2rem] p-8">
                <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center gap-3">
                    <motion.div variants={itemVariants} className="w-3 h-3 rounded-full bg-red-400" />
                    <motion.div variants={itemVariants} className="w-3 h-3 rounded-full bg-amber-400" />
                    <motion.div variants={itemVariants} className="w-3 h-3 rounded-full bg-emerald-400" />
                  </div>
                  <motion.div 
                    variants={itemVariants}
                    className="px-4 py-1.5 bg-blue-100 rounded-full text-[10px] font-semibold text-[#011F7B] border border-slate-100 uppercase tracking-widest" 
                  >
                    Simulasi CPNS 2026
                  </motion.div>
                </div>
                
                <div className="space-y-6">
                  <motion.div variants={itemVariants} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#011F7B] flex items-center justify-center text-white font-bold text-sm shrink-0">10</div>
                    <div className="space-y-3 pt-2 w-full">
                      <div className="h-4 w-full bg-slate-200 rounded-full" />
                      <div className="h-4 w-5/6 bg-slate-200 rounded-full" />
                    </div>
                  </motion.div>
                  
                  <div className="pl-14 space-y-3">
                    {[1, 2, 3, 4].map(j => (
                      <motion.div 
                        key={j} 
                        variants={itemVariants}
                        className={`h-12 w-full rounded-xl border flex items-center px-4 gap-3 transition-all duration-300 ${j === 2 ? 'border-[#011F7B] bg-[#011F7B]/5' : 'border-slate-100 bg-white'}`}
                      >
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${j === 2 ? 'border-[#011F7B]' : 'border-slate-200'}`}>
                          {j === 2 && <div className="w-2 h-2 rounded-full bg-[#011F7B]" />}
                        </div>
                        <div className={`h-2 rounded-full ${j === 2 ? 'w-24 bg-[#011F7B]/20' : 'w-32 bg-slate-100'}`} />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Side: Content (Animated) */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="order-1 lg:order-2"
          >
            <motion.div variants={itemVariants}>
              <Badge variant="success" className="mb-4">Interface Modern</Badge>
            </motion.div>
            
            <motion.h2 
              variants={itemVariants}
              className="text-3xl md:text-5xl font-black text-slate-900 mb-8 leading-tight"
            >
              Pengalaman Ujian yang <br />
              <span className="text-amber">Mulus</span> & <span className="text-primary">Interaktif</span>
            </motion.h2>

            <div className="space-y-6">
              {[
                "Tampilan bersih tanpa distraksi iklan.",
                "Navigasi soal yang cepat dan responsif.",
                "Sistem penilaian otomatis yang akurat.",
                "Kompatibel di PC, Tablet, maupun Smartphone."
              ].map((text, i) => (
                <motion.div 
                  key={i} 
                  variants={itemVariants}
                  className="flex items-center gap-3"
                >
                  <div className="w-6 h-6 rounded-full bg-[#FFBA09]/20 flex items-center justify-center text-[#011F7B]">
                    <HiOutlineCheckCircle size={16} />
                  </div>
                  <p className="text-slate-700 font-bold text-sm">{text}</p>
                </motion.div>
              ))}
            </div>

            <motion.div variants={itemVariants} className="mt-12">
              <Link 
                to="/register"
                className="inline-flex items-center px-10 py-3 bg-primary text-white rounded-xl text-[15px] font-bold hover:bg-amber hover:text-primary hover:shadow-2xl hover:shadow-amber/30 transition-all duration-500 flex items-center justify-center group shadow-lg shadow-primary/30"
              >
                Mulai Simulasi Gratis
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

