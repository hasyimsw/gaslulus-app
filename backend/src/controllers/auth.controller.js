import bcrypt from 'bcryptjs';
import prisma from '../lib/prisma.js';
import { generateToken } from '../lib/jwt.js';
import { registerSchema, loginSchema } from '../validators/schemas.js';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

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

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email harus diisi' });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Security: return success anyway, to prevent email enumeration
      return res.json({ success: true, message: 'Jika email terdaftar, link reset telah dikirim ke inbox Anda.' });
    }

    if (user.provider === 'GOOGLE') {
      return res.status(400).json({ success: false, message: 'Akun ini didaftarkan via Google. Silakan login menggunakan Google.' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 3600000); // 1 hour

    await prisma.passwordResetToken.upsert({
      where: { email },
      update: { token, expiresAt, createdAt: new Date() },
      create: { email, token, expiresAt }
    });

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'sandbox.smtp.mailtrap.io',
      port: process.env.SMTP_PORT || 2525,
      secure: process.env.SMTP_PORT === '465', // true for 465 (Gmail), false for others
      auth: {
        user: process.env.SMTP_USER || 'user',
        pass: process.env.SMTP_PASS || 'pass'
      }
    });

    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${token}`;

    try {
      await transporter.sendMail({
        from: process.env.SMTP_FROM || '"GasLulus Support" <noreply@gaslulus.com>',
        to: email,
        subject: 'Reset Password GasLulus',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h3 style="color: #011F7B;">Permintaan Reset Password</h3>
            <p>Halo,</p>
            <p>Anda telah meminta untuk melakukan reset password di GasLulus.</p>
            <p>Silakan klik tombol di bawah ini untuk membuat password baru:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}" style="display:inline-block;padding:12px 24px;background-color:#011F7B;color:white;text-decoration:none;border-radius:8px;font-weight:bold;">Reset Password</a>
            </div>
            <p style="color: #64748b; font-size: 12px;">Link ini hanya berlaku selama 1 jam.</p>
            <p style="color: #64748b; font-size: 12px;">Jika Anda tidak meminta reset password, abaikan email ini. Akun Anda tetap aman.</p>
          </div>
        `
      });
    } catch (err) {
      console.error('Failed to send reset email', err.message);
      // Fallback for development if SMTP is invalid
      console.log(`[DEV MODE] Reset link: ${resetLink}`);
    }

    return res.json({ success: true, message: 'Jika email terdaftar, link reset telah dikirim ke inbox Anda.' });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) return res.status(400).json({ success: false, message: 'Token dan password baru harus diisi' });

    const resetRecord = await prisma.passwordResetToken.findUnique({ where: { token } });
    if (!resetRecord || resetRecord.expiresAt < new Date()) {
      return res.status(400).json({ success: false, message: 'Token tidak valid atau sudah kedaluwarsa.' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.user.update({
      where: { email: resetRecord.email },
      data: { password: hashedPassword }
    });

    await prisma.passwordResetToken.delete({ where: { id: resetRecord.id } });

    return res.json({ success: true, message: 'Password berhasil diperbarui. Silakan login.' });
  } catch (error) {
    next(error);
  }
};
