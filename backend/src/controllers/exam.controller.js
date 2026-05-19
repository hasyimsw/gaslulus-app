import prisma from '../lib/prisma.js';
import { examSchema } from '../validators/schemas.js';
import { activeSessions } from '../lib/session.js';

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
    const shuffleArray = (array) => {
      const newArray = [...array];
      for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
      }
      return newArray;
    };
    const shuffled = shuffleArray(questions).slice(0, exam.totalQuestions);

    // Record session start time to prevent time spoofing
    if (req.user) {
      const sessionKey = `${req.user.id}_sim_${exam.id}`;
      activeSessions.set(sessionKey, Date.now());
    }

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

    // --- TIME SPOOFING PREVENTION ---
    let finalDurationUsed = parseInt(durationUsed) || 0;
    if (req.user) {
      const sessionKey = `${req.user.id}_sim_${exam.id}`;
      const startTime = activeSessions.get(sessionKey);
      if (startTime) {
        const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
        finalDurationUsed = Math.min(elapsedSeconds, exam.duration * 60 + 5);
        activeSessions.delete(sessionKey);
      }
    }

    const result = await prisma.$transaction(async (tx) => {
      const resData = await tx.result.create({
        data: {
          userId: req.user.id,
          examId,
          score,
          totalCorrect,
          totalWrong,
          totalSkipped,
          durationUsed: finalDurationUsed,
          answers: {
            create: answers.map((ans) => {
              const question = questions.find((q) => q.id.toString() === ans.questionId.toString());
              let isCorrect = false;
              if (question && ans.selectedOptionId) {
                const correctOption = question.options[0];
                if (correctOption && correctOption.id.toString() === ans.selectedOptionId.toString()) {
                  isCorrect = true;
                }
              }
              return {
                questionId: BigInt(ans.questionId),
                selectedOptionId: ans.selectedOptionId ? BigInt(ans.selectedOptionId) : null,
                isCorrect,
              };
            }).filter(a => a.questionId),
          }
        },
      });

      await tx.history.create({ data: { resultId: resData.id } });

      return resData;
    });

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
        durationUsed: finalDurationUsed,
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
    let exam = await prisma.exam.findFirst({
      where: { category, type: 'SIMULATION', isPublished: true }
    });

    if (!exam) {
      // Fallback: If no simulation exists, find ANY exam of that category
      exam = await prisma.exam.findFirst({
        where: { category, isPublished: true }
      });
      if (!exam) {
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

    // --- TIME SPOOFING PREVENTION ---
    let finalDurationUsed = parseInt(durationUsed) || 0;
    if (req.user) {
      const sessionKey = `${req.user.id}_practice_${category}_${subject}`;
      const startTime = activeSessions.get(sessionKey);
      if (startTime) {
        const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
        finalDurationUsed = Math.min(elapsedSeconds, 120 * 60);
        activeSessions.delete(sessionKey);
      }
    }

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
          durationUsed: finalDurationUsed,
          answers: {
            create: answers.map((ans) => {
              if (!ans.questionId) return null;
              const question = questions.find((q) => q.id.toString() === ans.questionId.toString());
              let isCorrect = false;
              if (question && ans.selectedOptionId) {
                const correctOption = question.options[0];
                if (correctOption && correctOption.id.toString() === ans.selectedOptionId.toString()) {
                  isCorrect = true;
                }
              }
              return {
                questionId: BigInt(ans.questionId),
                selectedOptionId: ans.selectedOptionId ? BigInt(ans.selectedOptionId) : null,
                isCorrect,
              };
            }).filter(Boolean),
          }
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
        durationUsed: finalDurationUsed,
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
