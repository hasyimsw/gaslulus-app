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

  console.log('✅ Users created:', admin.email, demoUser.email);

  const cpnsTwkCheck = await prisma.exam.findUnique({ where: { id: BigInt(1) } });
  const cpnsTwk = cpnsTwkCheck || await prisma.exam.create({
    data: {
      id: BigInt(1),
      title: 'TWK - Tes Wawasan Kebangsaan',
      description: 'Tes Wawasan Kebangsaan (TWK) untuk persiapan seleksi CPNS.',
      category: 'CPNS',
      subCategory: 'TWK',
      totalQuestions: 30,
      duration: 35,
      passingScore: 65,
      isPublished: true,
    },
  });

  const cpnsTiuCheck = await prisma.exam.findUnique({ where: { id: BigInt(2) } });
  const cpnsTiu = cpnsTiuCheck || await prisma.exam.create({
    data: {
      id: BigInt(2),
      title: 'TIU - Tes Intelegensia Umum',
      description: 'Tes Intelegensia Umum (TIU) untuk persiapan seleksi CPNS.',
      category: 'CPNS',
      subCategory: 'TIU',
      totalQuestions: 35,
      duration: 35,
      passingScore: 80,
      isPublished: true,
    },
  });

  const sdCheck = await prisma.exam.findUnique({ where: { id: BigInt(3) } });
  const sdExam = sdCheck || await prisma.exam.create({
    data: {
      id: BigInt(3),
      title: 'Tryout SD - Ujian Sekolah',
      description: 'Simulasi ujian sekolah SD mencakup Bahasa Indonesia, Matematika, dan IPA.',
      category: 'SD',
      totalQuestions: 60,
      duration: 90,
      passingScore: 60,
      isPublished: true,
    },
  });

  const smpCheck = await prisma.exam.findUnique({ where: { id: BigInt(4) } });
  const smpExam = smpCheck || await prisma.exam.create({
    data: {
      id: BigInt(4),
      title: 'Tryout SMP - Ujian Sekolah',
      description: 'Simulasi ujian sekolah SMP mencakup Matematika, Bahasa Indonesia, IPA, dan Bahasa Inggris.',
      category: 'SMP',
      totalQuestions: 100,
      duration: 120,
      passingScore: 60,
      isPublished: true,
    },
  });

  const smaCheck = await prisma.exam.findUnique({ where: { id: BigInt(5) } });
  const smaExam = smaCheck || await prisma.exam.create({
    data: {
      id: BigInt(5),
      title: 'Tryout SMA - TKA',
      description: 'Simulasi TKA SMA mencakup Matematika, Bahasa Indonesia, dan Bahasa Inggris.',
      category: 'SMA',
      totalQuestions: 90,
      duration: 120,
      passingScore: 60,
      isPublished: true,
    },
  });

  console.log('✅ Exams created');

  const existingCount = await prisma.question.count();
  if (existingCount > 0) {
    console.log(`ℹ️  ${existingCount} questions already exist, skipping`);
  } else {
    const allQuestions = [
      {
        examId: cpnsTwk.id,
        question: 'Pancasila sebagai dasar negara Indonesia tercantum dalam...',
        explanation: 'Pancasila sebagai dasar negara Indonesia tercantum dalam Pembukaan UUD 1945 alinea keempat.',
        difficulty: 'EASY',
        options: [
          { optionText: 'Pembukaan UUD 1945 alinea keempat', isCorrect: true },
          { optionText: 'Batang Tubuh UUD 1945 pasal 1', isCorrect: false },
          { optionText: 'Pembukaan UUD 1945 alinea pertama', isCorrect: false },
          { optionText: 'Penjelasan UUD 1945', isCorrect: false },
        ],
      },
      {
        examId: cpnsTwk.id,
        question: 'Sila pertama Pancasila adalah...',
        explanation: 'Sila pertama Pancasila adalah "Ketuhanan Yang Maha Esa".',
        difficulty: 'EASY',
        options: [
          { optionText: 'Kemanusiaan yang Adil dan Beradab', isCorrect: false },
          { optionText: 'Ketuhanan Yang Maha Esa', isCorrect: true },
          { optionText: 'Persatuan Indonesia', isCorrect: false },
          { optionText: 'Kerakyatan yang Dipimpin oleh Hikmat', isCorrect: false },
        ],
      },
      {
        examId: cpnsTwk.id,
        question: 'Bhinneka Tunggal Ika berasal dari bahasa...',
        explanation: 'Bhinneka Tunggal Ika berasal dari bahasa Jawa Kuno dalam Kakawin Sutasoma karya Mpu Tantular.',
        difficulty: 'EASY',
        options: [
          { optionText: 'Sansekerta', isCorrect: false },
          { optionText: 'Melayu Kuno', isCorrect: false },
          { optionText: 'Jawa Kuno', isCorrect: true },
          { optionText: 'Bali Kuno', isCorrect: false },
        ],
      },
      {
        examId: cpnsTwk.id,
        question: 'UUD 1945 pertama kali disahkan oleh...',
        explanation: 'UUD 1945 disahkan oleh PPKI pada tanggal 18 Agustus 1945.',
        difficulty: 'MEDIUM',
        options: [
          { optionText: 'BPUPKI', isCorrect: false },
          { optionText: 'PPKI', isCorrect: true },
          { optionText: 'DPR', isCorrect: false },
          { optionText: 'MPR', isCorrect: false },
        ],
      },
      {
        examId: cpnsTwk.id,
        question: 'Yang dimaksud dengan otonomi daerah adalah...',
        explanation: 'Otonomi daerah adalah hak, wewenang, dan kewajiban daerah otonom untuk mengatur dan mengurus sendiri urusan pemerintahan.',
        difficulty: 'MEDIUM',
        options: [
          { optionText: 'Kebebasan daerah untuk memisahkan diri dari NKRI', isCorrect: false },
          { optionText: 'Hak daerah untuk mengatur dan mengurus urusan pemerintahan sendiri', isCorrect: true },
          { optionText: 'Pemberian kekuasaan penuh kepada bupati/walikota', isCorrect: false },
          { optionText: 'Pemisahan kekuasaan antara pusat dan daerah secara mutlak', isCorrect: false },
        ],
      },
      {
        examId: cpnsTiu.id,
        question: 'Jika 2x + 5 = 15, maka nilai x adalah...',
        explanation: '2x + 5 = 15 → 2x = 10 → x = 5',
        difficulty: 'EASY',
        options: [
          { optionText: '3', isCorrect: false },
          { optionText: '4', isCorrect: false },
          { optionText: '5', isCorrect: true },
          { optionText: '6', isCorrect: false },
        ],
      },
      {
        examId: cpnsTiu.id,
        question: 'Antonim dari kata "KONKRET" adalah...',
        explanation: 'Konkret berarti nyata/berwujud. Antonimnya adalah abstrak.',
        difficulty: 'EASY',
        options: [
          { optionText: 'Nyata', isCorrect: false },
          { optionText: 'Abstrak', isCorrect: true },
          { optionText: 'Jelas', isCorrect: false },
          { optionText: 'Umum', isCorrect: false },
        ],
      },
      {
        examId: cpnsTiu.id,
        question: 'Deret angka: 2, 4, 8, 16, ... angka berikutnya adalah...',
        explanation: 'Pola deret adalah perkalian 2. 16×2=32.',
        difficulty: 'EASY',
        options: [
          { optionText: '24', isCorrect: false },
          { optionText: '28', isCorrect: false },
          { optionText: '32', isCorrect: true },
          { optionText: '36', isCorrect: false },
        ],
      },
      {
        examId: cpnsTiu.id,
        question: 'Sinonim dari kata "INOVATIF" adalah...',
        explanation: 'Inovatif berarti bersifat pembaruan. Sinonimnya adalah kreatif.',
        difficulty: 'MEDIUM',
        options: [
          { optionText: 'Konservatif', isCorrect: false },
          { optionText: 'Kreatif', isCorrect: true },
          { optionText: 'Produktif', isCorrect: false },
          { optionText: 'Efektif', isCorrect: false },
        ],
      },
      {
        examId: cpnsTiu.id,
        question: 'Sebuah persegi panjang memiliki panjang 12 cm dan lebar 8 cm. Berapakah luasnya?',
        explanation: 'Luas = panjang × lebar = 12 × 8 = 96 cm²',
        difficulty: 'EASY',
        options: [
          { optionText: '80 cm²', isCorrect: false },
          { optionText: '88 cm²', isCorrect: false },
          { optionText: '96 cm²', isCorrect: true },
          { optionText: '104 cm²', isCorrect: false },
        ],
      },
      {
        examId: sdExam.id,
        question: 'Ibu kota negara Indonesia adalah...',
        explanation: 'Jakarta adalah ibu kota negara Indonesia.',
        difficulty: 'EASY',
        options: [
          { optionText: 'Bandung', isCorrect: false },
          { optionText: 'Jakarta', isCorrect: true },
          { optionText: 'Surabaya', isCorrect: false },
          { optionText: 'Yogyakarta', isCorrect: false },
        ],
      },
      {
        examId: sdExam.id,
        question: 'Hasil dari 125 ÷ 5 adalah...',
        explanation: '125 ÷ 5 = 25',
        difficulty: 'EASY',
        options: [
          { optionText: '20', isCorrect: false },
          { optionText: '25', isCorrect: true },
          { optionText: '30', isCorrect: false },
          { optionText: '35', isCorrect: false },
        ],
      },
      {
        examId: sdExam.id,
        question: 'Hewan yang termasuk mamalia adalah...',
        explanation: 'Paus adalah mamalia laut yang menyusui anaknya.',
        difficulty: 'EASY',
        options: [
          { optionText: 'Ikan hiu', isCorrect: false },
          { optionText: 'Katak', isCorrect: false },
          { optionText: 'Paus', isCorrect: true },
          { optionText: 'Penyu', isCorrect: false },
        ],
      },
      {
        examId: smpExam.id,
        question: 'Rumus mencari luas lingkaran dengan jari-jari r adalah...',
        explanation: 'Luas lingkaran = π × r²',
        difficulty: 'EASY',
        options: [
          { optionText: 'π × r', isCorrect: false },
          { optionText: '2 × π × r', isCorrect: false },
          { optionText: 'π × r²', isCorrect: true },
          { optionText: '2 × π × r²', isCorrect: false },
        ],
      },
      {
        examId: smpExam.id,
        question: 'The English meaning of "buku" is...',
        explanation: '"Buku" in English is "book".',
        difficulty: 'EASY',
        options: [
          { optionText: 'Pen', isCorrect: false },
          { optionText: 'Book', isCorrect: true },
          { optionText: 'Table', isCorrect: false },
          { optionText: 'Chair', isCorrect: false },
        ],
      },
      {
        examId: smpExam.id,
        question: 'Apa yang dimaksud dengan fotosintesis?',
        explanation: 'Fotosintesis adalah proses pembuatan makanan pada tumbuhan menggunakan cahaya matahari.',
        difficulty: 'MEDIUM',
        options: [
          { optionText: 'Proses pernapasan pada tumbuhan', isCorrect: false },
          { optionText: 'Proses pembuatan makanan pada tumbuhan menggunakan cahaya matahari', isCorrect: true },
          { optionText: 'Proses penyerapan air oleh akar', isCorrect: false },
          { optionText: 'Proses reproduksi pada tumbuhan', isCorrect: false },
        ],
      },
      {
        examId: smaExam.id,
        question: 'Nilai dari log₁₀(1000) adalah...',
        explanation: 'log₁₀(1000) = log₁₀(10³) = 3',
        difficulty: 'MEDIUM',
        options: [
          { optionText: '2', isCorrect: false },
          { optionText: '3', isCorrect: true },
          { optionText: '4', isCorrect: false },
          { optionText: '10', isCorrect: false },
        ],
      },
      {
        examId: smaExam.id,
        question: 'Which sentence is grammatically correct?',
        explanation: '"She has been studying" uses Present Perfect Continuous tense correctly.',
        difficulty: 'MEDIUM',
        options: [
          { optionText: 'She have study since morning', isCorrect: false },
          { optionText: 'She has been studying since morning', isCorrect: true },
          { optionText: 'She is studied since morning', isCorrect: false },
          { optionText: 'She studying since morning', isCorrect: false },
        ],
      },
      {
        examId: smaExam.id,
        question: 'Gagasan utama suatu paragraf disebut juga...',
        explanation: 'Gagasan utama/pokok pikiran suatu paragraf disebut juga ide pokok.',
        difficulty: 'EASY',
        options: [
          { optionText: 'Kalimat penjelas', isCorrect: false },
          { optionText: 'Ide pokok', isCorrect: true },
          { optionText: 'Kalimat pendukung', isCorrect: false },
          { optionText: 'Paragraf penutup', isCorrect: false },
        ],
      },
    ];

    for (const q of allQuestions) {
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

    console.log(`✅ ${allQuestions.length} questions created`);
  }

  console.log('🎉 Seed completed successfully!');
  console.log('');
  console.log('📋 Admin: admin@gaslulus.id / admin123');
  console.log('📋 Demo:  demo@gaslulus.id / user123');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
