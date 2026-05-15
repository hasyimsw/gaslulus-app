import { useEffect, useState } from 'react';
import api from '../../lib/api';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { HiOutlineUser, HiOutlineTrash, HiOutlineShieldCheck, HiOutlineUserGroup } from 'react-icons/hi';
import { useAuthStore } from '../../stores/authStore';
import Swal from 'sweetalert2';

const OWNER_EMAIL = 'hasyimsriewahyudi@gmail.com';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useAuthStore();
  const isOwner = currentUser?.email === OWNER_EMAIL;

  const itemsPerPage = 12;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleRole = async (user) => {
    const newRole = user.role === 'ADMIN' ? 'USER' : 'ADMIN';
    const result = await Swal.fire({
      title: `Ubah Role ke ${newRole}?`,
      text: `User ${user.name} akan menjadi ${newRole}.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#011F7B',
      confirmButtonText: 'Ya, Ubah!',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      try {
        await api.put(`/admin/users/${user.uuid}/role`, { role: newRole });
        Swal.fire('Berhasil!', `Role ${user.name} diubah menjadi ${newRole}.`, 'success');
        fetchUsers();
      } catch (err) {
        Swal.fire('Gagal', err.response?.data?.message || 'Terjadi kesalahan', 'error');
      }
    }
  };

  const handleDelete = async (user) => {
    const result = await Swal.fire({
      title: 'Hapus User?',
      text: 'Semua data hasil ujian user ini juga akan terhapus.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/admin/users/${user.uuid}`);
        Swal.fire('Terhapus!', 'User telah berhasil dihapus.', 'success');
        fetchUsers();
      } catch (err) {
        Swal.fire('Gagal', 'Gagal menghapus user', 'error');
      }
    }
  };

  // Pagination Logic
  const totalPages = Math.ceil(users.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = users.slice(startIndex, startIndex + itemsPerPage);

  const getPageNumbers = () => {
    const pages = [];
    const delta = 2;
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== '...') {
        pages.push('...');
      }
    }
    return pages;
  };

  if (loading) return <div className="p-10 text-center animate-pulse text-slate-400">Memuat data user...</div>;

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {paginatedUsers.map((u) => (
          <Card key={u.uuid} className="p-6 group relative overflow-hidden flex flex-col h-full" hoverable>
            <div className="flex items-start gap-4 flex-1">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${u.role === 'ADMIN' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>
                {u.role === 'ADMIN' ? <HiOutlineShieldCheck size={24} /> : <HiOutlineUser size={24} />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-bold text-slate-900 truncate text-sm">{u.name}</h4>
                  <Badge variant={u.role === 'ADMIN' ? 'warning' : 'primary'} className="text-[7px] uppercase px-1.5">{u.role}</Badge>
                </div>
                <p className="text-[11px] text-slate-400 truncate mb-4 font-medium">{u.email}</p>
                
                <div className="flex items-center gap-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                  <span className="flex items-center gap-1"><HiOutlineUserGroup className="text-slate-300" /> {u._count.results} Ujian</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-50 flex justify-between items-center gap-2">
              <span className="text-[8px] font-bold text-slate-300 uppercase tracking-tighter">
                Joined {new Date(u.createdAt).toLocaleDateString()}
              </span>
              <div className="flex gap-2">
                {isOwner && u.email !== OWNER_EMAIL && (
                  <button 
                    onClick={() => handleToggleRole(u)}
                    className="p-2 rounded-lg bg-slate-50 text-[#011F7B] hover:bg-[#011F7B] hover:text-white transition-all border border-slate-100"
                    title={u.role === 'ADMIN' ? 'Set as User' : 'Set as Admin'}
                  >
                    <HiOutlineShieldCheck size={14} />
                  </button>
                )}
                {u.email !== OWNER_EMAIL && (
                  <button 
                    onClick={() => handleDelete(u)}
                    className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all border border-red-100"
                  >
                    <HiOutlineTrash size={14} />
                  </button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 py-8">
          {getPageNumbers().map((page, idx) => (
            page === '...' ? (
              <span key={`dots-${idx}`} className="px-3 text-slate-300 font-bold">...</span>
            ) : (
              <button
                key={page}
                onClick={() => {
                  setCurrentPage(page);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`
                  w-10 h-10 rounded-xl text-xs font-bold transition-all
                  ${currentPage === page 
                    ? 'bg-[#011F7B] text-white shadow-lg shadow-[#011F7B]/20' 
                    : 'bg-white text-slate-400 border border-slate-100 hover:border-[#011F7B]/30 hover:text-[#011F7B]'}
                `}
              >
                {page}
              </button>
            )
          ))}
        </div>
      )}
    </div>
  );
}
