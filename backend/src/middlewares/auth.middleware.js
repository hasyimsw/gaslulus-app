import { verifyToken } from '../lib/jwt.js';
import prisma from '../lib/prisma.js';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Token tidak ditemukan' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    const user = await prisma.user.findUnique({ where: { id: BigInt(decoded.id) } });
    if (!user) {
      return res.status(401).json({ success: false, message: 'User tidak ditemukan' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Token tidak valid atau sudah expired' });
  }
};

export const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ success: false, message: 'Akses ditolak. Hanya admin yang diizinkan.' });
  }
  next();
};
