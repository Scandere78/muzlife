"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { useAuth } from "../../contexts/AuthContext";
import EmailVerificationModal from "./EmailVerificationModal";

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
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");
  const [pendingPassword, setPendingPassword] = useState("");
  const { login } = useAuth();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      let result: { success: boolean; error?: string; requiresVerification?: boolean; email?: string } = { success: false };
      if (isLogin) {
        result = await login(formData.email, formData.password);
        
        // Si la connexion échoue à cause d'un email non vérifié
        if (!result.success && result.requiresVerification && result.email) {
          setPendingEmail(result.email);
          setPendingPassword(formData.password);
          setShowEmailVerification(true);
          setFormData({ email: "", password: "", name: "", confirmPassword: "" });
          setLoading(false);
          return;
        }
      } else {
        if (formData.password !== formData.confirmPassword) {
          setError("Les mots de passe ne correspondent pas");
          setLoading(false);
          return;
        }
        // Pour l'inscription, on fait appel direct à l'API pour gérer la vérification d'email
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            name: formData.name,
            password: formData.password,
          }),
        });
        
        const data = await response.json();
        
        if (response.ok) {
          if (data.needsEmailVerification) {
            // Afficher le modal de vérification d'email
            setPendingEmail(formData.email);
            setPendingPassword(formData.password);
            setShowEmailVerification(true);
            setFormData({ email: "", password: "", name: "", confirmPassword: "" });
          } else {
            // Inscription réussie sans vérification nécessaire
            result = { success: true };
          }
        } else {
          result = { success: false, error: data.message || "Erreur d'inscription" };
        }
      }
      
      if (result && result.success && !showEmailVerification) {
        onCloseAction();
        setFormData({ email: "", password: "", name: "", confirmPassword: "" });
        setIsLogin(true);
      } else if (result && !result.success) {
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

  const handleEmailVerificationSuccess = async () => {
    // Une fois l'email vérifié, on connecte automatiquement l'utilisateur
    try {
      const result = await login(pendingEmail, pendingPassword);
      if (result.success) {
        setShowEmailVerification(false);
        setPendingEmail("");
        setPendingPassword("");
        onCloseAction();
      }
    } catch {
      // Si la connexion automatique échoue, on ferme quand même les modals
      setShowEmailVerification(false);
      setPendingEmail("");
      setPendingPassword("");
      onCloseAction();
    }
  };

  const handleEmailVerificationClose = () => {
    setShowEmailVerification(false);
    setPendingEmail("");
    setPendingPassword("");
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
        className="w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <Card className="!bg-gray-800/90 border-gray-700 text-white">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl !text-white font-bold mb-2">
              {isLogin ? "Connexion" : "Inscription"}
            </CardTitle>
            <CardDescription className="text-gray-400">
              {isLogin
                ? "Connectez-vous pour sauvegarder vos progrès"
                : "Créez un compte pour suivre vos statistiques"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={isLogin ? "login" : "register"} className="w-full mb-4">
              <TabsList className="grid w-full grid-cols-2 gap-2 mb-6">
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
      
      {/* Modal de vérification d'email */}
      <EmailVerificationModal
        isOpen={showEmailVerification}
        email={pendingEmail}
        onVerificationSuccess={handleEmailVerificationSuccess}
        onClose={handleEmailVerificationClose}
      />
    </motion.div>
  );
}
