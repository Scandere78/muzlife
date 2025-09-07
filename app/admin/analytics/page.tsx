'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminAuth from '@/components/AdminAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { 
  ArrowLeft,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Activity,
  Clock,
  RefreshCcw,
  Calendar,
  Eye,
  MessageSquare,
  BookOpen,
  Brain,
  Loader2,
  Download,
  Filter,
  Globe,
  Smartphone,
  Monitor,
  Zap,
  Target,
  Award,
  Star,
  Volume2
} from 'lucide-react';

interface AnalyticsData {
  overview: {
    totalUsers: number;
    activeUsers: number;
    newUsers: number;
    userGrowth: number;
    totalSessions: number;
    avgSessionTime: number;
    bounceRate: number;
    retentionRate: number;
  };
  usage: {
    prayers: {
      total: number;
      thisWeek: number;
      growth: number;
    };
    quizzes: {
      total: number;
      thisWeek: number;
      growth: number;
    };
    readings: {
      total: number;
      thisWeek: number;
      growth: number;
    };
    audio: {
      total: number;
      thisWeek: number;
      growth: number;
    };
  };
  demographics: {
    countries: Array<{ name: string; users: number; percentage: number }>;
    devices: Array<{ type: string; users: number; percentage: number }>;
    ages: Array<{ range: string; users: number; percentage: number }>;
  };
  performance: {
    pageViews: number;
    uniqueVisitors: number;
    avgLoadTime: number;
    errorRate: number;
  };
  engagement: {
    dailyActive: Array<{ date: string; users: number }>;
    featureUsage: Array<{ feature: string; usage: number; trend: number }>;
    topPages: Array<{ page: string; views: number; time: number }>;
  };
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/analytics?range=${timeRange}`);
      
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      } else {
        toast.error('Erreur lors du chargement des analyses');
      }
    } catch (error) {
      console.error('Erreur lors du chargement des analyses:', error);
      toast.error('Erreur lors du chargement des analyses');
    } finally {
      setLoading(false);
    }
  };

  const exportData = async () => {
    try {
      toast.info('Génération du rapport en cours...');
      const response = await fetch(`/api/admin/analytics/export?range=${timeRange}`, {
        method: 'POST'
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `muzlife-analytics-${timeRange}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success('Rapport exporté avec succès');
      } else {
        toast.error('Erreur lors de l\'export');
      }
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      toast.error('Erreur lors de l\'export');
    }
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
              Chargement des analyses...
            </p>
            <p className="mt-2 text-sm text-green-600 dark:text-green-400">
              Calcul des statistiques et métriques
            </p>
          </div>
        </div>
      </AdminAuth>
    );
  }

  if (!analytics) {
    return (
      <AdminAuth>
        <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-foreground)', backgroundImage: 'url(/caligraphie.png)' }}>
          <Card className="border border-red-200/50 dark:border-red-700/50 shadow-lg bg-white/95 dark:bg-slate-800/95">
            <CardContent className="p-8 text-center">
              <BarChart3 className="h-16 w-16 text-red-600 dark:text-red-400 mx-auto mb-4 opacity-50" />
              <p className="text-red-700 dark:text-red-300 text-lg font-medium">
                Erreur de chargement des données
              </p>
              <Button onClick={fetchAnalytics} className="mt-4">
                Réessayer
              </Button>
            </CardContent>
          </Card>
        </div>
      </AdminAuth>
    );
  }

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
                      <BarChart3 className="h-8 w-8 text-white" />
                    </div>
                    <div className="absolute -inset-1 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl opacity-20 blur animate-pulse" />
                  </div>
                  <div>
                    <h1 className="text-3xl lg:text-4xl font-bold text-green-800 dark:text-white mb-2">
                      📊 Analyses & Statistiques
                    </h1>
                    <p className="text-green-700 dark:text-green-200 text-base lg:text-lg">
                      Tableau de bord complet des métriques MuzLife
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7d">7 jours</SelectItem>
                      <SelectItem value="30d">30 jours</SelectItem>
                      <SelectItem value="90d">90 jours</SelectItem>
                      <SelectItem value="1y">1 an</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={exportData}
                    className="flex items-center gap-2 bg-blue-600 text-white border-0 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300"
                  >
                    <Download className="h-4 w-4" />
                    Export
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={fetchAnalytics}
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

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="border border-green-200/50 dark:border-green-700/50 shadow-lg bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm hover:shadow-xl hover:shadow-green-500/20 transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-600 dark:text-green-400">Utilisateurs Actifs</p>
                      <p className="text-3xl font-bold text-green-800 dark:text-white">{analytics.overview.activeUsers.toLocaleString()}</p>
                      <div className="flex items-center mt-1">
                        <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                        <span className="text-xs text-green-600 dark:text-green-400">+{analytics.overview.userGrowth}%</span>
                      </div>
                    </div>
                    <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                      <Activity className="h-8 w-8 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-blue-200/50 dark:border-blue-700/50 shadow-lg bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Sessions</p>
                      <p className="text-3xl font-bold text-blue-800 dark:text-blue-300">{analytics.overview.totalSessions.toLocaleString()}</p>
                      <div className="flex items-center mt-1">
                        <Clock className="h-3 w-3 text-blue-500 mr-1" />
                        <span className="text-xs text-blue-600 dark:text-blue-400">{analytics.overview.avgSessionTime}min moy.</span>
                      </div>
                    </div>
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                      <Clock className="h-8 w-8 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-purple-200/50 dark:border-purple-700/50 shadow-lg bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Rétention</p>
                      <p className="text-3xl font-bold text-purple-800 dark:text-purple-300">{analytics.overview.retentionRate}%</p>
                      <div className="flex items-center mt-1">
                        <Target className="h-3 w-3 text-purple-500 mr-1" />
                        <span className="text-xs text-purple-600 dark:text-purple-400">Utilisateurs fidèles</span>
                      </div>
                    </div>
                    <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                      <Target className="h-8 w-8 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-amber-200/50 dark:border-amber-700/50 shadow-lg bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm hover:shadow-xl hover:shadow-amber-500/20 transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-amber-600 dark:text-amber-400">Performance</p>
                      <p className="text-3xl font-bold text-amber-800 dark:text-amber-300">{analytics.performance.avgLoadTime}s</p>
                      <div className="flex items-center mt-1">
                        <Zap className="h-3 w-3 text-amber-500 mr-1" />
                        <span className="text-xs text-amber-600 dark:text-amber-400">Temps de chargement</span>
                      </div>
                    </div>
                    <div className="p-3 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                      <Zap className="h-8 w-8 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Usage Statistics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <Card className="border border-green-200/50 dark:border-green-700/50 shadow-lg bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-800 dark:text-green-200">
                    <Activity className="h-5 w-5" />
                    Utilisation des Fonctionnalités
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50/70 to-emerald-50/70 dark:from-slate-700/30 dark:to-slate-600/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                          <Calendar className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-green-800 dark:text-white">Horaires de Prière</p>
                          <p className="text-sm text-green-600 dark:text-green-400">{analytics.usage.prayers.total.toLocaleString()} consultations</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center text-green-600 dark:text-green-400">
                          <TrendingUp className="h-4 w-4 mr-1" />
                          <span className="text-sm font-medium">+{analytics.usage.prayers.growth}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50/70 to-indigo-50/70 dark:from-slate-700/30 dark:to-slate-600/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                          <Brain className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-blue-800 dark:text-white">Quiz Islamiques</p>
                          <p className="text-sm text-blue-600 dark:text-blue-400">{analytics.usage.quizzes.total.toLocaleString()} tentatives</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center text-blue-600 dark:text-blue-400">
                          <TrendingUp className="h-4 w-4 mr-1" />
                          <span className="text-sm font-medium">+{analytics.usage.quizzes.growth}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50/70 to-violet-50/70 dark:from-slate-700/30 dark:to-slate-600/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                          <BookOpen className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium text-purple-800 dark:text-white">Lecture Coran</p>
                          <p className="text-sm text-purple-600 dark:text-purple-400">{analytics.usage.readings.total.toLocaleString()} lectures</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center text-purple-600 dark:text-purple-400">
                          <TrendingUp className="h-4 w-4 mr-1" />
                          <span className="text-sm font-medium">+{analytics.usage.readings.growth}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-amber-50/70 to-orange-50/70 dark:from-slate-700/30 dark:to-slate-600/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                          <Volume2 className="h-5 w-5 text-amber-600" />
                        </div>
                        <div>
                          <p className="font-medium text-amber-800 dark:text-white">Écoute Audio</p>
                          <p className="text-sm text-amber-600 dark:text-amber-400">{analytics.usage.audio.total.toLocaleString()} écoutes</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center text-amber-600 dark:text-amber-400">
                          <TrendingUp className="h-4 w-4 mr-1" />
                          <span className="text-sm font-medium">+{analytics.usage.audio.growth}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-green-200/50 dark:border-green-700/50 shadow-lg bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-800 dark:text-green-200">
                    <Globe className="h-5 w-5" />
                    Données Démographiques
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium text-green-800 dark:text-white mb-3">Top Pays</h4>
                      <div className="space-y-2">
                        {analytics.demographics.countries.map((country, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-green-700 dark:text-green-300">{country.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-24 h-2 bg-green-100 dark:bg-green-900/30 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-to-r from-green-500 to-emerald-600"
                                  style={{ width: `${country.percentage}%` }}
                                />
                              </div>
                              <span className="text-xs text-green-600 dark:text-green-400 w-12 text-right">
                                {country.users.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-green-800 dark:text-white mb-3">Appareils</h4>
                      <div className="grid grid-cols-3 gap-3">
                        {analytics.demographics.devices.map((device, index) => {
                          const Icon = device.type === 'mobile' ? Smartphone : 
                                     device.type === 'desktop' ? Monitor : Smartphone;
                          return (
                            <div key={index} className="text-center p-3 bg-gradient-to-r from-green-50/70 to-emerald-50/70 dark:from-slate-700/30 dark:to-slate-600/30 rounded-lg">
                              <Icon className="h-6 w-6 text-green-600 mx-auto mb-2" />
                              <p className="text-sm font-medium text-green-800 dark:text-white">{device.percentage}%</p>
                              <p className="text-xs text-green-600 dark:text-green-400">{device.type}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Performance & Engagement */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="border border-green-200/50 dark:border-green-700/50 shadow-lg bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-800 dark:text-green-200">
                    <Eye className="h-5 w-5" />
                    Pages les Plus Visitées
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analytics.engagement.topPages.map((page, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50/70 to-emerald-50/70 dark:from-slate-700/30 dark:to-slate-600/30 rounded-lg">
                        <div>
                          <p className="font-medium text-green-800 dark:text-white">{page.page}</p>
                          <div className="flex items-center gap-3 text-xs text-green-600 dark:text-green-400">
                            <span>{page.views.toLocaleString()} vues</span>
                            <span>•</span>
                            <span>{page.time}min moy.</span>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="w-16 h-2 bg-green-100 dark:bg-green-900/30 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-green-500 to-emerald-600"
                              style={{ width: `${Math.min(100, (page.views / Math.max(...analytics.engagement.topPages.map(p => p.views))) * 100)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-green-200/50 dark:border-green-700/50 shadow-lg bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-800 dark:text-green-200">
                    <Star className="h-5 w-5" />
                    Engagement par Fonctionnalité
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analytics.engagement.featureUsage.map((feature, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50/70 to-emerald-50/70 dark:from-slate-700/30 dark:to-slate-600/30 rounded-lg">
                        <div>
                          <p className="font-medium text-green-800 dark:text-white">{feature.feature}</p>
                          <p className="text-xs text-green-600 dark:text-green-400">{feature.usage}% d'utilisation</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-green-100 dark:bg-green-900/30 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-green-500 to-emerald-600"
                              style={{ width: `${feature.usage}%` }}
                            />
                          </div>
                          <div className="flex items-center">
                            {feature.trend > 0 ? (
                              <TrendingUp className="h-3 w-3 text-green-500" />
                            ) : (
                              <TrendingDown className="h-3 w-3 text-red-500" />
                            )}
                            <span className={`text-xs ml-1 ${feature.trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {Math.abs(feature.trend)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AdminAuth>
  );
}