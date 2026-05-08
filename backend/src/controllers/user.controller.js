import prisma from '../lib/prisma.js';
import { updateProfileSchema, updatePasswordSchema } from '../validators/schemas.js';
import bcrypt from 'bcryptjs';

export const getProfile = async (req, res) => {
  const userId = BigInt(req.user.id);
  const stats = await prisma.result.aggregate({
    where: { userId },
    _count: { id: true },
    _avg: { score: true },
  });

  return res.json({
    success: true,
    data: {
      ...req.user,
      stats: {
        totalExams: stats._count.id,
        avgScore: stats._avg.score ? Math.round(stats._avg.score) : 0,
      },
    },
  });
};

export const updateProfile = async (req, res, next) => {
  try {
    const data = updateProfileSchema.parse(req.body);
    const userId = BigInt(req.user.id);

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { name: data.name },
    });

    return res.json({
      success: true,
      message: 'Profil berhasil diperbarui',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const updatePassword = async (req, res, next) => {
  try {
    const data = updatePasswordSchema.parse(req.body);
    const userId = BigInt(req.user.id);
    const isMatch = await bcrypt.compare(data.currentPassword, req.user.password);
    
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Password lama salah' });
    }

    const hashed = await bcrypt.hash(data.newPassword, 12);
    await prisma.user.update({ where: { id: userId }, data: { password: hashed } });

    return res.json({ success: true, message: 'Password berhasil diperbarui' });
  } catch (error) {
    next(error);
  }
};
