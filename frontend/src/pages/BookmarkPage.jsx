import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../lib/api";
import Swal from "sweetalert2";
import {
  HiOutlineBookmark,
  HiOutlineTrash,
  HiOutlineChevronDown,
  HiOutlineChevronUp,
  HiOutlineLightBulb,
} from "react-icons/hi";
import { FaBookmark } from "react-icons/fa";

export default function BookmarkPage() {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    api
      .get("/bookmarks")
      .then((r) => setBookmarks(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleRemove = async (questionId) => {
    const result = await Swal.fire({
      title: "Hapus Bookmark?",
      text: "Soal ini akan dihapus dari daftar simpanan kamu.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Ya, Hapus",
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/bookmarks/${questionId}`);
        setBookmarks((prev) => prev.filter((b) => b.questionId !== questionId));
        Swal.fire({
          title: "Terhapus",
          icon: "success",
          timer: 1000,
          showConfirmButton: false,
        });
      } catch {
        Swal.fire("Error", "Gagal menghapus bookmark", "error");
      }
    }
  };

  const toggleExpand = (id) =>
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="animate-fade space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 mb-1">
          Bank Soal Saya
        </h1>
        <p className="text-slate-500 font-medium">
          Kumpulan soal yang kamu tandai untuk dipelajari kembali.
        </p>
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
      ) : bookmarks.length === 0 ? (
        <div className="card text-center py-24 flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 mb-6">
            <HiOutlineBookmark size={40} />
          </div>
          <h3 className="text-xl font-extrabold text-slate-900 mb-2">
            Belum ada bookmark
          </h3>
          <p className="text-slate-500 font-medium max-w-sm mx-auto">
            Klik ikon bookmark pada saat mengerjakan ujian untuk menyimpan soal
            yang ingin dipelajari.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {bookmarks.map((b, i) => {
            const q = b.question;
            const isOpen = expanded[b.id];

            return (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="card overflow-hidden"
              >
                <div className="flex items-start gap-6 p-6">
                  <div
                    className="flex-1 cursor-pointer min-w-0"
                    onClick={() => toggleExpand(b.id)}
                  >
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <span className="badge badge-primary px-2.5 py-0.5 text-[10px] uppercase tracking-wider">
                        {q.exam?.category}
                      </span>
                      <span className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">
                        {q.exam?.title}
                      </span>
                    </div>
                    <p className="font-extrabold text-slate-800 leading-relaxed text-lg">
                      {q.question}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleExpand(b.id)}
                      className={`p-2 rounded-xl border-2 transition-all ${isOpen ? "bg-blue-50 border-blue-100 text-blue-600 hover:bg-blue-100 cursor-pointer" : "border-blue-50 text-blue-400 bg-blue-50 hover:border-blue-100 hover:text-blue-500 hover:bg-blue-100 cursor-pointer"}`}
                    >
                      {isOpen ? (
                        <HiOutlineChevronUp size={20} />
                      ) : (
                        <HiOutlineChevronDown size={20} />
                      )}
                    </button>
                    <button
                      onClick={() => handleRemove(b.questionId)}
                      className="p-2 rounded-xl cursor-pointer border-2 border-red-50 text-red-400 bg-red-50 hover:border-red-100 hover:bg-red-100 hover:text-red-500 transition-all"
                    >
                      <HiOutlineTrash size={20} />
                    </button>
                  </div>
                </div>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden border-t border-slate-50"
                    >
                      <div className="p-6 lg:p-8 bg-slate-50/30">
                        <div className="text-[10px] text-slate-400 uppercase tracking-widest mb-6">
                          Pilihan Jawaban
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                          {q.options.map((opt, oi) => (
                            <div
                              key={opt.id}
                              className={`
                              p-3 rounded-xl border-2 flex items-center gap-4 transition-all
                              ${opt.isCorrect ? "bg-emerald-50 border-emerald-400 text-emerald-900 shadow-sm shadow-emerald-50" : "bg-white border-slate-100 text-slate-500"}
                            `}
                            >
                              <span
                                className={`
                                w-8 h-8 rounded-lg flex items-center justify-center text-[11px] shrink-0
                                ${opt.isCorrect ? "bg-emerald-500 text-white shadow-md shadow-emerald-100" : "bg-slate-100 text-slate-400"}
                              `}
                              >
                                {["A", "B", "C", "D", "E"][oi]}
                              </span>
                              <span
                                className={`font-semibold ${opt.isCorrect ? "text-emerald-900" : "text-slate-600"}`}
                              >
                                {opt.optionText}
                              </span>
                            </div>
                          ))}
                        </div>
                        {q.explanation && (
                          <div className="mt-8 p-6 bg-blue-50 border-2 border-blue-400 rounded-xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-100/50 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500" />
                            <div className="relative z-10">
                              <div className="flex items-center gap-2 text-[10px] text-blue-600 uppercase tracking-widest mb-3">
                                <HiOutlineLightBulb size={18} /> Pembahasan
                              </div>
                              <p className="text-sm text-blue-800 font-bold leading-relaxed">
                                {q.explanation}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
