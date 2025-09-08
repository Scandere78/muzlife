import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('timeRange') || '7d';
    
    const now = new Date();
    let startDate: Date;
    
    switch (timeRange) {
      case '24h':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    const [
      totalUsers,
      newUsers,
      totalQuizzes,
      newQuizzes,
      totalReadingSessions,
      newReadingSessions,
      averageQuizScore,
      userActivity,
      quizPerformance,
      readingProgress,
      topSurahs,
      userGrowth
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({
        where: {
          createdAt: {
            gte: startDate
          }
        }
      }),
      prisma.quizResult.count(),
      prisma.quizResult.count({
        where: {
          createdAt: {
            gte: startDate
          }
        }
      }),
      prisma.studySession.count(),
      prisma.studySession.count({
        where: {
          startedAt: {
            gte: startDate
          }
        }
      }),
      prisma.quizResult.aggregate({
        _avg: {
          score: true
        },
        where: {
          createdAt: {
            gte: startDate
          }
        }
      }),
      prisma.user.findMany({
        where: {
          updatedAt: {
            gte: startDate
          }
        },
        select: {
          id: true,
          name: true,
          updatedAt: true,
          _count: {
            select: {
              quizResults: true,
              studySessions: true
            }
          }
        },
        orderBy: {
          updatedAt: 'desc'
        },
        take: 10
      }),
      prisma.quizResult.groupBy({
        by: ['category'],
        _avg: {
          score: true
        },
        _count: {
          id: true
        },
        where: {
          createdAt: {
            gte: startDate
          }
        },
        orderBy: {
          _count: {
            id: 'desc'
          }
        }
      }),
      prisma.readingProgress.groupBy({
        by: ['surahNumber'],
        _count: {
          id: true
        },
        where: {
          readAt: {
            gte: startDate
          }
        },
        orderBy: {
          _count: {
            id: 'desc'
          }
        },
        take: 10
      }),
      prisma.favoriteSurah.groupBy({
        by: ['surahNumber'],
        _count: {
          id: true
        },
        orderBy: {
          _count: {
            id: 'desc'
          }
        },
        take: 10
      }),
      prisma.user.groupBy({
        by: ['createdAt'],
        _count: {
          id: true
        },
        where: {
          createdAt: {
            gte: startDate
          }
        },
        orderBy: {
          createdAt: 'asc'
        }
      })
    ]);

    const analytics = {
      overview: {
        totalUsers,
        newUsers,
        totalQuizzes,
        newQuizzes,
        totalReadingSessions,
        newReadingSessions,
        averageQuizScore: Math.round((averageQuizScore._avg.score || 0) * 100) / 100
      },
      userActivity,
      quizPerformance,
      readingProgress,
      topSurahs,
      userGrowth: userGrowth.map(item => ({
        date: item.createdAt.toISOString().split('T')[0],
        count: item._count.id
      }))
    };

    return NextResponse.json(analytics);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des analytics' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { type, data } = await request.json();

    if (type === 'export') {
      const analytics = await prisma.user.findMany({
        include: {
          stats: true,
          quizResults: true,
          readingProgress: true,
          studySessions: true
        }
      });

      return NextResponse.json({
        message: 'Export généré avec succès',
        data: analytics
      });
    }

    return NextResponse.json(
      { error: 'Type d\'action non supporté' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error processing analytics action:', error);
    return NextResponse.json(
      { error: 'Erreur lors du traitement de l\'action' },
      { status: 500 }
    );
  }
}