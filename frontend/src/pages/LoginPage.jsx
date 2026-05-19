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
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlineArrowRight,
  HiOutlineLightningBolt,
} from "react-icons/hi";
import Badge from "../components/ui/Badge";

export default function LoginPage() {
  const { login, loginWithGoogle, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState(localStorage.getItem("gaslulus_remembered_email") || "");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [rememberMe, setRememberMe] = useState(localStorage.getItem("gaslulus_remember_me") === "true");
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    localStorage.setItem("gaslulus_remember_me", rememberMe ? "true" : "false");
    if (rememberMe) {
      localStorage.setItem("gaslulus_remembered_email", email);
    } else {
      localStorage.removeItem("gaslulus_remembered_email");
    }

    const result = await login(email, password);
    if (result.success) {
      Swal.fire({ title: "Berhasil!", text: "Selamat datang kembali.", icon: "success", timer: 1500, showConfirmButton: false }).then(() => navigate("/dashboard"));
    } else {
      Swal.fire({ title: "Gagal", text: result.message, icon: "error" });
    }
  };

  const handleGoogleSuccess = async (tokenResponse) => {
    setGoogleLoading(true);
    try {
      localStorage.setItem("gaslulus_remember_me", rememberMe ? "true" : "false");
      const result = await loginWithGoogle(tokenResponse.access_token);
      if (result.success) {
        Swal.fire({ title: "Berhasil!", text: "Login dengan Google berhasil.", icon: "success", timer: 1500, showConfirmButton: false }).then(() => navigate("/dashboard"));
      } else {
        Swal.fire({ title: "Gagal", text: result.message, icon: "error" });
      }
    } catch {
      Swal.fire({ title: "Gagal", text: "Login dengan Google gagal. Silakan coba lagi.", icon: "error" });
    } finally {
      setGoogleLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    ux_mode: 'redirect',
    onError: () => {
      Swal.fire({ title: "Gagal", text: "Login dengan Google gagal.", icon: "error" });
    },
  });

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        <div className="min-h-full flex items-center justify-center p-8 py-12">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="w-full max-w-[400px]">
          <Card className="p-10">
            <div className="mb-10 text-center">
              <Link to="/" className="flex flex-col items-center mb-4">
                <img src="/logo.webp" alt="Logo" className="h-16 mb-4 object-contain" />
                <Badge variant="primary">
                  <HiOutlineLightningBolt className="mr-1" /> Gas Belajar, Gas Lulus!
                </Badge>
              </Link>
              <h1 className="text-3xl font-bold text-slate-900 mb-1">Selamat Datang</h1>
              <p className="text-slate-500 text-sm">Masuk untuk melanjutkan proses belajar.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <Input label="Email" type="email" icon={<HiOutlineMail />} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" required />
              
              <div className="relative">
                <Input label="Kata Sandi" type={showPass ? "text" : "password"} icon={<HiOutlineLockClosed />} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Masukkan kata sandi" required />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-[38px] text-slate-400 hover:text-slate-600 transition-colors">
                  {showPass ? <HiOutlineEyeOff size={20} /> : <HiOutlineEye size={20} />}
                </button>
              </div>

              <div className="flex items-center justify-between !mt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-600 select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-[#011F7B] focus:ring-[#011F7B] accent-[#011F7B]"
                  />
                  Ingat Saya
                </label>
                <Link to="/forgot-password" className="text-xs font-bold text-[#011F7B] hover:text-blue-800 hover:underline transition-colors">
                  Lupa Password?
                </Link>
              </div>

              <Button type="submit" isLoading={isLoading} className="w-full mt-2" icon={HiOutlineArrowRight}>
                Masuk ke Akun
              </Button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-slate-200"></div>
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">atau</span>
              <div className="flex-1 h-px bg-slate-200"></div>
            </div>

            {/* Google Login Button */}
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
              {googleLoading ? "Memproses..." : "Masuk dengan Google"}
            </button>

            <p className="text-center mt-10 text-slate-500 text-sm">
              Belum punya akun? <Link to="/register" className="text-[#011F7B] font-semibold hover:underline">Daftar Gratis</Link>
            </p>
          </Card>
        </motion.div>
      </div>
    </div>

      <div className="hidden lg:flex flex-[1.2] bg-gradient-to-br from-[#011F7B] to-[#010f3d] items-center justify-center p-16 text-center h-screen sticky top-0">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <h2 className="text-white text-4xl font-extrabold mb-6 leading-tight">"Persiapan terbaik untuk hari esok adalah melakukan yang terbaik hari ini."</h2>
          <p className="text-white/60 text-lg font-medium opacity-80">— Hasyim Ganteng.</p>
        </motion.div>
      </div> 
    </div>
  );
}
