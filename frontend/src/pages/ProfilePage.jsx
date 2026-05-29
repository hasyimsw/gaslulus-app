import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "../stores/authStore";
import api from "../lib/api";
import Swal from "sweetalert2";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import {
  HiOutlineUser,
  HiOutlinePencil,
  HiOutlineLockClosed,
  HiOutlineSave,
  HiOutlineX,
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlineShieldCheck,
  HiOutlineGlobeAlt,
} from "react-icons/hi";
import { FcGoogle } from "react-icons/fc";

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
  const [showPass, setShowPass] = useState(false);
  const [fetchingUser, setFetchingUser] = useState(true);

  const isGoogleUser = user?.provider === "GOOGLE";

  // Fetch fresh user data on mount to ensure provider field is up-to-date
  useEffect(() => {
    api
      .get("/auth/me")
      .then((res) => {
        if (res.data?.data) {
          updateUser({ ...user, ...res.data.data });
        }
      })
      .catch(() => {
        // silently fail — stale data will be used
      })
      .finally(() => {
        setFetchingUser(false);
      });
  }, []);

  // Name validation logic
  const isValidName = name.trim().length >= 3 && /^[a-zA-Z\s]*$/.test(name);

  // Password criteria logic
  const passwordCriteria = {
    length: pwForm.newPassword.length >= 8,
    uppercase: /[A-Z]/.test(pwForm.newPassword),
    number: /[0-9]/.test(pwForm.newPassword),
    symbol: /[^A-Za-z0-9]/.test(pwForm.newPassword),
  };
  const isPasswordSecure = Object.values(passwordCriteria).every(Boolean);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!isValidName) {
      return Swal.fire(
        "Gagal",
        "Nama minimal 3 karakter dan hanya boleh berisi huruf.",
        "error",
      );
    }
    setSaving(true);
    try {
      await api.put("/users/profile", { name: name.trim() });
      Swal.fire({
        title: "Berhasil!",
        text: "Profil diperbarui.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
      updateUser({ ...user, name: name.trim() });
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
      return Swal.fire("Error", "Konfirmasi password tidak cocok!", "error");
    }
    if (!isPasswordSecure) {
      return Swal.fire(
        "Error",
        "Password baru belum memenuhi kriteria keamanan!",
        "error",
      );
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-3xl font-bold text-primary mb-1">
          Profil <span className="text-amber-500 font-bold">Saya</span>
        </h1>
        <p className="text-slate-500 font-medium">
          Kelola informasi akun dan keamanan kamu.
        </p>
      </div>

      <div className="max-w-2xl space-y-6">
        <Card className="p-8 lg:p-10">
          <div className="flex flex-col sm:flex-row items-center gap-8 mb-10 text-center sm:text-left">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-3xl font-extrabold text-white shrink-0 shadow-lg shadow-primary/20 border-4 border-white">
                {user?.name?.[0]?.toUpperCase()}
              </div>
              <div className="absolute bottom-1 right-1 w-6 h-6 bg-emerald-500 border-3 border-white rounded-full shadow-md shadow-emerald-200" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold text-slate-900 mb-1 capitalize">
                {user?.name}
              </h2>
              <p className="text-slate-500 font-medium mb-4">{user?.email}</p>
              <div className="flex flex-wrap gap-2">
                <Badge variant={user?.role === "ADMIN" ? "warning" : "primary"}>
                  {user?.role === "ADMIN" ? "👑 Administrator" : "🎓 Peserta"}
                </Badge>
                {isGoogleUser && (
                  <Badge
                    variant="slate"
                    className="flex items-center gap-1 normal-case"
                  >
                    <FcGoogle size={14} /> Terhubung
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {editMode ? (
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <Input
                label="Nama Lengkap"
                icon={<HiOutlineUser />}
                value={name}
                onChange={(e) => setName(e.target.value)}
                isValid={name ? isValidName : null}
                maxLength={50}
                required
              />
              <div className="flex gap-3">
                <Button type="submit" isLoading={saving} icon={HiOutlineSave}>
                  Simpan
                </Button>
                <Button
                  variant="danger"
                  onClick={() => setEditMode(false)}
                  icon={HiOutlineX}
                >
                  Batal
                </Button>
              </div>
            </form>
          ) : (
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => setEditMode(true)}
              icon={HiOutlinePencil}
            >
              Edit Profil
            </Button>
          )}
        </Card>

        {fetchingUser ? (
          <Card className="p-8">
            <div className="flex items-center gap-4 animate-pulse">
              <div className="w-12 h-12 rounded-xl bg-slate-100" />
              <div className="space-y-2 flex-1">
                <div className="h-3 w-24 bg-slate-100 rounded-full" />
                <div className="h-2 w-40 bg-slate-100 rounded-full" />
              </div>
            </div>
          </Card>
        ) : (
          <Card className="p-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${isGoogleUser ? "bg-blue-50 text-blue-500" : "bg-red-50 text-red-500"}`}
                >
                  {isGoogleUser ? (
                    <HiOutlineGlobeAlt size={24} />
                  ) : (
                    <HiOutlineLockClosed size={24} />
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Keamanan</h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {isGoogleUser
                      ? "Akun Anda terhubung dengan Google."
                      : "Perbarui kata sandi Anda secara berkala."}
                  </p>
                </div>
              </div>

              {!isGoogleUser ? (
                <Button
                  variant="outline"
                  className="text-xs"
                  onClick={() => setShowPwForm(!showPwForm)}
                >
                  {showPwForm ? "Tutup" : "Ganti Password"}
                </Button>
              ) : (
                <div className="px-4 py-2 bg-slate-50 rounded-lg border border-slate-100 flex items-center gap-2">
                  <FcGoogle size={16} />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Google Managed
                  </span>
                </div>
              )}
            </div>

            {isGoogleUser && (
              <div className="mt-8 pt-6 border-t border-slate-50">
                <p className="text-sm text-slate-500 font-medium leading-relaxed bg-blue-50/50 p-4 rounded-xl border border-blue-100/50">
                  Karena Anda menggunakan akun Google, pengaturan keamanan dan
                  kata sandi dikelola langsung melalui portal{" "}
                  <a
                    href="https://myaccount.google.com/security"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline font-bold"
                  >
                    Keamanan Google
                  </a>
                  .
                </p>
              </div>
            )}

            {!isGoogleUser && showPwForm && (
              <form
                onSubmit={handleUpdatePassword}
                className="space-y-6 mt-8 pt-8 border-t border-slate-50"
              >
                <Input
                  label="Password Lama"
                  type={showPass ? "text" : "password"}
                  value={pwForm.currentPassword}
                  onChange={(e) =>
                    setPwForm({ ...pwForm, currentPassword: e.target.value })
                  }
                  icon={<HiOutlineLockClosed />}
                  required
                />

                <div className="space-y-2">
                  <div className="relative">
                    <Input
                      label="Password Baru"
                      type={showPass ? "text" : "password"}
                      value={pwForm.newPassword}
                      onChange={(e) =>
                        setPwForm({ ...pwForm, newPassword: e.target.value })
                      }
                      icon={<HiOutlineLockClosed />}
                      isValid={pwForm.newPassword ? isPasswordSecure : null}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-4 top-[38px] text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPass ? (
                        <HiOutlineEyeOff size={20} />
                      ) : (
                        <HiOutlineEye size={20} />
                      )}
                    </button>
                  </div>

                  {pwForm.newPassword && (
                    <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1">
                      <RequirementItem
                        label="8 Karakter"
                        met={passwordCriteria.length}
                      />
                      <RequirementItem
                        label="Huruf Besar"
                        met={passwordCriteria.uppercase}
                      />
                      <RequirementItem
                        label="Angka"
                        met={passwordCriteria.number}
                      />
                      <RequirementItem
                        label="Simbol"
                        met={passwordCriteria.symbol}
                      />
                    </div>
                  )}
                </div>

                <Input
                  label="Konfirmasi Password Baru"
                  type={showPass ? "text" : "password"}
                  value={pwForm.confirmNewPassword}
                  onChange={(e) =>
                    setPwForm({ ...pwForm, confirmNewPassword: e.target.value })
                  }
                  icon={<HiOutlineLockClosed />}
                  required
                />

                <Button
                  type="submit"
                  variant="danger"
                  isLoading={saving}
                  className="w-full"
                  icon={HiOutlineLockClosed}
                >
                  Ubah Password
                </Button>
              </form>
            )}
          </Card>
        )}
      </div>
    </motion.div>
  );
}

function RequirementItem({ label, met }) {
  return (
    <div className="flex items-center gap-1.5">
      <div
        className={`w-1.5 h-1.5 rounded-full transition-colors ${met ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" : "bg-slate-300"}`}
      />
      <span
        className={`text-[10px] font-semibold ${met ? "text-green-600" : "text-slate-400"}`}
      >
        {label}
      </span>
    </div>
  );
}
