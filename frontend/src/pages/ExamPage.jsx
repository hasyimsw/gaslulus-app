import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../lib/api";
import Swal from "sweetalert2";
import {
  HiOutlineClock,
  HiOutlineBookmark,
  HiChevronLeft,
  HiChevronRight,
  HiOutlineExclamationCircle,
  HiOutlineXCircle,
} from "react-icons/hi";
import { FaBookmark } from "react-icons/fa";

export default function ExamPage() {
  const { id, category, subject } = useParams();
  const isPractice = !!subject;
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [bookmarks, setBookmarks] = useState(new Set());
  const [currentQ, setCurrentQ] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const startTime = useRef(Date.now());

  useEffect(() => {
    const fetchQuestions = isPractice
      ? api.get(`/questions/practice/${category}/${subject}`)
      : api.get(`/exams/${id}/questions`);

    Promise.all([fetchQuestions, api.get("/bookmarks")])
      .then(([resQ, resB]) => {
        const examData = resQ.data.exam || {
          title: `Latihan ${subject}`,
          duration:
            subject === "Matematika"
              ? category === "SD"
                ? 40
                : category === "SMP" || category === "SMA"
                  ? 60
                  : 30
              : 30,
        };
        setQuestions(resQ.data.data);
        setExam(examData);

        // Load persistence data
        const sessionKey = isPractice
          ? `practice_session_${category}_${subject}`
          : `exam_session_${id}`;
        const savedData = localStorage.getItem(sessionKey);

        if (savedData) {
          const { answers: savedAnswers, timeLeft: savedTime } =
            JSON.parse(savedData);
          setAnswers(savedAnswers);
          setTimeLeft(savedTime);
        } else {
          setTimeLeft(examData.duration * 60);
        }

        const bSet = new Set(resB.data.data.map((b) => b.questionId));
        setBookmarks(bSet);
      })
      .catch(() => {
        navigate("/tryout");
      })
      .finally(() => setLoading(false));
  }, [id, category, subject, isPractice, navigate]);

  // Persistence Effect
  useEffect(() => {
    if (!loading && exam) {
      const sessionKey = isPractice
        ? `practice_session_${category}_${subject}`
        : `exam_session_${id}`;
      localStorage.setItem(
        sessionKey,
        JSON.stringify({ answers, timeLeft }),
      );
    }
  }, [answers, timeLeft, id, category, subject, isPractice, loading, exam]);

  useEffect(() => {
    if (!exam) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer);
          handleSubmit(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [exam]);

  useEffect(() => {
    const handleViolation = () => {
      Swal.fire({
        title:
          '<span class="text-xl font-black text-red-600">Peringatan Anti-Cheat!</span>',
        html: '<p class="text-slate-500 font-medium leading-relaxed">Dilarang meninggalkan halaman ujian! Aktivitas mencurigakan telah dicatat oleh sistem.</p>',
        icon: "error",
        confirmButtonText: "Saya Mengerti & Kembali",
        confirmButtonColor: "#011F7B",
        allowOutsideClick: false,
        padding: "3rem",
        customClass: {
          popup: "rounded-[40px] shadow-2xl border-none",
          confirmButton:
            "rounded-2xl px-8 py-4 font-black uppercase tracking-widest text-xs",
        },
      });
    };

    const handleVisibility = () => {
      if (document.hidden) handleViolation();
    };
    const handleBlur = () => {
      if (exam) handleVisibility();
    };
    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("blur", handleBlur);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("blur", handleBlur);
    };
  }, [exam]);

  const handleSubmit = useCallback(
    async (auto = false) => {
      if (submitting) return;
      if (!auto) {
        const result = await Swal.fire({
          title:
            '<span class="text-2xl font-black text-slate-800">Akhiri Ujian?</span>',
          html: '<p class="text-slate-500 font-medium">Pastikan semua soal telah terjawab dengan benar sebelum mengirim.</p>',
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#011F7B",
          cancelButtonColor: "#f1f5f9",
          confirmButtonText: "Ya, Akhiri",
          cancelButtonText: '<span class="text-slate-500">Batal</span>',
          padding: "3rem",
          customClass: {
            popup: "rounded-[40px] shadow-2xl border-none",
            confirmButton:
              "rounded-2xl px-8 py-4 font-black uppercase tracking-widest text-xs",
            cancelButton:
              "rounded-2xl px-8 py-4 font-black uppercase tracking-widest text-xs",
          },
        });
        if (!result.isConfirmed) return;
      }

      setSubmitting(true);
      const durationUsed = Math.floor((Date.now() - startTime.current) / 1000);
      const answersList = questions.map((q) => ({
        questionId: q.id,
        selectedOptionId: answers[q.id] || null,
      }));

      try {
        const endpoint = isPractice
          ? "/exams/practice/submit"
          : `/exams/${id}/submit`;
        const payload = {
          answers: answersList,
          durationUsed,
        };

        if (isPractice) {
          payload.category = category;
          payload.subject = subject;
        }

        const res = await api.post(endpoint, payload);
        await Swal.fire({
          title:
            '<span class="text-2xl font-black text-slate-800">Berhasil Terkirim!</span>',
          html: '<p className="text-slate-500 font-medium">Hasil ujian Anda telah berhasil diproses oleh sistem.</p>',
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
          padding: "3rem",
          background: "#ffffff",
          customClass: {
            popup: "rounded-[40px] shadow-2xl border-none",
            title: "pt-4",
          },
          showClass: {
            popup: "animate__animated animate__fadeInUp animate__faster",
          },
          hideClass: {
            popup: "animate__animated animate__fadeOutDown animate__faster",
          },
        });
        const sessionKey = isPractice
          ? `practice_session_${category}_${subject}`
          : `exam_session_${id}`;
        localStorage.removeItem(sessionKey);
        navigate(`/result/${res.data.data.resultId}`);
      } catch {
        Swal.fire({
          title: "Terjadi Kesalahan",
          text: "Gagal mengirimkan jawaban, silakan coba lagi.",
          icon: "error",
          confirmButtonColor: "#011F7B",
          customClass: { popup: "rounded-[32px]" },
        });
        setSubmitting(false);
      }
    },
    [questions, answers, id, submitting, navigate],
  );

  const formatTime = (secs) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const toggleBookmark = async (qId) => {
    try {
      if (bookmarks.has(qId)) {
        await api.delete(`/bookmarks/${qId}`);
        setBookmarks((prev) => {
          const next = new Set(prev);
          next.delete(qId);
          return next;
        });
      } else {
        await api.post("/bookmarks", { questionId: qId });
        setBookmarks((prev) => {
          const next = new Set(prev);
          next.add(qId);
          return next;
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#f8fafc]">
        <div className="w-12 h-12 border-4 border-[#011F7B]/10 border-t-blue-600 rounded-full animate-spin" />
        <p className="text-sm font-bold text-slate-400">
          Menyiapkan Lembar Ujian...
        </p>
      </div>
    );

  const q = questions[currentQ];

  return (
    <div className="bg-[#f8fafc] min-h-screen flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 px-10 py-5 flex items-center justify-between sticky top-0 z-[100]">
        <div className="flex items-center gap-6">
          <img src="/logo.webp" alt="GasLulus Logo" className="h-8" />
          <div className="h-8 w-px bg-slate-300 hidden md:block" />
          <div className="hidden md:block">
            <div className="font-semibold text-slate-500 text-sm">
              {isPractice ? (
                <div className="flex items-center gap-2">
                  <span className="bg-[#011F7B] text-white px-2 py-0.5 rounded text-[10px] uppercase font-bold">
                    PRACTICE
                  </span>
                  <span>
                    {category} - {subject}
                  </span>
                </div>
              ) : (
                exam?.title || "Simulasi CAT CPNS 2024"
              )}
            </div>
          </div>
        </div>

        <div className="bg-[#011F7B]/10 text-[#011F7B] px-6 py-2.5 rounded-xl flex items-center gap-3 border border-[#011F7B]/10">
          <HiOutlineClock size={20} />
          <span className="font-black text-sm tracking-tight tabular-nums">
            {formatTime(timeLeft)}
          </span>
        </div>
      </header>

      <main className="flex-1 max-w-[1400px] mx-auto w-full p-8 flex flex-col lg:flex-row gap-8">
        {/* Question Area */}
        <div className="flex-1 space-y-8">
          <div className="bg-white rounded-xl p-10 shadow-sm border border-slate-50 relative">
            <div className="flex justify-between items-center mb-8">
              <div className="bg-[#011F7B]/5 text-[#011F7B] px-5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest">
                SOAL NO. {currentQ + 1}
              </div>
              <button
                onClick={() => toggleBookmark(q.id)}
                className={`flex items-center gap-2 transition-colors text-xs font-bold cursor-pointer ${bookmarks.has(q.id) ? "text-amber-500" : "text-slate-400 hover:text-[#011F7B]"}`}
              >
                {bookmarks.has(q.id) ? (
                  <FaBookmark size={18} />
                ) : (
                  <HiOutlineBookmark size={18} />
                )}
                {bookmarks.has(q.id) ? "Tersimpan" : "Bookmark"}
              </button>
            </div>

            <div className="mb-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQ}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <p className="text-lg font-semibold text-slate-700 leading-relaxed">
                    {q?.question}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="space-y-4">
              {q?.options.map((opt, i) => (
                <button
                  key={opt.id}
                  onClick={() => setAnswers({ ...answers, [q.id]: opt.id })}
                  className={`
                    w-full p-4 rounded-xl border-2 text-left transition-all flex items-center gap-6
                    ${
                      answers[q.id] === opt.id
                        ? "bg-[#011F7B]/5/50 border-2 border-[#011F7B]/40"
                        : "bg-white border-slate-200 hover:border-[#011F7B]/40"
                    }
                  `}
                >
                  <div
                    className={`
                    w-8 h-8 rounded-xl flex items-center justify-center font-semibold text-xs shrink-0 transition-all
                    ${answers[q.id] === opt.id ? "bg-[#011F7B] text-white shadow-sm shadow-[#011F7B]/20" : "bg-white border-2 border-slate-200 text-slate-400"}
                  `}
                  >
                    {String.fromCharCode(65 + i)}
                  </div>
                  <span
                    className={`text-sm font-semibold leading-relaxed ${answers[q.id] === opt.id ? "text-slate-900" : "text-slate-500"}`}
                  >
                    {opt.optionText}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between">
            <button
              disabled={currentQ === 0}
              onClick={() => setCurrentQ((q) => q - 1)}
              className="bg-white border border-[#011F7B]/40/70 px-6 py-3 rounded-xl text-sm font-semibold text-slate-500 flex items-center gap-2 hover:bg-[#011F7B]/5 hover:text-[#011F7B] cursor-pointer disabled:opacity-30 transition-all"
            >
              <HiChevronLeft size={20} /> Sebelumnya
            </button>

            <button
              onClick={() =>
                currentQ === questions.length - 1
                  ? handleSubmit()
                  : setCurrentQ((q) => q + 1)
              }
              className="bg-[#011F7B] text-white px-6 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-[#011a6b] shadow-sm shadow-[#011F7B]/10 transition-all ml-auto cursor-pointer"
            >
              {currentQ === questions.length - 1 ? (
                "Selesai Ujian"
              ) : (
                <>
                  Selanjutnya <HiChevronRight size={20} />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="w-full lg:w-[380px] shrink-0">
          <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-50 flex flex-col h-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-slate-800">
                Navigasi Soal
              </h3>
              <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">
                Terjawab: {Object.keys(answers).length}/{questions.length}
              </div>
            </div>

            {/* Legend */}
            <div className="flex justify-between gap-2 mb-8">
              <div className="flex-1 bg-[#011F7B]/5 p-4 rounded-xl flex flex-col items-center gap-2">
                <div className="w-4 h-4 rounded bg-emerald-500" />
                <span className="text-[8px] font-semibold text-slate-500 uppercase tracking-widest">
                  Terjawab
                </span>
              </div>
              <div className="flex-1 bg-[#011F7B]/5 p-4 rounded-xl flex flex-col items-center gap-2">
                <div className="w-4 h-4 rounded bg-amber-500" />
                <span className="text-[8px] font-semibold text-slate-500 uppercase tracking-widest">
                  Bookmark
                </span>
              </div>
              <div className="flex-1 bg-[#011F7B]/5 p-4 rounded-xl flex flex-col items-center gap-2">
                <div className="w-4 h-4 rounded bg-slate-300" />
                <span className="text-[8px] font-semibold text-slate-500 uppercase tracking-widest">
                  Kosong
                </span>
              </div>
            </div>

            {/* Grid */}
            <div className="flex-1">
              <div className="grid grid-cols-5 gap-3">
                {questions.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentQ(i)}
                    className={`
                      w-full aspect-square rounded-xl font-semibold text-xs transition-all border-2
                      ${
                        i === currentQ
                          ? "border-[#011F7B] text-[#011F7B] ring-4 ring-[#011F7B]/5"
                          : bookmarks.has(item.id)
                            ? "bg-amber-500 border-amber-500 text-white"
                            : answers[item.id]
                              ? "bg-emerald-500 border-emerald-500 text-white"
                              : "bg-slate-100 border-transparent text-slate-400 hover:border-slate-200"
                      }
                    `}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={() => handleSubmit()}
              className="mt-12 w-full bg-red-50 text-red-500 py-4 rounded-xl font-semibold text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-red-100 hover:text-red-600 transition-all border border-red-100 cursor-pointer"
            >
              <HiOutlineXCircle size={20} />
              Akhiri Ujian
            </button>
          </div>
        </aside>
      </main>
    </div>
  );
}
