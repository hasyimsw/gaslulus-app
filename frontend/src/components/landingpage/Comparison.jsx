import { motion } from "framer-motion";
import { HiCheck, HiX } from "react-icons/hi";
import Badge from "../ui/Badge";
import { Link } from "react-router-dom";

export default function Comparison() {
  const comparisons = [
    {
      feature: "Update Bank Soal",
      conventional: "Update Berkala / Cetak",
      gaslulus: "Real-time & Adaptif"
    },
    {
      feature: "Akses Belajar",
      conventional: "Terikat Jadwal & Tempat",
      gaslulus: "24/7 (PC, Tablet, HP)"
    },
    {
      feature: "Analisis Progres",
      conventional: "Koreksi Manual",
      gaslulus: "AI-Powered Analytics"
    },
    {
      feature: "Metode Simulasi",
      conventional: "Kertas / PDF Statis",
      gaslulus: "Interaktif (Mirip CAT)"
    },
    {
      feature: "Efisiensi Biaya",
      conventional: "Relatif Mahal",
      gaslulus: "Gratis & Terjangkau"
    }
  ];

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
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <section id="comparison" className="px-6 py-24 md:py-32 bg-slate-50/50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-20">
          <Badge variant="primary" className="mb-6 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] bg-primary/10 text-primary border-none">
            Why GasLulus
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 tracking-tight">
            Metode Belajar <span className="text-primary">Masa Depan</span>
          </h2>
          <p className="text-slate-500 font-medium max-w-lg mx-auto leading-relaxed">
            Efisiensi adalah kunci. Lihat bagaimana kami mentransformasi cara Anda mempersiapkan masa depan.
          </p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="bg-white rounded-[2.5rem] p-4 shadow-2xl shadow-slate-200/50 border border-white"
        >
          <div className="bg-slate-50/50 rounded-[2rem] overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-1 md:grid-cols-5 border-b border-slate-100 bg-white/50 backdrop-blur-sm">
              <div className="md:col-span-2 p-6 md:p-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Parameter
              </div>
              <div className="hidden md:block p-8 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                Konvensional
              </div>
              <div className="md:col-span-2 p-6 md:p-8 text-[10px] font-black text-primary uppercase tracking-widest text-center bg-primary/[0.03]">
                GasLulus Experience
              </div>
            </div>

            {/* Rows */}
            <div className="divide-y divide-slate-100">
              {comparisons.map((item, i) => (
                <motion.div 
                  key={i} 
                  variants={itemVariants}
                  className="grid grid-cols-1 md:grid-cols-5 group hover:bg-white transition-colors duration-300"
                >
                  {/* Feature Name */}
                  <div className="md:col-span-2 p-6 md:p-8">
                    <span className="text-sm font-bold text-slate-900 block">{item.feature}</span>
                  </div>

                  {/* Conventional */}
                  <div className="p-6 md:p-8 flex items-center md:justify-center gap-3 border-t md:border-t-0 border-slate-100/50">
                    <div className="w-5 h-5 rounded-full border border-slate-200 flex items-center justify-center shrink-0">
                      <HiX className="text-slate-300" size={12} />
                    </div>
                    <span className="text-xs font-medium text-slate-400">{item.conventional}</span>
                  </div>

                  {/* GasLulus */}
                  <div className="md:col-span-2 p-6 md:p-8 flex items-center md:justify-center gap-4 bg-primary/[0.02] group-hover:bg-primary/[0.04] transition-colors border-t md:border-t-0 border-slate-100/50">
                    <div className="w-6 h-6 rounded-lg bg-primary text-white flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
                      <HiCheck size={14} />
                    </div>
                    <span className="text-sm font-bold text-primary tracking-tight">{item.gaslulus}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Small Footer Note */}
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="text-center mt-12 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]"
        >
          Siap Bertransformasi? <Link to="/register" className="text-primary hover:underline ml-2">Daftar Sekarang</Link>
        </motion.p>
      </div>
    </section>
  );
}

