import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../lib/api";
import {
  HiOutlineClock,
  HiOutlineBadgeCheck,
  HiOutlineXCircle,
  HiOutlineChevronRight,
  HiOutlineTrash,
} from "react-icons/hi";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = () => {
    setLoading(true);
    api
      .get("/results")
      .then((r) => setHistory(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  const handleClear = async () => {
    const result = await Swal.fire({
      title: "Hapus Semua Riwayat?",
      text: "Seluruh data riwayat tryout kamu akan dihapus permanen.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Ya, Hapus Semua",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        await api.delete("/results/clear");
        Swal.fire("Berhasil!", "Seluruh riwayat telah dihapus.", "success");
        setHistory([]);
      } catch {
        Swal.fire("Error", "Gagal menghapus riwayat", "error");
      }
    }
  };

  const formatDuration = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s}s`;
  };

  return (
    <div className="animate-fade space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 mb-1">
            Riwayat <span className="text-[#F59E0B]">Tryout</span>
          </h1>
          <p className="text-slate-500 font-medium">
            Pantau perkembangan skor kamu dari waktu ke waktu.
          </p>
        </div>
        {history.length > 0 && (
          <button
            onClick={handleClear}
            className="btn bg-red-50 text-red-500 hover:text-red-600 border border-red-100 hover:bg-red-100 font-bold px-5 py-2 text-sm"
          >
            <HiOutlineTrash size={18} />
            Hapus Riwayat
          </button>
        )}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="card h-24 bg-slate-50 animate-pulse border-none"
            />
          ))}
        </div>
      ) : history.length === 0 ? (
        <div className="card text-center py-24 flex flex-col items-center">
          <div className="text-6xl mb-6 grayscale opacity-40">📋</div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            Belum ada riwayat
          </h3>
          <p className="text-slate-500 font-medium mb-8">
            Kamu belum mengerjakan tryout apapun.
          </p>
          <Link
            to="/tryout"
            className="btn btn-primary px-6 py-3 shadow-md shadow-blue-100 font-medium"
          >
            Mulai Tryout Pertama
            <HiOutlineChevronRight size={16} />
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {history.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card p-5 flex flex-col sm:flex-row items-center gap-6 group hover:border-blue-200"
            >
              {/* Category Badge Icon */}
              <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0 group-hover:scale-110 transition-transform">
                <HiOutlineBadgeCheck size={32} />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0 text-center sm:text-left">
                <div className="text-[10px] font-black text-blue-600 mb-1 uppercase tracking-[0.15em] bg-blue-50 inline-block badge">
                  {item.category}
                </div>
                <div className="font-extrabold text-lg text-slate-900 mb-2 truncate">
                  {item.examTitle}
                </div>
                <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-xs font-medium text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <HiOutlineClock className="text-slate-400" />{" "}
                    {formatDuration(item.durationUsed)}
                  </span>
                  <span className="flex items-center gap-1.5 text-emerald-500 bg-emerald-50/50 px-2 py-0.5 rounded-md">
                    {item.totalCorrect} Benar
                  </span>
                  <span className="flex items-center gap-1.5 text-red-500 bg-red-50/50 px-2 py-0.5 rounded-md">
                    {item.totalWrong} Salah
                  </span>
                </div>
              </div>

              {/* Score & Action */}
              <div className="flex items-center gap-8 w-full sm:w-auto justify-between sm:justify-end pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-50">
                <div className="text-center">
                  <div
                    className={`text-3xl font-medium leading-none ${item.passed ? "text-emerald-500" : "text-red-500"}`}
                  >
                    {Math.round(item.score)}
                  </div>
                  <div
                    className={`text-[10px] font-medium uppercase tracking-widest mt-1.5 ${item.passed ? "text-emerald-500" : "text-red-500"}`}
                  >
                    {item.passed ? "Lulus" : "Gagal"}
                  </div>
                </div>
                <Link
                  to={`/result/${item.id}`}
                  className="p-2 rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-100 hover:text-blue-600 transition-colors"
                >
                  <HiOutlineChevronRight size={20} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
