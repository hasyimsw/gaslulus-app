import bcrypt from 'bcryptjs';
import prisma from '../lib/prisma.js';
import { generateToken } from '../lib/jwt.js';
import { registerSchema, loginSchema } from '../validators/schemas.js';

export const register = async (req, res, next) => {
  try {
    const data = registerSchema.parse(req.body);

    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Email sudah digunakan' });
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
      },
    });

    const token = generateToken({ id: user.id.toString(), role: user.role });

    return res.status(201).json({
      success: true,
      message: 'Registrasi berhasil',
      data: {
        uuid: user.uuid,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const data = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Email atau password salah' });
    }

    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Email atau password salah' });
    }

    const token = generateToken({ id: user.id.toString(), role: user.role });

    return res.json({
      success: true,
      message: 'Login berhasil',
      data: {
        uuid: user.uuid,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res) => {
  const user = req.user;
  return res.json({
    success: true,
    data: {
      uuid: user.uuid,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    },
  });
};
