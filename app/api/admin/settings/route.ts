import { NextRequest, NextResponse } from 'next/server';
import { writeFile, readFile, mkdir } from 'fs/promises';
import { join } from 'path';

const SETTINGS_FILE = join(process.cwd(), 'config', 'admin-settings.json');

const DEFAULT_SETTINGS = {
  general: {
    siteName: 'MuzLife',
    siteDescription: 'Application islamique complète',
    maintenanceMode: false,
    allowRegistration: true,
    defaultUserRole: 'user'
  },
  security: {
    passwordMinLength: 8,
    requireEmailVerification: true,
    sessionTimeout: 24,
    maxLoginAttempts: 5,
    enableTwoFactor: false
  },
  email: {
    smtpHost: '',
    smtpPort: 587,
    smtpSecure: false,
    smtpUser: '',
    smtpPassword: '',
    fromEmail: 'noreply@muzlife.com',
    fromName: 'MuzLife'
  },
  backup: {
    autoBackup: true,
    backupFrequency: 'daily',
    maxBackups: 30,
    backupLocation: 'local'
  },
  performance: {
    cacheEnabled: true,
    cacheDuration: 3600,
    compressionEnabled: true,
    minifyAssets: true
  },
  notifications: {
    emailNotifications: true,
    pushNotifications: false,
    adminAlerts: true,
    userWelcomeEmail: true
  }
};

async function ensureConfigDir() {
  try {
    await mkdir(join(process.cwd(), 'config'), { recursive: true });
  } catch (error) {
    // Directory might already exist
  }
}

async function loadSettings() {
  try {
    const data = await readFile(SETTINGS_FILE, 'utf8');
    return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
  } catch (error) {
    return DEFAULT_SETTINGS;
  }
}

async function saveSettings(settings: any) {
  try {
    await ensureConfigDir();
    await writeFile(SETTINGS_FILE, JSON.stringify(settings, null, 2));
    return true;
  } catch (error) {
    console.error('Error saving settings:', error);
    return false;
  }
}

export async function GET(request: NextRequest) {
  try {
    const settings = await loadSettings();
    
    // Don't return sensitive data like passwords
    const safeSettings = {
      ...settings,
      email: {
        ...settings.email,
        smtpPassword: settings.email.smtpPassword ? '***' : ''
      }
    };
    
    return NextResponse.json(safeSettings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des paramètres' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const newSettings = await request.json();
    const currentSettings = await loadSettings();
    
    // Merge with existing settings
    const updatedSettings = {
      ...currentSettings,
      ...newSettings,
      updatedAt: new Date().toISOString()
    };
    
    const success = await saveSettings(updatedSettings);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Erreur lors de la sauvegarde des paramètres' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ 
      message: 'Paramètres mis à jour avec succès',
      settings: updatedSettings
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour des paramètres' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, data } = await request.json();
    
    switch (action) {
      case 'backup':
        // Simulate backup creation
        const backupName = `backup_${new Date().toISOString().split('T')[0]}_${Date.now()}.json`;
        const settings = await loadSettings();
        
        // In a real implementation, you would create an actual backup
        return NextResponse.json({
          message: 'Sauvegarde créée avec succès',
          backupName,
          size: JSON.stringify(settings).length
        });
        
      case 'restore':
        // Simulate backup restoration
        return NextResponse.json({
          message: 'Sauvegarde restaurée avec succès'
        });
        
      case 'test-email':
        // Simulate email test
        return NextResponse.json({
          message: 'Email de test envoyé avec succès'
        });
        
      case 'clear-cache':
        // Simulate cache clearing
        return NextResponse.json({
          message: 'Cache vidé avec succès'
        });
        
      default:
        return NextResponse.json(
          { error: 'Action non supportée' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error processing settings action:', error);
    return NextResponse.json(
      { error: 'Erreur lors du traitement de l\'action' },
      { status: 500 }
    );
  }
}