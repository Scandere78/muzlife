import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import * as nodemailer from 'nodemailer';

// Fonctions de sécurité
function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
    .replace(/\//g, "&#x2F;");
}

function sanitizeEmailHeader(str: string): string {
  return str.replace(/[\r\n\x00]/g, '');
}

// Configuration SMTP
const SMTP_CONFIG = {
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  user: process.env.SMTP_USER,
  pass: process.env.SMTP_PASS,
  from: process.env.SMTP_FROM || 'noreply@muzlife.com',
  adminEmail: process.env.ADMIN_EMAIL || 'admin@muzlife.com',
};

// Types pour le formulaire de contact
interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  category: string;
  message: string;
}

// Fonction pour envoyer l'email de notification à l'admin
async function sendAdminNotification(data: ContactFormData): Promise<boolean> {
  try {
    // Si les credentials SMTP ne sont pas configurés, on simule l'envoi
    if (!SMTP_CONFIG.user || !SMTP_CONFIG.pass) {
      console.log('📧 Mode développement: Simulation de notification admin pour', data.email);
      console.log('Données du formulaire:', data);
      return true;
    }

    const transporter = nodemailer.createTransport({
      host: SMTP_CONFIG.host,
      port: SMTP_CONFIG.port,
      secure: false,
      auth: {
        user: SMTP_CONFIG.user,
        pass: SMTP_CONFIG.pass,
      },
    });

    const categoryLabels: Record<string, string> = {
      'bug': '🐛 Signalement de bug',
      'feature': '💡 Demande de fonctionnalité',
      'partnership': '🤝 Demande de partenariat',
      'support': '🔧 Support technique',
      'other': '📝 Autre demande'
    };

    const categoryLabel = categoryLabels[data.category] || '📝 Autre demande';

    const mailOptions = {
      from: SMTP_CONFIG.from,
      to: SMTP_CONFIG.adminEmail,
      subject: sanitizeEmailHeader(`[MuzLife Contact] ${categoryLabel} - ${data.subject}`),
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
          <div style="background: white; border-radius: 12px; padding: 30px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            
            <!-- Header -->
            <div style="text-align: center; margin-bottom: 30px; border-bottom: 3px solid #059669; padding-bottom: 20px;">
              <h1 style="color: #059669; margin: 0; font-size: 28px;">🕌 MuzLife</h1>
              <p style="color: #6b7280; margin: 5px 0 0 0; font-size: 14px;">Nouveau message de contact</p>
            </div>

            <!-- Category Badge -->
            <div style="text-align: center; margin-bottom: 25px;">
              <span style="display: inline-block; background: linear-gradient(135deg, #059669, #34d399); color: white; padding: 8px 20px; border-radius: 20px; font-weight: bold; font-size: 14px;">
                ${escapeHtml(categoryLabel)}
              </span>
            </div>

            <!-- Contact Info -->
            <div style="background: #f3f4f6; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
              <h3 style="color: #1f2937; margin: 0 0 15px 0; font-size: 18px;">Informations du contact</h3>
              <div style="display: grid; gap: 10px;">
                <div style="display: flex; align-items: center;">
                  <strong style="color: #374151; min-width: 80px;">Nom:</strong>
                  <span style="color: #6b7280;">${escapeHtml(data.firstName)} ${escapeHtml(data.lastName)}</span>
                </div>
                <div style="display: flex; align-items: center;">
                  <strong style="color: #374151; min-width: 80px;">Email:</strong>
                  <a href="mailto:${escapeHtml(data.email)}" style="color: #059669; text-decoration: none;">${escapeHtml(data.email)}</a>
                </div>
                <div style="display: flex; align-items: center;">
                  <strong style="color: #374151; min-width: 80px;">Sujet:</strong>
                  <span style="color: #6b7280;">${escapeHtml(data.subject)}</span>
                </div>
              </div>
            </div>

            <!-- Message -->
            <div style="background: #fff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
              <h3 style="color: #1f2937; margin: 0 0 15px 0; font-size: 18px;">Message</h3>
              <div style="color: #4b5563; line-height: 1.6; white-space: pre-wrap; font-size: 15px;">
${escapeHtml(data.message)}
              </div>
            </div>

            <!-- Action Buttons -->
            <div style="text-align: center; margin-top: 30px;">
              <a href="mailto:${escapeHtml(data.email)}?subject=${encodeURIComponent('Re: ' + sanitizeEmailHeader(data.subject))}" 
                 style="display: inline-block; background: linear-gradient(135deg, #059669, #34d399); color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 0 10px;">
                📧 Répondre
              </a>
            </div>

            <!-- Footer -->
            <div style="border-top: 1px solid #e5e7eb; margin-top: 30px; padding-top: 20px; text-align: center;">
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                © ${new Date().getFullYear()} MuzLife - Système de contact automatique
              </p>
              <p style="color: #9ca3af; font-size: 11px; margin: 5px 0 0 0;">
                Reçu le ${new Date().toLocaleString('fr-FR')}
              </p>
            </div>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Notification admin envoyée pour le contact de ${data.email}`);
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'envoi de la notification admin:', error);
    return false;
  }
}

// Fonction pour envoyer l'email de confirmation à l'utilisateur
async function sendUserConfirmation(data: ContactFormData): Promise<boolean> {
  try {
    // Si les credentials SMTP ne sont pas configurés, on simule l'envoi
    if (!SMTP_CONFIG.user || !SMTP_CONFIG.pass) {
      console.log('📧 Mode développement: Simulation de confirmation pour', data.email);
      return true;
    }

    const transporter = nodemailer.createTransport({
      host: SMTP_CONFIG.host,
      port: SMTP_CONFIG.port,
      secure: false,
      auth: {
        user: SMTP_CONFIG.user,
        pass: SMTP_CONFIG.pass,
      },
    });

    const categoryLabels: Record<string, string> = {
      'bug': 'Signalement de bug',
      'feature': 'Demande de fonctionnalité',
      'partnership': 'Demande de partenariat',
      'support': 'Support technique',
      'other': 'Autre demande'
    };

    const categoryLabel = categoryLabels[data.category] || 'Autre demande';

    const mailOptions = {
      from: SMTP_CONFIG.from,
      to: data.email,
      subject: sanitizeEmailHeader(`Confirmation de réception - ${data.subject}`),
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
          <div style="background: white; border-radius: 12px; padding: 30px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            
            <!-- Header -->
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #059669; margin: 0; font-size: 28px;">🕌 MuzLife</h1>
              <p style="color: #6b7280; margin: 5px 0 0 0;">Merci pour votre message</p>
            </div>

            <!-- Confirmation Message -->
            <div style="background: linear-gradient(135deg, #d1fae5, #a7f3d0); border-radius: 12px; padding: 25px; text-align: center; margin-bottom: 25px;">
              <div style="font-size: 48px; margin-bottom: 10px;">✅</div>
              <h2 style="color: #065f46; margin: 0 0 10px 0; font-size: 24px;">Message bien reçu !</h2>
              <p style="color: #047857; margin: 0; font-size: 16px;">
                Nous avons bien reçu votre demande et nous vous répondrons sous 24 heures.
              </p>
            </div>

            <!-- Recap -->
            <div style="background: #f9fafb; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
              <h3 style="color: #1f2937; margin: 0 0 15px 0; font-size: 16px;">Récapitulatif de votre demande</h3>
              <div style="color: #6b7280; font-size: 14px; line-height: 1.6;">
                <p><strong>Type:</strong> ${escapeHtml(categoryLabel)}</p>
                <p><strong>Sujet:</strong> ${escapeHtml(data.subject)}</p>
                <p><strong>Date:</strong> ${new Date().toLocaleString('fr-FR')}</p>
              </div>
            </div>

            <!-- What's Next -->
            <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 8px;">
              <p style="margin: 0; color: #92400e; font-size: 14px;">
                <strong>Prochaines étapes :</strong><br>
                • Nous analysons votre demande<br>
                • Un membre de notre équipe vous contactera<br>
                • Délai de réponse : sous 24 heures
              </p>
            </div>

            <!-- Contact Info -->
            <div style="text-align: center; margin-top: 25px;">
              <p style="color: #6b7280; font-size: 14px; margin: 0;">
                Une question urgente ? Contactez-nous directement à<br>
                <a href="mailto:contact@muzlife.com" style="color: #059669; text-decoration: none; font-weight: bold;">contact@muzlife.com</a>
              </p>
            </div>

            <!-- Footer -->
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
    console.log(`✅ Email de confirmation envoyé à ${data.email}`);
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'envoi de la confirmation:', error);
    return false;
  }
}

// Validation des données
function validateContactData(data: ContactFormData): string | null {
  if (!data.firstName || data.firstName.trim().length < 2) {
    return "Le prénom doit contenir au moins 2 caractères";
  }
  
  if (!data.lastName || data.lastName.trim().length < 2) {
    return "Le nom doit contenir au moins 2 caractères";
  }
  
  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return "Email invalide";
  }
  
  if (!data.subject || data.subject.trim().length < 5) {
    return "Le sujet doit contenir au moins 5 caractères";
  }
  
  if (!data.category || !['bug', 'feature', 'partnership', 'support', 'other'].includes(data.category)) {
    return "Catégorie invalide";
  }
  
  if (!data.message || data.message.trim().length < 10) {
    return "Le message doit contenir au moins 10 caractères";
  }
  
  return null;
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validation des données
    const validationError = validateContactData(data);
    if (validationError) {
      return NextResponse.json(
        { error: validationError },
        { status: 400 }
      );
    }

    const contactData: ContactFormData = {
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      email: data.email.trim().toLowerCase(),
      subject: data.subject.trim(),
      category: data.category,
      message: data.message.trim()
    };

    // Sauvegarder dans la base de données avec Prisma
    try {
      const savedMessage = await prisma.contactMessage.create({
        data: {
          firstName: contactData.firstName,
          lastName: contactData.lastName,
          email: contactData.email,
          subject: contactData.subject,
          category: contactData.category,
          message: contactData.message,
        }
      });
      console.log('💾 Message sauvegardé en base de données avec l\'ID:', savedMessage.id);
    } catch (dbError) {
      console.warn('⚠️  Erreur Prisma (Windows ARM64) - Mode fallback activé:', dbError instanceof Error ? dbError.message : 'Erreur inconnue');
      // Fallback: Log structuré pour récupération manuelle
      console.log('📝 CONTACT_MESSAGE_FALLBACK:', JSON.stringify({
        ...contactData,
        timestamp: new Date().toISOString(),
        source: 'website_contact_form'
      }));
      // On continue sans bloquer l'utilisateur
    }

    // Envoyer les emails
    const [adminNotified, userConfirmed] = await Promise.all([
      sendAdminNotification(contactData),
      sendUserConfirmation(contactData)
    ]);

    if (!adminNotified) {
      console.error('Échec de la notification admin');
    }
    
    if (!userConfirmed) {
      console.error('Échec de la confirmation utilisateur');
    }

    // Succès même si un email échoue
    return NextResponse.json(
      { 
        message: "Message envoyé avec succès",
        emailsSent: {
          adminNotified,
          userConfirmed
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Erreur lors du traitement du contact:", error);
    return NextResponse.json(
      { error: "Erreur serveur interne" },
      { status: 500 }
    );
  }
}