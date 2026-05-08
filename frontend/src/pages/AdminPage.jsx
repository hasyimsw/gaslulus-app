import { useEffect, useState } from 'react';
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../lib/api';
import { useAuthStore } from '../stores/authStore';
import Swal from 'sweetalert2';
import { 
  HiOutlineChartBar, 
  HiOutlineBookOpen, 
  HiOutlineUsers, 
  HiOutlinePlus, 
  HiOutlinePencil, 
  HiOutlineTrash,
  HiOutlineSave,
  HiOutlineX,
  HiOutlineLogout
} from 'react-icons/hi';

function AdminStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/stats').then(r => setStats(r.data.data)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-extrabold text-slate-900 mb-6">Ikhtisar Sistem</h2>
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1,2,3].map(i => <div key={i} className="card h-24 bg-slate-50 animate-pulse border-none" />)}
        </div>
      ) : stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Total Pengguna', value: stats.totalUsers, icon: HiOutlineUsers, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Total Paket Ujian', value: stats.totalExams, icon: HiOutlineBookOpen, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Total Hasil Tryout', value: stats.totalResults, icon: HiOutlineChartBar, color: 'text-amber-600', bg: 'bg-amber-50' },
          ].map((s, i) => (
            <div key={i} className="card p-6 flex items-center gap-5 group hover:border-blue-200">
              <div className={`w-14 h-14 rounded-2xl ${s.bg} ${s.color} flex items-center justify-center transition-transform group-hover:scale-110`}>
                <s.icon size={28} />
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900 leading-none mb-1.5">{s.value}</div>
                <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest leading-none">{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AdminExams() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', category: 'CPNS', subCategory: '', totalQuestions: 30, duration: 60, passingScore: 60, isPublished: false });

  useEffect(() => {
    api.get('/exams/admin/all').then(r => setExams(r.data.data)).finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/exams/${editing}`, { ...form, totalQuestions: +form.totalQuestions, duration: +form.duration, passingScore: +form.passingScore });
        Swal.fire('Berhasil!', 'Paket ujian telah diperbarui.', 'success');
      } else {
        await api.post('/exams', { ...form, totalQuestions: +form.totalQuestions, duration: +form.duration, passingScore: +form.passingScore });
        Swal.fire('Berhasil!', 'Paket ujian baru telah ditambahkan.', 'success');
      }
      const res = await api.get('/exams/admin/all');
      setExams(res.data.data);
      setShowForm(false);
      setEditing(null);
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || 'Gagal menyimpan', 'error');
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Hapus Paket?',
      text: "Data yang dihapus tidak dapat dikembalikan!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Ya, Hapus'
    });
    if (result.isConfirmed) {
      try {
        await api.delete(`/exams/${id}`);
        setExams(exams.filter(e => e.id !== id));
        Swal.fire('Terhapus!', 'Paket ujian telah dihapus.', 'success');
      } catch {
        Swal.fire('Error', 'Gagal menghapus paket', 'error');
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl font-extrabold text-slate-900">Manajemen Paket Ujian</h2>
        <button 
          onClick={() => { setEditing(null); setShowForm(true); }} 
          className="btn btn-primary px-6 py-2.5 text-sm font-black shadow-lg shadow-blue-100"
        >
          <HiOutlinePlus className="mr-1" /> Tambah Paket
        </button>
      </div>

      {showForm && (
        <div className="card p-8 lg:p-10 border-2 border-blue-50 shadow-xl shadow-blue-50/50">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2">Judul Ujian</label>
              <input 
                className="input-field" 
                value={form.title} 
                onChange={e => setForm({...form, title: e.target.value})} 
                required 
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2">Kategori</label>
              <select className="input-field" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                {['SD', 'SMP', 'SMA', 'CPNS'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2">Durasi (Menit)</label>
              <input type="number" className="input-field" value={form.duration} onChange={e => setForm({...form, duration: e.target.value})} required />
            </div>
            <div className="md:col-span-2 flex gap-3 pt-4 border-t border-slate-50 mt-2">
              <button type="submit" className="btn btn-primary px-8 py-3 text-sm font-black shadow-lg shadow-blue-100">
                <HiOutlineSave className="mr-2" /> Simpan Perubahan
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="btn btn-outline px-8 py-3 text-sm font-black border-2">
                <HiOutlineX className="mr-2" /> Batal
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="flex flex-col gap-4">
        {exams.map(exam => (
          <div key={exam.id} className="card p-5 flex flex-col sm:flex-row items-center justify-between group gap-6">
            <div className="text-center sm:text-left">
              <div className="font-extrabold text-lg text-slate-900 mb-1.5 group-hover:text-blue-600 transition-colors">{exam.title}</div>
              <div className="text-xs font-bold text-slate-400 flex items-center gap-2 justify-center sm:justify-start">
                <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md text-[10px] uppercase tracking-widest">{exam.category}</span>
                <span className="opacity-30">•</span>
                <span>{exam.totalQuestions} Soal</span>
                <span className="opacity-30">•</span>
                <span>{exam.duration} Menit</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => { setForm(exam); setEditing(exam.id); setShowForm(true); }} 
                className="p-2.5 rounded-xl border-2 border-slate-50 text-slate-300 hover:border-blue-100 hover:bg-blue-50 hover:text-blue-500 transition-all"
              >
                <HiOutlinePencil size={20} />
              </button>
              <button 
                onClick={() => handleDelete(exam.id)} 
                className="p-2.5 rounded-xl border-2 border-slate-50 text-slate-300 hover:border-red-100 hover:bg-red-50 hover:text-red-500 transition-all"
              >
                <HiOutlineTrash size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-10">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">Panel Administrator</h1>
        <p className="text-slate-500 font-medium leading-relaxed">Kelola statistik sistem dan konfigurasi paket ujian secara real-time.</p>
      </div>

      <div className="flex flex-wrap gap-3 p-1.5 bg-slate-100 rounded-2xl w-fit">
        <NavLink 
          to="/admin" 
          end 
          className={({isActive}) => `
            flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-black tracking-wide transition-all
            ${isActive ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}
          `}
        >
          <HiOutlineChartBar size={18} /> Statistik
        </NavLink>
        <NavLink 
          to="/admin/exams" 
          className={({isActive}) => `
            flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-black tracking-wide transition-all
            ${isActive ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}
          `}
        >
          <HiOutlineBookOpen size={18} /> Manajemen Paket
        </NavLink>
      </div>

      <main className="animate-fade">
        <Routes>
          <Route index element={<AdminStats />} />
          <Route path="exams" element={<AdminExams />} />
        </Routes>
      </main>
    </div>
  );
}
