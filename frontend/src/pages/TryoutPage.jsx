import { useEffect, useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../lib/api";
import {
  HiOutlineSearch,
  HiOutlineClock,
  HiOutlineBookOpen,
  HiOutlineChevronRight,
  HiCheck,
  HiArrowNarrowRight,
} from "react-icons/hi";
import Swal from "sweetalert2";

const CATEGORIES = ["Semua", "SD", "SMP", "SMA", "CPNS"];

export default function TryoutPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(
    searchParams.get("category") || "Semua",
  );
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const params =
      activeCategory !== "Semua" ? `?category=${activeCategory}` : "";
    setLoading(true);
    api
      .get(`/exams${params}`)
      .then((r) => {
        const order = { SD: 1, SMP: 2, SMA: 3, CPNS: 4 };
        const sorted = r.data.data.sort(
          (a, b) => (order[a.category] || 99) - (order[b.category] || 99),
        );
        setExams(sorted);
        setCurrentPage(1);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [activeCategory]);

  const handleStartExam = (examId) => {
    Swal.fire({
      title: "Mulai Ujian?",
      text: "Anda akan memulai sesi ujian ini. Pastikan koneksi stabil!",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Ya, Mulai Sekarang!",
      cancelButtonText: "Batal",
      customClass: {
        popup: "rounded-[24px]",
        confirmButton: "rounded-xl text-xs uppercase tracking-widest px-6 py-3",
        cancelButton: "rounded-xl text-xs uppercase tracking-widest px-6 py-3",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        navigate(`/exam/${examId}`);
      }
    });
  };

  const filtered = exams.filter((e) =>
    e.title.toLowerCase().includes(search.toLowerCase()),
  );
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const currentData = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <div className="space-y-12 pb-24">
      {/* Title Row */}
      <div className="space-y-1">
        <h1 className="text-3xl text-slate-900 tracking-tight">
          Daftar <span className="text-[#F59E0B]">Tryout.</span>
        </h1>
        <p className="text-slate-500 font-medium">
          Pilih paket ujian terpercaya untuk mengasah kemampuanmu.
        </p>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
        {/* Categories */}
        <div className="flex gap-3 overflow-x-auto scrollbar-hide">
          {CATEGORIES.map((cat) => {
            const active = activeCategory === cat;

            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`
            relative flex items-center text-xs cursor-pointer justify-center px-5 py-2 rounded-full font-medium whitespace-nowrap transition-all duration-200 border
            ${
              active
                ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-100"
                : "bg-white text-slate-600 border-slate-200 hover:border-blue-200 hover:text-blue-600 hover:bg-blue-50/40"
            }
          `}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative w-full xl:max-w-sm group">
          <HiOutlineSearch
            size={19}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"
          />

          <input
            type="text"
            placeholder="Cari paket tryout..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full h-12 rounded-full border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-700 placeholder:text-slate-400 outline-none transition-all duration-200 shadow-md shadow-blue-200/40 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <div className="w-10 h-10 border-2 border-blue-50 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-[10px] text-slate-300 tracking-widest uppercase">
            Memuat...
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentData.map((exam, i) => (
              <motion.div
                key={exam.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="card group relative flex flex-col p-8 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-600/10 hover:border-blue-500"
              >
                <div className="flex justify-between items-start mb-6">
                  <div
                    className={`
                    px-3 py-1 rounded-full text-[9px] uppercase tracking-[0.2em] font-semibold
                    ${
                      exam.category === "CPNS"
                        ? "bg-red-50 text-red-600"
                        : exam.category === "SMA"
                          ? "bg-amber-50 text-amber-600"
                          : exam.category === "SMP"
                            ? "bg-blue-50 text-blue-600"
                            : "bg-emerald-50 text-emerald-600"
                    }
                  `}
                  >
                    {exam.category}
                  </div>
                  <HiOutlineBookOpen
                    className="text-slate-300 group-hover:text-blue-300 transition-colors"
                    size={24}
                  />
                </div>

                <div className="flex-1 space-y-4">
                  <h3 className="text-xl text-slate-900 leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">
                    {exam.title}
                  </h3>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed line-clamp-2">
                    {exam.description ||
                      "Latih kemampuanmu dengan paket ujian terstandar untuk mencapai hasil maksimal."}
                  </p>
                </div>

                <div className="mt-8 flex items-center gap-6 py-4 border-t border-slate-50">
                  <div className="flex items-center gap-2">
                    <HiOutlineBookOpen className="text-blue-500" size={16} />
                    <span className="text-[10px] text-slate-600 uppercase tracking-widest">
                      {exam.totalQuestions} Soal
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <HiOutlineClock className="text-blue-500" size={16} />
                    <span className="text-[10px] text-slate-600 uppercase tracking-widest">
                      {exam.duration} Menit
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleStartExam(exam.id)}
                  className="mt-6 w-full bg-blue-600 text-white py-3 cursor-pointer rounded-xl text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-blue-100 transition-all hover:bg-blue-700 hover:shadow-blue-200 active:scale-[0.98] flex items-center justify-center gap-2 group-hover:gap-3"
                >
                  Mulai Ujian{" "}
                  <HiOutlineChevronRight className="transition-transform" />
                </button>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-16">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`
                    w-12 h-12 rounded-2xl text-[10px] transition-all
                    ${
                      currentPage === i + 1
                        ? "bg-blue-600 text-white shadow-xl shadow-blue-100"
                        : "bg-white text-slate-400 border border-slate-50 hover:border-blue-200 hover:text-blue-600 shadow-sm"
                    }
                  `}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {!loading && filtered.length === 0 && (
        <div className="text-center py-32 flex flex-col items-center">
          <div className="text-6xl mb-6 grayscale opacity-20">🔎</div>
          <h3 className="text-xl text-slate-900 mb-2">Tidak ditemukan</h3>
          <p className="text-slate-500 font-medium">
            Coba gunakan kata kunci pencarian yang lain.
          </p>
        </div>
      )}
    </div>
  );
}
