import { useEffect, useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../lib/api";
import Swal from "sweetalert2";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import {
  HiOutlineSearch,
  HiOutlineClock,
  HiOutlineBookOpen,
  HiOutlineChevronRight,
  HiCheck,
} from "react-icons/hi";

const CATEGORIES = ["Semua", "SD", "SMP", "SMA", "CPNS"];

export default function TryoutPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState("SIMULATION");
  const [activeCategory, setActiveCategory] = useState(searchParams.get("category") || "Semua");
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(true);
    if (mode === "SIMULATION") {
      const params = activeCategory !== "Semua" ? `?category=${activeCategory}` : "";
      api.get(`/exams${params}`).then((r) => {
        const order = { SD: 1, SMP: 2, SMA: 3, CPNS: 4 };
        setExams(r.data.data.sort((a, b) => (order[a.category] || 99) - (order[b.category] || 99)));
      }).finally(() => setLoading(false));
    } else {
      api.get(`/exams/subjects/${activeCategory}`).then((res) => setSubjects(res.data.data)).finally(() => setLoading(false));
    }
  }, [activeCategory, mode]);

  const handleStart = (id, type) => {
    Swal.fire({
      title: `Mulai ${type}?`,
      text: "Pastikan koneksi internet Anda stabil.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, Mulai!",
      cancelButtonText: "Batal"
    }).then((result) => {
      if (result.isConfirmed) navigate(`/exam/${id}`);
    });
  };

  const currentData = mode === "SIMULATION" 
    ? exams.filter(e => e.title.toLowerCase().includes(search.toLowerCase()))
    : subjects.filter(s => s.subject.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-12 pb-24">
      <div>
        <h1 className="text-3xl text-slate-900 tracking-tight">Daftar <span className="text-amber-500 font-black">Tryout.</span></h1>
        <p className="text-slate-500 font-medium">Asah kemampuanmu dengan paket ujian terpercaya.</p>
      </div>

      <div className="flex bg-slate-100/80 p-1 rounded-2xl w-fit border border-slate-200/50 shadow-sm">
        {["SIMULATION", "PRACTICE"].map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-8 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer ${mode === m ? "bg-white text-[#011F7B] shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
          >
            {m === "SIMULATION" ? "Simulasi Lengkap" : "Latihan Mapel"}
          </button>
        ))}
      </div>

      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-[10px] font-semibold shadow-sm mb-1 shadow-[#011F7B]/10 uppercase tracking-widest transition-all border ${activeCategory === cat ? "bg-[#011F7B] text-white border-[#011F7B] shadow-lg shadow-[#011F7B]/20" : "bg-white text-slate-500 border-slate-200 hover:border-[#011F7B]/30 hover:text-[#011F7B]"}`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="w-full xl:max-w-sm">
          <Input 
            icon={<HiOutlineSearch />} 
            placeholder={mode === "SIMULATION" ? "Cari paket tryout..." : "Cari mata pelajaran..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-full shadow-md shadow-[#011F7B]/10 bg-white"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <div className="w-10 h-10 border-2 border-slate-200 border-t-[#011F7B] rounded-full animate-spin" />
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Memuat...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentData.map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="p-8 h-full flex flex-col group" hoverable>
                <div className="flex justify-between items-start mb-6">
                  <Badge variant={item.category === 'CPNS' ? 'danger' : item.category === 'SMA' ? 'warning' : item.category === 'SMP' ? 'primary' : 'success'}>
                    {item.category}
                  </Badge>
                  <HiOutlineBookOpen className="text-slate-200 group-hover:text-[#011F7B]/30 transition-colors" size={24} />
                </div>

                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-[#011F7B] transition-colors">
                    {mode === "SIMULATION" ? item.title : item.subject}
                  </h3>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed line-clamp-2">
                    {mode === "SIMULATION" ? (item.description || "Simulasi ujian lengkap terstandar.") : `Latihan soal khusus mata pelajaran ${item.subject}.`}
                  </p>
                </div>

                <div className="mt-8 flex items-center gap-6 py-4 border-t border-slate-50">
                  <div className="flex items-center gap-2">
                    {mode === "SIMULATION" ? <HiOutlineBookOpen className="text-[#011F7B]/40" /> : <HiCheck className="text-emerald-400" />}
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      {(item._count?.questions !== undefined ? item._count.questions : item.totalQuestions) || 0} Soal
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <HiOutlineClock className="text-[#011F7B]/40" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.duration || 30} Menit</span>
                  </div>
                </div>

                <Button className="mt-6 w-full" onClick={() => handleStart(item.id, mode === "SIMULATION" ? "Ujian" : "Latihan")} icon={HiOutlineChevronRight}>
                  {mode === "SIMULATION" ? "Mulai Ujian" : "Mulai Latihan"}
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {!loading && currentData.length === 0 && (
        <div className="text-center py-32 flex flex-col items-center">
          <div className="text-5xl mb-4 opacity-20">🔎</div>
          <h3 className="text-lg font-bold text-slate-900">Tidak ada data ditemukan</h3>
          <p className="text-slate-500 text-sm">Coba sesuaikan kategori atau kata kunci pencarian Anda.</p>
        </div>
      )}
    </div>
  );
}
