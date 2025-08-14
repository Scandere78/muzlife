"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
// import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { useAuth } from "../../contexts/AuthContext";
import { User, Lock, Camera, Save, Home, BarChart3 } from "lucide-react";
import Link from "next/link";
import '../../styles/globals.css';

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    }
  }, [user]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (message) setMessage("");
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      if (formData.newPassword) {
        if (formData.newPassword !== formData.confirmPassword) {
          setMessage("Les nouveaux mots de passe ne correspondent pas");
          setLoading(false);
          return;
        }
        if (formData.newPassword.length < 6) {
          setMessage("Le nouveau mot de passe doit contenir au moins 6 caractères");
          setLoading(false);
          return;
        }
        if (!formData.currentPassword) {
          setMessage("Veuillez entrer votre mot de passe actuel");
          setLoading(false);
          return;
        }
      }
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          currentPassword: formData.currentPassword || undefined,
          newPassword: formData.newPassword || undefined
        })
      });
      const data = await response.json();
      if (response.ok) {
        setMessage("Profil mis à jour avec succès !");
        setIsEditing(false);
        setFormData(prev => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        }));
        if (updateProfile) {
          updateProfile(data.user);
        }
      } else {
        setMessage(data.message || "Erreur lors de la mise à jour");
      }
    } catch {
      setMessage("Erreur de connexion au serveur");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center navbar-safe">
        <div className="text-white text-xl">Vous devez être connecté pour accéder à votre profil</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl my-8 bg-black/50 text-white p-4 md:p-6 navbar-safe rounded-2xl">
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        {/* En-tête avec navigation */}
        <div className="mb-8">
          {/* Version Desktop */}
          <div className="hidden md:flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Link href="/">
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                    <Home className="h-4 w-4 mr-2" />
                    Retour au site
                  </Button>
                </Link>
                <span className="text-gray-600">|</span>
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
              </div>
              <h1 className="text-3xl font-bold text-green-400">Mon Profil</h1>
            </div>
            {!isEditing && (
              <Button onClick={() => setIsEditing(true)} className="bg-green-600 hover:bg-green-700">
                Modifier le profil
              </Button>
            )}
          </div>
          {/* Version Mobile */}
          <div className="md:hidden">
            <div className="mb-4">
              <h1 className="text-2xl font-bold text-green-400 mb-3">Mon Profil</h1>
              {/* Boutons de navigation mobile */}
              <div className="flex flex-wrap gap-2 mb-3">
                <Link href="/">
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white text-xs">
                    <Home className="h-4 w-4 mr-1" />
                    Retour au site
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white text-xs">
                    <BarChart3 className="h-4 w-4 mr-1" />
                    Dashboard
                  </Button>
                </Link>
              </div>
            </div>
            {!isEditing && (
              <Button 
                onClick={() => setIsEditing(true)} 
                className="w-full bg-green-600 hover:bg-green-700 mb-4"
              >
                Modifier le profil
              </Button>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Card Avatar et infos de base */}
          <Card className="bg-gray-800 border-gray-700 lg:col-span-1">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <Avatar className="w-20 h-20 md:w-24 md:h-24">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="bg-green-600 text-white text-xl md:text-2xl">
                      {user.name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <Button
                      size="sm"
                      className="absolute bottom-0 right-0 rounded-full w-8 h-8 p-0"
                      variant="secondary"
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
              <CardTitle className="text-white text-lg md:text-xl">{user.name}</CardTitle>
              <CardDescription className="text-gray-400 text-sm md:text-base">{user.email}</CardDescription>
            </CardHeader>
          </Card>
          {/* Card Informations personnelles */}
          <Card className="lg:col-span-2 bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <User className="h-5 w-5 mr-2" />
                Informations personnelles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="bg-gray-700 border-gray-600 text-white disabled:opacity-60"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="bg-gray-700 border-gray-600 text-white disabled:opacity-60"
                    />
                  </div>
                </div>
                {isEditing && (
                  <>
                    <div className="border-t border-gray-600 pt-4 mt-6">
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                        <Lock className="h-5 w-5 mr-2" />
                        Changer le mot de passe (optionnel)
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                          <Input
                            id="currentPassword"
                            name="currentPassword"
                            type="password"
                            value={formData.currentPassword}
                            onChange={handleInputChange}
                            placeholder="Mot de passe actuel"
                            className="bg-gray-700 border-gray-600 text-white"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                          <Input
                            id="newPassword"
                            name="newPassword"
                            type="password"
                            value={formData.newPassword}
                            onChange={handleInputChange}
                            placeholder="Nouveau mot de passe"
                            className="bg-gray-700 border-gray-600 text-white"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword">Confirmer le nouveau</Label>
                          <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            placeholder="Confirmer le nouveau"
                            className="bg-gray-700 border-gray-600 text-white"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
                      <Button
                        type="button"
                        variant="ghost"
                        className="w-full sm:w-auto"
                        onClick={() => {
                          setIsEditing(false);
                          setFormData({
                            name: user.name || '',
                            email: user.email || '',
                            currentPassword: '',
                            newPassword: '',
                            confirmPassword: ''
                          });
                          setMessage('');
                        }}
                      >
                        Annuler
                      </Button>
                      <Button
                        type="submit"
                        disabled={loading}
                        className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
                      >
                        {loading ? 'Sauvegarde...' : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Sauvegarder
                          </>
                        )}
                      </Button>
                    </div>
                  </>
                )}
                {message && (
                  <div className={`text-sm text-center p-3 rounded-md ${
                    message.includes('succès') 
                      ? 'bg-green-900/50 text-green-300 border border-green-600' 
                      : 'bg-red-900/50 text-red-300 border border-red-600'
                  }`}>
                    {message}
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
        {/* Informations du compte */}
        <Card className="mt-6 bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Informations du compte</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Membre depuis :</span>
                <span className="text-white ml-2">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR') : 'N/A'}
                </span>
              </div>
              <div>
                <span className="text-gray-400">Dernière connexion :</span>
                <span className="text-white ml-2">Aujourd&apos;hui</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

