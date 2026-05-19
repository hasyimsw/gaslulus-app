import prisma from '../lib/prisma.js';
import { questionSchema } from '../validators/schemas.js';
import * as XLSX from 'xlsx';
import { activeSessions } from '../lib/session.js';

// Public: Get practice questions by category and subject
export const getPracticeQuestions = async (req, res, next) => {
  try {
    const { category, subject } = req.params;
    
    const questions = await prisma.question.findMany({
      where: { 
        subject: subject,
        exam: { category: category, isPublished: true }
      },
      include: { options: { orderBy: { id: 'asc' } } },
      orderBy: { id: 'asc' }
    });

    if (questions.length === 0) {
      return res.status(404).json({ success: false, message: 'Soal tidak ditemukan untuk mata pelajaran ini' });
    }

    // Shuffle questions and limit to 20 questions
    const shuffleArray = (array) => {
      const newArray = [...array];
      for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
      }
      return newArray;
    };
    const shuffled = shuffleArray(questions).slice(0, 20);

    // Record session start time to prevent time spoofing
    if (req.user) {
      const sessionKey = `${req.user.id}_practice_${category}_${subject}`;
      activeSessions.set(sessionKey, Date.now());
    }

    return res.json({ 
      success: true, 
      data: shuffled,
      info: { category, subject, total: shuffled.length }
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Get all questions (with optional examId filter)
export const getQuestions = async (req, res, next) => {
  try {
    const { examId } = req.query;
    const where = examId ? { examId: BigInt(examId) } : {};

    const questions = await prisma.question.findMany({
      where,
      include: { options: true, exam: { select: { title: true, category: true } } },
      orderBy: { createdAt: 'desc' },
    });

    return res.json({
      success: true,
      data: questions,
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Create question with options
export const createQuestion = async (req, res, next) => {
  try {
    const data = questionSchema.parse(req.body);
    const question = await prisma.question.create({
      data: {
        examId: BigInt(data.examId),
        question: data.question,
        explanation: data.explanation,
        difficulty: data.difficulty || 'MEDIUM',
        subject: data.subject,
        options: {
          create: data.options.map((o) => ({ optionText: o.optionText, isCorrect: o.isCorrect })),
        },
      },
      include: { options: true },
    });

    return res.status(201).json({
      success: true,
      message: 'Soal berhasil dibuat',
      data: question,
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Update question
export const updateQuestion = async (req, res, next) => {
  try {
    const { question, explanation, difficulty, subject, options } = questionSchema.partial().parse(req.body);
    const qId = BigInt(req.params.id);

    await prisma.question.update({
      where: { id: qId },
      data: { question, explanation, difficulty, subject },
    });

    if (options && Array.isArray(options)) {
      await prisma.option.deleteMany({ where: { questionId: qId } });
      await prisma.option.createMany({
        data: options.map((o) => ({ questionId: qId, optionText: o.optionText, isCorrect: o.isCorrect })),
      });
    }

    return res.json({ success: true, message: 'Soal berhasil diperbarui' });
  } catch (error) {
    next(error);
  }
};

// Admin: Delete question
export const deleteQuestion = async (req, res, next) => {
  try {
    await prisma.question.delete({ where: { id: BigInt(req.params.id) } });
    return res.json({ success: true, message: 'Soal berhasil dihapus' });
  } catch (error) {
    next(error);
  }
};

// Admin: Bulk Import Questions via Excel
export const importQuestions = async (req, res, next) => {
  try {
    const examId = BigInt(req.params.examId);
    
    // 1. Validate exam exists
    const exam = await prisma.exam.findUnique({ where: { id: examId } });
    if (!exam) return res.status(404).json({ success: false, message: 'Ujian tidak ditemukan' });

    if (!req.file) return res.status(400).json({ success: false, message: 'File Excel tidak ditemukan' });

    // 2. Parse Excel from memory buffer
    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    if (sheetData.length === 0) {
      return res.status(400).json({ success: false, message: 'File Excel kosong atau salah format' });
    }

    // 3. Pre-validate row by row
    const errors = [];
    const validRows = [];

    sheetData.forEach((row, index) => {
      const rowNum = index + 2; // Assuming row 1 is header
      
      const qText = row['Pertanyaan']?.toString().trim();
      const diff = row['Kesulitan']?.toString().trim().toUpperCase() || 'MEDIUM';
      const ans = row['Jawaban Benar']?.toString().trim().toUpperCase();
      
      const optA = row['Pilihan A']?.toString().trim();
      const optB = row['Pilihan B']?.toString().trim();
      const optC = row['Pilihan C']?.toString().trim();
      const optD = row['Pilihan D']?.toString().trim();
      const optE = row['Pilihan E']?.toString().trim();

      if (!qText) errors.push({ baris: rowNum, pesan: "Pertanyaan tidak boleh kosong" });
      if (!ans || !['A', 'B', 'C', 'D', 'E'].includes(ans)) {
        errors.push({ baris: rowNum, pesan: "Jawaban Benar harus diisi huruf A, B, C, D, atau E" });
      }
      if (!['EASY', 'MEDIUM', 'HARD'].includes(diff)) {
        errors.push({ baris: rowNum, pesan: "Kesulitan harus diisi EASY, MEDIUM, atau HARD" });
      }
      if (!optA || !optB || !optC || !optD) {
        errors.push({ baris: rowNum, pesan: "Pilihan A, B, C, dan D wajib diisi" });
      }

      if (errors.length === 0) {
        validRows.push({
          question: qText,
          explanation: row['Penjelasan']?.toString().trim() || null,
          difficulty: diff,
          subject: row['Mata Pelajaran']?.toString().trim() || null,
          options: [
            { optionText: optA, isCorrect: ans === 'A' },
            { optionText: optB, isCorrect: ans === 'B' },
            { optionText: optC, isCorrect: ans === 'C' },
            { optionText: optD, isCorrect: ans === 'D' },
            ...(optE ? [{ optionText: optE, isCorrect: ans === 'E' }] : [])
          ]
        });
      }
    });

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Ditemukan kesalahan validasi pada file Excel. Silakan perbaiki dan unggah kembali.',
        errors
      });
    }

    // 4. Prisma Transaction
    await prisma.$transaction(
      validRows.map((row) =>
        prisma.question.create({
          data: {
            examId,
            question: row.question,
            explanation: row.explanation,
            difficulty: row.difficulty,
            subject: row.subject,
            options: {
              create: row.options
            }
          }
        })
      )
    );

    return res.status(201).json({
      success: true,
      message: `${validRows.length} soal berhasil diimpor dengan sukses`,
    });
  } catch (error) {
    next(error);
  }
};
