import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'メールアドレスとパスワードは必須です' },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'このメールアドレスは既に登録されています' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    // Send email
    // Note: Configure these environment variables in .env
    // If SMTP_HOST is not set, we just log the email content.
    if (process.env.SMTP_HOST) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      try {
        await transporter.sendMail({
          from: process.env.SMTP_FROM || '"Antigravity App" <no-reply@example.com>',
          to: email,
          subject: '登録完了のお知らせ',
          text: 'ご登録ありがとうございます。アカウントの作成が完了しました。',
          html: '<b>ご登録ありがとうございます。</b><br>アカウントの作成が完了しました。',
        });
        console.log(`Registration email sent to ${email}`);
      } catch (emailError) {
        console.error('Failed to send email:', emailError);
      }
    } else {
        console.log(`[Mock Email] To: ${email}, Subject: 登録完了のお知らせ`);
    }

    return NextResponse.json(
      { message: 'ユーザー登録が完了しました', userId: user.id },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}
