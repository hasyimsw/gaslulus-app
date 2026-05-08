import prisma from '../lib/prisma.js';
import { examSchema } from '../validators/schemas.js';

// Public: Get all published exams
export const getExams = async (req, res, next) => {
  try {
    const { category } = req.query;
    const where = { isPublished: true };
    if (category) where.category = category;

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

    return res.json({ success: true, data: exams.map(e => ({ ...e, id: e.id.toString() })) });
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

    return res.json({ success: true, data: { ...exam, id: exam.id.toString() } });
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
      include: { options: true },
    });

    // Randomize questions and options
    const shuffled = questions
      .sort(() => Math.random() - 0.5)
      .slice(0, exam.totalQuestions)
      .map((q) => ({
        ...q,
        id: q.id.toString(),
        examId: q.examId.toString(),
        options: q.options
          .sort(() => Math.random() - 0.5)
          .map((o) => ({
            id: o.id.toString(),
            questionId: o.questionId.toString(),
            optionText: o.optionText,
            isCorrect: o.isCorrect,
          })),
      }));

    return res.json({ success: true, data: shuffled, exam: { ...exam, id: exam.id.toString() } });
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
        resultId: result.id.toString(),
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
    return res.json({ success: true, data: exams.map(e => ({ ...e, id: e.id.toString() })) });
  } catch (error) {
    next(error);
  }
};

// Admin: Create exam
export const createExam = async (req, res, next) => {
  try {
    const data = examSchema.parse(req.body);
    const exam = await prisma.exam.create({ data });
    return res.status(201).json({ success: true, message: 'Ujian berhasil dibuat', data: { ...exam, id: exam.id.toString() } });
  } catch (error) {
    next(error);
  }
};

// Admin: Update exam
export const updateExam = async (req, res, next) => {
  try {
    const data = examSchema.partial().parse(req.body);
    const exam = await prisma.exam.update({ where: { id: BigInt(req.params.id) }, data });
    return res.json({ success: true, message: 'Ujian berhasil diperbarui', data: { ...exam, id: exam.id.toString() } });
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
