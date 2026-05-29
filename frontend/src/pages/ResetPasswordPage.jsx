import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../lib/api";
import Swal from "sweetalert2";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import {
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlineKey,
} from "react-icons/hi";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      Swal.fire({
        icon: "error",
        title: "Token Tidak Valid",
        text: "Link reset password tidak valid atau tidak lengkap.",
        confirmButtonColor: "#011F7B",
      }).then(() => {
        navigate("/login");
      });
    }
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return Swal.fire("Gagal", "Password dan konfirmasi tidak cocok", "error");
    }
    if (password.length < 6) {
      return Swal.fire("Gagal", "Password minimal 6 karakter", "error");
    }

    setLoading(true);
    try {
      const res = await api.post("/auth/reset-password", { token, password });
      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: res.data.message || "Password berhasil diperbarui.",
        confirmButtonColor: "#011F7B",
      }).then(() => {
        navigate("/login");
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text:
          error.response?.data?.message ||
          "Terjadi kesalahan saat mereset password",
        confirmButtonColor: "#011F7B",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!token) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-8 sm:p-10 rounded-3xl shadow-xl shadow-primary/5 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary">
            <HiOutlineKey size={32} />
          </div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
            Buat Password Baru
          </h1>
          <p className="text-slate-500 text-sm mt-2 font-medium">
            Silakan masukkan password baru untuk akun Anda.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <Input
              label="Password Baru"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              icon={<HiOutlineLockClosed />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="absolute right-4 top-10 text-slate-400 hover:text-primary transition-colors"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <HiOutlineEyeOff size={20} />
              ) : (
                <HiOutlineEye size={20} />
              )}
            </button>
          </div>

          <div className="relative">
            <Input
              label="Konfirmasi Password Baru"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              icon={<HiOutlineLockClosed />}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full py-3.5 mt-2"
            isLoading={loading}
          >
            Simpan Password Baru
          </Button>

          <div className="text-center mt-6">
            <Link
              to="/login"
              className="text-sm font-bold text-slate-500 hover:text-primary transition-colors"
            >
              Batal dan kembali ke Login
            </Link>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
