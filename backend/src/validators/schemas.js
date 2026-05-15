import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string()
    .trim()
    .min(2, 'Nama minimal 2 karakter')
    .max(100)
    .regex(/^[^<>]*$/, 'Nama tidak boleh mengandung karakter HTML (< atau >)'),
  email: z.string().trim().toLowerCase().email('Format email tidak valid (contoh: nama@email.com)'),
  password: z.string()
    .trim()
    .min(8, 'Password minimal 8 karakter')
    .regex(/[A-Z]/, 'Password harus mengandung minimal 1 huruf besar')
    .regex(/[0-9]/, 'Password harus mengandung minimal 1 angka')
    .regex(/[^A-Za-z0-9]/, 'Password harus mengandung minimal 1 simbol (contoh: @, #, $, dll)'),
  confirmPassword: z.string().trim(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Password tidak cocok',
  path: ['confirmPassword'],
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('Format email tidak valid'),
  password: z.string().trim().min(1, 'Password wajib diisi'),
});

export const examSchema = z.object({
  title: z.string().trim().min(3, 'Judul minimal 3 karakter'),
  description: z.string().trim().optional(),
  category: z.enum(['SD', 'SMP', 'SMA', 'CPNS']),
  subCategory: z.string().trim().optional(),
  totalQuestions: z.number().int().positive(),
  duration: z.number().int().positive(),
  passingScore: z.number().int().min(0).max(100).optional(),
  type: z.enum(['SIMULATION', 'PRACTICE']).optional(),
  isPublished: z.boolean().optional(),
});

export const questionSchema = z.object({
  examId: z.number().int().positive(),
  question: z.string().trim().min(5, 'Pertanyaan minimal 5 karakter'),
  explanation: z.string().trim().optional(),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']).optional(),
  subject: z.string().trim().optional(),
  options: z.array(z.object({
    optionText: z.string().trim().min(1, 'Pilihan jawaban tidak boleh kosong'),
    isCorrect: z.boolean(),
  })).min(2, 'Minimal 2 pilihan jawaban'),
});

export const updateProfileSchema = z.object({
  name: z.string()
    .trim()
    .min(2, 'Nama minimal 2 karakter')
    .max(100)
    .regex(/^[^<>]*$/, 'Nama tidak boleh mengandung karakter HTML (< atau >)')
    .optional(),
});

export const updatePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Password lama wajib diisi'),
  newPassword: z.string().min(6, 'Password baru minimal 6 karakter'),
  confirmNewPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: 'Konfirmasi password tidak cocok',
  path: ['confirmNewPassword'],
});
