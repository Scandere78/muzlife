"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { useAuth } from "../../contexts/AuthContext";

interface AuthModalProps {
  isOpen: boolean;
  onCloseAction: () => void;
}

export default function AuthModal({ isOpen, onCloseAction }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState<{
    email: string;
    password: string;
    name: string;
    confirmPassword: string;
  }>({
    email: "",
    password: "",
    name: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      let result: { success: boolean; error?: string };
      if (isLogin) {
        result = await login(formData.email, formData.password);
      } else {
        if (formData.password !== formData.confirmPassword) {
          setError("Les mots de passe ne correspondent pas");
          setLoading(false);
          return;
        }
        result = await register(formData.email, formData.name, formData.password);
      }
      if (result.success) {
        onCloseAction();
        setFormData({ email: "", password: "", name: "", confirmPassword: "" });
        setIsLogin(true);
      } else {
        setError(result.error || "Erreur inconnue");
      }
    } catch {
      setError("Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      onClick={onCloseAction}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <Card className="bg-gray-800 border-gray-700 text-white">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-green-400">
              {isLogin ? "Connexion" : "Inscription"}
            </CardTitle>
            <CardDescription className="text-gray-400">
              {isLogin
                ? "Connectez-vous pour sauvegarder vos progrès"
                : "Créez un compte pour suivre vos statistiques"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={isLogin ? "login" : "register"} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger
                  value="login"
                  onClick={() => setIsLogin(true)}
                  className="data-[state=active]:bg-green-600"
                >
                  Connexion
                </TabsTrigger>
                <TabsTrigger
                  value="register"
                  onClick={() => setIsLogin(false)}
                  className="data-[state=active]:bg-green-600"
                >
                  Inscription
                </TabsTrigger>
              </TabsList>
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Votre nom"
                      required={!isLogin}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="votre@email.com"
                    required
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Mot de passe</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    required
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="••••••••"
                      required={!isLogin}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                )}
                {error && (
                  <div className="text-red-400 text-sm text-center">
                    {error}
                  </div>
                )}
                <Button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700"
                  disabled={loading}
                >
                  {loading
                    ? "Chargement..."
                    : isLogin
                    ? "Se connecter"
                    : "S'inscrire"}
                </Button>
              </form>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
