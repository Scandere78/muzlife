import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import * as nodemailer from 'nodemailer';

const prisma = new PrismaClient();

// Configuration SMTP (vous devez configurer vos propres identifiants)
const SMTP_CONFIG = {
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  user: process.env.SMTP_USER,
  pass: process.env.SMTP_PASS,
  from: process.env.SMTP_FROM || 'noreply@muzlife.com',
};

// Fonction pour générer un code de vérification à 6 chiffres
function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Fonction pour envoyer l'email de vérification
async function sendVerificationEmail(email: string, code: string): Promise<boolean> {
  try {
    console.log(`📧 Tentative d'envoi du code de vérification pour ${email}: ${code}`);
    
    const transporter = nodemailer.createTransport({
      host: SMTP_CONFIG.host,
      port: SMTP_CONFIG.port,
      secure: false,
      auth: {
        user: SMTP_CONFIG.user,
        pass: SMTP_CONFIG.pass,
      },
    });

    const mailOptions = {
      from: SMTP_CONFIG.from,
      to: email,
      subject: 'Code de vérification MuzLife',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
          <div style="background: white; border-radius: 12px; padding: 30px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #059669; margin: 0; font-size: 28px;">🕌 MuzLife</h1>
            </div>
            
            <h2 style="color: #1f2937; text-align: center; margin-bottom: 20px;">Bienvenue sur MuzLife !</h2>
            
            <p style="color: #4b5563; font-size: 16px; line-height: 1.6; text-align: center;">
              Merci de vous être inscrit sur MuzLife. Pour finaliser la création de votre compte, 
              veuillez utiliser le code de vérification ci-dessous :
            </p>
            
            <div style="background: linear-gradient(135deg, #059669, #34d399); padding: 25px; text-align: center; border-radius: 12px; margin: 30px 0;">
              <div style="color: white; font-size: 14px; margin-bottom: 8px; opacity: 0.9;">VOTRE CODE DE VÉRIFICATION</div>
              <div style="font-size: 36px; font-weight: bold; color: white; letter-spacing: 8px; font-family: monospace;">${code}</div>
            </div>
            
            <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 8px;">
              <p style="margin: 0; color: #92400e; font-size: 14px;">
                ⏰ <strong>Important :</strong> Ce code est valide pendant 10 minutes seulement.
              </p>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; line-height: 1.5; text-align: center; margin-top: 30px;">
              Si vous n'avez pas créé de compte MuzLife, vous pouvez ignorer cet email en toute sécurité.
            </p>
            
            <div style="border-top: 1px solid #e5e7eb; margin-top: 30px; padding-top: 20px; text-align: center;">
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                © ${new Date().getFullYear()} MuzLife - Votre compagnon spirituel
              </p>
            </div>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Email de vérification envoyé avec succès à ${email}`);    
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email requis" },
        { status: 400 }
      );
    }

    // Vérifier si l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    if (user.isEmailVerified) {
      return NextResponse.json(
        { error: "Email déjà vérifié" },
        { status: 400 }
      );
    }

    // Générer un nouveau code de vérification
    const verificationCode = generateVerificationCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Mettre à jour l'utilisateur avec le nouveau code
    await prisma.user.update({
      where: { email },
      data: {
        emailVerificationToken: verificationCode,
        emailVerificationExpires: expiresAt,
      }
    });

    // Envoyer l'email
    const emailSent = await sendVerificationEmail(email, verificationCode);

    if (!emailSent) {
      return NextResponse.json(
        { error: "Erreur lors de l'envoi de l'email" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Code de vérification envoyé" },
      { status: 200 }
    );

  } catch (error) {
    console.error("Erreur lors du renvoi de la vérification:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}