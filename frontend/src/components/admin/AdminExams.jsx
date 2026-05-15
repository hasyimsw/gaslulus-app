import { useEffect, useState } from 'react';
import api from '../../lib/api';
import Swal from 'sweetalert2';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Badge from '../ui/Badge';
import { 
  HiOutlinePlus, 
  HiOutlinePencil, 
  HiOutlineTrash,
  HiOutlineSave,
  HiOutlineX,
  HiOutlineSearch
} from 'react-icons/hi';

export default function AdminExams({ type = 'SIMULATION' }) {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', category: 'CPNS', subCategory: '', totalQuestions: 30, duration: 60, passingScore: 60, type: type, isPublished: false });

  const CATEGORIES = ["Semua", "SD", "SMP", "SMA", "CPNS"];

  useEffect(() => {
    setForm(f => ({ ...f, type }));
  }, [type]);

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = () => {
    api.get('/exams/admin/all').then(r => setExams(r.data.data)).finally(() => setLoading(false));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, totalQuestions: +form.totalQuestions, duration: +form.duration, passingScore: +form.passingScore };
      if (editing) {
        await api.put(`/exams/${editing}`, payload);
        Swal.fire('Berhasil!', 'Paket ujian telah diperbarui.', 'success');
      } else {
        await api.post('/exams', payload);
        Swal.fire('Berhasil!', 'Paket ujian baru telah ditambahkan.', 'success');
      }
      fetchExams();
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
        <h2 className="text-xl font-extrabold text-slate-900">Manajemen Paket {type === 'SIMULATION' ? 'Simulasi' : 'Latihan'}</h2>
        <Button onClick={() => { setEditing(null); setForm({...form, title: '', isPublished: false}); setShowForm(true); }} icon={HiOutlinePlus}>
          Tambah Paket
        </Button>
      </div>

      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-[10px] font-semibold shadow-sm mb-1 shadow-[#011F7B]/10 uppercase tracking-widest transition-all border ${
                activeCategory === cat ? 'bg-[#011F7B] text-white border-[#011F7B] shadow-md shadow-[#011F7B]/20' : 'bg-white text-slate-400 border-slate-100 hover:border-blue-100 hover:text-[#011F7B]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="relative w-full xl:max-w-xs">
          <Input 
            icon={<HiOutlineSearch />} 
            placeholder="Cari paket..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="py-2 text-sm shadow-md shadow-[#011F7B]/10 bg-white"
          />
        </div>
      </div>

      {showForm && (
        <Card className="p-8 lg:p-10 border-2 border-[#011F7B]/5 shadow-xl">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Input label="Judul Ujian" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Kategori</label>
              <select className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-slate-900 text-sm font-medium focus:border-[#011F7B] focus:ring-2 focus:ring-[#011F7B]/5 outline-none" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                {['SD', 'SMP', 'SMA', 'CPNS'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Tipe Ujian</label>
              <select className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-slate-900 text-sm font-medium focus:border-[#011F7B] focus:ring-2 focus:ring-[#011F7B]/5 outline-none" value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
                <option value="SIMULATION">SIMULASI LENGKAP</option>
                <option value="PRACTICE">LATIHAN MAPEL</option>
              </select>
            </div>
            <Input label="Durasi (Menit)" type="number" value={form.duration} onChange={e => setForm({...form, duration: e.target.value})} required />
            <Input label="Total Soal (Target)" type="number" value={form.totalQuestions} onChange={e => setForm({...form, totalQuestions: e.target.value})} required />
            <Input label="Passing Score (%)" type="number" value={form.passingScore} onChange={e => setForm({...form, passingScore: e.target.value})} required />
            
            <div className="md:col-span-2">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input type="checkbox" className="sr-only" checked={form.isPublished} onChange={e => setForm({...form, isPublished: e.target.checked})} />
                  <div className={`w-10 h-5 rounded-full transition-colors ${form.isPublished ? 'bg-[#011F7B]' : 'bg-slate-200'}`}></div>
                  <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${form.isPublished ? 'translate-x-5' : ''}`}></div>
                </div>
                <span className="text-sm font-bold text-slate-700 group-hover:text-[#011F7B] transition-colors">Publikasikan Paket Ujian</span>
              </label>
            </div>

            <div className="md:col-span-2 flex gap-3 pt-4 border-t border-slate-50 mt-2">
              <Button type="submit" icon={HiOutlineSave}>Simpan Perubahan</Button>
              <Button variant="outline" onClick={() => setShowForm(false)} icon={HiOutlineX}>Batal</Button>
            </div>
          </form>
        </Card>
      )}

      <div className="flex flex-col gap-4">
        {exams
          .filter(e => e.type === type)
          .filter(e => activeCategory === 'Semua' || e.category === activeCategory)
          .filter(e => e.title.toLowerCase().includes(search.toLowerCase()))
          .map(exam => (
          <Card key={exam.id} className="p-5 flex flex-col sm:flex-row items-center justify-between group gap-6">
            <div className="text-center sm:text-left">
              <div className="font-extrabold text-lg text-slate-900 mb-1.5 group-hover:text-[#011F7B] transition-colors">{exam.title}</div>
              <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                <Badge variant="primary">{exam.category}</Badge>
                <Badge variant={exam.type === 'SIMULATION' ? 'slate' : 'warning'}>
                  {exam.type === 'SIMULATION' ? 'Simulasi' : 'Latihan'}
                </Badge>
                <span className="text-[10px] font-bold text-[#011F7B] ml-2">{exam._count?.questions || 0} / {exam.totalQuestions} Soal</span>
                <span className="text-[10px] font-bold text-slate-400 ml-2">{exam.duration} Menit</span>
                {exam.isPublished ? <Badge variant="success">Published</Badge> : <Badge variant="danger">Draft</Badge>}
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setForm(exam); setEditing(exam.id); setShowForm(true); }} className="p-2.5 cursor-pointer bg-[#011F7B]/5 rounded-xl border-2 border-[#011F7B]/20 text-[#011F7B] hover:border-blue-100 hover:bg-blue-100 hover:text-[#011F7B] transition-all">
                <HiOutlinePencil size={20} />
              </button>
              <button onClick={() => handleDelete(exam.id)} className="p-2.5 cursor-pointer bg-red-50 rounded-xl border-2 border-red-200 text-red-400 hover:border-red-100 hover:bg-red-100 hover:text-red-500 transition-all">
                <HiOutlineTrash size={20} />
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
