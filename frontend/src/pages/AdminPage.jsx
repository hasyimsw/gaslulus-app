import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../stores/authStore';
import { 
  HiOutlineChartBar, 
  HiOutlineBookOpen, 
  HiOutlineLogout,
  HiOutlineDocumentText,
} from 'react-icons/hi';

// Modular Components
import AdminStats from '../components/admin/AdminStats';
import AdminExams from '../components/admin/AdminExams';
import AdminQuestions from '../components/admin/AdminQuestions';

export default function AdminPage() {
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { to: "/admin", label: "Statistik", icon: HiOutlineChartBar, end: true },
    { type: 'divider' },
    { to: "/admin/exams/simulation", label: "Paket Simulasi", icon: HiOutlineBookOpen },
    { to: "/admin/questions/simulation", label: "Soal Simulasi", icon: HiOutlineDocumentText },
    { type: 'divider' },
    { to: "/admin/exams/practice", label: "Paket Latihan", icon: HiOutlineBookOpen },
    { to: "/admin/questions/practice", label: "Soal Latihan", icon: HiOutlineDocumentText },
  ];

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">Panel Administrator</h1>
          <p className="text-slate-500 font-medium leading-relaxed">Kelola statistik sistem dan konfigurasi paket ujian.</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100/80 rounded-2xl w-fit backdrop-blur-sm border border-white/50 shadow-md shadow-[#011F7B]/5">
        {navItems.map((item, idx) => (
          item.type === 'divider' ? (
            <div key={idx} className="h-8 w-px bg-slate-200 my-auto mx-1 hidden sm:block" />
          ) : (
            <NavLink 
              key={item.to}
              to={item.to} 
              end={item.end}
              className={({isActive}) => `
                flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold tracking-wide transition-all
                ${isActive ? 'bg-white text-[#011F7B] shadow-md shadow-[#011F7B]/10' : 'text-slate-400 hover:text-slate-600'}
              `}
            >
              <item.icon size={18} /> {item.label}
            </NavLink>
          )
        ))}
      </div>

      <main className="animate-fade pb-10">
        <Routes>
          <Route index element={<AdminStats />} />
          <Route path="exams/simulation" element={<AdminExams type="SIMULATION" />} />
          <Route path="exams/practice" element={<AdminExams type="PRACTICE" />} />
          <Route path="questions/simulation" element={<AdminQuestions type="SIMULATION" />} />
          <Route path="questions/practice" element={<AdminQuestions type="PRACTICE" />} />
        </Routes>
      </main>
    </div>
  );
}
