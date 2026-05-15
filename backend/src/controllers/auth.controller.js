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
        provider: 'LOCAL',
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

    // Proteksi: user Google tidak bisa login dengan password
    if (user.provider === 'GOOGLE' && !user.password) {
      return res.status(401).json({
        success: false,
        message: 'Akun ini terdaftar melalui Google. Silakan login dengan Google.',
      });
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
        avatar: user.avatar,
        provider: user.provider,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const googleLogin = async (req, res, next) => {
  try {
    const { accessToken } = req.body;

    if (!accessToken) {
      return res.status(400).json({ success: false, message: 'Token Google tidak ditemukan' });
    }

    // Verifikasi access token dengan memanggil Google UserInfo API
    const googleRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!googleRes.ok) {
      return res.status(401).json({ success: false, message: 'Token Google tidak valid' });
    }

    const payload = await googleRes.json();
    const { sub: googleId, email, name, picture } = payload;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email tidak tersedia dari akun Google' });
    }

    // Cari user berdasarkan email
    let user = await prisma.user.findUnique({ where: { email } });

    if (user) {
      // User sudah ada — update googleId & avatar jika belum ada
      if (!user.googleId) {
        user = await prisma.user.update({
          where: { email },
          data: {
            googleId,
            avatar: picture || user.avatar,
            provider: user.password ? user.provider : 'GOOGLE',
          },
        });
      }
    } else {
      // User baru — buat akun tanpa password
      user = await prisma.user.create({
        data: {
          name: name || 'Google User',
          email,
          googleId,
          avatar: picture,
          provider: 'GOOGLE',
          password: null,
        },
      });
    }

    const token = generateToken({ id: user.id.toString(), role: user.role });

    return res.json({
      success: true,
      message: 'Login dengan Google berhasil',
      data: {
        uuid: user.uuid,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        provider: user.provider,
        token,
      },
    });
  } catch (error) {
    console.error('Google Login Error:', error.message);
    return res.status(401).json({
      success: false,
      message: 'Verifikasi Google gagal. Silakan coba lagi.',
    });
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
      avatar: user.avatar,
      provider: user.provider,
      createdAt: user.createdAt,
    },
  });
};
