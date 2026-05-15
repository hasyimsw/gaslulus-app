import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../lib/api";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import {
  HiOutlineClock,
  HiOutlineBadgeCheck,
  HiOutlineChevronRight,
  HiOutlineTrash,
} from "react-icons/hi";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => { fetchHistory(); }, []);

  const fetchHistory = () => {
    setLoading(true);
    api.get("/results").then((r) => setHistory(r.data.data)).catch(() => {}).finally(() => setLoading(false));
  };

  const handleClear = async () => {
    const result = await Swal.fire({
      title: "Hapus Semua Riwayat?",
      text: "Data riwayat akan dihapus permanen.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal"
    });

    if (result.isConfirmed) {
      try {
        await api.delete("/results/clear");
        Swal.fire("Berhasil!", "Riwayat telah dihapus.", "success");
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

  const totalPages = Math.ceil(history.length / itemsPerPage);
  const paginatedHistory = history.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 mb-1">Riwayat <span className="text-amber-500 font-black">Tryout</span></h1>
          <p className="text-slate-500 font-medium">Pantau perkembangan skor kamu dari waktu ke waktu.</p>
        </div>
        {history.length > 0 && (
          <Button variant="danger" onClick={handleClear} icon={HiOutlineTrash} className="text-xs">
            Hapus Riwayat
          </Button>
        )}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => <Card key={i} className="h-24 animate-pulse bg-slate-50 border-none" />)}
        </div>
      ) : history.length === 0 ? (
        <Card className="text-center py-24 flex flex-col items-center">
          <div className="text-5xl mb-4 grayscale opacity-20">📋</div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Belum ada riwayat</h3>
          <p className="text-slate-500 font-medium mb-8">Kamu belum mengerjakan tryout apapun.</p>
          <Button as={Link} to="/tryout" icon={HiOutlineChevronRight}>Mulai Tryout Pertama</Button>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          {paginatedHistory.map((item, i) => (
            <motion.div key={item.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="p-5 flex flex-col sm:flex-row items-center gap-6 group" hoverable>
                <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0 group-hover:scale-110 transition-transform">
                  <HiOutlineBadgeCheck size={32} />
                </div>

                <div className="flex-1 min-w-0 text-center sm:text-left">
                  <Badge variant="primary" className="mb-2 uppercase tracking-widest text-[9px]">{item.category}</Badge>
                  <div className="font-bold text-lg text-slate-900 mb-2 truncate">{item.examTitle}</div>
                  <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <span className="flex items-center gap-1.5"><HiOutlineClock /> {formatDuration(item.durationUsed)}</span>
                    <span className="text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg">{item.totalCorrect} Benar</span>
                    <span className="text-red-500 bg-red-50 px-2 py-1 rounded-lg">{item.totalWrong} Salah</span>
                  </div>
                </div>

                <div className="flex items-center gap-8 w-full sm:w-auto justify-between sm:justify-end pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-50">
                  <div className="text-center">
                    <div className={`text-3xl font-black leading-none ${item.passed ? "text-emerald-500" : "text-red-500"}`}>{Math.round(item.score)}</div>
                    <Badge variant={item.passed ? "success" : "danger"} className="mt-2 text-[8px]">{item.passed ? "LULUS" : "GAGAL"}</Badge>
                  </div>
                  <Button as={Link} to={`/result/${item.id}`} variant="outline" className="p-3" icon={HiOutlineChevronRight} />
                </div>
              </Card>
            </motion.div>
          ))}

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              {[...Array(totalPages)].map((_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => { setCurrentPage(page); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                    className={`w-10 h-10 rounded-xl text-xs font-bold transition-all ${currentPage === page ? "bg-blue-600 text-white shadow-lg shadow-blue-100" : "bg-white text-slate-400 border border-slate-100 hover:border-blue-200"}`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
