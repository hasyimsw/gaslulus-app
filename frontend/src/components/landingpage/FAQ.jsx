import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiChevronDown } from "react-icons/hi";
import Badge from "../ui/Badge";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: "Apa itu GasLulus?",
      answer: "GasLulus adalah platform simulasi ujian interaktif yang dirancang khusus untuk membantu siswa SD, SMP, SMA, hingga calon CPNS mempersiapkan ujian dengan metode belajar yang modern dan terukur."
    },
    {
      question: "Apakah tersedia akses gratis?",
      answer: "Ya! Kami menyediakan paket akses gratis untuk setiap jenjang sehingga Anda bisa mencoba kualitas materi dan antarmuka simulasi kami sebelum memutuskan untuk berlangganan fitur premium."
    },
    {
      question: "Perangkat apa saja yang didukung?",
      answer: "GasLulus berbasis web (SaaS), sehingga dapat diakses melalui browser di berbagai perangkat seperti Laptop (Windows/Mac), Tablet, maupun Smartphone (Android/iOS) tanpa perlu instalasi aplikasi."
    },
    {
      question: "Bagaimana dengan kualitas soalnya?",
      answer: "Seluruh bank soal di GasLulus disusun oleh tim ahli dan diperbarui secara berkala mengikuti standar kurikulum nasional terbaru serta pola soal ujian tahun-tahun sebelumnya."
    },
    {
      question: "Apakah ada sistem penilaian otomatis?",
      answer: "Ya, sistem kami menggunakan teknologi penilaian otomatis yang akurat. Setelah simulasi selesai, Anda akan langsung mendapatkan skor beserta analisis detail performa per mata pelajaran."
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
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <section id="faq" className="px-6 py-24 md:py-32 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row gap-12 md:gap-24">
          {/* Left Side: Header (Animated) */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="md:w-1/3"
          >
            <Badge variant="primary" className="mb-6 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] bg-primary/10 text-primary border-none">
              Support
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 tracking-tight leading-[1.1]">
              Frequently Asked <span className="text-primary">Questions.</span>
            </h2>
            <p className="text-slate-500 font-medium leading-relaxed">
              Semua yang perlu Anda ketahui tentang GasLulus dalam satu tempat.
            </p>
          </motion.div>

          {/* Right Side: Accordion (Animated) */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="md:w-2/3 space-y-2"
          >
            {faqs.map((faq, i) => (
              <motion.div 
                key={i} 
                variants={itemVariants}
                className={`transition-all duration-500 rounded-2xl ${openIndex === i ? 'bg-slate-50/80' : 'bg-transparent'}`}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
                  className="w-full p-6 flex items-center justify-between gap-6 text-left group"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-1 h-6 rounded-full transition-all duration-500 ${openIndex === i ? 'bg-primary' : 'bg-slate-200 group-hover:bg-slate-300'}`} />
                    <span className={`text-base font-medium tracking-tight transition-colors ${openIndex === i ? 'text-primary' : 'text-slate-900'}`}>
                      {faq.question}
                    </span>
                  </div>
                  <HiChevronDown 
                    className={`text-slate-400 transition-transform duration-500 ${openIndex === i ? 'rotate-180 text-primary' : 'group-hover:text-slate-600'}`} 
                    size={20} 
                  />
                </button>
                
                <AnimatePresence>
                  {openIndex === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                      className="overflow-hidden"
                    >
                      <div className="px-11 pb-8 text-sm text-slate-500 font-medium leading-relaxed max-w-xl">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

