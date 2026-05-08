import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineLightningBolt, HiOutlineCheckCircle, HiOutlineArrowRight, HiOutlineGlobeAlt, HiOutlineAcademicCap, HiOutlineUserGroup, HiArrowNarrowRight } from 'react-icons/hi';

const features = [
  { icon: HiOutlineLightningBolt, title: 'Simulasi CAT Realistis', desc: 'Sistem ujian yang dirancang mirip dengan aplikasi CAT BKN asli.' },
  { icon: HiOutlineAcademicCap, title: 'Soal Terstandar', desc: 'Bank soal yang disusun oleh tim ahli sesuai kisi-kisi terbaru.' },
  { icon: HiOutlineUserGroup, title: 'Komunitas Belajar', desc: 'Bergabung dengan ribuan pejuang pendidikan lainnya di seluruh Indonesia.' },
];

export default function LandingPage() {
  return (
    <div className="bg-white min-h-screen text-slate-900 overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-white/80 backdrop-blur-2xl border-b border-slate-100 px-[5%] py-4 flex items-center justify-between">
        <Link to="/" className="flex flex-col items-start gap-1 no-underline group">
          <img src="/logo.webp" alt="Logo" className="w-10 h-10 rounded-xl shadow-sm transition-transform group-hover:scale-105" />
          <div className="text-[10px] text-blue-600 font-extrabold tracking-wider bg-blue-50 px-2 py-0.5 rounded-md">
            Platform Tryout #1
          </div>
        </Link>
        <div className="flex gap-8 items-center">
          <Link to="/login" className="text-slate-500 hover:text-blue-600 no-underline font-bold text-sm transition-colors">
            Masuk
          </Link>
          <Link to="/register" className="btn btn-primary px-6 py-2.5 rounded-xl text-sm shadow-lg shadow-blue-100 transition-all hover:-translate-y-0.5">
            Daftar Gratis
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-48 pb-32 text-center px-6 overflow-hidden">
        {/* Background Decor */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-50 rounded-full blur-[100px] -mr-64 -mt-32 opacity-60 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-50 rounded-full blur-[100px] -ml-48 -mb-32 opacity-60 pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-5xl mx-auto relative z-10"
        >
          <div className="inline-flex items-center gap-2.5 bg-blue-50 text-blue-600 px-5 py-2 rounded-full text-xs font-extrabold tracking-[0.1em] border border-blue-100 mb-8 uppercase">
            <HiOutlineLightningBolt size={16} /> Akselerasi Belajar Kamu Sekarang
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 leading-[1.05] mb-8 tracking-tight">
            Latihan Lebih Cerdas, <br />
            <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent italic">
              Lulus Lebih Pasti.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-500 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
            Platform simulasi ujian gratis dengan bank soal terlengkap untuk jenjang SD, SMP, SMA, hingga CPNS. Pantau progres kamu dengan analisis data yang akurat.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/register" className="btn btn-primary px-10 py-4.5 text-lg rounded-2xl shadow-2xl shadow-blue-200/60 w-full sm:w-auto">
              Mulai Belajar Sekarang <HiOutlineArrowRight className="ml-2" />
            </Link>
            <Link to="/login" className="btn btn-outline bg-white px-10 py-4.5 text-lg rounded-2xl w-full sm:w-auto border-2 border-slate-200 hover:border-blue-200">
              Coba Simulasi Gratis
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="bg-slate-50/50 py-16 border-y border-slate-100 px-6">
        <div className="max-w-6xl mx-auto flex flex-wrap justify-between gap-10 md:gap-4">
          {[
            { v: '50K+', l: 'Pelajar Aktif' },
            { v: '10K+', l: 'Bank Soal' },
            { v: '95%', l: 'Kepuasan User' },
            { v: '100%', l: 'Gratis Selamanya' }
          ].map((s, i) => (
            <div key={i} className="flex-1 min-w-[150px] text-center">
              <div className="text-4xl font-black text-slate-900 mb-1">{s.v}</div>
              <div className="text-[11px] text-slate-400 font-extrabold uppercase tracking-widest leading-none mt-1">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">Segalanya yang Kamu Butuhkan</h2>
            <p className="text-slate-500 text-lg font-medium">Fitur unggulan untuk memastikan persiapan kamu mencapai performa maksimal.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feat, i) => (
              <motion.div 
                key={i} 
                whileHover={{ y: -10 }}
                className="card p-10 border-none shadow-2xl shadow-slate-100/50 flex flex-col items-start text-left group transition-all"
              >
                <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  <feat.icon size={32} />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-4">{feat.title}</h3>
                <p className="text-slate-500 leading-relaxed font-medium">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 bg-slate-900 relative overflow-hidden text-center">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_30%_50%,#2563eb_0%,transparent_50%)]" />
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">Sudah Siap Melangkah Lebih Jauh?</h2>
          <p className="text-slate-400 text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
            Ribuan pejuang lainnya sudah mulai. Jangan biarkan impianmu tertunda hanya karena kurang persiapan.
          </p>
          <Link to="/register" className="btn btn-primary px-12 py-5 text-xl rounded-2xl shadow-2xl shadow-blue-600/20 border-none transition-transform hover:scale-105 active:scale-95">
            Daftar Sekarang — 100% Gratis
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          <div className="lg:col-span-2">
            <Link to="/" className="flex flex-col items-start gap-1 no-underline mb-6 group">
              <img src="/logo.webp" alt="Logo" className="w-12 h-12 rounded-xl" />
              <div className="text-[11px] text-blue-600 font-extrabold tracking-wider bg-blue-50 px-2 py-0.5 rounded-md uppercase">
                Platform Tryout #1
              </div>
            </Link>
            <p className="text-slate-500 leading-relaxed max-w-sm font-medium">
              Gas Belajar, Gas Lulus! Solusi belajar mandiri gratis untuk masa depan pelajar Indonesia yang lebih cerah.
            </p>
          </div>
          <div>
            <h4 className="text-slate-900 font-black mb-6 uppercase text-sm tracking-widest">Kategori</h4>
            <ul className="space-y-4 text-slate-500 font-bold text-sm list-none p-0 m-0">
              <li className="hover:text-blue-600 cursor-pointer transition-colors">Tryout CPNS</li>
              <li className="hover:text-blue-600 cursor-pointer transition-colors">Tryout SMA</li>
              <li className="hover:text-blue-600 cursor-pointer transition-colors">Tryout SMP</li>
              <li className="hover:text-blue-600 cursor-pointer transition-colors">Tryout SD</li>
            </ul>
          </div>
          <div>
            <h4 className="text-slate-900 font-black mb-6 uppercase text-sm tracking-widest">Halaman</h4>
            <ul className="space-y-4 text-slate-500 font-bold text-sm list-none p-0 m-0">
              <li className="hover:text-blue-600 cursor-pointer transition-colors">Tentang Kami</li>
              <li className="hover:text-blue-600 cursor-pointer transition-colors">Syarat & Ketentuan</li>
              <li className="hover:text-blue-600 cursor-pointer transition-colors">Kebijakan Privasi</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-10 border-t border-slate-50 text-center">
          <p className="text-slate-400 text-sm font-bold tracking-tight">
            © 2026 GasLulus — Dibuat dengan <span className="text-red-500">❤️</span> untuk Pendidikan Indonesia.
          </p>
        </div>
      </footer>
    </div>
  );
}
