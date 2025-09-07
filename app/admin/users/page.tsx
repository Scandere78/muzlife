'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminAuth from '@/components/AdminAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { 
  ArrowLeft,
  Users,
  Search,
  Filter,
  Calendar,
  User,
  Mail,
  Shield,
  ShieldCheck,
  Clock,
  RefreshCcw,
  Eye,
  Trash2,
  UserPlus,
  UserMinus,
  Loader2,
  MapPin,
  Activity,
  Star,
  TrendingUp,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

interface UserData {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'user' | 'admin' | 'moderator';
  status: 'active' | 'inactive' | 'banned' | 'pending';
  emailVerified: boolean;
  lastActive: string;
  registeredAt: string;
  location?: string;
  totalPrayers: number;
  totalQuizzes: number;
  totalReadings: number;
  streakDays: number;
  preferences: {
    notifications: boolean;
    darkMode: boolean;
    language: string;
  };
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/users');
      
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        toast.error('Erreur lors du chargement des utilisateurs');
      }
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error);
      toast.error('Erreur lors du chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  const updateUserStatus = async (id: string, status: UserData['status']) => {
    try {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        setUsers(prev => 
          prev.map(user => 
            user.id === id ? { ...user, status } : user
          )
        );
        
        if (selectedUser?.id === id) {
          setSelectedUser(prev => prev ? { ...prev, status } : null);
        }
        
        toast.success('Statut utilisateur mis à jour');
      } else {
        toast.error('Erreur lors de la mise à jour du statut');
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast.error('Erreur lors de la mise à jour du statut');
    }
  };

  const updateUserRole = async (id: string, role: UserData['role']) => {
    try {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role }),
      });

      if (response.ok) {
        setUsers(prev => 
          prev.map(user => 
            user.id === id ? { ...user, role } : user
          )
        );
        
        if (selectedUser?.id === id) {
          setSelectedUser(prev => prev ? { ...prev, role } : null);
        }
        
        toast.success('Rôle utilisateur mis à jour');
      } else {
        toast.error('Erreur lors de la mise à jour du rôle');
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast.error('Erreur lors de la mise à jour du rôle');
    }
  };

  const deleteUser = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        setUsers(prev => prev.filter(user => user.id !== id));
        if (selectedUser?.id === id) {
          setSelectedUser(null);
        }
        toast.success('Utilisateur supprimé avec succès');
      } else {
        toast.error('Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300';
      case 'moderator': return 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300';
      case 'user': return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300';
      case 'inactive': return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300';
      case 'banned': return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return CheckCircle;
      case 'inactive': return Clock;
      case 'banned': return XCircle;
      case 'pending': return AlertCircle;
      default: return Clock;
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const stats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    inactive: users.filter(u => u.status === 'inactive').length,
    admins: users.filter(u => u.role === 'admin').length,
    verified: users.filter(u => u.emailVerified).length
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
              Chargement des utilisateurs...
            </p>
            <p className="mt-2 text-sm text-green-600 dark:text-green-400">
              Récupération des données utilisateurs
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
                      <Users className="h-8 w-8 text-white" />
                    </div>
                    <div className="absolute -inset-1 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl opacity-20 blur animate-pulse" />
                  </div>
                  <div>
                    <h1 className="text-3xl lg:text-4xl font-bold text-green-800 dark:text-white mb-2">
                      👥 Gestion des Utilisateurs
                    </h1>
                    <p className="text-green-700 dark:text-green-200 text-base lg:text-lg">
                      Administration complète des comptes utilisateurs
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={fetchUsers}
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
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-emerald-200/50 dark:border-emerald-700/50 shadow-lg bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm hover:shadow-xl hover:shadow-emerald-500/20 transition-all duration-300">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Actifs</p>
                      <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">{stats.active}</p>
                    </div>
                    <Activity className="h-6 w-6 text-emerald-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-gray-200/50 dark:border-gray-700/50 shadow-lg bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm hover:shadow-xl hover:shadow-gray-500/20 transition-all duration-300">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Inactifs</p>
                      <p className="text-2xl font-bold text-gray-700 dark:text-gray-300">{stats.inactive}</p>
                    </div>
                    <Clock className="h-6 w-6 text-gray-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-red-200/50 dark:border-red-700/50 shadow-lg bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm hover:shadow-xl hover:shadow-red-500/20 transition-all duration-300">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-red-600 dark:text-red-400 uppercase tracking-wider">Admins</p>
                      <p className="text-2xl font-bold text-red-700 dark:text-red-300">{stats.admins}</p>
                    </div>
                    <ShieldCheck className="h-6 w-6 text-red-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-blue-200/50 dark:border-blue-700/50 shadow-lg bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Vérifiés</p>
                      <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{stats.verified}</p>
                    </div>
                    <CheckCircle className="h-6 w-6 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Users List */}
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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-green-500" />
                        <Input
                          placeholder="Rechercher par nom ou email..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 bg-green-50/50 dark:bg-slate-700/50 border-green-200 dark:border-green-700 focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                      
                      <Select value={filterRole} onValueChange={setFilterRole}>
                        <SelectTrigger className="bg-green-50/50 dark:bg-slate-700/50 border-green-200 dark:border-green-700">
                          <SelectValue placeholder="Rôle" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tous les rôles</SelectItem>
                          <SelectItem value="admin">🔴 Admin</SelectItem>
                          <SelectItem value="moderator">🟠 Modérateur</SelectItem>
                          <SelectItem value="user">🔵 Utilisateur</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select value={filterStatus} onValueChange={setFilterStatus}>
                        <SelectTrigger className="bg-green-50/50 dark:bg-slate-700/50 border-green-200 dark:border-green-700">
                          <SelectValue placeholder="Statut" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tous les statuts</SelectItem>
                          <SelectItem value="active">🟢 Actif</SelectItem>
                          <SelectItem value="inactive">⚪ Inactif</SelectItem>
                          <SelectItem value="banned">🔴 Banni</SelectItem>
                          <SelectItem value="pending">🟡 En attente</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                {/* Users */}
                <div className="space-y-4">
                  {filteredUsers.map((user) => {
                    const StatusIcon = getStatusIcon(user.status);
                    const isSelected = selectedUser?.id === user.id;
                    
                    return (
                      <Card 
                        key={user.id} 
                        className={`border shadow-lg bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm hover:shadow-xl transition-all duration-300 cursor-pointer ${
                          isSelected 
                            ? 'border-green-400 dark:border-green-600 shadow-green-500/20' 
                            : 'border-green-200/50 dark:border-green-700/50 hover:shadow-green-500/10'
                        }`}
                        onClick={() => setSelectedUser(user)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-4 mb-4">
                            <div className="flex items-start gap-3">
                              <div className="relative">
                                {user.avatar ? (
                                  <img
                                    src={user.avatar}
                                    alt={user.name}
                                    className="h-12 w-12 rounded-full border-2 border-green-200 dark:border-green-700"
                                  />
                                ) : (
                                  <div className="h-12 w-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                    {user.name.charAt(0).toUpperCase()}
                                  </div>
                                )}
                                <div className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white ${
                                  user.status === 'active' ? 'bg-green-500' : 
                                  user.status === 'inactive' ? 'bg-gray-400' : 
                                  user.status === 'banned' ? 'bg-red-500' : 'bg-yellow-500'
                                }`} />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="font-bold text-lg text-green-800 dark:text-white">
                                    {user.name}
                                  </h3>
                                  {user.emailVerified && (
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                  )}
                                </div>
                                <div className="flex items-center gap-3 text-sm text-green-700 dark:text-green-300 mb-2">
                                  <div className="flex items-center gap-1">
                                    <Mail className="h-3 w-3" />
                                    <span className="text-green-600 dark:text-green-400">{user.email}</span>
                                  </div>
                                  {user.location && (
                                    <div className="flex items-center gap-1">
                                      <MapPin className="h-3 w-3" />
                                      <span>{user.location}</span>
                                    </div>
                                  )}
                                </div>
                                <div className="flex items-center gap-4 text-xs text-green-600 dark:text-green-400">
                                  <span>🕌 {user.totalPrayers} prières</span>
                                  <span>🧠 {user.totalQuizzes} quiz</span>
                                  <span>📖 {user.totalReadings} lectures</span>
                                  <span>🔥 {user.streakDays} jours</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex flex-col items-end gap-2">
                              <Badge className={`${getStatusColor(user.status)} font-medium px-3 py-1 text-xs flex items-center gap-1`}>
                                <StatusIcon className="h-3 w-3" />
                                {user.status === 'active' ? 'Actif' :
                                 user.status === 'inactive' ? 'Inactif' :
                                 user.status === 'banned' ? 'Banni' : 'En attente'}
                              </Badge>
                              <Badge className={`${getRoleColor(user.role)} text-xs px-2 py-1`}>
                                {user.role === 'admin' ? 'Admin' :
                                 user.role === 'moderator' ? 'Modérateur' : 'Utilisateur'}
                              </Badge>
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-xs text-green-600 dark:text-green-400">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>
                                Inscrit le {new Date(user.registeredAt).toLocaleDateString('fr-FR')}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>
                                Actif {new Date(user.lastActive).toLocaleDateString('fr-FR')}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>

              {/* User Details */}
              <div className="xl:col-span-1">
                {selectedUser ? (
                  <Card className="border border-green-200/50 dark:border-green-700/50 shadow-lg bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm sticky top-4">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-green-800 dark:text-green-200">
                          Détails Utilisateur
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-center">
                        {selectedUser.avatar ? (
                          <img
                            src={selectedUser.avatar}
                            alt={selectedUser.name}
                            className="h-20 w-20 rounded-full border-4 border-green-200 dark:border-green-700 mx-auto mb-3"
                          />
                        ) : (
                          <div className="h-20 w-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-3">
                            {selectedUser.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <h3 className="font-bold text-xl text-green-800 dark:text-white">
                          {selectedUser.name}
                        </h3>
                        <p className="text-green-600 dark:text-green-400 text-sm">
                          {selectedUser.email}
                        </p>
                      </div>

                      {/* Statistics */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-gradient-to-r from-green-50/70 to-emerald-50/70 dark:from-slate-700/30 dark:to-slate-600/30 p-3 rounded-lg text-center">
                          <p className="text-2xl font-bold text-green-800 dark:text-white">{selectedUser.totalPrayers}</p>
                          <p className="text-xs text-green-600 dark:text-green-400">Prières</p>
                        </div>
                        <div className="bg-gradient-to-r from-green-50/70 to-emerald-50/70 dark:from-slate-700/30 dark:to-slate-600/30 p-3 rounded-lg text-center">
                          <p className="text-2xl font-bold text-green-800 dark:text-white">{selectedUser.totalQuizzes}</p>
                          <p className="text-xs text-green-600 dark:text-green-400">Quiz</p>
                        </div>
                        <div className="bg-gradient-to-r from-green-50/70 to-emerald-50/70 dark:from-slate-700/30 dark:to-slate-600/30 p-3 rounded-lg text-center">
                          <p className="text-2xl font-bold text-green-800 dark:text-white">{selectedUser.totalReadings}</p>
                          <p className="text-xs text-green-600 dark:text-green-400">Lectures</p>
                        </div>
                        <div className="bg-gradient-to-r from-green-50/70 to-emerald-50/70 dark:from-slate-700/30 dark:to-slate-600/30 p-3 rounded-lg text-center">
                          <p className="text-2xl font-bold text-green-800 dark:text-white">{selectedUser.streakDays}</p>
                          <p className="text-xs text-green-600 dark:text-green-400">Jours consécutifs</p>
                        </div>
                      </div>

                      {/* Status Update */}
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-green-800 dark:text-green-200">Statut</label>
                          <Select
                            value={selectedUser.status}
                            onValueChange={(value) => updateUserStatus(selectedUser.id, value as UserData['status'])}
                          >
                            <SelectTrigger className="w-full mt-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="active">Actif</SelectItem>
                              <SelectItem value="inactive">Inactif</SelectItem>
                              <SelectItem value="banned">Banni</SelectItem>
                              <SelectItem value="pending">En attente</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-green-800 dark:text-green-200">Rôle</label>
                          <Select
                            value={selectedUser.role}
                            onValueChange={(value) => updateUserRole(selectedUser.id, value as UserData['role'])}
                          >
                            <SelectTrigger className="w-full mt-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="user">Utilisateur</SelectItem>
                              <SelectItem value="moderator">Modérateur</SelectItem>
                              <SelectItem value="admin">Administrateur</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="pt-4 border-t border-green-200 dark:border-green-700">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/20 transition-colors"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Supprimer l'utilisateur
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                              <AlertDialogDescription>
                                Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible et supprimera toutes ses données.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Annuler</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteUser(selectedUser.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Supprimer
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="border border-green-200/50 dark:border-green-700/50 shadow-lg bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm">
                    <CardContent className="p-8 text-center">
                      <Users className="h-16 w-16 text-green-600 dark:text-green-400 mx-auto mb-4 opacity-50" />
                      <p className="text-green-700 dark:text-green-300 text-lg font-medium">
                        Sélectionnez un utilisateur
                      </p>
                      <p className="text-green-600 dark:text-green-400 text-sm mt-1">
                        Cliquez sur un utilisateur pour voir les détails
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