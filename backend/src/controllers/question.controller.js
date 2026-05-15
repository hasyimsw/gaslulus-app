import prisma from '../lib/prisma.js';
import { questionSchema } from '../validators/schemas.js';

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

    // Do not randomize, just limit to 20 questions
    const ordered = questions
      .slice(0, 20)
      .map((q) => ({
        ...q,
        id: q.id.toString(),
        examId: q.examId.toString(),
        options: q.options.map((o) => ({
          id: o.id.toString(),
          questionId: o.questionId.toString(),
          optionText: o.optionText,
          isCorrect: o.isCorrect,
        })),
      }));

    return res.json({ 
      success: true, 
      data: ordered,
      info: { category, subject, total: ordered.length }
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
      data: questions.map((q) => ({
        ...q,
        id: q.id.toString(),
        examId: q.examId.toString(),
        options: q.options.map((o) => ({ ...o, id: o.id.toString(), questionId: o.questionId.toString() })),
      })),
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
      data: { ...question, id: question.id.toString(), examId: question.examId.toString() },
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Update question
export const updateQuestion = async (req, res, next) => {
  try {
    const { question, explanation, difficulty, subject, options } = req.body;
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
