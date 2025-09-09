'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminAuth from '@/components/AdminAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { 
  ArrowLeft,
  Settings,
  Save,
  RefreshCcw,
  Loader2,
  Database,
  Shield,
  Mail,
  Smartphone,
  Globe,
  Palette,
  Bell,
  Key,
  Server,
  Cloud,
  Lock,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle,
  Upload,
  Download
} from 'lucide-react';

interface SystemSettings {
  general: {
    siteName: string;
    siteDescription: string;
    maintenanceMode: boolean;
    registrationEnabled: boolean;
    emailVerificationRequired: boolean;
    defaultLanguage: string;
    timezone: string;
  };
  security: {
    passwordMinLength: number;
    requireSpecialCharacters: boolean;
    sessionTimeout: number;
    maxLoginAttempts: number;
    enableTwoFactor: boolean;
    apiRateLimit: number;
  };
  email: {
    smtpHost: string;
    smtpPort: number;
    smtpUsername: string;
    smtpPassword: string;
    fromEmail: string;
    fromName: string;
    enableEmailNotifications: boolean;
  };
  notifications: {
    enablePushNotifications: boolean;
    enableEmailNotifications: boolean;
    enableSMSNotifications: boolean;
    notificationRetentionDays: number;
  };
  storage: {
    maxFileSize: number;
    allowedFileTypes: string[];
    storageProvider: 'local' | 'aws' | 'cloudinary';
    awsBucket?: string;
    awsRegion?: string;
    cloudinaryCloudName?: string;
  };
  api: {
    enablePublicAPI: boolean;
    apiVersion: string;
    rateLimitPerMinute: number;
    requireApiKey: boolean;
  };
  backup: {
    enableAutoBackup: boolean;
    backupFrequency: 'daily' | 'weekly' | 'monthly';
    backupRetentionDays: number;
    backupLocation: string;
    lastBackupDate?: string;
  };
  performance: {
    enableCaching: boolean;
    cacheTimeout: number;
    enableCompression: boolean;
    enableCDN: boolean;
    cdnUrl?: string;
  };
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', label: 'Général', icon: Settings },
    { id: 'security', label: 'Sécurité', icon: Shield },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'storage', label: 'Stockage', icon: Database },
    { id: 'api', label: 'API', icon: Key },
    { id: 'backup', label: 'Sauvegarde', icon: Cloud },
    { id: 'performance', label: 'Performance', icon: Server }
  ];

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/settings');
      
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      } else {
        toast.error('Erreur lors du chargement des paramètres');
      }
    } catch (error) {
      console.error('Erreur lors du chargement des paramètres:', error);
      toast.error('Erreur lors du chargement des paramètres');
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    if (!settings) return;

    try {
      setSaving(true);
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        toast.success('Paramètres sauvegardés avec succès');
      } else {
        toast.error('Erreur lors de la sauvegarde');
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const createBackup = async () => {
    try {
      toast.info('Création de la sauvegarde en cours...');
      const response = await fetch('/api/admin/backup', {
        method: 'POST'
      });
      
      if (response.ok) {
        const result = await response.json();
        toast.success('Sauvegarde créée avec succès');
        // Update last backup date
        if (settings) {
          setSettings({
            ...settings,
            backup: {
              ...settings.backup,
              lastBackupDate: new Date().toISOString()
            }
          });
        }
      } else {
        toast.error('Erreur lors de la création de la sauvegarde');
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast.error('Erreur lors de la création de la sauvegarde');
    }
  };

  const updateSetting = (section: keyof SystemSettings, key: string, value: any) => {
    if (!settings) return;
    
    setSettings({
      ...settings,
      [section]: {
        ...settings[section],
        [key]: value
      }
    });
  };

  if (loading) {
    return (
      <AdminAuth>
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center" style={{ background: 'var(--color-foreground)', backgroundImage: 'url(/caligraphie.png)' }}>
          <div className="text-center">
            <div className="relative inline-block">
              <Loader2 className="h-16 w-16 text-green-600 dark:text-green-400 animate-spin" />
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 animate-pulse" />
            </div>
            <p className="mt-6 text-xl font-medium text-green-800 dark:text-green-200">
              Chargement des paramètres...
            </p>
            <p className="mt-2 text-sm text-green-600 dark:text-green-400">
              Configuration système et préférences
            </p>
          </div>
        </div>
      </AdminAuth>
    );
  }

  if (!settings) {
    return (
      <AdminAuth>
        <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-foreground)', backgroundImage: 'url(/caligraphie.png)' }}>
          <Card className="border border-red-200/50 dark:border-red-700/50 shadow-lg bg-white/95 dark:bg-slate-800/95">
            <CardContent className="p-8 text-center">
              <Settings className="h-16 w-16 text-red-600 dark:text-red-400 mx-auto mb-4 opacity-50" />
              <p className="text-red-700 dark:text-red-300 text-lg font-medium">
                Erreur de chargement des paramètres
              </p>
              <Button onClick={fetchSettings} className="mt-4">
                Réessayer
              </Button>
            </CardContent>
          </Card>
        </div>
      </AdminAuth>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="siteName">Nom du Site</Label>
              <Input
                id="siteName"
                value={settings.general.siteName}
                onChange={(e) => updateSetting('general', 'siteName', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="siteDescription">Description du Site</Label>
              <Textarea
                id="siteDescription"
                value={settings.general.siteDescription}
                onChange={(e) => updateSetting('general', 'siteDescription', e.target.value)}
                className="mt-1"
                rows={3}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Mode Maintenance</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">Désactive temporairement l'accès au site</p>
              </div>
              <Switch
                checked={settings.general.maintenanceMode}
                onCheckedChange={(checked) => updateSetting('general', 'maintenanceMode', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Inscription Activée</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">Permet aux nouveaux utilisateurs de s'inscrire</p>
              </div>
              <Switch
                checked={settings.general.registrationEnabled}
                onCheckedChange={(checked) => updateSetting('general', 'registrationEnabled', checked)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="defaultLanguage">Langue par Défaut</Label>
                <Select
                  value={settings.general.defaultLanguage}
                  onValueChange={(value) => updateSetting('general', 'defaultLanguage', value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="ar">العربية</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="timezone">Fuseau Horaire</Label>
                <Select
                  value={settings.general.timezone}
                  onValueChange={(value) => updateSetting('general', 'timezone', value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Europe/Paris">Europe/Paris</SelectItem>
                    <SelectItem value="Africa/Casablanca">Africa/Casablanca</SelectItem>
                    <SelectItem value="UTC">UTC</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="passwordMinLength">Longueur Minimum du Mot de Passe</Label>
                <Input
                  id="passwordMinLength"
                  type="number"
                  value={settings.security.passwordMinLength}
                  onChange={(e) => updateSetting('security', 'passwordMinLength', parseInt(e.target.value))}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="maxLoginAttempts">Tentatives de Connexion Max</Label>
                <Input
                  id="maxLoginAttempts"
                  type="number"
                  value={settings.security.maxLoginAttempts}
                  onChange={(e) => updateSetting('security', 'maxLoginAttempts', parseInt(e.target.value))}
                  className="mt-1"
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Caractères Spéciaux Requis</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">Oblige l'utilisation de caractères spéciaux</p>
              </div>
              <Switch
                checked={settings.security.requireSpecialCharacters}
                onCheckedChange={(checked) => updateSetting('security', 'requireSpecialCharacters', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Authentification à Deux Facteurs</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active 2FA pour tous les administrateurs</p>
              </div>
              <Switch
                checked={settings.security.enableTwoFactor}
                onCheckedChange={(checked) => updateSetting('security', 'enableTwoFactor', checked)}
              />
            </div>
            <div>
              <Label htmlFor="sessionTimeout">Timeout de Session (minutes)</Label>
              <Input
                id="sessionTimeout"
                type="number"
                value={settings.security.sessionTimeout}
                onChange={(e) => updateSetting('security', 'sessionTimeout', parseInt(e.target.value))}
                className="mt-1"
              />
            </div>
          </div>
        );

      case 'email':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="smtpHost">Serveur SMTP</Label>
                <Input
                  id="smtpHost"
                  value={settings.email.smtpHost}
                  onChange={(e) => updateSetting('email', 'smtpHost', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="smtpPort">Port SMTP</Label>
                <Input
                  id="smtpPort"
                  type="number"
                  value={settings.email.smtpPort}
                  onChange={(e) => updateSetting('email', 'smtpPort', parseInt(e.target.value))}
                  className="mt-1"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="smtpUsername">Nom d'Utilisateur SMTP</Label>
                <Input
                  id="smtpUsername"
                  value={settings.email.smtpUsername}
                  onChange={(e) => updateSetting('email', 'smtpUsername', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="smtpPassword">Mot de Passe SMTP</Label>
                <div className="relative mt-1">
                  <Input
                    id="smtpPassword"
                    type={showPasswords ? "text" : "password"}
                    value={settings.email.smtpPassword}
                    onChange={(e) => updateSetting('email', 'smtpPassword', e.target.value)}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(!showPasswords)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fromEmail">Email Expéditeur</Label>
                <Input
                  id="fromEmail"
                  type="email"
                  value={settings.email.fromEmail}
                  onChange={(e) => updateSetting('email', 'fromEmail', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="fromName">Nom Expéditeur</Label>
                <Input
                  id="fromName"
                  value={settings.email.fromName}
                  onChange={(e) => updateSetting('email', 'fromName', e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        );

      case 'backup':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label>Sauvegarde Automatique</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active les sauvegardes automatiques</p>
              </div>
              <Switch
                checked={settings.backup.enableAutoBackup}
                onCheckedChange={(checked) => updateSetting('backup', 'enableAutoBackup', checked)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="backupFrequency">Fréquence</Label>
                <Select
                  value={settings.backup.backupFrequency}
                  onValueChange={(value) => updateSetting('backup', 'backupFrequency', value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Quotidienne</SelectItem>
                    <SelectItem value="weekly">Hebdomadaire</SelectItem>
                    <SelectItem value="monthly">Mensuelle</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="backupRetentionDays">Rétention (jours)</Label>
                <Input
                  id="backupRetentionDays"
                  type="number"
                  value={settings.backup.backupRetentionDays}
                  onChange={(e) => updateSetting('backup', 'backupRetentionDays', parseInt(e.target.value))}
                  className="mt-1"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="backupLocation">Emplacement de Sauvegarde</Label>
              <Input
                id="backupLocation"
                value={settings.backup.backupLocation}
                onChange={(e) => updateSetting('backup', 'backupLocation', e.target.value)}
                className="mt-1"
              />
            </div>
            {settings.backup.lastBackupDate && (
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-green-800 dark:text-green-200">Dernière sauvegarde</span>
                </div>
                <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                  {new Date(settings.backup.lastBackupDate).toLocaleString('fr-FR')}
                </p>
              </div>
            )}
            <Button onClick={createBackup} className="w-full">
              <Cloud className="h-4 w-4 mr-2" />
              Créer une Sauvegarde Maintenant
            </Button>
          </div>
        );

      default:
        return (
          <div className="text-center py-12">
            <Settings className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              Section de paramètres en cours de développement
            </p>
          </div>
        );
    }
  };

  return (
    <AdminAuth>
      <div className="min-h-screen" style={{ background: 'var(--color-foreground)', backgroundImage: 'url(/caligraphie.png)' }}>
        <div className="relative">
          <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="p-4 bg-gradient-to-br from-green-600 via-emerald-600 to-green-700 rounded-2xl shadow-lg">
                      <Settings className="h-8 w-8 text-white" />
                    </div>
                    <div className="absolute -inset-1 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl opacity-20 blur animate-pulse" />
                  </div>
                  <div>
                    <h1 className="text-3xl lg:text-4xl font-bold text-green-800 dark:text-white mb-2">
                      ⚙️ Paramètres Système
                    </h1>
                    <p className="text-green-700 dark:text-green-200 text-base lg:text-lg">
                      Configuration avancée de l'application MuzLife
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Button
                    onClick={saveSettings}
                    disabled={saving}
                    className="flex items-center gap-2 bg-blue-600 text-white border-0 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300"
                  >
                    <Save className={`h-4 w-4 ${saving ? 'animate-pulse' : ''}`} />
                    {saving ? 'Sauvegarde...' : 'Sauvegarder'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={fetchSettings}
                    disabled={loading}
                    className="flex items-center gap-2 bg-white/90 dark:bg-slate-800/90 border-green-200 dark:border-green-700 text-green-700 dark:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-300"
                  >
                    <RefreshCcw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    Actualiser
                  </Button>
                  <Link href="/admin">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2 bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 text-white border-0 hover:shadow-lg hover:shadow-green-500/30 transition-all duration-300 hover:scale-105"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Retour Dashboard
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Tabs Navigation */}
              <div className="lg:col-span-1">
                <Card className="border border-green-200/50 dark:border-green-700/50 shadow-lg bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm sticky top-4">
                  <CardContent className="p-4">
                    <nav className="space-y-2">
                      {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                          <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all duration-200 ${
                              isActive 
                                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg' 
                                : 'text-green-700 dark:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20'
                            }`}
                          >
                            <Icon className="h-5 w-5" />
                            <span className="font-medium">{tab.label}</span>
                          </button>
                        );
                      })}
                    </nav>
                  </CardContent>
                </Card>
              </div>

              {/* Tab Content */}
              <div className="lg:col-span-3">
                <Card className="border border-green-200/50 dark:border-green-700/50 shadow-lg bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-green-800 dark:text-green-200">
                      {tabs.find(tab => tab.id === activeTab)?.label}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {renderTabContent()}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminAuth>
  );
}