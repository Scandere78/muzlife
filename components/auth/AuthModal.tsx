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

  // Animation variants
  const cardVariants = {
    initial: { opacity: 0, y: 50, scale: 0.9 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -50, scale: 0.9 }
  };

  const inputVariants = {
    focus: { scale: 1.02, transition: { duration: 0.2 } },
    blur: { scale: 1, transition: { duration: 0.2 } }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-gradient-to-br from-black/60 via-gray-900/70 to-green-900/40 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onCloseAction}
    >
      {/* Background animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-10 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
          <div className="absolute top-3/4 left-3/4 w-96 h-96 bg-teal-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
        </div>
      </div>

      <motion.div
        variants={cardVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gray-800/20 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-gray-600/30">
          {/* Header with icon */}
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 20 }}
            >
              <div className="mx-auto mb-6 w-20 h-20 bg-gradient-to-br from-green-600 to-emerald-700 rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6 text-3xl font-bold text-white"
            >
              {isLogin ? "Connexion" : "Inscription"}
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-2 text-sm text-gray-300"
            >
              {isLogin
                ? "Connectez-vous pour sauvegarder vos progrès"
                : "Créez un compte pour suivre vos statistiques"}
            </motion.p>
          </div>

          {/* Error message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-red-500/20 border border-red-500/30 text-red-100 px-4 py-3 rounded-lg mb-4 mt-6"
            >
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">{error}</span>
              </div>
            </motion.div>
          )}

          {/* Form */}
          <motion.form
            className="mt-8 space-y-6"
            onSubmit={handleSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {/* Tabs */}
            <Tabs value={isLogin ? "login" : "register"} className="w-full mb-6">
              <TabsList className="grid w-full grid-cols-2 gap-2 mb-6 bg-gray-700/50">
                <TabsTrigger
                  value="login"
                  onClick={() => setIsLogin(true)}
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-emerald-700 data-[state=active]:text-white"
                >
                  Connexion
                </TabsTrigger>
                <TabsTrigger
                  value="register"
                  onClick={() => setIsLogin(false)}
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-emerald-700 data-[state=active]:text-white"
                >
                  Inscription
                </TabsTrigger>
              </TabsList>

              <div className="space-y-4">
                {/* Name field for registration */}
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Label htmlFor="name" className="block text-sm font-medium text-gray-300">
                      Nom complet *
                    </Label>
                    <motion.input
                      variants={inputVariants}
                      whileFocus="focus"
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Votre nom complet"
                      required={!isLogin}
                      className="mt-1 appearance-none relative block w-full px-4 py-3 border border-gray-600 placeholder-gray-400 text-white bg-gray-800/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 backdrop-blur-sm transition-all duration-200"
                    />
                  </motion.div>
                )}

                {/* Email */}
                <div>
                  <Label htmlFor="email" className="block text-sm font-medium text-gray-300">
                    Email *
                  </Label>
                  <motion.input
                    variants={inputVariants}
                    whileFocus="focus"
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="votre@email.com"
                    required
                    className="mt-1 appearance-none relative block w-full px-4 py-3 border border-gray-600 placeholder-gray-400 text-white bg-gray-800/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 backdrop-blur-sm transition-all duration-200"
                  />
                </div>

                {/* Password */}
                <div>
                  <Label htmlFor="password" className="block text-sm font-medium text-gray-300">
                    Mot de passe *
                  </Label>
                  <motion.input
                    variants={inputVariants}
                    whileFocus="focus"
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    required
                    className="mt-1 appearance-none relative block w-full px-4 py-3 border border-gray-600 placeholder-gray-400 text-white bg-gray-800/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 backdrop-blur-sm transition-all duration-200"
                  />
                </div>

                {/* Confirm password for registration */}
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
                      Confirmer le mot de passe *
                    </Label>
                    <motion.input
                      variants={inputVariants}
                      whileFocus="focus"
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="••••••••"
                      required={!isLogin}
                      className="mt-1 appearance-none relative block w-full px-4 py-3 border border-gray-600 placeholder-gray-400 text-white bg-gray-800/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 backdrop-blur-sm transition-all duration-200"
                    />
                  </motion.div>
                )}
              </div>

              {/* Submit button */}
              <div className="mt-6">
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transition-all duration-200"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      {isLogin ? 'Connexion...' : 'Inscription...'}
                    </div>
                  ) : (
                    <span className="flex items-center">
                      {isLogin ? (
                        <>
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                          </svg>
                          Se connecter
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                          </svg>
                          S'inscrire
                        </>
                      )}
                    </span>
                  )}
                </motion.button>
              </div>
            </Tabs>
          </motion.form>
        </div>
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
