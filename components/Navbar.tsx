"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "../contexts/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import AuthModal from "./auth/AuthModal";
import Image from "next/image";
import { Button } from "./ui/button";
import { ModeToggle } from "./ui/mode-toggle";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const { user, logout } = useAuth();
  const router = useRouter();
  const isLoggedIn = !!user;
  const pathname = usePathname();
  const isDashboardPage = pathname?.includes("/dashboard");

  const isActive = (path: string) => pathname === path;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showDropdown &&
        !(event.target as HTMLElement).closest(".dropdown-container")
      ) {
        setShowDropdown(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  useEffect(() => {
    setIsMenuOpen(false);
    setShowDropdown(false);
  }, [pathname]);

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    router.push("/");
    setTimeout(() => window.location.reload(), 500);
  };


  if (isDashboardPage) return null;

  return (
    <>
      <nav className={`fixed w-full top-0 z-50 transition-all duration-500 font-sans h-20 ${
        scrolled
          ? "bg-gradient-to-b from-[var(--color-foreground)]/90 via-[var(--color-foreground)]/60 to-transparent"
          : "bg-gradient-to-b from-[var(--color-foreground)]/80 via-[var(--color-foreground)]/40 to-transparent "
      }`}>
        <div className="max-w-7xl mx-auto h-full px-3 sm:px-4 md:px-6">
          <div className="flex items-center h-full justify-between">
            {/* Logo avec image et texte */}
            <div className="flex-shrink-0">
              <Link href="/" className="font-bold text-2xl sm:text-3xl flex items-center group">
                <Image src="/muzlife_v2.png" alt="MuzLife" width={48} height={48} className="h-10 w-10 sm:h-12 sm:w-12 mr-2 sm:mr-3 transition-transform duration-300 group-hover:scale-110" />
                <span className="text-[var(--color-accent)] transition-colors duration-300 group-hover:text-[var(--color-accent)]/80">Muz</span>
                <span className="text-white ml-1 sm:ml-2 transition-colors duration-300 group-hover:text-white/80">Life</span>
              </Link>
            </div>
            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center">
              <div className="flex items-center space-x-4 xl:space-x-6">
                <Link href="/adoration" className="relative !text-white hover:!text-[var(--color-accent)] px-3 lg:px-4 py-2.5 rounded-md transition-all duration-300 text-base lg:text-lg font-medium group">
                  ⭐ Adoration
                  <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-1 bg-[var(--color-accent)] rounded-full transition-all duration-500 ease-out ${
                    isActive("/tuto/wudu") 
                      ? "w-full opacity-100" 
                      : "w-0 opacity-0 group-hover:w-1/2 group-hover:opacity-70"
                  }`}></div>
                </Link>
                <Link href="/ecoute" className="relative !text-white hover:!text-[var(--color-accent)] px-3 lg:px-4 py-2.5 rounded-md transition-all duration-300 text-base lg:text-lg font-medium group">
                  📗 Coran
                  <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-1 bg-[var(--color-accent)] rounded-full transition-all duration-500 ease-out ${
                    isActive("/ecoute") 
                      ? "w-full opacity-100" 
                      : "w-0 opacity-0 group-hover:w-1/2 group-hover:opacity-70"
                  }`}></div>
                </Link>
                <Link href="/quizz" className="relative !text-white hover:!text-[var(--color-accent)] px-3 lg:px-4 py-2.5 rounded-md transition-all duration-300 text-base lg:text-lg font-medium group">
                  🧠 Quizz
                  <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-1 bg-[var(--color-accent)] rounded-full transition-all duration-500 ease-out ${
                    isActive("/quizz") 
                      ? "w-full opacity-100" 
                      : "w-0 opacity-0 group-hover:w-1/2 group-hover:opacity-70"
                  }`}></div>
                </Link>
                <Link href="/horaires" className="relative !text-white hover:!text-[var(--color-accent)] px-3 lg:px-4 py-2.5 rounded-md transition-all duration-300 text-base lg:text-lg font-medium group">
                  🕌 Horaires
                  <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-1 bg-[var(--color-accent)] rounded-full transition-all duration-500 ease-out ${
                    isActive("/horaires") 
                      ? "w-full opacity-100" 
                      : "w-0 opacity-0 group-hover:w-1/2 group-hover:opacity-70"
                  }`}></div>
                </Link>
                <Link href="/about" className="relative !text-white hover:!text-[var(--color-accent)] px-3 lg:px-4 py-2.5 rounded-md transition-all duration-300 text-base lg:text-lg font-medium group">
                  👤 À propos
                  <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-1 bg-[var(--color-accent)] rounded-full transition-all duration-500 ease-out ${
                    isActive("/about") 
                      ? "w-full opacity-100" 
                      : "w-0 opacity-0 group-hover:w-1/2 group-hover:opacity-70"
                  }`}></div>
                </Link>
              </div>
            </div>
            {/* Theme toggle + boutons */}
            <div className="hidden lg:flex items-center gap-3 ml-4 xl:ml-6">
              <ModeToggle />
              {/* Bouton de connexion / Compte utilisateur  mode desktop*/}
              {!isLoggedIn ? (
                <Button
                  onClick={() => setShowAuthModal(true)}
                  className="relative w-auto px-6 py-2.5 bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 text-white rounded-full hover:shadow-2xl hover:shadow-green-500/30 transition-all duration-500 border border-emerald-400/40 group hover:scale-105 flex items-center gap-2.5 backdrop-blur-sm overflow-hidden"
                  variant="default"
                >
                  {/* Effet de brillance animé */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
                  
                  {/* Contenu du bouton */}
                  <div className="relative flex items-center gap-2.5">
                    <div className="p-1 bg-white/10 rounded-full group-hover:bg-white/20 transition-all duration-300">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                      </svg>
                    </div>
                    <span className="font-semibold text-sm tracking-wide">Connexion</span>
                  </div>
                  
                  {/* Effet de pulsation en arrière-plan */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400/20 to-emerald-400/20 opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-300"></div>
                </Button>
              ) : (
                <div className="relative">
                  <Button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="relative w-auto px-4 py-2.5 h-auto bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 text-white rounded-full hover:shadow-2xl hover:shadow-green-500/30 transition-all duration-500 border border-emerald-400/40 group hover:scale-105 flex items-center gap-3 backdrop-blur-sm overflow-hidden"
                    variant="default"
                  >
                    {/* Effet de brillance animé */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
                    
                    {/* Contenu du bouton */}
                    <div className="relative flex items-center gap-3">
                      {user?.avatar ? (
                        <div className="relative">
                          <Image src={user.avatar} alt={user.name} width={32} height={32} className="h-8 w-8 rounded-full border-2 border-white/40 transition-transform duration-300 group-hover:scale-110 shadow-lg" />
                          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-green-400/30 to-emerald-400/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                      ) : (
                        <div className="relative">
                          <div className="h-8 w-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-sm font-bold border-2 border-white/40 transition-transform duration-300 group-hover:scale-110 shadow-lg">
                            {user?.name?.charAt(0) || "U"}
                          </div>
                          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                      )}
                      <div className="flex flex-col items-start">
                        <span className="font-semibold text-sm max-w-24 truncate leading-tight">
                          {user?.name || "Utilisateur"}
                        </span>
                        <span className="text-xs text-white/80 font-medium">Connecté</span>
                      </div>
                      <div className="p-1 bg-white/10 rounded-full group-hover:bg-white/20 transition-all duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                    
                    {/* Effet de pulsation en arrière-plan */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400/20 to-emerald-400/20 opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-300"></div>
                  </Button>
                  {showDropdown && (
                    <div className="absolute right-0 mt-3 w-64 bg-gradient-to-br from-white via-gray-50 to-white rounded-2xl shadow-2xl border border-gray-200/60 dropdown-container animate-in slide-in-from-top-4 duration-500 ease-out overflow-hidden backdrop-blur-sm z-20">
                      {/* En-tête avec dégradé */}
                      <div className="relative px-5 py-4 bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 text-white">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                        <div className="relative flex items-center gap-3">
                          {user?.avatar ? (
                            <Image src={user.avatar} alt={user.name} width={40} height={40} className="h-10 w-10 rounded-full border-2 border-white/40 shadow-lg" />
                          ) : (
                            <div className="h-10 w-10 bg-gradient-to-br from-white/20 to-white/10 rounded-full flex items-center justify-center text-white text-lg font-bold border-2 border-white/40 shadow-lg">
                              {user?.name?.charAt(0) || "U"}
                            </div>
                          )}
                          <div>
                            <p className="font-bold text-white text-sm">{user?.name}</p>
                            <p className="text-xs text-white/90 truncate max-w-[150px]">{user?.email}</p>
                          </div>
                        </div>
                      </div>

                      {/* Menu items */}
                      <div className="py-2">
                        <Link
                          href="/profile"
                          className="group flex items-center px-5 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 transition-all duration-300 hover:translate-x-2 relative overflow-hidden"
                          onClick={() => setShowDropdown(false)}
                        >
                          <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-green-500 to-emerald-600 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                          <div className="p-2 bg-green-100 rounded-lg mr-3 group-hover:bg-green-200 transition-all duration-300 group-hover:scale-110">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                          <div>
                            <span className="font-semibold text-gray-800 group-hover:text-green-700">Mon profil</span>
                            <p className="text-xs text-gray-500 group-hover:text-green-600">Gérer vos informations</p>
                          </div>
                        </Link>

                        <Link
                          href="/dashboard"
                          className="group flex items-center px-5 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-green-50 transition-all duration-300 hover:translate-x-2 relative overflow-hidden"
                          onClick={() => setShowDropdown(false)}
                        >
                          <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-emerald-500 to-green-600 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                          <div className="p-2 bg-emerald-100 rounded-lg mr-3 group-hover:bg-emerald-200 transition-all duration-300 group-hover:scale-110">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                          </div>
                          <div>
                            <span className="font-semibold text-gray-800 group-hover:text-emerald-700">Dashboard</span>
                            <p className="text-xs text-gray-500 group-hover:text-emerald-600">Vos statistiques</p>
                          </div>
                        </Link>

                        {/* Séparateur */}
                        <div className="my-2 mx-4 border-t border-gray-200"></div>

                        <Link
                          href="/"
                          className="group w-full text-left flex items-center px-5 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 transition-all duration-300 hover:translate-x-2 relative overflow-hidden"
                          onClick={handleLogout}
                        >
                          <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-red-500 to-pink-600 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                          <div className="p-2 bg-pink-100 rounded-lg mr-3 group-hover:bg-red-200 transition-all duration-300 group-hover:scale-110">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                          </div>
                          <div>
                            <span className="font-semibold text-red-800 group-hover:text-red-700">Déconnexion</span>
                            <p className="text-xs text-gray-500 group-hover:text-red-600">Quitter votre session</p>
                          </div>
                        </Link>

                        
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            {/* Mobile menu button */}
            <div className="lg:hidden">
              <Button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="group relative w-10 h-10 rounded-full border border-white/20 !bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 hover:scale-110"
                aria-label="Menu principal"
                variant="outline"
                size="icon"
              >
                <svg
                  className="absolute h-[1.2rem] w-[1.2rem] transition-all duration-300"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {isMenuOpen ? (
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M6 18L18 6M6 6l12 12"
                      className="animate-pulse"
                    />
                  ) : (
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M4 6h16M4 12h16M4 18h16" 
                    />
                  )}
                </svg>
              </Button>
            </div>
          </div>
        </div>
        {/* Overlay pour fermer le menu en cliquant à l'extérieur */}
        {isMenuOpen && (
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-300"
            onClick={() => setIsMenuOpen(false)}
          ></div>
        )}
        {/* Menu mobile */}
        <div
          className={`fixed top-20 right-2 md:hidden z-50 w-72 max-w-[calc(100vw-1rem)] rounded-xl shadow-2xl transition-all duration-500 ease-out transform ${
            isMenuOpen ? "translate-x-0 opacity-100 scale-100" : "translate-x-full opacity-0 scale-95"
          }`}
        >
          <div className="bg-gradient-to-b from-transparent to-[var(--color-foreground)] dark:from-gray-800 dark:to-gray-900 rounded-xl overflow-hidden backdrop-blur-md border border-white/10 dark:border-gray-600">
            {/* En-tête du menu avec compte */}
            <div className="p-4 flex flex-col gap-4">
              {/* Bouton de connexion/compte + theme toggle */}

              <div className="flex items-center gap-3">
                                <ModeToggle />
                {/* Bouton de connexion/compte avec style desktop */}
                {!isLoggedIn ? (
                
                <Button
                  onClick={() => {
                    setShowAuthModal(true);
                    setIsMenuOpen(false);
                  }}
                  className="relative flex-1 px-6 py-3 bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 text-white rounded-full hover:shadow-2xl hover:shadow-green-500/30 transition-all duration-500 border border-emerald-400/40 group hover:scale-105 flex items-center gap-2.5 backdrop-blur-sm overflow-hidden"
                  variant="default"
                >
                  {/* Effet de brillance animé */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
                  
                  {/* Contenu du bouton */}
                  <div className="relative flex items-center gap-2.5">
                    <div className="p-1 bg-white/10 rounded-full group-hover:bg-white/20 transition-all duration-300">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                      </svg>
                    </div>
                    <span className="font-semibold text-sm tracking-wide">Connexion</span>
                  </div>
                  
                  {/* Effet de pulsation en arrière-plan */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400/20 to-emerald-400/20 opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-300"></div>
                </Button>
                
              ) : (
                <Button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="relative flex-1 px-4 py-3 h-auto bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 text-white rounded-full hover:shadow-2xl hover:shadow-green-500/30 transition-all duration-500 border border-emerald-400/40 group hover:scale-105 flex items-center gap-3 backdrop-blur-sm overflow-hidden"
                  variant="default"
                >
                  {/* Effet de brillance animé */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
                  
                  {/* Contenu du bouton */}
                  <div className="relative flex items-center gap-3 w-full">
                    {user?.avatar ? (
                      <div className="relative">
                        <Image src={user.avatar} alt={user.name} width={32} height={32} className="h-8 w-8 rounded-full border-2 border-white/40 transition-transform duration-300 group-hover:scale-110 shadow-lg" />
                        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-green-400/30 to-emerald-400/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                    ) : (
                      <div className="relative">
                        <div className="h-8 w-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-sm font-bold border-2 border-white/40 transition-transform duration-300 group-hover:scale-110 shadow-lg">
                          {user?.name?.charAt(0) || "U"}
                        </div>
                        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                    )}
                    <div className="flex flex-col items-start flex-1">
                      <span className="font-semibold text-sm max-w-32 truncate leading-tight">
                        {user?.name || "Utilisateur"}
                      </span>
                      <span className="text-xs text-white/80 font-medium">Connecté</span>
                    </div>
                    <div className="p-1 bg-white/10 rounded-full group-hover:bg-white/20 transition-all duration-300">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  
                  {/* Effet de pulsation en arrière-plan */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400/20 to-emerald-400/20 opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-300"></div>
                </Button>
              )}
                
              {/* Theme toggle à droite du bouton */}
              </div>
            </div>
            {/* Navigation mobile */}
            <div className="px-2 py-3">
              <div className="space-y-1">
                <Link
                    href="/adoration"
                  className={`flex items-center px-3 py-3 rounded-lg transition-all duration-300 hover:translate-x-2 ${
                    isActive("/adoration")
                      ? "bg-white/20 text-white shadow-lg scale-105"
                      : "text-white hover:text-[var(--color-accent)] hover:bg-white/10"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 transition-transform duration-300 hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 3a2 2 0 0 1 1.6.8l3 4a2 2 0 0 1 .013 2.382l-7.99 10.986a2 2 0 0 1-3.247 0l-7.99-10.986A2 2 0 0 1 2.4 7.8l2.998-3.997A2 2 0 0 1 7 3z" /><path d="M2 9h20"/>
                  </svg>
                  <span className="text-lg text-white">Adoration</span>
                </Link>
                <Link
                  href="/ecoute"
                  className={`flex items-center px-3 py-3 rounded-lg transition-all duration-300 hover:translate-x-2 ${
                    isActive("/ecoute")
                      ? "bg-white/20 text-white shadow-lg scale-105"
                      : "text-white hover:text-[var(--color-accent)] hover:bg-white/10"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 transition-transform duration-300 hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <span className="text-lg text-white">Coran</span>
                </Link>
                <Link
                  href="/quizz"
                  className={`flex items-center px-3 py-3 rounded-lg transition-all duration-300 hover:translate-x-2 ${
                    isActive("/quizz")
                      ? "bg-white/20 text-white shadow-lg scale-105"
                      : "text-white hover:text-[var(--color-accent)] hover:bg-white/10"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 transition-transform duration-300 hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-lg text-white">Quizz</span>
                </Link>
                <Link
                  href="/horaires"
                  className={`flex items-center px-3 py-3 rounded-lg transition-all duration-300 hover:translate-x-2 ${
                    isActive("/horaires")
                      ? "bg-white/20 text-white shadow-lg scale-105"
                      : "text-white hover:text-[var(--color-accent)] hover:bg-white/10"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >

                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 transition-transform duration-300 hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6l4 2"/><circle cx="12" cy="12" r="10"/></svg>
                  <span className="text-lg text-white">Horaires</span>
                </Link>
                <Link
                  href="/about"
                  className={`flex items-center px-3 py-3 rounded-lg transition-all duration-300 hover:translate-x-2 ${
                    isActive("/about")
                      ? "bg-white/20 text-white shadow-lg scale-105"
                      : "text-white hover:text-[var(--color-accent)] hover:bg-white/10"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 transition-transform duration-300 hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-lg text-white">À propos</span>
                </Link>
              </div>
            </div>
            {/* Boutons du bas pour utilisateurs connectés */}
            {isLoggedIn && (
              <div className="px-2 pb-3">
                <div className="border-t border-white/10 pt-2 mt-2 space-y-1">
                  <Link
                    href="/profile"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="flex items-center px-3 py-3 rounded-lg text-white hover:text-[var(--color-accent)] hover:bg-white/10 transition-all duration-300 hover:translate-x-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 transition-transform duration-300 hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="text-lg">Mon profil</span>
                    </div>
                  </Link>
                  <Link
                    href="/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="flex items-center px-3 py-3 rounded-lg text-white hover:text-[var(--color-accent)] hover:bg-white/10 transition-all duration-300 hover:translate-x-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 transition-transform duration-300 hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      <span className="text-lg">Dashboard</span>
                    </div>
                  </Link>
                  <Button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="relative w-full px-6 py-3 bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white rounded-full hover:shadow-2xl hover:shadow-red-500/30 transition-all duration-500 border border-red-400/40 group hover:scale-105 flex items-center gap-2.5 backdrop-blur-sm overflow-hidden"
                    variant="default"
                  >
                    {/* Effet de brillance animé */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
                    
                    {/* Contenu du bouton */}
                    <div className="relative flex items-center gap-2.5">
                      <div className="p-1 bg-white/10 rounded-full group-hover:bg-white/20 transition-all duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                      </div>
                      <span className="font-semibold text-sm tracking-wide">Déconnexion</span>
                    </div>
                    
                    {/* Effet de pulsation en arrière-plan */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-400/20 to-red-600/20 opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-300"></div>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
      <AuthModal isOpen={showAuthModal} onCloseAction={() => setShowAuthModal(false)} />
    </>
  );
};

export default Navbar;