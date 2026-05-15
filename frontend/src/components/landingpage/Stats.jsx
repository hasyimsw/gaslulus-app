import { motion } from "framer-motion";

export default function Stats() {
  const stats = [
    { label: "PENGGUNA AKTIF", value: "999+" },
    { label: "BANK SOAL", value: "999+" },
    { label: "DURASI FLEKSIBEL", value: "24/7" },
    { label: "AKSES BELAJAR", value: "GRATIS" },
  ];

  return (
    <section className="px-6 py-12 md:py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            visible: { transition: { staggerChildren: 0.1 } }
          }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12"
        >
          {stats.map((s, i) => (
            <motion.div 
              key={i}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
              }}
              className="text-center group"
            >
              <div className="flex flex-col items-center">
                <span className="text-2xl md:text-3xl font-bold text-primary tracking-tight leading-none mb-2">
                  {s.value}
                </span>
                <span className="text-[10px] md:text-[11px] font-semibold text-slate-400 uppercase tracking-[0.2em]">
                  {s.label}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}




