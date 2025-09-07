'use client';

import { useState, useEffect } from 'react';
import AdminAuth from '@/components/AdminAuth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { 
  Shield, 
  MessageSquare, 
  Bug, 
  Handshake, 
  HelpCircle,
  Mail,
  Search,
  Filter,
  Calendar,
  User,
  Clock,
  Eye,
  Trash2,
  BarChart3,
  MoreVertical,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  RefreshCcw,
  ArrowLeft,
  Loader2,
  Settings
} from 'lucide-react';

interface ContactSubmission {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  category: string;
  message: string;
  createdAt: string;
  status: 'new' | 'read' | 'replied' | 'closed';
}

export default function AdminDashboard() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/contact-submissions');
      if (response.ok) {
        const data = await response.json();
        setSubmissions(data);
      } else {
        toast.error('Erreur lors du chargement des soumissions');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du chargement des soumissions');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: ContactSubmission['status']) => {
    try {
      const response = await fetch(`/api/admin/contact-submissions/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      
      if (response.ok) {
        setSubmissions(prev => 
          prev.map(sub => 
            sub.id === id ? { ...sub, status } : sub
          )
        );
        toast.success('Statut mis à jour avec succès');
      } else {
        toast.error('Erreur lors de la mise à jour du statut');
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      toast.error('Erreur lors de la mise à jour du statut');
    }
  };

  const deleteSubmission = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/contact-submissions/${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        setSubmissions(prev => prev.filter(sub => sub.id !== id));
        toast.success('Soumission supprimée avec succès');
      } else {
        toast.error('Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'bug': return Bug;
      case 'feature': return HelpCircle;
      case 'partnership': return Handshake;
      case 'support': return MessageSquare;
      default: return Mail;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'bug': return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-700/50';
      case 'feature': return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-700/50';
      case 'partnership': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-700/50';
      case 'support': return 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-700/50';
      default: return 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-700/50';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-700/50';
      case 'read': return 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-700/50';
      case 'replied': return 'bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-900/20 dark:text-teal-300 dark:border-teal-700/50';
      case 'closed': return 'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-900/20 dark:text-slate-300 dark:border-slate-700/50';
      default: return 'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-900/20 dark:text-slate-300 dark:border-slate-700/50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new': return AlertCircle;
      case 'read': return Eye;
      case 'replied': return CheckCircle;
      case 'closed': return XCircle;
      default: return AlertCircle;
    }
  };

  const filteredSubmissions = submissions.filter(submission => {
    const matchesSearch = 
      submission.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === 'all' || submission.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || submission.status === filterStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const stats = {
    total: submissions.length,
    new: submissions.filter(s => s.status === 'new').length,
    pending: submissions.filter(s => s.status === 'read').length,
    resolved: submissions.filter(s => s.status === 'replied' || s.status === 'closed').length
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
              Chargement du tableau de bord admin...
            </p>
            <p className="mt-2 text-sm text-green-600 dark:text-green-400">
              Vérification des permissions et récupération des données
            </p>
          </div>
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
                      <Shield className="h-8 w-8 text-white" />
                    </div>
                    <div className="absolute -inset-1 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl opacity-20 blur animate-pulse" />
                  </div>
                  <div>
                    <h1 className="text-3xl lg:text-4xl font-bold text-green-800 dark:text-white mb-2">
                      🏢 Dashboard Admin MuzLife
                    </h1>
                    <p className="text-green-700 dark:text-green-200 text-base lg:text-lg">
                      Centre de contrôle et gestion avancée
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.location.href = '/admin/tickets'}
                    className="flex items-center gap-2 bg-blue-600 text-white border-0 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 hover:scale-105"
                  >
                    <MessageSquare className="h-4 w-4" />
                    Tickets
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={fetchSubmissions}
                    disabled={loading}
                    className="flex items-center gap-2 bg-white/90 dark:bg-slate-800/90 border-green-200 dark:border-green-700 text-green-700 dark:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-300"
                  >
                    <RefreshCcw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    Actualiser
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.location.href = '/'}
                    className="flex items-center gap-2 bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 text-white border-0 hover:shadow-lg hover:shadow-green-500/30 transition-all duration-300 hover:scale-105"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Retour au site
                  </Button>
                </div>
              </div>
            </div>

            {/* Quick Navigation */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card 
                className="border border-blue-200/50 dark:border-blue-700/50 shadow-lg bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300 cursor-pointer group"
                onClick={() => window.location.href = '/admin/tickets'}
              >
                <CardContent className="p-6 text-center">
                  <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl mx-auto w-fit mb-4 group-hover:scale-110 transition-transform duration-300">
                    <MessageSquare className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-bold text-blue-800 dark:text-blue-200 mb-2">Système de Tickets</h3>
                  <p className="text-blue-600 dark:text-blue-400 text-sm">Gestion avancée des réclamations</p>
                </CardContent>
              </Card>

              <Card 
                className="border border-purple-200/50 dark:border-purple-700/50 shadow-lg bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-300 cursor-pointer group"
                onClick={() => window.location.href = '/admin/analytics'}
              >
                <CardContent className="p-6 text-center">
                  <div className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl mx-auto w-fit mb-4 group-hover:scale-110 transition-transform duration-300">
                    <BarChart3 className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-bold text-purple-800 dark:text-purple-200 mb-2">Analyses</h3>
                  <p className="text-purple-600 dark:text-purple-400 text-sm">Statistiques détaillées</p>
                </CardContent>
              </Card>

              <Card 
                className="border border-amber-200/50 dark:border-amber-700/50 shadow-lg bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm hover:shadow-xl hover:shadow-amber-500/20 transition-all duration-300 cursor-pointer group"
                onClick={() => window.location.href = '/admin/users'}
              >
                <CardContent className="p-6 text-center">
                  <div className="p-4 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl mx-auto w-fit mb-4 group-hover:scale-110 transition-transform duration-300">
                    <User className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-bold text-amber-800 dark:text-amber-200 mb-2">Utilisateurs</h3>
                  <p className="text-amber-600 dark:text-amber-400 text-sm">Gestion des comptes</p>
                </CardContent>
              </Card>

              <Card 
                className="border border-rose-200/50 dark:border-rose-700/50 shadow-lg bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm hover:shadow-xl hover:shadow-rose-500/20 transition-all duration-300 cursor-pointer group"
                onClick={() => window.location.href = '/admin/settings'}
              >
                <CardContent className="p-6 text-center">
                  <div className="p-4 bg-gradient-to-br from-rose-500 to-rose-600 rounded-xl mx-auto w-fit mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Settings className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-bold text-rose-800 dark:text-rose-200 mb-2">Paramètres</h3>
                  <p className="text-rose-600 dark:text-rose-400 text-sm">Configuration système</p>
                </CardContent>
              </Card>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="border border-green-200/50 dark:border-green-700/50 shadow-lg bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm hover:shadow-xl hover:shadow-green-500/20 transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-green-600 dark:text-green-400 uppercase tracking-wider mb-2">Total Messages</p>
                      <p className="text-3xl font-bold text-green-800 dark:text-white">{stats.total}</p>
                      <div className="flex items-center mt-2">
                        <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                        <span className="text-xs text-green-600 dark:text-green-400">Toutes catégories</span>
                      </div>
                    </div>
                    <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <BarChart3 className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-emerald-200/50 dark:border-emerald-700/50 shadow-lg bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm hover:shadow-xl hover:shadow-emerald-500/20 transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-2">📩 Nouveaux</p>
                      <p className="text-3xl font-bold text-emerald-700 dark:text-emerald-300">{stats.new}</p>
                      <div className="flex items-center mt-2">
                        <AlertCircle className="h-3 w-3 text-emerald-500 mr-1" />
                        <span className="text-xs text-emerald-600 dark:text-emerald-400">Nécessite attention</span>
                      </div>
                    </div>
                    <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <MessageSquare className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-amber-200/50 dark:border-amber-700/50 shadow-lg bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm hover:shadow-xl hover:shadow-amber-500/20 transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-2">⏳ En cours</p>
                      <p className="text-3xl font-bold text-amber-700 dark:text-amber-300">{stats.pending}</p>
                      <div className="flex items-center mt-2">
                        <Clock className="h-3 w-3 text-amber-500 mr-1" />
                        <span className="text-xs text-amber-600 dark:text-amber-400">En traitement</span>
                      </div>
                    </div>
                    <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <Clock className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-teal-200/50 dark:border-teal-700/50 shadow-lg bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm hover:shadow-xl hover:shadow-teal-500/20 transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wider mb-2">✅ Résolus</p>
                      <p className="text-3xl font-bold text-teal-700 dark:text-teal-300">{stats.resolved}</p>
                      <div className="flex items-center mt-2">
                        <CheckCircle className="h-3 w-3 text-teal-500 mr-1" />
                        <span className="text-xs text-teal-600 dark:text-teal-400">Traités avec succès</span>
                      </div>
                    </div>
                    <div className="p-3 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <CheckCircle className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <Card className="border border-green-200/50 dark:border-green-700/50 shadow-lg bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm mb-8">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-green-800 dark:text-green-200">
                  <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg shadow-md">
                    <Filter className="h-5 w-5 text-white" />
                  </div>
                  🔍 Filtres et recherche
                </CardTitle>
                <CardDescription className="text-green-700 dark:text-green-300 ml-11">
                  Trouvez rapidement les messages qui vous intéressent
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-green-500" />
                    <Input
                      placeholder="Rechercher par nom, email ou sujet..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-green-50/50 dark:bg-slate-700/50 border-green-200 dark:border-green-700 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                    />
                  </div>
                  
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="bg-green-50/50 dark:bg-slate-700/50 border-green-200 dark:border-green-700 focus:ring-2 focus:ring-green-500">
                      <SelectValue placeholder="Toutes les catégories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les catégories</SelectItem>
                      <SelectItem value="bug">🐛 Signaler un bug</SelectItem>
                      <SelectItem value="feature">✨ Demande de fonctionnalité</SelectItem>
                      <SelectItem value="partnership">🤝 Partenariat</SelectItem>
                      <SelectItem value="support">🛠️ Support technique</SelectItem>
                      <SelectItem value="other">📝 Autre</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="bg-green-50/50 dark:bg-slate-700/50 border-green-200 dark:border-green-700 focus:ring-2 focus:ring-green-500">
                      <SelectValue placeholder="Tous les statuts" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les statuts</SelectItem>
                      <SelectItem value="new">🆕 Nouveau</SelectItem>
                      <SelectItem value="read">👁️ Lu</SelectItem>
                      <SelectItem value="replied">💬 Répondu</SelectItem>
                      <SelectItem value="closed">✅ Fermé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Submissions List */}
            <div className="space-y-6">
              {filteredSubmissions.length === 0 ? (
                <Card className="border border-green-200/50 dark:border-green-700/50 shadow-lg bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm">
                  <CardContent className="p-16 text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-800/50 dark:to-emerald-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
                      <MessageSquare className="h-10 w-10 text-green-600 dark:text-green-400" />
                    </div>
                    <p className="text-2xl font-bold text-green-800 dark:text-green-200 mb-2">
                      📭 Aucun message trouvé
                    </p>
                    <p className="text-green-600 dark:text-green-400 text-lg">
                      Aucun message ne correspond à vos critères de recherche.
                    </p>
                    <p className="text-green-500 dark:text-green-500 text-sm mt-2">
                      Essayez de modifier vos filtres ou votre recherche.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredSubmissions.map((submission) => {
                  const CategoryIcon = getCategoryIcon(submission.category);
                  const StatusIcon = getStatusIcon(submission.status);
                  
                  return (
                    <Card key={submission.id} className="border border-green-200/50 dark:border-green-700/50 shadow-lg bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm hover:shadow-xl hover:shadow-green-500/10 transition-all duration-300 group overflow-hidden">
                      <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-6">
                          <div className="flex items-start gap-4">
                            <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-md group-hover:scale-105 transition-transform duration-300">
                              <CategoryIcon className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-bold text-xl text-green-800 dark:text-white mb-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                                {submission.subject}
                              </h3>
                              <div className="flex flex-wrap items-center gap-3 text-sm text-green-700 dark:text-green-300">
                                <div className="flex items-center gap-1">
                                  <User className="h-4 w-4" />
                                  <span className="font-medium">{submission.firstName} {submission.lastName}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Mail className="h-4 w-4" />
                                  <span className="text-green-600 dark:text-green-400">{submission.email}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge className={`${getCategoryColor(submission.category)} font-medium px-3 py-1 text-xs shadow-sm`}>
                              {submission.category === 'bug' ? '🐛' : 
                               submission.category === 'feature' ? '✨' : 
                               submission.category === 'partnership' ? '🤝' : 
                               submission.category === 'support' ? '🛠️' : '📝'} {submission.category}
                            </Badge>
                            <Badge className={`${getStatusColor(submission.status)} font-medium px-3 py-1 text-xs flex items-center gap-1 shadow-sm`}>
                              <StatusIcon className="h-3 w-3" />
                              {submission.status === 'new' ? 'Nouveau' :
                               submission.status === 'read' ? 'Lu' :
                               submission.status === 'replied' ? 'Répondu' : 'Fermé'}
                            </Badge>
                          </div>
                        </div>

                        <div className="bg-gradient-to-r from-green-50/70 to-emerald-50/70 dark:from-slate-700/30 dark:to-slate-600/30 p-5 rounded-xl mb-6 border border-green-100 dark:border-green-800/50">
                          <p className="text-green-900 dark:text-green-100 whitespace-pre-wrap leading-relaxed">
                            {submission.message}
                          </p>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-green-200/30 dark:border-green-700/30">
                          <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                            <Calendar className="h-4 w-4" />
                            <span className="font-medium">
                              {new Date(submission.createdAt).toLocaleDateString('fr-FR', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-9 px-3 bg-white/90 dark:bg-slate-800/90 border-green-200 dark:border-green-700 text-green-700 dark:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                                >
                                  Statut
                                  <MoreVertical className="h-3 w-3 ml-1" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuLabel>Changer le statut</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => updateStatus(submission.id, 'read')}
                                  disabled={submission.status === 'read'}
                                  className="flex items-center gap-2"
                                >
                                  <Eye className="h-4 w-4" />
                                  Marquer comme lu
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => updateStatus(submission.id, 'replied')}
                                  disabled={submission.status === 'replied'}
                                  className="flex items-center gap-2"
                                >
                                  <MessageSquare className="h-4 w-4" />
                                  Marquer répondu
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => updateStatus(submission.id, 'closed')}
                                  className="flex items-center gap-2"
                                >
                                  <XCircle className="h-4 w-4" />
                                  Fermer
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                            
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-9 px-3 text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/20 transition-colors"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Êtes-vous sûr de vouloir supprimer ce message ? Cette action est irréversible.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => deleteSubmission(submission.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Supprimer
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminAuth>
  );
}