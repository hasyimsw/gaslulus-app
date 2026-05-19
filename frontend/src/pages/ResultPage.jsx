import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../lib/api";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import {
  HiOutlineClock,
  HiOutlineChevronRight,
  HiOutlineRefresh,
  HiAcademicCap,
  HiOutlineCheckCircle,
  HiOutlineChevronDown,
  HiOutlineChevronUp,
  HiOutlineXCircle,
} from "react-icons/hi";

export default function ResultPage() {
  const { id } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedQ, setExpandedQ] = useState(null);

  useEffect(() => {
    api.get(`/results/${id}`).then((r) => setResult(r.data.data)).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-4 border-slate-100 border-t-[#011F7B] rounded-full animate-spin" />
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Menganalisis Hasil...</p>
    </div>
  );
  
  if (!result) return <div className="min-h-screen flex items-center justify-center font-bold text-slate-400">Hasil tidak ditemukan</div>;

  const passed = result.score >= (result.exam?.passingScore || 60);

  return (
    <div className="bg-slate-50/50 min-h-screen py-12 px-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <Card className="p-10 lg:p-14 text-center" shadow="xl">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className={`w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-8 ${passed ? "bg-emerald-50 text-emerald-500" : "bg-red-50 text-red-500"}`}>
            <HiAcademicCap size={48} />
          </motion.div>
          
          <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Hasil Tryout Kamu</h1>
          <p className="text-slate-400 font-bold mb-12 tracking-widest uppercase text-[10px]">{result.exam?.title}</p>

          <div className="flex justify-center items-baseline gap-2 mb-6">
            <span className={`text-9xl font-black tracking-tighter ${passed ? "text-emerald-500" : "text-red-500"}`}>
              {Math.round(result.score)}
            </span>
            <span className="text-3xl text-slate-200 font-bold">/ 100</span>
          </div>

          <div className="mb-12">
            <Badge variant={passed ? "success" : "danger"} className="px-8 py-2 text-xs tracking-[0.2em]">
              {passed ? "SELAMAT! ANDA LULUS" : "MAAF, ANDA BELUM LULUS"}
            </Badge>
          </div>

          <div className="grid grid-cols-3 gap-6 pt-10 border-t border-slate-50">
            {[
              { val: result.totalCorrect, lab: "Benar", color: "text-emerald-500" },
              { val: result.totalWrong, lab: "Salah", color: "text-red-500" },
              { val: result.totalSkipped, lab: "Kosong", color: "text-amber-500" },
            ].map((s, i) => (
              <div key={i}>
                <div className={`text-4xl font-black ${s.color}`}>{s.val}</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{s.lab}</div>
              </div>
            ))}
          </div>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#011F7B]/5 text-[#011F7B] flex items-center justify-center shrink-0">
              <HiOutlineClock size={24} />
            </div>
            <div>
              <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Durasi Pengerjaan</div>
              <div className="font-bold text-slate-900">{Math.floor(result.durationUsed / 60)}m {result.durationUsed % 60}s</div>
            </div>
          </Card>
          <Card className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
              <HiOutlineCheckCircle size={24} />
            </div>
            <div>
              <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Passing Score</div>
              <div className="font-bold text-slate-900">{result.exam?.passingScore || 60} Poin</div>
            </div>
          </Card>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-8 pb-4">
          <Button as={Link} to="/tryout" className="flex-1 py-4 text-sm" icon={HiOutlineRefresh}>Coba Tryout Lain</Button>
          <Button as={Link} to="/dashboard" variant="outline" className="flex-1 py-4 text-sm" icon={HiOutlineChevronRight}>Ke Dashboard</Button>
        </div>

        {result.answers && result.answers.length > 0 && (
          <div className="pt-8 space-y-4">
            <h2 className="text-xl font-extrabold text-slate-900 mb-6">Pembahasan Soal</h2>
            {result.answers.map((ans, idx) => {
              const isExpanded = expandedQ === ans.id;
              const q = ans.question;
              if (!q) return null;

              return (
                <Card key={ans.id} className="overflow-hidden border border-slate-100">
                  <div 
                    className="p-6 cursor-pointer hover:bg-slate-50 transition-colors flex gap-4"
                    onClick={() => setExpandedQ(isExpanded ? null : ans.id)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant={ans.isCorrect ? "success" : (ans.selectedOptionId ? "danger" : "warning")}>
                          {ans.isCorrect ? "Benar" : (ans.selectedOptionId ? "Salah" : "Kosong")}
                        </Badge>
                        <span className="text-xs font-bold text-slate-400">Soal {idx + 1}</span>
                      </div>
                      <p className="text-slate-800 font-medium whitespace-pre-wrap">{q.question}</p>
                    </div>
                    <div className="text-slate-400 shrink-0">
                      {isExpanded ? <HiOutlineChevronUp size={20} /> : <HiOutlineChevronDown size={20} />}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="p-6 pt-0 border-t border-slate-100 bg-slate-50/50 space-y-6">
                      <div className="space-y-3 mt-6">
                        {q.options.map((opt, i) => {
                          const isSelected = String(opt.id) === String(ans.selectedOptionId);
                          const isCorrect = opt.isCorrect;
                          
                          let bgClass = "bg-white border-slate-200 text-slate-600";
                          if (isCorrect) bgClass = "bg-emerald-50 border-emerald-200 text-emerald-800 font-bold shadow-sm shadow-emerald-100";
                          else if (isSelected && !isCorrect) bgClass = "bg-red-50 border-red-200 text-red-700 font-bold shadow-sm shadow-red-100";

                          return (
                            <div key={opt.id} className={`p-4 rounded-xl border-2 text-sm flex gap-3 transition-all ${bgClass}`}>
                              <span className="opacity-50 shrink-0">{String.fromCharCode(65+i)}.</span>
                              <span className="flex-1">{opt.optionText}</span>
                              {isCorrect && <HiOutlineCheckCircle className="text-emerald-500 shrink-0" size={20} />}
                              {isSelected && !isCorrect && <HiOutlineXCircle className="text-red-500 shrink-0" size={20} />}
                            </div>
                          );
                        })}
                      </div>

                      {q.explanation && (
                        <div className="p-5 bg-[#011F7B]/5 rounded-xl border border-[#011F7B]/10">
                          <h4 className="text-xs font-extrabold text-[#011F7B] uppercase tracking-widest mb-2">Penjelasan:</h4>
                          <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{q.explanation}</p>
                        </div>
                      )}
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
