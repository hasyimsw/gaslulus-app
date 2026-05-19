import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineArrowRight, HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import Button from "../ui/Button";

export default function Navbar({ scrolled, isMenuOpen, setIsMenuOpen, scrollToSection }) {
  const menuItems = [
    { id: 'levels', label: 'Jenjang' },
    { id: 'tryout', label: 'Tryout' },
    { id: 'faq', label: 'FAQ' }
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-white/80 backdrop-blur-xl py-3 border-b border-slate-100 shadow-sm" 
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="flex items-center gap-2 group">
          <img src="/logo.webp" alt="Logo" className="h-10" />
        </a>
        
        <div className="flex items-center gap-10">
          <div className="hidden md:flex items-center gap-8"> 
          {menuItems.map((item) => (
            <a 
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => scrollToSection(e, item.id)}
              className="text-sm font-semibold text-slate-600 hover:text-[#011F7B] transition-colors"
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link 
            to="/register" 
            className="px-8 py-3 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-amber hover:text-primary hover:shadow-2xl hover:shadow-amber/30 transition-all duration-500 flex items-center justify-center group shadow-lg shadow-primary/30"
          >
            Daftar Gratis
          </Link>
        </div>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-slate-900 p-2.5 bg-primary/10 hover:bg-slate-100 rounded-xl cursor-pointer transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle Menu"  
        >
          {isMenuOpen ? <HiOutlineX size={24} /> : <HiOutlineMenu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-xl border-b border-slate-100 overflow-hidden shadow-xl z-[100]"
          >
            <div className="px-6 pt-4 pb-10 flex flex-col gap-8">
              {menuItems.map((item) => (
                <a 
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => scrollToSection(e, item.id)}
                  className="text-lg font-semibold text-slate-600 hover:text-[#011F7B] transition-colors"
                >
                  {item.label}
                </a>
              ))}
              <Button variant="primary" className="w-full">
                <Link to="/register">Daftar Sekarang — Gratis</Link>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

