import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const difficulty = searchParams.get('difficulty');

    // Typage strict pour whereClause
    const whereClause: {
      isActive: true;
      category?: string;
      difficulty?: string;
    } = { isActive: true };
    if (category) whereClause.category = category;
    if (difficulty) whereClause.difficulty = difficulty;

    const questions = await prisma.question.findMany({
      where: whereClause,
      select: {
        id: true,
        category: true,
        question: true,
        options: true,
        answer: true,
        explanation: true,
        source: true,
        difficulty: true,
      },
    });
    return NextResponse.json({ questions, count: questions.length });
  } catch {
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { category, question, options, answer, explanation, source, difficulty } = await req.json();
    const newQuestion = await prisma.question.create({
      data: {
        category,
        question,
        options,
        answer,
        explanation,
        source,
        difficulty: difficulty || 'normal',
      },
    });
    return NextResponse.json({ message: 'Question créée avec succès', question: newQuestion }, { status: 201 });
  } catch {
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}
