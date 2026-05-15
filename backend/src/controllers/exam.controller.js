import prisma from '../lib/prisma.js';
import { examSchema } from '../validators/schemas.js';

// Public: Get all published exams
export const getExams = async (req, res, next) => {
  try {
    const { category } = req.query;
    const where = { isPublished: true, type: 'SIMULATION' };
    if (category && category !== 'Semua') where.category = category;

    const exams = await prisma.exam.findMany({
      where,
      select: {
        id: true, title: true, description: true, category: true,
        subCategory: true, totalQuestions: true, duration: true,
        passingScore: true, createdAt: true,
        _count: { select: { questions: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.json({ success: true, data: exams });
  } catch (error) {
    next(error);
  }
};

export const getSubjectsByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;
    const where = { isPublished: true, type: 'PRACTICE' };
    if (category && category !== 'Semua') {
      where.category = category;
    }

    const exams = await prisma.exam.findMany({
      where,
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        totalQuestions: true,
        duration: true,
        _count: { select: { questions: true } },
      },
      orderBy: { createdAt: 'desc' }
    });

    return res.json({ 
      success: true, 
      data: exams.map(e => ({ 
        ...e, 
        subject: e.title, // Use title as subject for the frontend
        totalQuestions: e._count.questions
      }))
    });
  } catch (error) {
    next(error);
  }
};

// Public: Get exam by ID
export const getExamById = async (req, res, next) => {
  try {
    const exam = await prisma.exam.findFirst({
      where: { id: BigInt(req.params.id), isPublished: true },
      include: {
        _count: { select: { questions: true } },
      },
    });
    if (!exam) return res.status(404).json({ success: false, message: 'Ujian tidak ditemukan' });

    return res.json({ success: true, data: exam });
  } catch (error) {
    next(error);
  }
};

// Get exam questions (randomized)
export const getExamQuestions = async (req, res, next) => {
  try {
    const exam = await prisma.exam.findFirst({
      where: { id: BigInt(req.params.id), isPublished: true },
    });
    if (!exam) return res.status(404).json({ success: false, message: 'Ujian tidak ditemukan' });

    const questions = await prisma.question.findMany({
      where: { examId: BigInt(req.params.id) },
      include: { options: { orderBy: { id: 'asc' } } },
      orderBy: { id: 'asc' }
    });

    // Shuffle questions and limit to totalQuestions
    const shuffled = questions.sort(() => Math.random() - 0.5).slice(0, exam.totalQuestions);

    return res.json({ success: true, data: shuffled, exam });
  } catch (error) {
    next(error);
  }
};

// Submit exam
export const submitExam = async (req, res, next) => {
  try {
    const { answers, durationUsed } = req.body;
    // answers: [{ questionId, selectedOptionId }]

    const examId = BigInt(req.params.id);
    const exam = await prisma.exam.findFirst({ where: { id: examId, isPublished: true } });
    if (!exam) return res.status(404).json({ success: false, message: 'Ujian tidak ditemukan' });

    // Get correct answers
    const questionIds = answers.map((a) => BigInt(a.questionId));
    const questions = await prisma.question.findMany({
      where: { id: { in: questionIds } },
      include: { options: { where: { isCorrect: true } } },
    });

    let totalCorrect = 0;
    let totalWrong = 0;
    let totalSkipped = 0;

    answers.forEach((ans) => {
      const question = questions.find((q) => q.id.toString() === ans.questionId.toString());
      if (!question) return;

      if (!ans.selectedOptionId) {
        totalSkipped++;
        return;
      }

      const correctOption = question.options[0];
      if (correctOption && correctOption.id.toString() === ans.selectedOptionId.toString()) {
        totalCorrect++;
      } else {
        totalWrong++;
      }
    });

    const total = totalCorrect + totalWrong + totalSkipped;
    const score = total > 0 ? Math.round((totalCorrect / total) * 100) : 0;

    const result = await prisma.result.create({
      data: {
        userId: req.user.id,
        examId,
        score,
        totalCorrect,
        totalWrong,
        totalSkipped,
        durationUsed: durationUsed || 0,
      },
    });

    await prisma.history.create({ data: { resultId: result.id } });

    return res.json({
      success: true,
      message: 'Ujian berhasil diselesaikan',
      data: {
        resultId: result.id,
        score,
        totalCorrect,
        totalWrong,
        totalSkipped,
        passed: score >= exam.passingScore,
        passingScore: exam.passingScore,
        durationUsed,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Get all exams
export const adminGetExams = async (req, res, next) => {
  try {
    const exams = await prisma.exam.findMany({
      include: { _count: { select: { questions: true, results: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return res.json({ success: true, data: exams });
  } catch (error) {
    next(error);
  }
};

// Admin: Create exam
export const createExam = async (req, res, next) => {
  try {
    const data = examSchema.parse(req.body);
    const exam = await prisma.exam.create({ data });
    return res.status(201).json({ success: true, message: 'Ujian berhasil dibuat', data: exam });
  } catch (error) {
    next(error);
  }
};

// Admin: Update exam
export const updateExam = async (req, res, next) => {
  try {
    const data = examSchema.partial().parse(req.body);
    const exam = await prisma.exam.update({ where: { id: BigInt(req.params.id) }, data });
    return res.json({ success: true, message: 'Ujian berhasil diperbarui', data: exam });
  } catch (error) {
    next(error);
  }
};

// Admin: Delete exam
export const deleteExam = async (req, res, next) => {
  try {
    await prisma.exam.delete({ where: { id: BigInt(req.params.id) } });
    return res.json({ success: true, message: 'Ujian berhasil dihapus' });
  } catch (error) {
    next(error);
  }
};

// Submit Practice Session
export const submitPractice = async (req, res, next) => {
  try {
    const { answers, durationUsed, category, subject } = req.body;

    if (!category || !answers || !Array.isArray(answers)) {
      return res.status(400).json({ success: false, message: 'Data latihan tidak lengkap' });
    }

    // Find a reference simulation exam for this category
    const exam = await prisma.exam.findFirst({
      where: { category, type: 'SIMULATION', isPublished: true }
    });

    if (!exam) {
      return res.status(404).json({ success: false, message: 'Kategori ujian tidak tersedia untuk simulasi' });
    }

    if (!exam) {
      // Fallback: If no simulation exists, find ANY exam of that category
      const fallbackExam = await prisma.exam.findFirst({
        where: { category, isPublished: true }
      });
      if (!fallbackExam) {
        return res.status(404).json({ success: false, message: 'Kategori ujian tidak tersedia' });
      }
    }

    // Process answers and fetch questions
    const validAnswerIds = answers
      .filter(a => a.questionId)
      .map(a => {
        try { return BigInt(a.questionId); } catch { return null; }
      })
      .filter(id => id !== null);

    const questions = await prisma.question.findMany({
      where: { id: { in: validAnswerIds } },
      include: { options: { where: { isCorrect: true } }, exam: true },
    });

    // Use the examId from the actual questions if possible, otherwise use reference simulation
    const actualExamId = questions.length > 0 ? questions[0].examId : exam.id;

    let totalCorrect = 0;
    let totalWrong = 0;
    let totalSkipped = 0;

    answers.forEach((ans) => {
      if (!ans.questionId) return;
      
      const question = questions.find((q) => q.id.toString() === ans.questionId.toString());
      if (!question) {
        totalSkipped++;
        return;
      }

      if (!ans.selectedOptionId) {
        totalSkipped++;
        return;
      }

      const correctOption = question.options[0];
      if (correctOption && correctOption.id.toString() === ans.selectedOptionId.toString()) {
        totalCorrect++;
      } else {
        totalWrong++;
      }
    });

    const total = totalCorrect + totalWrong + totalSkipped;
    const score = total > 0 ? Math.round((totalCorrect / total) * 100) : 0;

    // Database operations in a transaction or sequential
    const result = await prisma.$transaction(async (tx) => {
      const resData = await tx.result.create({
        data: {
          userId: req.user.id,
          examId: actualExamId,
          score: parseFloat(score),
          totalCorrect,
          totalWrong,
          totalSkipped,
          durationUsed: parseInt(durationUsed) || 0,
        },
      });

      await tx.history.create({
        data: { resultId: resData.id }
      });

      return resData;
    });

    return res.json({
      success: true,
      message: 'Latihan berhasil diselesaikan',
      data: {
        resultId: result.id,
        score,
        totalCorrect,
        totalWrong,
        totalSkipped,
        passed: score >= 60,
        passingScore: 60,
        durationUsed: parseInt(durationUsed) || 0,
      },
    });
  } catch (error) {
    console.error('CRITICAL ERROR in submitPractice:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Terjadi kesalahan internal pada server',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
