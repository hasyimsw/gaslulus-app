import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../lib/api";
import {
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineClock,
  HiOutlineChevronRight,
  HiOutlineRefresh,
  HiAcademicCap,
} from "react-icons/hi";

export default function ResultPage() {
  const { id } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/results/${id}`)
      .then((r) => setResult(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Memuat hasil...
      </div>
    );
  if (!result) return <div>Hasil tidak ditemukan</div>;

  const passed = result.score >= (result.exam?.passingScore || 60);

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-10 lg:p-14 text-center shadow-xl shadow-slate-200/50"
        >
          <div
            className={`
            w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8
            ${passed ? "bg-emerald-50 text-emerald-500 shadow-lg shadow-emerald-100" : "bg-red-50 text-red-500 shadow-lg shadow-red-100"}
          `}
          >
            <HiAcademicCap size={40} />
          </div>
          <h1 className="text-4xl font-black text-slate-900 mb-2">
            Hasil Tryout Kamu
          </h1>
          <p className="text-slate-500 font-bold mb-10 tracking-wide uppercase text-sm">
            {result.exam?.title}
          </p>

          <div className="flex justify-center items-baseline gap-2 mb-4">
            <span
              className={`text-8xl font-black ${passed ? "text-emerald-500" : "text-red-500"}`}
            >
              {Math.round(result.score)}
            </span>
            <span className="text-2xl text-slate-300 font-bold">/ 100</span>
          </div>

          <div
            className={`
            inline-block px-8 py-2 rounded-full font-black text-sm tracking-widest mb-12
            ${passed ? "bg-emerald-500 text-white shadow-lg shadow-emerald-200" : "bg-red-500 text-white shadow-lg shadow-red-200"}
          `}
          >
            {passed ? "SELAMAT! ANDA LULUS" : "MAAF, ANDA BELUM LULUS"}
          </div>

          <div className="grid grid-cols-3 gap-4 border-t border-slate-50 pt-10">
            <div className="space-y-1">
              <div className="text-3xl font-black text-emerald-500 leading-none">
                {result.totalCorrect}
              </div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Benar
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-black text-red-500 leading-none">
                {result.totalWrong}
              </div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Salah
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-black text-amber-500 leading-none">
                {result.totalSkipped}
              </div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Kosong
              </div>
            </div>
          </div>
        </motion.div>

        {/* Secondary Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="card p-6 flex items-center gap-4 bg-white border-none shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
              <HiOutlineClock size={24} />
            </div>
            <div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">
                Waktu Pengerjaan
              </div>
              <div className="font-extrabold text-slate-900 text-sm">
                {Math.floor(result.durationUsed / 60)} Menit{" "}
                {result.durationUsed % 60} Detik
              </div>
            </div>
          </div>
          <div className="card p-6 flex items-center gap-4 bg-white border-none shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500 shrink-0">
              <HiOutlineCheckCircle size={24} />
            </div>
            <div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">
                Skor Minimum Lulus
              </div>
              <div className="font-extrabold text-slate-900 text-sm">
                {result.exam?.passingScore || 60} Poin
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Link to="/tryout" className="flex-1">
            <button className="btn btn-primary w-full py-4 text-sm font-medium shadow-lg shadow-blue-100 uppercase tracking-widest">
              <HiOutlineRefresh className="mr-2" /> Coba Tryout Lain
            </button>
          </Link>
          <Link to="/dashboard" className="flex-1">
            <button className="btn btn-outline bg-white w-full py-4 text-sm font-medium uppercase tracking-widest border-2">
              Ke Dashboard <HiOutlineChevronRight className="ml-2" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
