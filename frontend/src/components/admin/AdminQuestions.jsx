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
  HiOutlineSearch,
  HiOutlineUpload,
  HiOutlineDocumentDownload
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
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Bulk import states
  const [showImportModal, setShowImportModal] = useState(false);
  const [importFile, setImportFile] = useState(null);
  const [importing, setImporting] = useState(false);
  const [importErrors, setImportErrors] = useState([]);
  
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
    setCurrentPage(1);
  }, [type]);

  useEffect(() => {
    if (selectedExamId) {
      setLoading(true);
      api.get(`/questions?examId=${selectedExamId}`)
        .then(r => {
          setQuestions(r.data.data);
          setCurrentPage(1);
        })
        .finally(() => setLoading(false));
    } else {
      setQuestions([]);
      setCurrentPage(1);
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
  const handleImport = async (e) => {
    e.preventDefault();
    if (!importFile) return;
    setImporting(true);
    setImportErrors([]);

    const formData = new FormData();
    formData.append('file', importFile);

    try {
      const res = await api.post(`/questions/import/${selectedExamId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      Swal.fire('Berhasil!', res.data.message, 'success');
      setShowImportModal(false);
      setImportFile(null);
      
      const refreshRes = await api.get(`/questions?examId=${selectedExamId}`);
      setQuestions(refreshRes.data.data);
    } catch (err) {
      if (err.response?.data?.errors) {
        setImportErrors(err.response.data.errors);
      } else {
        Swal.fire('Error', err.response?.data?.message || 'Gagal mengimpor file', 'error');
      }
    } finally {
      setImporting(false);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentQuestions = questions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(questions.length / itemsPerPage);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl font-extrabold text-slate-900">Manajemen Soal {type === 'SIMULATION' ? 'Simulasi' : 'Latihan'}</h2>
        {selectedExamId && (
          <div className="flex gap-2">
            <Button onClick={() => { setShowImportModal(true); setShowForm(false); }} variant="outline" icon={HiOutlineUpload}>
              Impor Excel
            </Button>
            <Button onClick={() => { 
              setEditing(null); 
              setForm({ examId: selectedExamId, question: '', explanation: '', difficulty: 'MEDIUM', subject: '', options: [...defaultOptions.map(o => ({...o}))] });
              setShowForm(true); 
              setShowImportModal(false);
            }} icon={HiOutlinePlus}>
              Tambah Soal
            </Button>
          </div>
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

      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-white/20">
            <div className="sticky top-0 bg-white/90 backdrop-blur-md px-6 py-4 border-b border-slate-100 flex items-center justify-between z-10">
              <h3 className="text-lg font-extrabold text-slate-900">
                Impor Soal Masal (Excel)
              </h3>
              <button 
                type="button"
                onClick={() => setShowImportModal(false)}
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
              >
                <HiOutlineX size={20} />
              </button>
            </div>
            <form onSubmit={handleImport} className="p-6 space-y-6">
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
                <p className="text-sm text-slate-600 mb-3">Silakan gunakan format Excel yang telah disediakan untuk mencegah kegagalan impor.</p>
                <a href="/Template_Soal_GasLulus.xlsx" download className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-[#011F7B] hover:bg-slate-50 transition-colors">
                  <HiOutlineDocumentDownload size={16} /> Unduh Template Resmi
                </a>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Pilih File Excel (.xlsx)</label>
                <input type="file" accept=".xlsx, .xls, .csv" onChange={e => setImportFile(e.target.files[0])} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#011F7B]/5 file:text-[#011F7B] hover:file:bg-[#011F7B]/10 cursor-pointer" required />
              </div>
              
              {importErrors.length > 0 && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-xl max-h-48 overflow-y-auto">
                  <p className="text-sm font-bold text-red-600 mb-2">Ditemukan {importErrors.length} Kesalahan:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    {importErrors.map((err, idx) => (
                      <li key={idx} className="text-xs text-red-500"><span className="font-bold">Baris {err.baris}:</span> {err.pesan}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-slate-100 mt-2">
                <Button type="submit" isLoading={importing} icon={HiOutlineUpload} className="flex-1 w-full">Unggah Soal</Button>
                <Button variant="outline" type="button" onClick={() => setShowImportModal(false)} icon={HiOutlineX} className="flex-1 w-full">Batal</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-white/20">
            <div className="sticky top-0 bg-white/90 backdrop-blur-md px-6 py-4 border-b border-slate-100 flex items-center justify-between z-10">
              <h3 className="text-lg font-extrabold text-slate-900">
                {editing ? 'Edit Soal' : 'Tambah Soal Baru'}
              </h3>
              <button 
                type="button"
                onClick={() => setShowForm(false)}
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
              >
                <HiOutlineX size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
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

              <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-slate-100 mt-2">
                <Button type="submit" icon={HiOutlineSave} className="flex-1 w-full">Simpan</Button>
                <Button variant="outline" type="button" onClick={() => setShowForm(false)} icon={HiOutlineX} className="flex-1 w-full">Batal</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedExamId && !loading && !showForm && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-700">Daftar Soal ({questions.length})</h3>
          </div>
          {currentQuestions.map((q, idx) => (
            <Card key={q.id} className="p-5 flex flex-col gap-4">
              <div className="flex justify-between gap-4">
                <div className="flex-1">
                  <div className="text-xs font-bold text-slate-400 mb-1">Soal {indexOfFirstItem + idx + 1} • <span className="text-[#011F7B] uppercase tracking-widest">{q.difficulty}</span></div>
                  <div className="text-slate-800 whitespace-pre-wrap font-medium">{q.question}</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { setForm({...q}); setEditing(q.id); setShowForm(true); }} className="p-2 h-fit cursor-pointer bg-[#011F7B]/5 rounded-xl border-2 border-[#011F7B]/20 text-[#011F7B] hover:border-blue-100 hover:bg-blue-100 hover:text-[#011F7B] transition-all"><HiOutlinePencil size={18} /></button>
                  <button onClick={() => handleDelete(q.id)} className="p-2 h-fit cursor-pointer bg-red-50 rounded-xl border-2 border-red-200 text-red-400 hover:border-red-100 hover:bg-red-100 hover:text-red-500 transition-all"><HiOutlineTrash size={18} /></button>
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
          
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4">
              <span className="text-sm text-slate-500 font-medium">Menampilkan {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, questions.length)} dari {questions.length} soal</span>
              <div className="flex gap-2">
                <button 
                  disabled={currentPage === 1} 
                  onClick={() => setCurrentPage(p => p - 1)} 
                  className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors"
                >
                  Sebelumnya
                </button>
                <div className="flex items-center gap-1 px-2">
                  <span className="text-sm font-bold text-[#011F7B]">{currentPage}</span>
                  <span className="text-sm text-slate-400">/ {totalPages}</span>
                </div>
                <button 
                  disabled={currentPage === totalPages} 
                  onClick={() => setCurrentPage(p => p + 1)} 
                  className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors"
                >
                  Selanjutnya
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
