import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../lib/api';
import Swal from 'sweetalert2';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { HiOutlineMail, HiOutlineArrowLeft } from 'react-icons/hi';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const res = await api.post('/auth/forgot-password', { email });
      setSuccess(true);
      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: res.data.message || 'Link reset password telah dikirim ke email Anda.',
        confirmButtonColor: '#011F7B',
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: error.response?.data?.message || 'Terjadi kesalahan saat memproses permintaan',
        confirmButtonColor: '#011F7B',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 sm:p-10 rounded-3xl shadow-xl shadow-[#011F7B]/5 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#011F7B]/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#011F7B]">
            <HiOutlineMail size={32} />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Lupa Password?</h1>
          <p className="text-slate-500 text-sm mt-2 font-medium">
            Masukkan email Anda dan kami akan mengirimkan instruksi untuk melakukan reset password.
          </p>
        </div>

        {success ? (
          <div className="text-center space-y-6">
            <div className="p-4 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100 text-sm font-medium">
              Silakan periksa kotak masuk email Anda (termasuk folder spam) untuk link reset password.
            </div>
            <Link to="/login" className="inline-flex items-center justify-center gap-2 text-sm font-bold text-[#011F7B] hover:text-blue-800 transition-colors">
              <HiOutlineArrowLeft size={16} /> Kembali ke Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Alamat Email"
              type="email"
              placeholder="nama@email.com"
              icon={<HiOutlineMail />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            
            <Button 
              type="submit" 
              className="w-full py-3.5" 
              isLoading={loading}
            >
              Kirim Link Reset
            </Button>
            
            <div className="text-center mt-6">
              <Link to="/login" className="text-sm font-bold text-slate-500 hover:text-[#011F7B] transition-colors">
                Ingat password Anda? Kembali Login
              </Link>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
}
