import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthStore } from "../stores/authStore";
import Swal from "sweetalert2";
import {
  HiOutlineUser,
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlineArrowRight,
  HiOutlineLightningBolt,
} from "react-icons/hi";

export default function RegisterPage() {
  const { register, isLoading } = useAuthStore();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      Swal.fire("Error", "Konfirmasi password tidak cocok!", "error");
      return;
    }
    const result = await register(
      form.name,
      form.email,
      form.password,
      form.confirmPassword,
    );
    if (result.success) {
      Swal.fire({
        title: "Akun Berhasil Dibuat!",
        text: "Silakan masuk untuk mulai belajar.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    } else {
      Swal.fire({
        title: "Gagal Mendaftar",
        text: result.message,
        icon: "error",
        confirmButtonColor: "#2563eb",
      });
    }
  };

  return (
    <div className="flex min-h-screen bg-blue-50">
      {/* Decorative Left (Hidden on Mobile) */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-blue-600 to-blue-800 items-center justify-center p-16">
        <div className="max-w-[440px] text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <h2 className="text-4xl font-extrabold text-white mb-6 leading-tight">
              Bergabung Bersama Pejuang Lulus Lainnya!
            </h2>
            <p className="text-lg text-blue-100 font-medium opacity-80">
              Dapatkan akses gratis ke ribuan soal latihan dan simulasi ujian
              terpercaya.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Register Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
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
              Daftar Akun Gratis
            </h1>
            <p className="text-slate-500 text-sm">
              Daftar akun gratis untuk mulai belajar.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">
                Nama Lengkap
              </label>
              <div className="relative">
                <HiOutlineUser
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Masukkan nama lengkap"
                  className="input-field pl-11"
                  maxLength={100}
                  required
                />
              </div>
            </div>

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
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
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
                  name="password"
                  type={showPass ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Minimal 8 karakter & simbol"
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

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">
                Konfirmasi Kata Sandi
              </label>
              <div className="relative">
                <HiOutlineLockClosed
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  name="confirmPassword"
                  type={showPass ? "text" : "password"}
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Ulangi kata sandi"
                  className="input-field pl-11"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary w-full py-3 text-sm mt-4 shadow-lg shadow-blue-100"
            >
              {isLoading ? (
                "Mendaftarkan..."
              ) : (
                <>
                  Daftar Sekarang <HiOutlineArrowRight />
                </>
              )}
            </button>
          </form>

          <p className="text-center mt-10 text-slate-500 text-sm font-medium">
            Sudah punya akun?{" "}
            <Link
              to="/login"
              className="text-blue-600 font-semibold hover:underline decoration-1 underline-offset-4"
            >
              Masuk di Sini
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
