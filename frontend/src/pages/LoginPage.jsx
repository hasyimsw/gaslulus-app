import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthStore } from "../stores/authStore";
import Swal from "sweetalert2";
import {
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlineArrowRight,
  HiOutlineLightningBolt,
} from "react-icons/hi";

export default function LoginPage() {
  const { login, isLoading } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(email, password);
    if (result.success) {
      Swal.fire({
        title: "Berhasil Masuk!",
        text: "Selamat datang kembali di GasLulus.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    } else {
      Swal.fire({
        title: "Gagal Masuk",
        text: result.message,
        icon: "error",
        confirmButtonColor: "#2563eb",
      });
    }
  };

  return (
    <div className="flex min-h-screen bg-blue-50">
      {/* Left: Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-[400px] bg-white rounded-md p-4 shadow-sm"
        >
          <div className="mb-10 text-center">
            <div className="flex flex-col items-center text-center">
              <img
                src="/logo.webp"
                alt="Logo"
                className="h-20 mb-4 object-contain"
              />

              <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-1 rounded-full text-xs border border-blue-100 mb-8 uppercase font-semibold tracking-[0.1em]">
                <HiOutlineLightningBolt size={16} />
                Gas Belajar, Gas Lulus!
              </div>
            </div>

            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Selamat Datang
            </h1>
            <p className="text-slate-500 text-sm">
              Masuk untuk melanjutkan proses belajar kamu.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">
                Email
              </label>
              <div className="relative">
                <HiOutlineMail
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="input-field pl-11"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">
                Kata Sandi
              </label>
              <div className="relative">
                <HiOutlineLockClosed
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi"
                  className="input-field pl-11 pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPass ? (
                    <HiOutlineEyeOff size={20} />
                  ) : (
                    <HiOutlineEye size={20} />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary w-full py-3 text-sm mt-4 shadow-lg shadow-blue-100"
            >
              {isLoading ? (
                "Memproses..."
              ) : (
                <>
                  Masuk ke Akun <HiOutlineArrowRight />
                </>
              )}
            </button>
          </form>

          <p className="text-center mt-10 text-slate-500 text-sm font-medium">
            Belum punya akun?{" "}
            <Link
              to="/register"
              className="text-blue-600 font-semibold hover:underline decoration-1 underline-offset-4"
            >
              Daftar Gratis
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right: Decorative */}
      <div className="hidden lg:flex flex-[1.2] bg-gradient-to-br from-blue-600 to-blue-800 items-center justify-center p-16">
        <div className="max-w-[500px] text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-white text-4xl font-extrabold mb-6 leading-tight">
              "Persiapan terbaik untuk hari esok adalah melakukan yang terbaik
              hari ini."
            </h2>
            <p className="text-blue-100 text-lg font-medium opacity-80">
              — Belajar mandiri dengan simulasi ujian terpercaya.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
