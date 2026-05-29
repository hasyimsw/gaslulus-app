import prisma from '../lib/prisma.js';

// Get user's history
export const getHistory = async (req, res, next) => {
  try {
    const results = await prisma.result.findMany({
      where: { userId: BigInt(req.user.id) },
      include: { exam: { select: { title: true, category: true, passingScore: true } } },
      orderBy: { createdAt: 'desc' },
    });

    return res.json({
      success: true,
      data: results.map(r => ({
        ...r,
        examTitle: r.exam.title,
        category: r.exam.category,
        passed: r.score >= r.exam.passingScore
      })),
    });
  } catch (error) {
    next(error);
  }
};

// Get result detail
export const getResultDetail = async (req, res, next) => {
  try {
    const id = BigInt(req.params.id);
    const userId = BigInt(req.user.id);
    
    const result = await prisma.result.findFirst({
      where: { id, userId },
      include: { 
        exam: true,
        answers: {
          include: {
            question: {
              include: { options: true }
            }
          }
        }
      },
    });

    if (!result) return res.status(404).json({ success: false, message: 'Hasil tidak ditemukan' });

    return res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Get dashboard stats
export const getDashboardStats = async (req, res, next) => {
  try {
    const userId = BigInt(req.user.id);

    const totalExams = await prisma.result.count({ where: { userId } });
    const avgScore = await prisma.result.aggregate({ where: { userId }, _avg: { score: true } });
    const lastResults = await prisma.result.findMany({
      where: { userId },
      include: { exam: { select: { title: true, category: true, passingScore: true } } },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    const allResults = await prisma.result.findMany({
      where: { userId },
      select: {
        score: true,
        exam: { select: { passingScore: true } },
      },
    });
    const totalPassed = allResults.filter(r => r.score >= r.exam.passingScore).length;

    return res.json({
      success: true,
      data: {
        totalExams,
        avgScore: avgScore._avg.score ? Math.round(avgScore._avg.score) : 0,
        totalPassed,
        recentResults: lastResults.map((r) => ({
          ...r,
          examTitle: r.exam.title,
          category: r.exam.category,
          passed: r.score >= r.exam.passingScore,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const clearHistory = async (req, res, next) => {
  try {
    await prisma.result.deleteMany({
      where: { userId: BigInt(req.user.id) }
    });
    return res.json({ success: true, message: 'Seluruh riwayat berhasil dihapus' });
  } catch (error) {
    next(error);
  }
};
