import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../lib/api";
import Swal from "sweetalert2";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import {
  HiOutlineBookmark,
  HiOutlineTrash,
  HiOutlineChevronDown,
  HiOutlineChevronUp,
  HiOutlineLightBulb,
} from "react-icons/hi";

export default function BookmarkPage() {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    api.get("/bookmarks").then((r) => setBookmarks(r.data.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleRemove = async (questionId) => {
    const result = await Swal.fire({
      title: "Hapus Bookmark?",
      text: "Soal ini akan dihapus dari daftar simpanan.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Ya, Hapus",
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/bookmarks/${questionId}`);
        setBookmarks((prev) => prev.filter((b) => b.questionId !== questionId));
        Swal.fire({ title: "Terhapus", icon: "success", timer: 1000, showConfirmButton: false });
      } catch {
        Swal.fire("Error", "Gagal menghapus bookmark", "error");
      }
    }
  };

  const toggleExpand = (id) => setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 mb-1">Bank Soal <span className="text-amber-500 font-black">Saya</span></h1>
        <p className="text-slate-500 font-medium">Kumpulan soal yang kamu tandai untuk dipelajari kembali.</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-6 flex items-start gap-6 animate-pulse">
              <div className="flex-1 space-y-4">
                <div className="flex gap-3">
                  <div className="w-12 h-3 bg-slate-100 rounded" />
                  <div className="w-24 h-3 bg-slate-100 rounded" />
                </div>
                <div className="w-full h-5 bg-slate-100 rounded" />
                <div className="w-2/3 h-5 bg-slate-100 rounded" />
              </div>
              <div className="flex gap-2">
                <div className="w-10 h-10 bg-slate-100 rounded-xl" />
                <div className="w-10 h-10 bg-slate-100 rounded-xl" />
              </div>
            </Card>
          ))}
        </div>
      ) : bookmarks.length === 0 ? (
        <Card className="text-center py-24 flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 mb-6">
            <HiOutlineBookmark size={40} />
          </div>
          <h3 className="text-xl font-extrabold text-slate-900 mb-2">Belum ada bookmark</h3>
          <p className="text-slate-500 font-medium max-w-sm mx-auto">Klik ikon bookmark saat mengerjakan ujian untuk menyimpan soal yang ingin dipelajari.</p>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          {bookmarks.map((b, i) => {
            const q = b.question;
            const isOpen = expanded[b.id];

            return (
              <motion.div key={b.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Card className="overflow-hidden" hoverable={!isOpen}>
                  <div className="flex items-start gap-6 p-6">
                    <div className="flex-1 cursor-pointer min-w-0" onClick={() => toggleExpand(b.id)}>
                      <div className="flex flex-wrap items-center gap-3 mb-4">
                        <Badge variant="primary" className="text-[9px]">{q.exam?.category}</Badge>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{q.exam?.title}</span>
                      </div>
                      <p className="font-bold text-slate-800 leading-relaxed text-lg">{q.question}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => toggleExpand(b.id)} className="p-2" icon={isOpen ? HiOutlineChevronUp : HiOutlineChevronDown} />
                      <Button variant="danger" onClick={() => handleRemove(b.questionId)} className="p-2" icon={HiOutlineTrash} />
                    </div>
                  </div>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t border-slate-50">
                        <div className="p-6 lg:p-8 bg-slate-50/30">
                          <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-6">Pilihan Jawaban</div>
                          <div className="grid grid-cols-1 gap-3">
                            {q.options.map((opt, oi) => (
                              <div key={opt.id} className={`p-4 rounded-xl border-2 flex items-center gap-4 transition-all ${opt.isCorrect ? "bg-emerald-50 border-emerald-500 text-emerald-900" : "bg-white border-slate-50 text-slate-500"}`}>
                                <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${opt.isCorrect ? "bg-emerald-500 text-white shadow-lg shadow-emerald-100" : "bg-slate-100 text-slate-400"}`}>
                                  {String.fromCharCode(65 + oi)}
                                </span>
                                <span className={`font-bold ${opt.isCorrect ? "text-emerald-900" : "text-slate-600"}`}>{opt.optionText}</span>
                              </div>
                            ))}
                          </div>
                          {q.explanation && (
                            <div className="mt-8 p-6 bg-blue-50/50 border-2 border-blue-600 rounded-2xl relative overflow-hidden group">
                              <div className="relative z-10">
                                <div className="flex items-center gap-2 text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-3">
                                  <HiOutlineLightBulb size={18} /> Pembahasan
                                </div>
                                <p className="text-sm text-blue-900 font-bold leading-relaxed">{q.explanation}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
