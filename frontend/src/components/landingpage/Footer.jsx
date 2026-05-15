import { Link } from "react-router-dom";
import { FaInstagram, FaTwitter, FaLinkedinIn } from "react-icons/fa";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="px-6 pt-20 pb-8 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-8 pb-20 border-b border-slate-50">
          {/* Brand Section */}
          <div className="md:col-span-5">
            <Link to="/" className="flex items-center gap-2 mb-8">
              <img src="/logo.webp" alt="GasLulus" className="h-8" />
            </Link>
            <p className="text-slate-500 font-medium leading-relaxed max-w-sm mb-10">
              Platform persiapan ujian dengan sistem simulasi termodern di Indonesia. Kami membantu Anda lulus dengan hasil terbaik.
            </p>
            <div className="flex gap-6">
              {[
                { icon: <FaInstagram size={20} />, label: "Instagram" },
                { icon: <FaTwitter size={20} />, label: "Twitter" },
                { icon: <FaLinkedinIn size={20} />, label: "LinkedIn" }
              ].map((social, i) => (
                <a 
                  key={i} 
                  href="#" 
                  className="text-slate-400 hover:text-primary transition-colors duration-300"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links Section */}
          <div className="md:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-[10px] font-semibold text-slate-900 uppercase tracking-[0.2em] mb-8">Platform</h4>
              <ul className="space-y-4">
                <li><a href="#levels" className="text-sm font-bold text-slate-500 hover:text-primary transition-colors">Jenjang Belajar</a></li>
                <li><a href="#tryout" className="text-sm font-bold text-slate-500 hover:text-primary transition-colors">Simulasi Tryout</a></li>
                <li><a href="#faq" className="text-sm font-bold text-slate-500 hover:text-primary transition-colors">Bantuan</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] font-semibold text-slate-900 uppercase tracking-[0.2em] mb-8">Perusahaan</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-sm font-bold text-slate-500 hover:text-primary transition-colors">Tentang Kami</a></li>
                <li><a href="#" className="text-sm font-bold text-slate-500 hover:text-primary transition-colors">Karir</a></li>
                <li><a href="#" className="text-sm font-bold text-slate-500 hover:text-primary transition-colors">Kontak</a></li>
              </ul>
            </div>
            <div className="col-span-2 md:col-span-1">
              <h4 className="text-[10px] font-semibold text-slate-900 uppercase tracking-[0.2em] mb-8">Legal</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-sm font-bold text-slate-500 hover:text-primary transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-sm font-bold text-slate-500 hover:text-primary transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
            © {currentYear} GasLulus. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

