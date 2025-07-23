import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Token manquant' }, { status: 401 });
    }
    const token = authHeader.substring(7);
    let decoded: { userId: string };
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
      const { payload } = await jwtVerify(token, secret);
      decoded = payload as { userId: string };
    } catch {
      return NextResponse.json({ error: 'Token invalide' }, { status: 401 });
    }
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        stats: true,
        quizResults: true,
        readingProgress: true,
      },
    });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    // Ne pas renvoyer le mot de passe
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _pw, ...safeUser } = user;
    return NextResponse.json(safeUser);
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Token manquant' }, { status: 401 });
    }
    const token = authHeader.substring(7);
    let decoded: { userId: string };
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
      const { payload } = await jwtVerify(token, secret);
      decoded = payload as { userId: string };
    } catch {
      return NextResponse.json({ error: 'Token invalide' }, { status: 401 });
    }
    const data = await req.json();
    const { name, avatar } = data;
    if (typeof name !== 'string' || name.length < 2) {
      return NextResponse.json({ error: 'Nom invalide' }, { status: 400 });
    }
    const user = await prisma.user.update({
      where: { id: decoded.userId },
      data: { name, avatar },
    });
    // Ne pas renvoyer le mot de passe
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _pw, ...safeUser } = user;
    return NextResponse.json(safeUser);
  } catch {
    return NextResponse.json({ error: 'Erreur lors de la mise à jour du profil' }, { status: 500 });
  }
}
