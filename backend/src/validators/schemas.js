import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter').max(100),
  email: z.string().email('Format email tidak valid (contoh: nama@email.com)'),
  password: z.string()
    .min(8, 'Password minimal 8 karakter')
    .regex(/^(?=.*[a-z])/, 'Password harus mengandung huruf kecil')
    .regex(/^(?=.*[A-Z])/, 'Password harus mengandung huruf kapital')
    .regex(/^(?=.*\d)/, 'Password harus mengandung angka')
    .regex(/^(?=.*[@$!%*?&_])/, 'Password harus mengandung simbol spesifik (@$!%*?&_)'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Password tidak cocok',
  path: ['confirmPassword'],
});

export const loginSchema = z.object({
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(1, 'Password wajib diisi'),
});


export const examSchema = z.object({
  title: z.string().min(3, 'Judul minimal 3 karakter'),
  description: z.string().optional(),
  category: z.enum(['SD', 'SMP', 'SMA', 'CPNS']),
  subCategory: z.string().optional(),
  totalQuestions: z.number().int().positive(),
  duration: z.number().int().positive(),
  passingScore: z.number().int().min(0).max(100).optional(),
  isPublished: z.boolean().optional(),
});

export const questionSchema = z.object({
  examId: z.number().int().positive(),
  question: z.string().min(5, 'Pertanyaan minimal 5 karakter'),
  explanation: z.string().optional(),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']).optional(),
  options: z.array(z.object({
    optionText: z.string().min(1, 'Pilihan jawaban tidak boleh kosong'),
    isCorrect: z.boolean(),
  })).min(2, 'Minimal 2 pilihan jawaban'),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
});

export const updatePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Password lama wajib diisi'),
  newPassword: z.string().min(6, 'Password baru minimal 6 karakter'),
  confirmNewPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: 'Konfirmasi password tidak cocok',
  path: ['confirmNewPassword'],
});
