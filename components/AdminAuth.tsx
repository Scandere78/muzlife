'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Shield, Lock, Eye, EyeOff } from 'lucide-react';

interface AdminAuthProps {
  children: React.ReactNode;
}

export default function AdminAuth({ children }: AdminAuthProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Vérifier si déjà authentifié au chargement
  useEffect(() => {
    const adminAuth = localStorage.getItem('admin_auth');
    if (adminAuth === 'authenticated') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulation d'une vérification (remplacer par votre logique d'auth)
    // Pour la démo, le mot de passe est "admin123"
    if (password === 'admin123') {
      localStorage.setItem('admin_auth', 'authenticated');
      setIsAuthenticated(true);
    } else {
      setError('Mot de passe incorrect');
    }
    
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_auth');
    setIsAuthenticated(false);
    setPassword('');
  };

  if (isAuthenticated) {
    return (
      <div>
        {/* Bouton de déconnexion en haut à droite */}
        <div className="fixed top-4 right-4 z-50">
          <Button 
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="bg-white/80 backdrop-blur-sm"
          >
            <Lock className="h-4 w-4 mr-2" />
            Déconnexion
          </Button>
        </div>
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 dark:from-gray-900 dark:to-purple-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-0 shadow-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4 p-3 bg-purple-500 rounded-xl shadow-lg w-fit">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Accès Administrateur
          </CardTitle>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Veuillez vous authentifier pour accéder au dashboard admin
          </p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Mot de passe administrateur
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Entrez le mot de passe admin"
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading || !password}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Vérification...
                </div>
              ) : (
                <>
                  <Shield className="h-4 w-4 mr-2" />
                  Accéder au Dashboard
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-xs text-blue-800 dark:text-blue-200">
              <strong>Note de développement:</strong><br />
              Pour la démo, utilisez le mot de passe: <code className="font-mono bg-blue-100 dark:bg-blue-800 px-1 rounded">admin123</code>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}