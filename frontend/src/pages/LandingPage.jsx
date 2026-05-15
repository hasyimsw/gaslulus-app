import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineArrowUp } from "react-icons/hi";
import Navbar from "../components/landingpage/Navbar";
import Hero from "../components/landingpage/Hero";
import Stats from "../components/landingpage/Stats";
import LearningLevels from "../components/landingpage/LearningLevels";
import TryoutPreview from "../components/landingpage/TryoutPreview";
import FAQ from "../components/landingpage/FAQ";
import FinalCTA from "../components/landingpage/FinalCTA";
import Footer from "../components/landingpage/Footer";

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };


  const scrollToSection = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      // Close menu first to stabilize layout
      if (isMenuOpen) setIsMenuOpen(false);

      // Small delay to let the menu closing animation start/finish
      setTimeout(() => {
        const offset = 80; 
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }, 50);
    }
  };

  return (
    <div className="bg-white min-h-screen text-slate-900 font-sans selection:bg-blue-600 selection:text-white overflow-x-hidden">
      <Navbar 
        scrolled={scrolled} 
        isMenuOpen={isMenuOpen} 
        setIsMenuOpen={setIsMenuOpen} 
        scrollToSection={scrollToSection} 
      />

      <main>
        <Hero scrollToSection={scrollToSection} />
        <Stats />
        <LearningLevels />
        <TryoutPreview />
        <FAQ />
        <FinalCTA />
      </main>

      <Footer />

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-[60] w-12 h-12 bg-white/90 backdrop-blur-md border border-slate-100 rounded-full flex items-center justify-center text-primary shadow-xl shadow-primary/5 hover:bg-primary hover:text-white hover:-translate-y-1 transition-all duration-300 group"
          >
            <HiOutlineArrowUp size={24} className="group-hover:scale-110 transition-transform" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
