'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminAuth from '@/components/AdminAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { 
  ArrowLeft,
  Ticket,
  Search,
  Filter,
  Calendar,
  User,
  Mail,
  MessageCircle,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RefreshCcw,
  Eye,
  Send,
  Trash2,
  FileText,
  Tag,
  ArrowUp,
  Bug,
  Lightbulb,
  Handshake,
  HelpCircle,
  Star,
  TrendingUp,
  Loader2
} from 'lucide-react';

interface Ticket {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  category: string;
  priority: string;
  status: string;
  assignedTo?: string;
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  user?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
}


export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/tickets');
      
      if (response.ok) {
        const data = await response.json();
        setTickets(data.tickets || []);
      } else {
        toast.error('Erreur lors du chargement des tickets');
      }
    } catch (error) {
      console.error('Erreur lors du chargement des tickets:', error);
      toast.error('Erreur lors du chargement des tickets');
    } finally {
      setLoading(false);
    }
  };

  const updateTicketStatus = async (id: string, status: Ticket['status']) => {
    try {
      const response = await fetch(`/api/admin/tickets/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        setTickets(prev => 
          prev.map(ticket => 
            ticket.id === id 
              ? { ...ticket, status, updatedAt: new Date().toISOString() } 
              : ticket
          )
        );
        
        if (selectedTicket?.id === id) {
          setSelectedTicket(prev => prev ? { ...prev, status, updatedAt: new Date().toISOString() } : null);
        }
        
        toast.success('Statut du ticket mis à jour');
      } else {
        toast.error('Erreur lors de la mise à jour du statut');
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast.error('Erreur lors de la mise à jour du statut');
    }
  };


  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'bug': return Bug;
      case 'feature': return Lightbulb;
      case 'partnership': return Handshake;
      case 'support': return HelpCircle;
      default: return FileText;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'bug': return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300';
      case 'feature': return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300';
      case 'partnership': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300';
      case 'support': return 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300';
      case 'general': return 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300';
      case 'feedback': return 'bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300';
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300';
      case 'resolved': return 'bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-900/20 dark:text-teal-300';
      case 'closed': return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = 
      ticket.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === 'all' || ticket.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || ticket.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || ticket.priority === filterPriority;
    
    return matchesSearch && matchesCategory && matchesStatus && matchesPriority;
  });

  const stats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === 'open').length,
    inProgress: tickets.filter(t => t.status === 'in-progress').length,
    resolved: tickets.filter(t => t.status === 'resolved').length,
    highPriority: tickets.filter(t => t.priority === 'high' || t.priority === 'urgent').length
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
              Chargement des tickets...
            </p>
            <p className="mt-2 text-sm text-green-600 dark:text-green-400">
              Récupération des données du système de tickets
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
                      <Ticket className="h-8 w-8 text-white" />
                    </div>
                    <div className="absolute -inset-1 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl opacity-20 blur animate-pulse" />
                  </div>
                  <div>
                    <h1 className="text-3xl lg:text-4xl font-bold text-green-800 dark:text-white mb-2">
                      🎫 Système de Tickets
                    </h1>
                    <p className="text-green-700 dark:text-green-200 text-base lg:text-lg">
                      Gestion avancée des réclamations et demandes
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={fetchTickets}
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

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
              <Card className="border border-green-200/50 dark:border-green-700/50 shadow-lg bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm hover:shadow-xl hover:shadow-green-500/20 transition-all duration-300">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-green-600 dark:text-green-400 uppercase tracking-wider">Total</p>
                      <p className="text-2xl font-bold text-green-800 dark:text-white">{stats.total}</p>
                    </div>
                    <FileText className="h-6 w-6 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-emerald-200/50 dark:border-emerald-700/50 shadow-lg bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm hover:shadow-xl hover:shadow-emerald-500/20 transition-all duration-300">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Ouverts</p>
                      <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">{stats.open}</p>
                    </div>
                    <AlertCircle className="h-6 w-6 text-emerald-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-blue-200/50 dark:border-blue-700/50 shadow-lg bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">En cours</p>
                      <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{stats.inProgress}</p>
                    </div>
                    <Clock className="h-6 w-6 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-teal-200/50 dark:border-teal-700/50 shadow-lg bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm hover:shadow-xl hover:shadow-teal-500/20 transition-all duration-300">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wider">Résolus</p>
                      <p className="text-2xl font-bold text-teal-700 dark:text-teal-300">{stats.resolved}</p>
                    </div>
                    <CheckCircle2 className="h-6 w-6 text-teal-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-orange-200/50 dark:border-orange-700/50 shadow-lg bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm hover:shadow-xl hover:shadow-orange-500/20 transition-all duration-300">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-orange-600 dark:text-orange-400 uppercase tracking-wider">Priorité Haute</p>
                      <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">{stats.highPriority}</p>
                    </div>
                    <Star className="h-6 w-6 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Tickets List */}
              <div className="xl:col-span-2">
                {/* Filters */}
                <Card className="border border-green-200/50 dark:border-green-700/50 shadow-lg bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm mb-6">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3 text-green-800 dark:text-green-200">
                      <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg shadow-md">
                        <Filter className="h-4 w-4 text-white" />
                      </div>
                      Filtres de recherche
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-green-500" />
                        <Input
                          placeholder="Rechercher..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 bg-green-50/50 dark:bg-slate-700/50 border-green-200 dark:border-green-700 focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                      
                      <Select value={filterCategory} onValueChange={setFilterCategory}>
                        <SelectTrigger className="bg-green-50/50 dark:bg-slate-700/50 border-green-200 dark:border-green-700">
                          <SelectValue placeholder="Catégorie" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Toutes les catégories</SelectItem>
                          <SelectItem value="general">❓ Question générale</SelectItem>
                          <SelectItem value="support">🛠️ Support technique</SelectItem>
                          <SelectItem value="feature">💡 Suggestion de fonctionnalité</SelectItem>
                          <SelectItem value="bug">🐛 Signaler un bug</SelectItem>
                          <SelectItem value="partnership">🤝 Partenariat</SelectItem>
                          <SelectItem value="feedback">📝 Retour d'expérience</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select value={filterStatus} onValueChange={setFilterStatus}>
                        <SelectTrigger className="bg-green-50/50 dark:bg-slate-700/50 border-green-200 dark:border-green-700">
                          <SelectValue placeholder="Statut" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tous les statuts</SelectItem>
                          <SelectItem value="open">🟢 Ouvert</SelectItem>
                          <SelectItem value="in-progress">🔵 En cours</SelectItem>
                          <SelectItem value="resolved">✅ Résolu</SelectItem>
                          <SelectItem value="closed">⚪ Fermé</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select value={filterPriority} onValueChange={setFilterPriority}>
                        <SelectTrigger className="bg-green-50/50 dark:bg-slate-700/50 border-green-200 dark:border-green-700">
                          <SelectValue placeholder="Priorité" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Toutes les priorités</SelectItem>
                          <SelectItem value="urgent">🔴 Urgent</SelectItem>
                          <SelectItem value="high">🟠 Haute</SelectItem>
                          <SelectItem value="medium">🟡 Moyenne</SelectItem>
                          <SelectItem value="low">🟢 Basse</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                {/* Tickets */}
                <div className="space-y-4">
                  {filteredTickets.map((ticket) => {
                    const CategoryIcon = getCategoryIcon(ticket.category);
                    const isSelected = selectedTicket?.id === ticket.id;
                    
                    return (
                      <Card 
                        key={ticket.id} 
                        className={`border shadow-lg bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm hover:shadow-xl transition-all duration-300 cursor-pointer ${
                          isSelected 
                            ? 'border-green-400 dark:border-green-600 shadow-green-500/20' 
                            : 'border-green-200/50 dark:border-green-700/50 hover:shadow-green-500/10'
                        }`}
                        onClick={() => setSelectedTicket(ticket)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-4 mb-4">
                            <div className="flex items-start gap-3">
                              <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg shadow-md">
                                <CategoryIcon className="h-5 w-5 text-white" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-mono text-sm text-green-600 dark:text-green-400 font-semibold">
                                    #{ticket.id.slice(-8)}
                                  </span>
                                  <Badge className={`${getPriorityColor(ticket.priority)} text-xs px-2 py-0.5`}>
                                    {ticket.priority.toUpperCase()}
                                  </Badge>
                                </div>
                                <h3 className="font-bold text-lg text-green-800 dark:text-white mb-1 line-clamp-2">
                                  {ticket.subject}
                                </h3>
                                <div className="flex items-center gap-3 text-sm text-green-700 dark:text-green-300">
                                  <div className="flex items-center gap-1">
                                    <User className="h-3 w-3" />
                                    <span>{ticket.name}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Mail className="h-3 w-3" />
                                    <span className="text-green-600 dark:text-green-400">{ticket.email}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex flex-col items-end gap-2">
                              <Badge className={`${getStatusColor(ticket.status)} font-medium px-3 py-1 text-xs`}>
                                {ticket.status === 'open' ? 'Ouvert' :
                                 ticket.status === 'in-progress' ? 'En cours' :
                                 ticket.status === 'resolved' ? 'Résolu' : 'Fermé'}
                              </Badge>
                              <Badge className={`${getCategoryColor(ticket.category)} text-xs px-2 py-1`}>
                                {ticket.category}
                              </Badge>
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-xs text-green-600 dark:text-green-400">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>
                                {new Date(ticket.createdAt).toLocaleDateString('fr-FR', {
                                  day: '2-digit',
                                  month: '2-digit',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>
                            {ticket.user && (
                              <div className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                <span>Utilisateur connecté</span>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>

              {/* Ticket Details */}
              <div className="xl:col-span-1">
                {selectedTicket ? (
                  <Card className="border border-green-200/50 dark:border-green-700/50 shadow-lg bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm sticky top-4">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-green-800 dark:text-green-200">
                          #{selectedTicket.id.slice(-8)}
                        </CardTitle>
                        <div className="flex gap-2">
                          <Select
                            value={selectedTicket.status}
                            onValueChange={(value) => updateTicketStatus(selectedTicket.id, value as Ticket['status'])}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="open">Ouvert</SelectItem>
                              <SelectItem value="in-progress">En cours</SelectItem>
                              <SelectItem value="resolved">Résolu</SelectItem>
                              <SelectItem value="closed">Fermé</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-green-800 dark:text-white mb-2">
                          {selectedTicket.subject}
                        </h3>
                        <div className="bg-gradient-to-r from-green-50/70 to-emerald-50/70 dark:from-slate-700/30 dark:to-slate-600/30 p-3 rounded-lg border border-green-100 dark:border-green-800/50">
                          <p className="text-green-900 dark:text-green-100 text-sm leading-relaxed">
                            {selectedTicket.message}
                          </p>
                        </div>
                      </div>

                      {/* Informations additionnelles */}
                      <div className="grid grid-cols-2 gap-3 pt-4 border-t border-green-200 dark:border-green-700">
                        <div className="text-center p-3 bg-gradient-to-r from-green-50/70 to-emerald-50/70 dark:from-slate-700/30 dark:to-slate-600/30 rounded-lg">
                          <p className="text-lg font-bold text-green-800 dark:text-white">{selectedTicket.category}</p>
                          <p className="text-xs text-green-600 dark:text-green-400">Catégorie</p>
                        </div>
                        <div className="text-center p-3 bg-gradient-to-r from-green-50/70 to-emerald-50/70 dark:from-slate-700/30 dark:to-slate-600/30 rounded-lg">
                          <p className="text-lg font-bold text-green-800 dark:text-white">{selectedTicket.priority}</p>
                          <p className="text-xs text-green-600 dark:text-green-400">Priorité</p>
                        </div>
                      </div>

                      {selectedTicket.user && (
                        <div className="p-3 bg-gradient-to-r from-blue-50/70 to-indigo-50/70 dark:from-slate-700/30 dark:to-slate-600/30 rounded-lg">
                          <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                            👤 Utilisateur connecté : {selectedTicket.user.name}
                          </p>
                          <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                            {selectedTicket.user.email}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="border border-green-200/50 dark:border-green-700/50 shadow-lg bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm">
                    <CardContent className="p-8 text-center">
                      <Ticket className="h-16 w-16 text-green-600 dark:text-green-400 mx-auto mb-4 opacity-50" />
                      <p className="text-green-700 dark:text-green-300 text-lg font-medium">
                        Sélectionnez un ticket
                      </p>
                      <p className="text-green-600 dark:text-green-400 text-sm mt-1">
                        Cliquez sur un ticket pour voir les détails
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminAuth>
  );
}