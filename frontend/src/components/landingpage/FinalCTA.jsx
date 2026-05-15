import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Badge from "../ui/Badge";

export default function FinalCTA() {
  return (
    <section className="px-6 py-24 md:py-40">
      <div className="max-w-6xl mx-auto">
        <div className="bg-[#011F7B] rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden">
          {/* Subtle Decorative Elements */}
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_rgba(255,186,9,0.05),_transparent)] -z-10" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-white/[0.03] rounded-full blur-[100px]" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative z-10"
          >
            <div className="flex justify-center mb-8">
              <Badge className="bg-white/10 text-white border-white/20 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em]">
                Limited Access
              </Badge>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 leading-[1.1] tracking-tight">
              Masa Depanmu <br /><span className="text-white/60">Dimulai Hari Ini.</span>
            </h2>
            
            <p className="text-white/50 mb-12 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
              Bergabunglah dengan ribuan siswa yang telah berhasil meraih skor impian mereka bersama GasLulus.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link 
                to="/register"
                className="group relative inline-flex items-center px-12 py-4 bg-white text-[#011F7B] rounded-2xl text-lg font-bold shadow-[0_20px_40px_-10px_rgba(255,255,255,0.2)] hover:shadow-[0_20px_40px_-10px_rgba(255,255,255,0.4)] hover:-translate-y-1 transition-all duration-300"
              >
                Daftar Sekarang — Gratis
              </Link>
            </div>

            <div className="mt-12 flex items-center justify-center gap-8 opacity-40">
              {["Tanpa Biaya", "Akses Instan", "Bank Soal 2026"].map((text, i) => (
                <span key={i} className="text-[10px] font-semibold text-white uppercase tracking-[0.2em] hidden sm:block">
                  {text}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

