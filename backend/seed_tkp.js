import prisma from './src/lib/prisma.js';

async function seedTKP() {
  try {
    const exam = await prisma.exam.create({
      data: {
        title: 'CPNS - TKP (Tes Karakteristik Pribadi)',
        description: 'Simulasi ujian CPNS TKP yang mengukur penguasaan pelayanan publik, jejaring kerja, sosial budaya, TIK, dan profesionalisme.',
        category: 'CPNS',
        subCategory: 'TKP',
        totalQuestions: 45,
        duration: 45,
        passingScore: 65,
        isPublished: true,
      }
    });

    // Menambahkan 2 contoh soal TKP
    await prisma.question.create({
      data: {
        examId: exam.id,
        question: 'Anda sedang melayani pelanggan yang sangat cerewet dan banyak menuntut, sementara di belakangnya antrean masih sangat panjang. Sikap Anda...',
        difficulty: 'MEDIUM',
        options: {
          create: [
            { optionText: 'Memintanya untuk cepat karena antrean masih panjang', isCorrect: false },
            { optionText: 'Melayani dengan sabar dan tetap tersenyum meskipun dalam hati kesal', isCorrect: false },
            { optionText: 'Melayani dengan ramah, cepat, dan solutif sesuai prosedur standar', isCorrect: true },
            { optionText: 'Meminta bantuan rekan kerja untuk menangani pelanggan tersebut', isCorrect: false },
            { optionText: 'Mengabaikan tuntutannya dan melayani seperlunya saja', isCorrect: false },
          ]
        }
      }
    });

    await prisma.question.create({
      data: {
        examId: exam.id,
        question: 'Instansi Anda baru saja mengimplementasikan sistem absensi berbasis wajah yang rumit. Beberapa rekan senior kesulitan menggunakannya. Anda...',
        difficulty: 'MEDIUM',
        options: {
          create: [
            { optionText: 'Fokus pada pekerjaan sendiri karena itu bukan urusan saya', isCorrect: false },
            { optionText: 'Menawarkan bantuan secara inisiatif dan mengajari mereka hingga bisa', isCorrect: true },
            { optionText: 'Melaporkan ke atasan agar diadakan pelatihan khusus', isCorrect: false },
            { optionText: 'Membantu jika diminta saja', isCorrect: false },
            { optionText: 'Menyarankan mereka untuk kembali menggunakan sistem absen manual', isCorrect: false },
          ]
        }
      }
    });

    console.log('✅ Berhasil menambahkan Tryout CPNS - TKP beserta contoh soal!');
  } catch (err) {
    console.error('❌ Gagal menambahkan:', err);
  } finally {
    await prisma.$disconnect();
  }
}

seedTKP();
