import 'dotenv/config';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import pkg from '@prisma/client';
import bcrypt from 'bcryptjs';

const { PrismaClient } = pkg;

function parseDatabaseUrl(url) {
  const parsed = new URL(url);
  return {
    host: parsed.hostname,
    port: parseInt(parsed.port) || 3306,
    user: parsed.username,
    password: parsed.password || undefined,
    database: parsed.pathname.replace('/', ''),
    connectionLimit: 5,
  };
}

const dbConfig = parseDatabaseUrl(process.env.DATABASE_URL);
const adapter = new PrismaMariaDb(dbConfig);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting seed...');

  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@gaslulus.id' },
    update: {},
    create: {
      name: 'Admin GasLulus',
      email: 'admin@gaslulus.id',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  const userPassword = await bcrypt.hash('user123', 12);
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@gaslulus.id' },
    update: {},
    create: {
      name: 'Budi Pelajar',
      email: 'demo@gaslulus.id',
      password: userPassword,
      role: 'USER',
    },
  });

  console.log('✅ Users:', admin.email, demoUser.email);

  const exams = [
    { id: BigInt(1), title: 'TWK - Tes Wawasan Kebangsaan', description: 'Tes Wawasan Kebangsaan (TWK) untuk persiapan seleksi CPNS.', category: 'CPNS', subCategory: 'TWK', totalQuestions: 30, duration: 35, passingScore: 65 },
    { id: BigInt(2), title: 'TIU - Tes Intelegensia Umum', description: 'Tes Intelegensia Umum (TIU) untuk persiapan seleksi CPNS.', category: 'CPNS', subCategory: 'TIU', totalQuestions: 35, duration: 35, passingScore: 80 },
    { id: BigInt(3), title: 'Tryout SD - Ujian Sekolah', description: 'Simulasi ujian sekolah SD mencakup Bahasa Indonesia, Matematika, dan IPA.', category: 'SD', totalQuestions: 60, duration: 90, passingScore: 60 },
    { id: BigInt(4), title: 'Tryout SMP - Ujian Sekolah', description: 'Simulasi ujian SMP mencakup Matematika, Bahasa Indonesia, IPA, dan Bahasa Inggris.', category: 'SMP', totalQuestions: 100, duration: 120, passingScore: 60 },
    { id: BigInt(5), title: 'Tryout SMA - TKA', description: 'Simulasi TKA SMA mencakup Matematika, Bahasa Indonesia, dan Bahasa Inggris.', category: 'SMA', totalQuestions: 90, duration: 120, passingScore: 60 },
  ];

  const createdExams = {};
  for (const exam of exams) {
    const existing = await prisma.exam.findUnique({ where: { id: exam.id } });
    if (!existing) {
      const created = await prisma.exam.create({ data: { ...exam, isPublished: true } });
      createdExams[exam.id.toString()] = created;
    } else {
      createdExams[exam.id.toString()] = existing;
    }
  }
  console.log('✅ Exams ready');

  const existingCount = await prisma.question.count();
  if (existingCount > 0) {
    console.log(`ℹ️  ${existingCount} questions exist, skipping`);
  } else {
    const e1 = createdExams['1'];
    const e2 = createdExams['2'];
    const e3 = createdExams['3'];
    const e4 = createdExams['4'];
    const e5 = createdExams['5'];

    const questions = [
      { examId: e1.id, question: 'Pancasila sebagai dasar negara Indonesia tercantum dalam...', explanation: 'Pancasila tercantum dalam Pembukaan UUD 1945 alinea keempat.', difficulty: 'EASY', options: [{ optionText: 'Pembukaan UUD 1945 alinea keempat', isCorrect: true }, { optionText: 'Batang Tubuh UUD 1945 pasal 1', isCorrect: false }, { optionText: 'Pembukaan UUD 1945 alinea pertama', isCorrect: false }, { optionText: 'Penjelasan UUD 1945', isCorrect: false }] },
      { examId: e1.id, question: 'Sila pertama Pancasila adalah...', explanation: 'Sila pertama adalah "Ketuhanan Yang Maha Esa".', difficulty: 'EASY', options: [{ optionText: 'Kemanusiaan yang Adil dan Beradab', isCorrect: false }, { optionText: 'Ketuhanan Yang Maha Esa', isCorrect: true }, { optionText: 'Persatuan Indonesia', isCorrect: false }, { optionText: 'Kerakyatan yang Dipimpin oleh Hikmat', isCorrect: false }] },
      { examId: e1.id, question: 'Bhinneka Tunggal Ika berasal dari bahasa...', explanation: 'Berasal dari bahasa Jawa Kuno dalam Kakawin Sutasoma.', difficulty: 'EASY', options: [{ optionText: 'Sansekerta', isCorrect: false }, { optionText: 'Melayu Kuno', isCorrect: false }, { optionText: 'Jawa Kuno', isCorrect: true }, { optionText: 'Bali Kuno', isCorrect: false }] },
      { examId: e1.id, question: 'UUD 1945 pertama kali disahkan oleh...', explanation: 'Disahkan oleh PPKI pada 18 Agustus 1945.', difficulty: 'MEDIUM', options: [{ optionText: 'BPUPKI', isCorrect: false }, { optionText: 'PPKI', isCorrect: true }, { optionText: 'DPR', isCorrect: false }, { optionText: 'MPR', isCorrect: false }] },
      { examId: e1.id, question: 'Otonomi daerah berarti...', explanation: 'Otonomi daerah adalah hak daerah untuk mengatur dan mengurus urusan pemerintahan sendiri.', difficulty: 'MEDIUM', options: [{ optionText: 'Kebebasan daerah memisahkan diri dari NKRI', isCorrect: false }, { optionText: 'Hak daerah mengatur dan mengurus pemerintahan sendiri', isCorrect: true }, { optionText: 'Pemberian kekuasaan penuh kepada bupati', isCorrect: false }, { optionText: 'Pemisahan kekuasaan antara pusat dan daerah secara mutlak', isCorrect: false }] },
      { examId: e2.id, question: 'Jika 2x + 5 = 15, maka nilai x adalah...', explanation: '2x = 10, x = 5', difficulty: 'EASY', options: [{ optionText: '3', isCorrect: false }, { optionText: '4', isCorrect: false }, { optionText: '5', isCorrect: true }, { optionText: '6', isCorrect: false }] },
      { examId: e2.id, question: 'Antonim dari kata KONKRET adalah...', explanation: 'Konkret = nyata. Antonimnya = abstrak.', difficulty: 'EASY', options: [{ optionText: 'Nyata', isCorrect: false }, { optionText: 'Abstrak', isCorrect: true }, { optionText: 'Jelas', isCorrect: false }, { optionText: 'Umum', isCorrect: false }] },
      { examId: e2.id, question: 'Deret: 2, 4, 8, 16, ... angka berikutnya?', explanation: 'Pola ×2: 16×2=32', difficulty: 'EASY', options: [{ optionText: '24', isCorrect: false }, { optionText: '28', isCorrect: false }, { optionText: '32', isCorrect: true }, { optionText: '36', isCorrect: false }] },
      { examId: e2.id, question: 'Sinonim INOVATIF adalah...', explanation: 'Inovatif = bersifat pembaruan = kreatif', difficulty: 'MEDIUM', options: [{ optionText: 'Konservatif', isCorrect: false }, { optionText: 'Kreatif', isCorrect: true }, { optionText: 'Produktif', isCorrect: false }, { optionText: 'Efektif', isCorrect: false }] },
      { examId: e2.id, question: 'Luas persegi panjang 12cm × 8cm adalah...', explanation: 'L = p × l = 12 × 8 = 96 cm²', difficulty: 'EASY', options: [{ optionText: '80 cm²', isCorrect: false }, { optionText: '88 cm²', isCorrect: false }, { optionText: '96 cm²', isCorrect: true }, { optionText: '104 cm²', isCorrect: false }] },
      { examId: e3.id, question: 'Ibu kota Indonesia adalah...', explanation: 'Jakarta adalah ibu kota Indonesia.', difficulty: 'EASY', options: [{ optionText: 'Bandung', isCorrect: false }, { optionText: 'Jakarta', isCorrect: true }, { optionText: 'Surabaya', isCorrect: false }, { optionText: 'Yogyakarta', isCorrect: false }] },
      { examId: e3.id, question: 'Hasil 125 ÷ 5 adalah...', explanation: '125 ÷ 5 = 25', difficulty: 'EASY', options: [{ optionText: '20', isCorrect: false }, { optionText: '25', isCorrect: true }, { optionText: '30', isCorrect: false }, { optionText: '35', isCorrect: false }] },
      { examId: e3.id, question: 'Hewan mamalia adalah...', explanation: 'Paus adalah mamalia laut.', difficulty: 'EASY', options: [{ optionText: 'Ikan hiu', isCorrect: false }, { optionText: 'Katak', isCorrect: false }, { optionText: 'Paus', isCorrect: true }, { optionText: 'Penyu', isCorrect: false }] },
      { examId: e4.id, question: 'Luas lingkaran jari-jari r adalah...', explanation: 'L = π × r²', difficulty: 'EASY', options: [{ optionText: 'π × r', isCorrect: false }, { optionText: '2 × π × r', isCorrect: false }, { optionText: 'π × r²', isCorrect: true }, { optionText: '2 × π × r²', isCorrect: false }] },
      { examId: e4.id, question: 'Arti "buku" dalam bahasa Inggris adalah...', explanation: '"Buku" = "book"', difficulty: 'EASY', options: [{ optionText: 'Pen', isCorrect: false }, { optionText: 'Book', isCorrect: true }, { optionText: 'Table', isCorrect: false }, { optionText: 'Chair', isCorrect: false }] },
      { examId: e4.id, question: 'Fotosintesis adalah...', explanation: 'Fotosintesis = proses pembuatan makanan tumbuhan menggunakan cahaya matahari.', difficulty: 'MEDIUM', options: [{ optionText: 'Proses pernapasan tumbuhan', isCorrect: false }, { optionText: 'Proses pembuatan makanan menggunakan cahaya matahari', isCorrect: true }, { optionText: 'Proses penyerapan air oleh akar', isCorrect: false }, { optionText: 'Proses reproduksi tumbuhan', isCorrect: false }] },
      { examId: e5.id, question: 'Nilai log₁₀(1000) adalah...', explanation: 'log₁₀(10³) = 3', difficulty: 'MEDIUM', options: [{ optionText: '2', isCorrect: false }, { optionText: '3', isCorrect: true }, { optionText: '4', isCorrect: false }, { optionText: '10', isCorrect: false }] },
      { examId: e5.id, question: 'Which is grammatically correct?', explanation: '"She has been studying" = Present Perfect Continuous', difficulty: 'MEDIUM', options: [{ optionText: 'She have study since morning', isCorrect: false }, { optionText: 'She has been studying since morning', isCorrect: true }, { optionText: 'She is studied since morning', isCorrect: false }, { optionText: 'She studying since morning', isCorrect: false }] },
      { examId: e5.id, question: 'Gagasan utama paragraf disebut juga...', explanation: 'Gagasan utama = ide pokok', difficulty: 'EASY', options: [{ optionText: 'Kalimat penjelas', isCorrect: false }, { optionText: 'Ide pokok', isCorrect: true }, { optionText: 'Kalimat pendukung', isCorrect: false }, { optionText: 'Paragraf penutup', isCorrect: false }] },
    ];

    for (const q of questions) {
      await prisma.question.create({
        data: {
          examId: q.examId,
          question: q.question,
          explanation: q.explanation,
          difficulty: q.difficulty,
          options: { create: q.options },
        },
      });
    }
    console.log(`✅ ${questions.length} questions created`);
  }

  console.log('🎉 Seed done!');
  console.log('Admin: admin@gaslulus.id / admin123');
  console.log('Demo:  demo@gaslulus.id / user123');
}

main()
  .catch((e) => { console.error('❌', e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
