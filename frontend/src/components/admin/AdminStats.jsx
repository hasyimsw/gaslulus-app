import { useEffect, useState } from 'react';
import api from '../../lib/api';
import Card from '../ui/Card';
import { HiOutlineChartBar, HiOutlineBookOpen, HiOutlineUsers } from 'react-icons/hi';

export default function AdminStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/stats').then(r => setStats(r.data.data)).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1,2,3].map(i => <div key={i} className="h-32 bg-slate-100 rounded-3xl animate-pulse" />)}
      </div>
    );
  }

  const items = [
    { label: 'Total Pengguna', value: stats?.totalUsers || 0, icon: HiOutlineUsers, color: 'text-[#011F7B]', bg: 'bg-[#011F7B]/5' },
    { label: 'Total Paket Ujian', value: stats?.totalExams || 0, icon: HiOutlineBookOpen, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Total Hasil Tryout', value: stats?.totalResults || 0, icon: HiOutlineChartBar, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-extrabold text-slate-900 mb-6">Ikhtisar Sistem</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((s, i) => (
          <Card key={i} className="p-6 flex items-center gap-5 group" hoverable>
            <div className={`w-14 h-14 rounded-2xl ${s.bg} ${s.color} flex items-center justify-center transition-transform group-hover:scale-110`}>
              <s.icon size={28} />
            </div>
            <div>
              <div className="text-2xl font-semibold text-slate-900 leading-none mb-1.5">{s.value}</div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest leading-none">{s.label}</div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
