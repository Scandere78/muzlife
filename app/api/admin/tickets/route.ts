import { NextRequest, NextResponse } from 'next/server';

// Simulation d'une base de données en mémoire pour les tickets
const mockTickets = [
  {
    id: '1',
    ticketNumber: 'TKT-001',
    firstName: 'Ahmed',
    lastName: 'Benali',
    email: 'ahmed.benali@email.com',
    subject: 'Bug dans le calcul des horaires de prière',
    category: 'bug',
    priority: 'high',
    message: 'Bonjour, je remarque que les horaires de prière ne correspondent pas à ma géolocalisation. Le Maghrib est affiché avec 30 minutes de retard. Cela pose un problème pour ma pratique religieuse quotidienne.',
    status: 'open',
    assignedTo: null,
    responses: [],
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '2',
    ticketNumber: 'TKT-002',
    firstName: 'Fatima',
    lastName: 'Zahra',
    email: 'fatima.zahra@email.com',
    subject: 'Demande de partenariat pour application mobile',
    category: 'partnership',
    priority: 'medium',
    message: 'Nous sommes une association islamique basée à Casablanca et nous aimerions intégrer vos services dans notre application mobile destinée à la communauté musulmane. Pouvons-nous discuter d\'un partenariat stratégique ?',
    status: 'in-progress',
    assignedTo: 'Admin',
    responses: [
      {
        id: '1',
        message: 'Merci pour votre message. Nous sommes très intéressés par votre proposition de partenariat. Pouvez-vous nous envoyer plus de détails sur votre association et votre application ?',
        isAdminResponse: true,
        authorName: 'Équipe MuzLife',
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
      }
    ],
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '3',
    ticketNumber: 'TKT-003',
    firstName: 'Mohamed',
    lastName: 'El Amrani',
    email: 'mohamed.amrani@email.com',
    subject: 'Problème de synchronisation audio Coran',
    category: 'support',
    priority: 'medium',
    message: 'L\'audio des récitations du Coran ne se synchronise pas correctement avec le texte. Parfois il y a un décalage de plusieurs secondes. Cela rend l\'utilisation difficile pour l\'apprentissage.',
    status: 'resolved',
    assignedTo: 'Support Technique',
    responses: [
      {
        id: '2',
        message: 'Nous avons identifié le problème et déployé une correction. Pouvez-vous tester à nouveau et nous confirmer si le problème persiste ?',
        isAdminResponse: true,
        authorName: 'Support Technique',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '3',
        message: 'Parfait ! Le problème est résolu. L\'audio est maintenant parfaitement synchronisé. Merci beaucoup pour votre réactivité.',
        isAdminResponse: false,
        authorName: 'Mohamed El Amrani',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      }
    ],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '4',
    ticketNumber: 'TKT-004',
    firstName: 'Aisha',
    lastName: 'Benkacem',
    email: 'aisha.benkacem@email.com',
    subject: 'Demande de nouvelle fonctionnalité - Rappels personnalisés',
    category: 'feature',
    priority: 'low',
    message: 'Il serait formidable d\'avoir des rappels personnalisés pour les invocations (adhkar) en plus des prières. Par exemple, des notifications pour le dhikr du matin et du soir.',
    status: 'open',
    assignedTo: null,
    responses: [],
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '5',
    ticketNumber: 'TKT-005',
    firstName: 'Youssef',
    lastName: 'Alaoui',
    email: 'youssef.alaoui@email.com',
    subject: 'Erreur critique - Application plante au démarrage',
    category: 'bug',
    priority: 'urgent',
    message: 'Urgent ! L\'application plante systématiquement au démarrage depuis la dernière mise à jour. J\'ai essayé de redémarrer mon téléphone mais le problème persiste. Je ne peux plus accéder à aucune fonctionnalité.',
    status: 'in-progress',
    assignedTo: 'Développement',
    responses: [
      {
        id: '4',
        message: 'Nous avons reçu votre rapport et nous travaillons activement sur ce problème critique. Pouvez-vous nous indiquer le modèle de votre téléphone et la version de votre système d\'exploitation ?',
        isAdminResponse: true,
        authorName: 'Équipe Développement',
        createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString()
      }
    ],
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString()
  }
];

export async function GET(request: NextRequest) {
  try {
    // Simuler un délai de traitement
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Retourner les tickets simulés
    return NextResponse.json(mockTickets, { status: 200 });
  } catch (error) {
    console.error('Erreur lors de la récupération des tickets:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des tickets' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Créer un nouveau ticket
    const newTicket = {
      id: Date.now().toString(),
      ticketNumber: `TKT-${String(mockTickets.length + 1).padStart(3, '0')}`,
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      subject: body.subject,
      category: body.category || 'support',
      priority: body.priority || 'medium',
      message: body.message,
      status: 'open' as const,
      assignedTo: null,
      responses: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    mockTickets.push(newTicket);
    
    return NextResponse.json(newTicket, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création du ticket:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du ticket' },
      { status: 500 }
    );
  }
}