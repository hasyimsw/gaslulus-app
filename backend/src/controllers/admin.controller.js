import prisma from '../lib/prisma.js';

// Admin: Get all users
export const getUsers = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true, uuid: true, name: true, email: true, role: true, createdAt: true,
        _count: { select: { results: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.json({
      success: true,
      data: users.map((u) => ({ ...u, id: u.id.toString() })),
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Get system stats
export const getStats = async (req, res, next) => {
  try {
    const [totalUsers, totalExams, totalResults, totalQuestions] = await Promise.all([
      prisma.user.count({ where: { role: 'USER' } }),
      prisma.exam.count(),
      prisma.result.count(),
      prisma.question.count(),
    ]);

    const recentUsers = await prisma.user.findMany({
      where: { role: 'USER' },
      select: { uuid: true, name: true, email: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    const recentResults = await prisma.result.findMany({
      include: {
        user: { select: { name: true } },
        exam: { select: { title: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    return res.json({
      success: true,
      data: {
        totalUsers,
        totalExams,
        totalResults,
        totalQuestions,
        recentUsers,
        recentResults: recentResults.map((r) => ({
          id: r.id.toString(),
          userName: r.user.name,
          examTitle: r.exam.title,
          score: r.score,
          createdAt: r.createdAt,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Delete user
export const deleteUser = async (req, res, next) => {
  try {
    await prisma.user.delete({ where: { uuid: req.params.uuid } });
    return res.json({ success: true, message: 'User berhasil dihapus' });
  } catch (error) {
    next(error);
  }
};
