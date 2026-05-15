import prisma from '../lib/prisma.js';

// Get user's bookmarks
export const getBookmarks = async (req, res, next) => {
  try {
    const bookmarks = await prisma.bookmark.findMany({
      where: { userId: req.user.id },
      include: {
        question: {
          include: {
            options: true,
            exam: { select: { title: true, category: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.json({
      success: true,
      data: bookmarks,
    });
  } catch (error) {
    next(error);
  }
};

// Add bookmark
export const addBookmark = async (req, res, next) => {
  try {
    const { questionId } = req.body;
    const bookmark = await prisma.bookmark.create({
      data: { userId: req.user.id, questionId: BigInt(questionId) },
    });
    return res.status(201).json({ success: true, message: 'Soal berhasil di-bookmark', data: bookmark });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ success: false, message: 'Soal sudah di-bookmark' });
    }
    next(error);
  }
};

// Remove bookmark
export const removeBookmark = async (req, res, next) => {
  try {
    await prisma.bookmark.deleteMany({
      where: { userId: req.user.id, questionId: BigInt(req.params.questionId) },
    });
    return res.json({ success: true, message: 'Bookmark berhasil dihapus' });
  } catch (error) {
    next(error);
  }
};
