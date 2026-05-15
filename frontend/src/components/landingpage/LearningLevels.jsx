import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  HiOutlineAcademicCap, 
  HiOutlineBookOpen, 
  HiOutlineArrowNarrowRight,
  HiOutlineStar,
  HiOutlineLibrary
} from "react-icons/hi";
import Card from "../ui/Card";
import Badge from "../ui/Badge";
import Button from "../ui/Button";

export default function LearningLevels() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <section id="levels" className="px-6 py-10 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 md:mb-24">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-primary mb-6 tracking-tight"
          >
            Pilih Jenjang Belajarmu
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 max-w-2xl mx-auto font-medium"
          >
            Kurikulum adaptif yang disesuaikan dengan standar kompetensi nasional terbaru.
          </motion.p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch"
        >
          {/* Left Column: SD */}
          <motion.div variants={itemVariants} className="h-full">
            <Card className="p-10 h-full flex flex-col bg-slate-50 border-transparent shadow-md shadow-primary/20 hover:bg-primary hover:shadow-xl transition-all duration-300 rounded-xl group overflow-hidden">
              <div className="w-16 h-16 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-10 group-hover:bg-white/20 group-hover:text-white transition-all duration-300 shadow-sm">
                <HiOutlineAcademicCap size={32} />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-primary mb-4 group-hover:text-white transition-colors">Sekolah Dasar</h3>
                <p className="text-slate-600 leading-relaxed font-medium mb-12 group-hover:text-white/80 transition-colors">
                  Fokus pada konsep dasar dan persiapan USBN dengan metode yang interaktif.
                </p>
              </div>
              <Link to="/tryout?category=SD" className="inline-flex items-center gap-2 text-primary font-bold text-sm group-hover:text-white transition-all">
                Eksplorasi Materi <HiOutlineArrowNarrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </Card>
          </motion.div>

          {/* Middle Column: SMP & SMA */}
          <div className="flex flex-col gap-6 lg:gap-8">
            <motion.div variants={itemVariants} className="flex-1">
              <Card className="p-8 h-full bg-slate-50 border-transparent shadow-md shadow-primary/20 hover:bg-primary hover:shadow-xl transition-all duration-300 rounded-xl group flex items-center gap-6 overflow-hidden">
                <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-white/20 group-hover:text-white transition-all duration-300 shadow-sm">
                  <HiOutlineBookOpen size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-primary mb-1 group-hover:text-white transition-colors">SMP / MTs</h3>
                  <p className="text-sm text-slate-600 font-medium group-hover:text-white/70 transition-colors">Strategi masuk SMA favorit.</p>
                </div>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants} className="flex-1">
              <Card className="p-8 h-full bg-slate-50 border-transparent shadow-md shadow-primary/20 hover:bg-primary hover:shadow-xl transition-all duration-300 rounded-xl group flex items-center gap-6 overflow-hidden">
                <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-white/20 group-hover:text-white transition-all duration-300 shadow-sm">
                  <HiOutlineLibrary size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-primary mb-1 group-hover:text-white transition-colors">SMA / SMK / MA</h3>
                  <p className="text-sm text-slate-600 font-medium group-hover:text-white/70 transition-colors">Targeting top universitas & UTBK.</p>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Right Column: CPNS */}
          <motion.div variants={itemVariants} className="h-full">
            <Card className="p-10 h-full flex flex-col bg-slate-50 border-transparent shadow-md shadow-primary/20 hover:bg-primary hover:shadow-xl transition-all duration-300 rounded-xl group relative overflow-hidden">
              <div className="mb-6">
                <Badge variant="success">MOST POPULAR</Badge>
              </div>

              <div className="flex-1">
                <h3 className="text-2xl font-bold text-primary mb-4 group-hover:text-white transition-colors">Seleksi CPNS</h3>
                <p className="text-slate-600 leading-relaxed font-medium mb-8 group-hover:text-white/80 transition-colors">
                  Simulasi CAT (Computer Assisted Test) dengan bank soal TWK, TIU & TKP terupdate.
                </p>
                
                <div className="flex flex-wrap gap-2 mb-10">
                  <span className="bg-primary/10 text-primary/50 px-3 py-1 rounded-full text-[10px] font-bold group-hover:bg-white/20 group-hover:text-white transition-all">TWK</span>
                  <span className="bg-primary/10 text-primary/50 px-3 py-1 rounded-full text-[10px] font-bold group-hover:bg-white/20 group-hover:text-white transition-all">TIU</span>
                  <span className="bg-primary/10 text-primary/50 px-3 py-1 rounded-full text-[10px] font-bold group-hover:bg-white/20 group-hover:text-white transition-all">TKP</span>
                </div>
              </div>

              <Button 
                as={Link} 
                to="/register" 
                className="w-full bg-primary text-white group-hover:bg-white group-hover:text-primary hover:bg-white hover:text-primary border border-transparent hover:border-primary font-bold transition-all duration-300 shadow-lg shadow-primary/10 group-hover:shadow-none"
              >
                Daftar Sekarang
              </Button>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}




