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

export default function AdminQuestions({ type = 'SIMULATION' }) {
  const [exams, setExams] = useState([]);
  const [selectedExamId, setSelectedExamId] = useState('');
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [search, setSearch] = useState('');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  
  const CATEGORIES = ["Semua", "SD", "SMP", "SMA", "CPNS"];
  const defaultOptions = [
    { optionText: '', isCorrect: true },
    { optionText: '', isCorrect: false },
    { optionText: '', isCorrect: false },
    { optionText: '', isCorrect: false },
    { optionText: '', isCorrect: false }
  ];

  const [form, setForm] = useState({
    examId: '',
    question: '',
    explanation: '',
    difficulty: 'MEDIUM',
    subject: '',
    options: [...defaultOptions]
  });

  useEffect(() => {
    api.get('/exams/admin/all').then(r => setExams(r.data.data));
  }, []);

  useEffect(() => {
    setSelectedExamId('');
    setQuestions([]);
    setShowForm(false);
  }, [type]);

  useEffect(() => {
    if (selectedExamId) {
      setLoading(true);
      api.get(`/questions?examId=${selectedExamId}`)
        .then(r => setQuestions(r.data.data))
        .finally(() => setLoading(false));
    } else {
      setQuestions([]);
    }
  }, [selectedExamId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, examId: parseInt(selectedExamId, 10) };
      if (editing) {
        await api.put(`/questions/${editing}`, payload);
        Swal.fire('Berhasil!', 'Soal telah diperbarui.', 'success');
      } else {
        await api.post('/questions', payload);
        Swal.fire('Berhasil!', 'Soal baru telah ditambahkan.', 'success');
      }
      const res = await api.get(`/questions?examId=${selectedExamId}`);
      setQuestions(res.data.data);
      setShowForm(false);
      setEditing(null);
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || 'Gagal menyimpan', 'error');
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Hapus Soal?',
      text: "Data yang dihapus tidak dapat dikembalikan!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Ya, Hapus'
    });
    if (result.isConfirmed) {
      try {
        await api.delete(`/questions/${id}`);
        setQuestions(questions.filter(q => q.id !== id));
        Swal.fire('Terhapus!', 'Soal telah dihapus.', 'success');
      } catch {
        Swal.fire('Error', 'Gagal menghapus soal', 'error');
      }
    }
  };

  const handleOptionChange = (index, field, value) => {
    const newOptions = [...form.options];
    if (field === 'isCorrect') {
      newOptions.forEach(o => o.isCorrect = false);
      newOptions[index].isCorrect = true;
    } else {
      newOptions[index][field] = value;
    }
    setForm({ ...form, options: newOptions });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl font-extrabold text-slate-900">Manajemen Soal {type === 'SIMULATION' ? 'Simulasi' : 'Latihan'}</h2>
        {selectedExamId && (
          <Button onClick={() => { 
            setEditing(null); 
            setForm({ examId: selectedExamId, question: '', explanation: '', difficulty: 'MEDIUM', subject: '', options: [...defaultOptions.map(o => ({...o}))] });
            setShowForm(true); 
          }} icon={HiOutlinePlus}>
            Tambah Soal
          </Button>
        )}
      </div>

      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); setSelectedExamId(''); setQuestions([]); }}
              className={`px-5 py-2 rounded-full text-[10px] font-semibold shadow-sm mb-1 shadow-[#011F7B]/10 uppercase tracking-widest transition-all border ${
                activeCategory === cat ? 'bg-[#011F7B] text-white border-[#011F7B] shadow-md shadow-[#011F7B]/20' : 'bg-white text-slate-400 border-slate-100 hover:border-blue-100 hover:text-[#011F7B]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="relative w-full xl:max-w-xs">
          <Input icon={<HiOutlineSearch />} placeholder="Cari soal..." value={search} onChange={e => setSearch(e.target.value)} className="py-2 text-sm shadow-md shadow-[#011F7B]/10 bg-white" />
        </div>
      </div>

      <Card className="p-6 border-2 border-slate-50">
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Pilih Paket Ujian</label>
        <select className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-slate-900 text-sm font-medium focus:border-[#011F7B] focus:ring-2 focus:ring-[#011F7B]/5 outline-none" value={selectedExamId} onChange={e => { setSelectedExamId(e.target.value); setShowForm(false); }}>
          <option value="">-- Pilih Paket {type === 'SIMULATION' ? 'Simulasi' : 'Latihan'} --</option>
          {exams.filter(exam => exam.type === type && (activeCategory === 'Semua' || exam.category === activeCategory)).map(exam => (
            <option key={exam.id} value={exam.id}>{exam.title} - {exam.category}</option>
          ))}
        </select>
      </Card>

      {showForm && (
        <Card className="p-8 lg:p-10 border-2 border-[#011F7B]/5 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Pertanyaan</label>
              <textarea className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-slate-900 text-sm font-medium focus:border-[#011F7B] focus:ring-2 focus:ring-[#011F7B]/5 outline-none min-h-[100px]" value={form.question} onChange={e => setForm({...form, question: e.target.value})} required />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Penjelasan (Opsional)</label>
              <textarea className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-slate-900 text-sm font-medium focus:border-[#011F7B] focus:ring-2 focus:ring-[#011F7B]/5 outline-none min-h-[80px]" value={form.explanation} onChange={e => setForm({...form, explanation: e.target.value})} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Kesulitan</label>
                <select className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-slate-900 text-sm font-medium focus:border-[#011F7B] focus:ring-2 focus:ring-[#011F7B]/5 outline-none" value={form.difficulty} onChange={e => setForm({...form, difficulty: e.target.value})}>
                  {['EASY', 'MEDIUM', 'HARD'].map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <Input label="Mata Pelajaran" placeholder="Contoh: Matematika" value={form.subject || ''} onChange={e => setForm({...form, subject: e.target.value})} required={type === 'PRACTICE'} />
            </div>
            
            <div className="space-y-4 pt-4 border-t border-slate-50">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Pilihan Jawaban</label>
              {form.options.map((opt, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <input type="radio" checked={opt.isCorrect} onChange={() => handleOptionChange(i, 'isCorrect', true)} className="mt-4 w-5 h-5 text-[#011F7B]" />
                  <textarea className={`flex-1 w-full px-4 py-3 border-2 rounded-xl text-sm font-medium focus:ring-2 outline-none transition-all min-h-[60px] ${opt.isCorrect ? 'border-emerald-500 bg-emerald-50 focus:ring-emerald-100' : 'border-slate-200 bg-white focus:ring-blue-100'}`} placeholder={`Opsi ${String.fromCharCode(65+i)}`} value={opt.optionText} onChange={e => handleOptionChange(i, 'optionText', e.target.value)} required />
                </div>
              ))}
            </div>

            <div className="flex gap-3 pt-4 border-t border-slate-50">
              <Button type="submit" icon={HiOutlineSave}>Simpan</Button>
              <Button variant="outline" onClick={() => setShowForm(false)} icon={HiOutlineX}>Batal</Button>
            </div>
          </form>
        </Card>
      )}

      {selectedExamId && !loading && !showForm && (
        <div className="space-y-4">
          <h3 className="font-bold text-slate-700">Daftar Soal ({questions.length})</h3>
          {questions.map((q, idx) => (
            <Card key={q.id} className="p-5 flex flex-col gap-4">
              <div className="flex justify-between gap-4">
                <div className="flex-1">
                  <div className="text-xs font-bold text-slate-400 mb-1">Soal {idx + 1} • <span className="text-[#011F7B] uppercase tracking-widest">{q.difficulty}</span></div>
                  <div className="text-slate-800 whitespace-pre-wrap font-medium">{q.question}</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { setForm({...q}); setEditing(q.id); setShowForm(true); }} className="p-2 h-fit cursor-pointer rounded-xl border-2 border-[#011F7B]/10 text-[#011F7B]/60 hover:text-[#011F7B] transition-all"><HiOutlinePencil size={18} /></button>
                  <button onClick={() => handleDelete(q.id)} className="p-2 h-fit cursor-pointer rounded-xl border-2 border-red-50 text-red-300 hover:text-red-500 transition-all"><HiOutlineTrash size={18} /></button>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {q.options.map((opt, i) => (
                  <div key={opt.id} className={`p-3 rounded-xl text-sm border ${opt.isCorrect ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-bold' : 'bg-slate-50 border-transparent text-slate-500'}`}>
                    <span className="opacity-50 mr-2">{String.fromCharCode(65+i)}.</span> {opt.optionText}
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
