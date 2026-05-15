import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useGoogleLogin } from "@react-oauth/google";
import { useAuthStore } from "../stores/authStore";
import Swal from "sweetalert2";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Card from "../components/ui/Card";
import {
  HiOutlineUser,
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlineArrowRight,
  HiOutlineLightningBolt,
} from "react-icons/hi";
import Badge from "../components/ui/Badge";

export default function RegisterPage() {
  const { register, loginWithGoogle, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [showPass, setShowPass] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Real-time validation states
  const passwordCriteria = {
    length: form.password.length >= 8,
    uppercase: /[A-Z]/.test(form.password),
    number: /[0-9]/.test(form.password),
    symbol: /[^A-Za-z0-9]/.test(form.password),
  };

  const isPasswordSecure = Object.values(passwordCriteria).every(Boolean);
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      return Swal.fire({ title: "Gagal", text: "Konfirmasi kata sandi tidak cocok!", icon: "error" });
    }
    const result = await register(form.name, form.email, form.password, form.confirmPassword);
    if (result.success) {
      Swal.fire({ title: "Berhasil!", text: "Silakan masuk.", icon: "success", timer: 2000 }).then(() => navigate("/login"));
    } else {
      Swal.fire({ title: "Gagal Mendaftar", text: result.message, icon: "error" });
    }
  };

  const handleGoogleSuccess = async (tokenResponse) => {
    setGoogleLoading(true);
    try {
      const result = await loginWithGoogle(tokenResponse.access_token);
      if (result.success) {
        Swal.fire({ title: "Berhasil!", text: "Akun Google berhasil terhubung.", icon: "success", timer: 1500, showConfirmButton: false }).then(() => navigate("/dashboard"));
      } else {
        Swal.fire({ title: "Gagal", text: result.message, icon: "error" });
      }
    } catch {
      Swal.fire({ title: "Gagal", text: "Daftar dengan Google gagal. Silakan coba lagi.", icon: "error" });
    } finally {
      setGoogleLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: () => {
      Swal.fire({ title: "Gagal", text: "Pendaftaran dengan Google dibatalkan.", icon: "error" });
    },
  });

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-[#011F7B] to-[#010f3d] items-center justify-center p-16 text-center h-screen sticky top-0">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          <h2 className="text-4xl font-extrabold text-white mb-6 leading-tight">Bergabung Bersama Pejuang Lulus!</h2>
          <p className="text-lg text-white/60 font-medium opacity-80">Dapatkan akses gratis ke ratusan soal latihan terpercaya.</p>
        </motion.div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="min-h-full flex items-center justify-center p-8 py-12">
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="w-full max-w-[400px]">
          <Card className="p-10">
          <div className="mb-10 text-center">
            <Link to="/" className="flex flex-col items-center mb-4">
              <img src="/logo.webp" alt="Logo" className="h-16 mb-4 object-contain" />
              <Badge variant="primary">
                <HiOutlineLightningBolt className="mr-1" /> Gas Belajar, Gas Lulus!
              </Badge>
            </Link>
            <h1 className="text-3xl font-bold text-slate-900 mb-1">Daftar Akun</h1>
            <p className="text-slate-500 text-sm">Mulai perjalanan belajarmu hari ini.</p>
          </div>

          {/* Google Register Button */}
          <button
            type="button"
            onClick={() => googleLogin()}
            disabled={googleLoading || isLoading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border-2 border-slate-200 bg-white text-slate-700 font-semibold text-sm hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {googleLoading ? (
              <div className="w-5 h-5 border-2 border-slate-300 border-t-[#011F7B] rounded-full animate-spin"></div>
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            )}
            {googleLoading ? "Memproses..." : "Daftar dengan Google"}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-slate-200"></div>
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">atau</span>
            <div className="flex-1 h-px bg-slate-200"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input label="Nama Lengkap" name="name" icon={<HiOutlineUser />} value={form.name} onChange={handleChange} placeholder="Nama lengkap Anda" required />
            
            <Input 
              label="Email" 
              name="email" 
              type="email" 
              icon={<HiOutlineMail />} 
              value={form.email} 
              onChange={handleChange} 
              placeholder="name@example.com" 
              isValid={form.email ? isValidEmail : null}
              error={form.email && !isValidEmail ? "Format email tidak valid" : null}
              required 
            />

            <div className="space-y-2">
              <div className="relative">
                <Input 
                  label="Kata Sandi" 
                  name="password" 
                  type={showPass ? "text" : "password"} 
                  icon={<HiOutlineLockClosed />} 
                  value={form.password} 
                  onChange={handleChange} 
                  placeholder="Minimal 8 karakter" 
                  isValid={form.password ? isPasswordSecure : null}
                  required 
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-[38px] text-slate-400 hover:text-slate-600 transition-colors">
                  {showPass ? <HiOutlineEyeOff size={20} /> : <HiOutlineEye size={20} />}
                </button>
              </div>

              {form.password && (
                <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1">
                  <RequirementItem label="8 Karakter" met={passwordCriteria.length} />
                  <RequirementItem label="Huruf Besar" met={passwordCriteria.uppercase} />
                  <RequirementItem label="Angka" met={passwordCriteria.number} />
                  <RequirementItem label="Simbol" met={passwordCriteria.symbol} />
                </div>
              )}
            </div>

            <Input label="Konfirmasi Kata Sandi" name="confirmPassword" type={showPass ? "text" : "password"} icon={<HiOutlineLockClosed />} value={form.confirmPassword} onChange={handleChange} placeholder="Ulangi kata sandi" required />

            <Button type="submit" isLoading={isLoading} className="w-full mt-4" icon={HiOutlineArrowRight}>
              Daftar Sekarang
            </Button>
          </form>

          <p className="text-center mt-10 text-slate-500 text-sm">
            Sudah punya akun? <Link to="/login" className="text-[#011F7B] font-semibold hover:underline">Masuk</Link>
          </p>
          </Card>
        </motion.div>
      </div>
    </div>
    </div>
  );
}

function RequirementItem({ label, met }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className={`w-1.5 h-1.5 rounded-full transition-colors ${met ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" : "bg-slate-300"}`} />
      <span className={`text-[10px] font-semibold ${met ? "text-green-600" : "text-slate-400"}`}>{label}</span>
    </div>
  );
}
