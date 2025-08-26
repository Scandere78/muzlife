'use client';

import { useState, useEffect } from 'react';
import AdminAuth from '@/components/AdminAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  Download,
  BarChart3,
  ArrowLeft,
  MoreVertical,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  RefreshCcw
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

export default function AdminPage() {
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
      const response = await fetch('/api/admin/contact-submissions');
      if (response.ok) {
        const data = await response.json();
        setSubmissions(data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des soumissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: ContactSubmission['status']) => {
    try {
      const response = await fetch(`/api/admin/contact-submissions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      
      if (response.ok) {
        setSubmissions(prev => 
          prev.map(sub => sub.id === id ? { ...sub, status } : sub)
        );
        toast.success(`Statut mis à jour avec succès`);
      } else {
        toast.error('Erreur lors de la mise à jour du statut');
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
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
      case 'bug': return 'bg-red-100 text-red-800 border-red-200';
      case 'feature': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'partnership': return 'bg-green-100 text-green-800 border-green-200';
      case 'support': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300';
      case 'read': return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300';
      case 'replied': return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300';
      case 'closed': return 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900/20 dark:text-slate-300';
      default: return 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900/20 dark:text-slate-300';
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement du dashboard admin...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminAuth>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25" />
        <div className="relative">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="relative p-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg">
                <Shield className="h-8 w-8 text-white" />
                <div className="absolute -inset-0.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl opacity-30 blur" />
              </div>
              <div>
                <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
                <p className="text-slate-600 dark:text-slate-400 text-lg mt-1">
                  Gestion intelligente des demandes de contact
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={fetchSubmissions}
                className="flex items-center gap-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all duration-200"
              >
                <RefreshCcw className="h-4 w-4" />
                Actualiser
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => window.location.href = '/'}
                className="flex items-center gap-2 bg-white/80 backdrop-blur-sm hover:bg-white hover:shadow-lg transition-all duration-300"
              >
                <ArrowLeft className="h-5 w-5" />
                Retour au site
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm dark:bg-slate-800/90 hover:shadow-2xl transition-all duration-300 group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Total</p>
                  <p className="text-4xl font-bold text-slate-900 dark:text-white mt-2">{stats.total}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-3 w-3 text-emerald-500 mr-1" />
                    <span className="text-xs text-emerald-600 dark:text-emerald-400">+12% ce mois</span>
                  </div>
                </div>
                <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <BarChart3 className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm dark:bg-slate-800/90 hover:shadow-2xl transition-all duration-300 group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Nouveaux</p>
                  <p className="text-4xl font-bold text-emerald-600 mt-2">{stats.new}</p>
                  <div className="flex items-center mt-2">
                    <AlertCircle className="h-3 w-3 text-emerald-500 mr-1" />
                    <span className="text-xs text-slate-600 dark:text-slate-400">Nécessite attention</span>
                  </div>
                </div>
                <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <MessageSquare className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm dark:bg-slate-800/90 hover:shadow-2xl transition-all duration-300 group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">En cours</p>
                  <p className="text-4xl font-bold text-amber-600 mt-2">{stats.pending}</p>
                  <div className="flex items-center mt-2">
                    <Clock className="h-3 w-3 text-amber-500 mr-1" />
                    <span className="text-xs text-slate-600 dark:text-slate-400">En traitement</span>
                  </div>
                </div>
                <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <Clock className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm dark:bg-slate-800/90 hover:shadow-2xl transition-all duration-300 group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Résolus</p>
                  <p className="text-4xl font-bold text-blue-600 mt-2">{stats.resolved}</p>
                  <div className="flex items-center mt-2">
                    <CheckCircle className="h-3 w-3 text-blue-500 mr-1" />
                    <span className="text-xs text-slate-600 dark:text-slate-400">Traités</span>
                  </div>
                </div>
                <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm dark:bg-slate-800/95 mb-8">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
              <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
                <Filter className="h-4 w-4 text-white" />
              </div>
              Filtres intelligents
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400">
              Trouvez rapidement les soumissions qui vous intéressent
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Rechercher par nom, email ou sujet..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600">
                  <SelectValue placeholder="Toutes les catégories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les catégories</SelectItem>
                  <SelectItem value="bug">Signaler un bug</SelectItem>
                  <SelectItem value="feature">Demande de fonctionnalité</SelectItem>
                  <SelectItem value="partnership">Partenariat</SelectItem>
                  <SelectItem value="support">Support technique</SelectItem>
                  <SelectItem value="other">Autre</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600">
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="new">Nouveau</SelectItem>
                  <SelectItem value="read">Lu</SelectItem>
                  <SelectItem value="replied">Répondu</SelectItem>
                  <SelectItem value="closed">Fermé</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Submissions List */}
        <div className="space-y-6">
          {filteredSubmissions.length === 0 ? (
            <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm dark:bg-slate-800/95">
              <CardContent className="p-16 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MessageSquare className="h-10 w-10 text-slate-500 dark:text-slate-400" />
                </div>
                <p className="text-2xl font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Aucune soumission trouvée
                </p>
                <p className="text-slate-500 dark:text-slate-400 text-lg">
                  Aucune réclamation ne correspond à vos critères de recherche.
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredSubmissions.map((submission) => {
              const CategoryIcon = getCategoryIcon(submission.category);
              const StatusIcon = getStatusIcon(submission.status);
              
              return (
                <Card key={submission.id} className="border-0 shadow-xl bg-white/95 backdrop-blur-sm dark:bg-slate-800/95 hover:shadow-2xl transition-all duration-500 group overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                          <CategoryIcon className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            {submission.subject}
                          </h3>
                          <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              <span>{submission.firstName} {submission.lastName}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              <span>{submission.email}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Badge className={`${getCategoryColor(submission.category)} font-medium px-3 py-1 text-xs`}>
                          {submission.category}
                        </Badge>
                        <Badge className={`${getStatusColor(submission.status)} font-medium px-3 py-1 text-xs flex items-center gap-1`}>
                          <StatusIcon className="h-3 w-3" />
                          {submission.status}
                        </Badge>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-700/50 dark:to-slate-600/50 p-5 rounded-xl mb-6 border border-slate-200/50 dark:border-slate-600/50">
                      <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                        {submission.message}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
                      <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
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
                              className="h-9 px-3 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
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
                                Êtes-vous sûr de vouloir supprimer cette soumission ? Cette action est irréversible.
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