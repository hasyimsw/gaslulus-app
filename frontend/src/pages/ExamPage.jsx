import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../lib/api";
import Swal from "sweetalert2";
import {
  HiChevronLeft,
  HiChevronRight,
  HiOutlineXCircle,
} from "react-icons/hi";

// Sub-components
import ExamTimer from "../components/exam/ExamTimer";
import ExamQuestion from "../components/exam/ExamQuestion";
import ExamSidebar from "../components/exam/ExamSidebar";

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
          duration: subject === "Matematika" ? (category === "SD" ? 40 : 60) : 30,
        };
        setQuestions(resQ.data.data);
        setExam(examData);

        const sessionKey = isPractice ? `practice_session_${category}_${subject}` : `exam_session_${id}`;
        const savedData = localStorage.getItem(sessionKey);

        if (savedData) {
          const { answers: savedAnswers, timeLeft: savedTime } = JSON.parse(savedData);
          setAnswers(savedAnswers);
          setTimeLeft(savedTime);
        } else {
          setTimeLeft(examData.duration * 60);
        }

        const bSet = new Set(resB.data.data.map((b) => b.questionId));
        setBookmarks(bSet);
      })
      .catch(() => navigate("/tryout"))
      .finally(() => setLoading(false));
  }, [id, category, subject, isPractice, navigate]);

  // Persistence
  useEffect(() => {
    if (!loading && exam) {
      const sessionKey = isPractice ? `practice_session_${category}_${subject}` : `exam_session_${id}`;
      localStorage.setItem(sessionKey, JSON.stringify({ answers, timeLeft }));
    }
  }, [answers, timeLeft, id, category, subject, isPractice, loading, exam]);

  // Anti-Cheat
  useEffect(() => {
    if (!exam) return;
    const handleViolation = () => {
      Swal.fire({
        title: '<span class="text-xl font-black text-red-600">Peringatan Anti-Cheat!</span>',
        html: '<p class="text-slate-500 font-medium leading-relaxed">Dilarang meninggalkan halaman ujian!</p>',
        icon: "error",
        confirmButtonText: "Saya Mengerti & Kembali",
        confirmButtonColor: "#011F7B",
        allowOutsideClick: false,
        padding: "3rem",
        customClass: { popup: "rounded-[40px] shadow-2xl border-none", confirmButton: "rounded-2xl px-8 py-4 font-black uppercase tracking-widest text-xs" },
      });
    };
    const handleVisibility = () => { if (document.hidden) handleViolation(); };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [exam]);

  const handleSubmit = useCallback(
    async (auto = false) => {
      if (submitting) return;
      if (!auto) {
        const result = await Swal.fire({
          title: '<span class="text-2xl font-black text-slate-800">Akhiri Ujian?</span>',
          html: '<p class="text-slate-500 font-medium">Pastikan semua soal telah terjawab.</p>',
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#011F7B",
          confirmButtonText: "Ya, Akhiri",
          cancelButtonText: '<span class="text-slate-500">Batal</span>',
          padding: "3rem",
          customClass: { popup: "rounded-[40px] shadow-2xl border-none", confirmButton: "rounded-2xl px-8 py-4 font-black uppercase tracking-widest text-xs" },
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
        const endpoint = isPractice ? "/exams/practice/submit" : `/exams/${id}/submit`;
        const payload = { answers: answersList, durationUsed };
        if (isPractice) { payload.category = category; payload.subject = subject; }

        const res = await api.post(endpoint, payload);
        
        await Swal.fire({
          title: '<span class="text-3xl font-black text-[#011F7B]">Luar Biasa! 🚀</span>',
          html: `
            <div class="mt-4 space-y-6">
              <p class="text-slate-500 font-medium text-lg leading-relaxed">
                Perjuanganmu luar biasa! Lembar jawabanmu telah kami terima dan sedang diproses oleh sistem.
              </p>
              <div class="py-8 flex flex-col items-center gap-4">
                <div class="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-3xl flex items-center justify-center shadow-sm border border-emerald-100 animate-pulse">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div class="space-y-1">
                  <p class="text-[10px] font-black text-[#011F7B] uppercase tracking-[0.2em]">Sistem Sedang Menghitung Skor</p>
                  <div class="w-48 h-1 bg-slate-100 rounded-full overflow-hidden mx-auto">
                    <div class="h-full bg-[#011F7B] animate-progress-indefinite"></div>
                  </div>
                </div>
              </div>
              <p class="text-xs text-slate-400 font-semibold italic">"Hasil tidak akan mengkhianati usaha. Tetap semangat!"</p>
            </div>
          `,
          showConfirmButton: false,
          timer: 3500,
          timerProgressBar: true,
          padding: '4rem',
          background: '#ffffff',
          customClass: {
            popup: 'rounded-[60px] border-none shadow-2xl',
            timerProgressBar: 'bg-[#011F7B]/10',
          },
          showClass: {
            popup: 'animate__animated animate__zoomIn animate__faster'
          },
          hideClass: {
            popup: 'animate__animated animate__fadeOutDown animate__faster'
          }
        });

        const sessionKey = isPractice ? `practice_session_${category}_${subject}` : `exam_session_${id}`;
        localStorage.removeItem(sessionKey);
        navigate(`/result/${res.data.data.resultId}`);
      } catch {
        Swal.fire({ title: "Terjadi Kesalahan", text: "Gagal mengirimkan jawaban.", icon: "error" });
        setSubmitting(false);
      }
    },
    [questions, answers, id, category, subject, isPractice, submitting, navigate],
  );

  const toggleBookmark = async (qId) => {
    try {
      if (bookmarks.has(qId)) {
        await api.delete(`/bookmarks/${qId}`);
        setBookmarks((prev) => { const next = new Set(prev); next.delete(qId); return next; });
      } else {
        await api.post("/bookmarks", { questionId: qId });
        setBookmarks((prev) => { const next = new Set(prev); next.add(qId); return next; });
      }
    } catch (err) { console.error(err); }
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#f8fafc]">
      <div className="w-12 h-12 border-4 border-[#011F7B]/10 border-t-blue-600 rounded-full animate-spin" />
      <p className="text-sm font-bold text-slate-400">Menyiapkan Lembar Ujian...</p>
    </div>
  );

  return (
    <div className="bg-[#f8fafc] min-h-screen flex flex-col font-sans">
      <header className="bg-white border-b border-slate-100 px-10 py-5 flex items-center justify-between sticky top-0 z-[100]">
        <div className="flex items-center gap-6">
          <img src="/logo.webp" alt="Logo" className="h-8" />
          <div className="h-8 w-px bg-slate-300 hidden md:block" />
          <div className="hidden md:block text-sm font-semibold text-slate-500">
            {isPractice ? `${category} - ${subject}` : exam?.title}
          </div>
        </div>
        <ExamTimer timeLeft={timeLeft} setTimeLeft={setTimeLeft} onTimeUp={() => handleSubmit(true)} />
      </header>

      <main className="flex-1 max-w-[1400px] mx-auto w-full p-8 flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-8">
          <ExamQuestion 
            question={questions[currentQ]} 
            index={currentQ} 
            selectedOption={answers[questions[currentQ]?.id]} 
            onSelect={(qId, optId) => setAnswers({ ...answers, [qId]: optId })}
            isBookmarked={bookmarks.has(questions[currentQ]?.id)}
            onToggleBookmark={toggleBookmark}
          />
          
          <div className="flex items-center justify-between">
            <button
              disabled={currentQ === 0}
              onClick={() => setCurrentQ((q) => q - 1)}
              className="bg-white border border-slate-200 px-6 py-3 rounded-xl text-sm font-semibold text-slate-500 flex items-center gap-2 hover:bg-slate-50 disabled:opacity-30 transition-all cursor-pointer"
            >
              <HiChevronLeft size={20} /> Sebelumnya
            </button>
            <button
              onClick={() => currentQ === questions.length - 1 ? handleSubmit() : setCurrentQ((q) => q + 1)}
              className="bg-[#011F7B] text-white px-6 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-[#011a6b] transition-all cursor-pointer"
            >
              {currentQ === questions.length - 1 ? "Selesai Ujian" : <>Selanjutnya <HiChevronRight size={20} /></>}
            </button>
          </div>
        </div>

        <ExamSidebar 
          questions={questions} 
          currentQ={currentQ} 
          setCurrentQ={setCurrentQ} 
          answers={answers} 
          bookmarks={bookmarks} 
          onSubmit={() => handleSubmit()} 
        />
      </main>
    </div>
  );
}
