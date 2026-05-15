import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import {
  HiOutlineViewGrid,
  HiOutlineBookOpen,
  HiOutlineClock,
  HiOutlineBookmark,
  HiOutlineUser,
  HiOutlineLogout,
  HiMenuAlt2,
  HiX,
  HiOutlineShieldCheck,
  HiOutlineLightningBolt,
} from "react-icons/hi";
import Swal from "sweetalert2";

const navItems = [
  { to: "/dashboard", icon: HiOutlineViewGrid, label: "Dashboard" },
  { to: "/tryout", icon: HiOutlineBookOpen, label: "Tryout" },
  { to: "/history", icon: HiOutlineClock, label: "Riwayat" },
  { to: "/bookmark", icon: HiOutlineBookmark, label: "Bookmark" },
  { to: "/profile", icon: HiOutlineUser, label: "Profil Saya" },
];

export default function DashboardLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    Swal.fire({
      title:
        '<span class="text-2xl font-semibold text-slate-800 tracking-tight">Keluar Akun?</span>',
      html: '<p class="text-slate-500 font-medium leading-relaxed">Anda akan mengakhiri sesi dan kembali ke halaman masuk.</p>',
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#011F7B",
      cancelButtonColor: "#f1f5f9",
      confirmButtonText: "Ya, Keluar",
      cancelButtonText: '<span class="text-slate-500">Batal</span>',
      padding: "3rem",
      background: "#ffffff",
      customClass: {
        popup: "rounded-[40px] shadow-2xl border-none",
        confirmButton:
          "rounded-2xl px-8 py-4 font-semibold uppercase tracking-widest text-xs",
        cancelButton:
          "rounded-2xl px-8 py-4 font-semibold uppercase tracking-widest text-xs",
      },
      showClass: {
        popup: "animate__animated animate__fadeInUp animate__faster",
      },
      hideClass: {
        popup: "animate__animated animate__fadeOutDown animate__faster",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        Swal.fire({
          title:
            '<span class="text-xl font-semibold text-slate-800">Berhasil Keluar</span>',
          html: '<p class="text-slate-500 text-xs font-medium">Sesi Anda telah berakhir dengan aman.</p>',
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
          padding: "2rem",
          customClass: {
            popup: "rounded-[32px] shadow-2xl border-none",
          },
        });
        navigate("/");
      }
    });
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Mobile Navbar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-[70px] bg-white border-b border-slate-200 px-5 flex items-center justify-between z-[60] shadow-sm">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-[#011F7B]/10 border border-[#011F7B]/20 p-2 rounded-lg cursor-pointer flex items-center justify-center transition-colors hover:bg-[#011F7B]/20"
        >
          {sidebarOpen ? (
            <HiX size={24} className="text-red-500" />
          ) : (
            <HiMenuAlt2 size={24} className="text-[#011F7B]" />
          )}
        </button>
        <img src="/logo.webp" alt="GasLulus Logo" className="h-8" />
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-slate-900/40 z-[45] backdrop-blur-[2px]"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed left-0 top-0 z-50 h-screen w-[260px] bg-white border-r border-slate-100 flex flex-col transition-transform duration-300 lg:translate-x-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        {/* Brand */}
        <div className="p-8 pb-8 flex items-center justify-center">
          <img src="/logo.webp" alt="GasLulus Logo" className="h-9" />
        </div>

        {/* User Info - Premium Minimalist */}
        <div className="px-4 mb-4">
          <div className="p-4 rounded-xl transition-all duration-300 hover:bg-slate-50 border border-transparent hover:border-slate-100 group cursor-default bg-[#011F7B]/5">
            <div className="flex items-center gap-3">
              <div className="relative shrink-0">
                <div className="w-10 h-10 rounded-xl bg-[#011F7B] text-white flex items-center justify-center font-semibold shadow-md shadow-[#011F7B]/20 transition-transform group-hover:scale-105">
                  {user?.name?.[0]?.toUpperCase()}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full shadow-sm" />
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-sm text-slate-900 truncate tracking-tight capitalize">
                  {user?.name}
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span
                    className={`text-[9px] font-semibold uppercase tracking-widest ${user?.role === "ADMIN" ? "text-[#FFBA09]" : "text-[#011F7B]"}`}
                  >
                    {user?.role === "ADMIN" ? "Admin" : "Peserta"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 flex flex-col gap-1 overflow-y-auto">
          <div className="text-[10px] font-semibold text-slate-500 px-4 pb-3 uppercase tracking-[0.2em]">
            Menu
          </div>
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => `
                relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm
                ${
                  isActive
                    ? "bg-[#011F7B]/10 text-[#011F7B] font-bold"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                }
              `}
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={18}
                    className={
                      isActive
                        ? "text-[#011F7B]"
                        : "text-slate-400 group-hover:text-slate-600"
                    }
                  />
                  {label}
                  {isActive && (
                    <div className="absolute left-0 w-1 h-5 bg-[#011F7B] rounded-r-full" />
                  )}
                </>
              )}
            </NavLink>
          ))}

          {user?.role === "ADMIN" && (
            <div className="mt-8 flex flex-col gap-1">
              <div className="text-[10px] font-semibold text-slate-500 px-4 pb-3 uppercase tracking-[0.2em]">
                Sistem
              </div>
              <NavLink
                to="/admin"
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) => `
                  relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm
                  ${
                    isActive
                      ? "bg-amber-50/50 text-amber-600 font-bold"
                      : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                  }
                `}
              >
                {({ isActive }) => (
                  <>
                    <HiOutlineShieldCheck
                      size={18}
                      className={isActive ? "text-amber-600" : "text-slate-400"}
                    />
                    Admin Panel
                    {isActive && (
                      <div className="absolute left-0 w-1 h-5 bg-amber-600 rounded-r-full" />
                    )}
                  </>
                )}
              </NavLink>
            </div>
          )}
        </nav>

        {/* Logout */}
        <div className="p-4 mt-auto">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl w-full text-red-400 cursor-pointer bg-red-50 hover:text-red-600 hover:bg-red-100 transition-all font-bold text-sm"
          >
            <HiOutlineLogout size={18} />
            Keluar
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 lg:pl-[260px] pt-[70px] lg:pt-0 transition-all duration-300">
        <div className="p-4 md:p-8 lg:p-10 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
