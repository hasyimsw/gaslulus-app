import { useState } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "../stores/authStore";
import api from "../lib/api";
import Swal from "sweetalert2";
import {
  HiOutlineUser,
  HiOutlineMail,
  HiOutlinePencil,
  HiOutlineLockClosed,
  HiOutlineSave,
  HiOutlineX,
} from "react-icons/hi";

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore();
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [pwForm, setPwForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [showPwForm, setShowPwForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put("/users/profile", { name });
      Swal.fire({
        title: "Berhasil!",
        text: "Profil Anda telah diperbarui.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      // Update global state
      updateUser({ ...user, name });

      setEditMode(false);
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Gagal memperbarui profil",
        "error",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmNewPassword) {
      Swal.fire("Error", "Password baru tidak cocok!", "error");
      return;
    }
    setSaving(true);
    try {
      await api.put("/users/password", pwForm);
      Swal.fire("Berhasil!", "Password telah diganti.", "success");
      setShowPwForm(false);
      setPwForm({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Gagal memperbarui password",
        "error",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="animate-fade space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">
          Profil Saya
        </h1>
        <p className="text-slate-500 font-medium">
          Kelola informasi akun dan keamanan kamu.
        </p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Profile Card */}
        <div className="card p-8 lg:p-10">
          <div className="flex flex-col sm:flex-row items-center gap-8 mb-10">
            <div className="w-28 h-28 rounded-full bg-blue-600 flex items-center justify-center text-4xl font-extrabold text-white shrink-0 shadow-lg shadow-blue-200/40 border-4 border-white">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0 text-center sm:text-left">
              <h2 className="text-2xl font-bold text-slate-900 mb-1 truncate capitalize">
                {user?.name}
              </h2>
              <p className="text-slate-500 font-medium mb-4 truncate">
                {user?.email}
              </p>
              <span
                className={`badge px-4 py-1.5 text-xs ${user?.role === "ADMIN" ? "badge-warning" : "badge-primary"}`}
              >
                {user?.role === "ADMIN"
                  ? "👑 Administrator"
                  : "🎓 Peserta Terverifikasi"}
              </span>
            </div>
          </div>

          {editMode ? (
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">
                  Nama Lengkap
                </label>
                <input
                  className="input-field rounded-xl border-slate-300 focus:border-blue-500"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={30}
                  required
                />
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="btn btn-primary px-5 py-2 rounded-xl"
                >
                  <HiOutlineSave size={18} />{" "}
                  {saving ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
                <button
                  type="button"
                  onClick={() => setEditMode(false)}
                  className="btn btn-outline px-5 py-2 rounded-xl"
                >
                  <HiOutlineX size={18} /> Batal
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setEditMode(true)}
              className="btn btn-outline w-full sm:w-auto border-dashed border-2 px-5 py-1.5 rounded-xl"
            >
              <HiOutlinePencil size={18} /> Edit Profil
            </button>
          )}
        </div>

        {/* Security Card */}
        <div className="card p-8">
          <div
            className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 ${showPwForm ? "mb-8" : ""}`}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-red-500 shrink-0">
                <HiOutlineLockClosed size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Keamanan Akun</h3>
                <p className="text-sm text-slate-500 font-medium">
                  Perbarui kata sandi secara berkala.
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowPwForm(!showPwForm)}
              className="btn btn-outline text-xs px-5 py-2 rounded-xl border-slate-300"
            >
              {showPwForm ? "Batal" : "Ganti Password"}
            </button>
          </div>

          {showPwForm && (
            <form
              onSubmit={handleUpdatePassword}
              className="space-y-6 mt-8 pt-8 border-t border-slate-100"
            >
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest">
                  Password Lama
                </label>
                <input
                  type="password"
                  className="input-field rounded-xl"
                  value={pwForm.currentPassword}
                  onChange={(e) =>
                    setPwForm({ ...pwForm, currentPassword: e.target.value })
                  }
                  maxLength={30}
                  required
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest">
                    Password Baru
                  </label>
                  <input
                    type="password"
                    className="input-field rounded-xl"
                    value={pwForm.newPassword}
                    onChange={(e) =>
                      setPwForm({ ...pwForm, newPassword: e.target.value })
                    }
                    maxLength={30}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest">
                    Konfirmasi Password
                  </label>
                  <input
                    type="password"
                    className="input-field rounded-xl"
                    value={pwForm.confirmNewPassword}
                    onChange={(e) =>
                      setPwForm({
                        ...pwForm,
                        confirmNewPassword: e.target.value,
                      })
                    }
                    maxLength={30}
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={saving}
                className="btn flex bg-red-500 text-white hover:bg-red-600 w-full py-2.5 text-sm font-semibold shadow-lg shadow-red-100"
              >
                <HiOutlineLockClosed />
                {saving ? "Memproses..." : "Ubah Password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
