import { NextRequest, NextResponse } from 'next/server';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function PUT(req: NextRequest) {
  try {
    // Vérifier l'authentification JWT
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Token manquant' }, { status: 401 });
    }
    const token = authHeader.substring(7);
    let decoded: { userId: string };
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    } catch {
      return NextResponse.json({ error: 'Token invalide' }, { status: 401 });
    }

    const { oldPassword, newPassword } = await req.json();
    if (
      typeof oldPassword !== 'string' ||
      typeof newPassword !== 'string' ||
      newPassword.length < 6
    ) {
      return NextResponse.json({ error: 'Mot de passe invalide' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user || !user.password) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    const isValid = await bcrypt.compare(oldPassword, user.password);
    if (!isValid) {
      return NextResponse.json({ error: 'Ancien mot de passe incorrect' }, { status: 403 });
    }

    const hashed = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({
      where: { id: decoded.userId },
      data: { password: hashed },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Erreur lors du changement de mot de passe' }, { status: 500 });
  }
}
