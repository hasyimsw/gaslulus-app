import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthStore } from "../stores/authStore";
import api from "../lib/api";
import {
  HiOutlineBookOpen,
  HiOutlineTrendingUp,
  HiOutlineBadgeCheck,
  HiOutlineArrowRight,
  HiPlay,
  HiArrowNarrowRight,
  HiOutlineLibrary,
  HiOutlineAcademicCap,
  HiOutlineViewGrid,
} from "react-icons/hi";

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/results/dashboard")
      .then((r) => setStats(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Selamat Pagi";
    if (h < 17) return "Selamat Siang";
    return "Selamat Malam";
  };

  return (
    <div className="space-y-10">
      {/* Simple Greeting */}
      <div>
        <h1 className="text-3xl text-slate-900 tracking-tight mb-1">
          {getGreeting()},{" "}
          <span className="text-blue-600 capitalize">
            {user?.name?.split(" ")[0]}!
          </span>{" "}
          👋
        </h1>
        <p className="text-slate-500">
          Siap untuk meningkatkan skor ujianmu hari ini?
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            label: "Total Tryout",
            value: stats?.totalExams ?? 0,
            icon: HiOutlineBookOpen,
            color: "text-blue-600",
            bg: "bg-blue-50",
          },
          {
            label: "Rata-rata Skor",
            value: stats?.avgScore ?? 0,
            icon: HiOutlineTrendingUp,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
          },
          {
            label: "Ujian Lulus",
            value: stats?.totalPassed ?? 0,
            icon: HiOutlineBadgeCheck,
            color: "text-amber-500",
            bg: "bg-amber-50",
          },
        ].map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="card flex items-center gap-5 p-6 hover:border-blue-100"
          >
            <div
              className={`w-14 h-14 rounded-xl ${s.bg} flex items-center justify-center shrink-0`}
            >
              <s.icon size={28} className={s.color} />
            </div>
            <div>
              <div className="text-2xl font-medium text-slate-900 leading-none mb-1.5">
                {loading ? "..." : s.value}
              </div>
              <div className="text-[11px] text-slate-500 uppercase tracking-widest">
                {s.label}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Categories */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl text-slate-900 tracking-tight">
            Pilih Jenjang Tryout
          </h2>
          <Link
            to="/tryout"
            className="text-blue-600 font-bold text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 hover:text-blue-700 transition-colors"
          >
            Semua Paket <HiArrowNarrowRight size={18} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              cat: "SD",
              icon: HiOutlineLibrary,
              desc: "Dasar pemahaman dan latihan ujian sekolah.",
              color: "text-emerald-500",
              bg: "bg-emerald-50",
            },
            {
              cat: "SMP",
              icon: HiOutlineLibrary,
              desc: "Belajar dan latihan soal masuk SMA unggulan.",
              color: "text-blue-500",
              bg: "bg-blue-50",
            },
            {
              cat: "SMA",
              icon: HiOutlineLibrary,
              desc: "Latihan ujian sekolah dan Tes Kemampuan Akademik.",
              color: "text-amber-500",
              bg: "bg-amber-50",
            },
            {
              cat: "CPNS",
              icon: HiOutlineAcademicCap,
              desc: "Persiapan SKD CPNS lengkap dengan simulasi CAT.",
              color: "text-red-500",
              bg: "bg-red-50",
            },
          ].map((item, i) => (
            <Link key={i} to={`/tryout?category=${item.cat}`} className="group">
              <motion.div
                whileHover={{ y: -4 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="card p-7 h-full flex flex-col border-slate-100 hover:border-blue-100 hover:shadow-xl hover:shadow-slate-200/40"
              >
                <div
                  className={`w-12 h-12 rounded-xl ${item.bg} ${item.color} flex items-center justify-center mb-6 transition-transform group-hover:scale-110`}
                >
                  <item.icon size={24} />
                </div>
                <h3 className="text-lg text-slate-900 mb-2">{item.cat}</h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed mb-8">
                  {item.desc}
                </p>
                <div className="mt-auto flex items-center gap-2 text-[10px] font-medium tracking-widest text-blue-600">
                  Mulai Belajar <HiPlay />
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent Activity */}
      {stats?.recentResults?.length > 0 && (
        <section className="space-y-6">
          <h2 className="text-xl text-slate-900 tracking-tight">
            Aktivitas Terbaru
          </h2>
          <div className="card p-0 overflow-hidden divide-y divide-slate-50 border-slate-100">
            {stats.recentResults.slice(0, 5).map((r, i) => (
              <div
                key={i}
                className="p-5 flex items-center justify-between hover:bg-slate-50/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${r.passed ? "bg-emerald-50 text-emerald-500" : "bg-red-50 text-red-500"}`}
                  >
                    <HiOutlineBadgeCheck size={24} />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">
                      {r.examTitle}
                    </div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-widest mt-0.5">
                      Dikerjakan pada{" "}
                      {new Date(r.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                      })}
                    </div>
                  </div>
                </div>
                <div className="text-center font-semibold">
                  <div
                    className={`text-xl ${r.passed ? "text-emerald-500" : "text-red-500"}`}
                  >
                    {Math.round(r.score)}
                  </div>
                  <div
                    className={`text-[9px] uppercase tracking-widest ${r.passed ? "text-emerald-500" : "text-red-500"}`}
                  >
                    {r.passed ? "Lulus" : "Tidak Lulus"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
