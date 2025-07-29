"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "../contexts/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import AuthModal from "./auth/AuthModal";
import Image from "next/image";
import { Button } from "./ui/button";

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
        <div className="max-w-7xl mx-auto h-full px-4 md:px-6">
          <div className="flex items-center h-full justify-between">
            {/* Logo avec image et texte */}
            <div className="flex-shrink-0">
              <Link href="/" className="font-bold text-3xl flex items-center group">
                <Image src="/muzlife_v2.png" alt="MuzLife" width={48} height={48} className="h-12 w-12 mr-3 transition-transform duration-300 group-hover:scale-110" />
                <span className="text-[var(--color-accent)] transition-colors duration-300 group-hover:text-[var(--color-accent)]/80">Muz</span>
                <span className="text-white ml-2 transition-colors duration-300 group-hover:text-white/80">Life</span>
              </Link>
            </div>
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center">
              <div className="flex items-center space-x-6">
                <Link href="/lecture" className="relative !text-white hover:!text-[var(--color-accent)] px-4 py-2.5 rounded-md transition-all duration-300 text-lg font-medium group">
                  🧑‍🏫 Lecture
                  <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-1 bg-[var(--color-accent)] rounded-full transition-all duration-500 ease-out ${
                    isActive("/lecture") 
                      ? "w-full opacity-100" 
                      : "w-0 opacity-0 group-hover:w-1/2 group-hover:opacity-70"
                  }`}></div>
                </Link>
                <Link href="/ecoute" className="relative !text-white hover:!text-[var(--color-accent)] px-4 py-2.5 rounded-md transition-all duration-300 text-lg font-medium group">
                  🎧 Écoute
                  <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-1 bg-[var(--color-accent)] rounded-full transition-all duration-500 ease-out ${
                    isActive("/ecoute") 
                      ? "w-full opacity-100" 
                      : "w-0 opacity-0 group-hover:w-1/2 group-hover:opacity-70"
                  }`}></div>
                </Link>
                <Link href="/quizz" className="relative !text-white hover:!text-[var(--color-accent)] px-4 py-2.5 rounded-md transition-all duration-300 text-lg font-medium group">
                  🧠 Quizz
                  <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-1 bg-[var(--color-accent)] rounded-full transition-all duration-500 ease-out ${
                    isActive("/quizz") 
                      ? "w-full opacity-100" 
                      : "w-0 opacity-0 group-hover:w-1/2 group-hover:opacity-70"
                  }`}></div>
                </Link>
                <Link href="/horaires" className="relative !text-white hover:!text-[var(--color-accent)] px-4 py-2.5 rounded-md transition-all duration-300 text-lg font-medium group">
                  🕌 Horaires
                  <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-1 bg-[var(--color-accent)] rounded-full transition-all duration-500 ease-out ${
                    isActive("/horaires") 
                      ? "w-full opacity-100" 
                      : "w-0 opacity-0 group-hover:w-1/2 group-hover:opacity-70"
                  }`}></div>
                </Link>
                <Link href="/about" className="relative !text-white hover:!text-[var(--color-accent)] px-4 py-2.5 rounded-md transition-all duration-300 text-lg font-medium group">
                  👤 À propos
                  <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-1 bg-[var(--color-accent)] rounded-full transition-all duration-500 ease-out ${
                    isActive("/about") 
                      ? "w-full opacity-100" 
                      : "w-0 opacity-0 group-hover:w-1/2 group-hover:opacity-70"
                  }`}></div>
                </Link>
              </div>
            </div>
            {/* Bouton de connexion desktop */}
            <div className="hidden md:block ml-6">
              {isLoggedIn ? (
                <div className="relative">
                  <Button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center bg-gradient-to-r from-[var(--color-foreground)] to-[var(--color-muted)] text-white px-6 py-2.5 rounded-full hover:shadow-lg transition-all duration-300 border border-green-500/30 group hover:scale-105"
                    variant="default"
                  >
                    {user?.avatar ? (
                      <Image src={user.avatar} alt={user.name} width={32} height={32} className="h-8 w-8 rounded-full mr-2.5 border border-white/30 transition-transform duration-300 group-hover:scale-110" />
                    ) : (
                      <div className="h-8 w-8 bg-[var(--color-foreground)] rounded-full mr-2.5 flex items-center justify-center text-white text-sm font-bold border border-white/30 transition-transform duration-300 group-hover:scale-110">
                        {user?.name?.charAt(0) || "U"}
                      </div>
                    )}
                    <span className="mr-1 text-base transition-colors duration-300 group-hover:text-[var(--color-accent)]">{user?.name || "Profil"}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform duration-300 ${showDropdown ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </Button>
                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl py-1.5 z-20 border border-gray-100 dropdown-container animate-in slide-in-from-top-2 duration-300">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="font-semibold text-gray-800">{user?.name}</p>
                        <p className="text-sm text-gray-500 truncate">{user?.email}</p>
                      </div>
                      <Link
                        href="/profile"
                        className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-green-50 transition-all duration-200 hover:translate-x-1"
                        onClick={() => setShowDropdown(false)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Mon profil
                      </Link>
                      <Link
                        href="/dashboard"
                        className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-green-50 transition-all duration-200 hover:translate-x-1"
                        onClick={() => setShowDropdown(false)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        Dashboard
                      </Link>
                      <div className="border-t border-gray-100 my-1"></div>
                      <Button
                        onClick={handleLogout}
                        className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-all duration-200 hover:translate-x-1"
                        variant="ghost"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Déconnexion
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <Button
                  onClick={() => setShowAuthModal(true)}
                  className="relative overflow-hidden group transition-all duration-300 hover:scale-105"
                  variant="default"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  <div className="absolute inset-0 "></div>
                  <div className="relative z-10 flex items-center text-white px-6 py-2.5 rounded-full font-medium text-lg transition-colors duration-300 group-hover:text-[var(--color-accent)]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 transition-transform duration-300 group-hover:rotate-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    Connexion
                  </div>
                  <div className="absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-l from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Button>
              )}
            </div>
            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-full bg-green-600/30 backdrop-blur-sm text-white hover:bg-green-500/40 focus:outline-none transition-all duration-300 hover:scale-110"
                aria-label="Menu principal"
                variant="default"
              >
                <svg
                  className="h-6 w-6 transition-transform duration-300"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
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
          className={`fixed top-20 right-2 md:hidden z-50 w-64 rounded-xl shadow-2xl transition-all duration-500 ease-out transform ${
            isMenuOpen ? "translate-x-0 opacity-100 scale-100" : "translate-x-full opacity-0 scale-95"
          }`}
        >
          <div className="bg-gradient-to-b from-[var(--color-foreground)] to-[var(--color-foreground)] rounded-xl overflow-hidden backdrop-blur-md border border-white/10">
            {/* En-tête du menu avec compte */}
            {isLoggedIn ? (
              <div className="p-4 bg-black/20 flex items-center">
                {user?.avatar ? (
                  <Image src={user.avatar} alt={user.name} width={48} height={48} className="h-12 w-12 rounded-full border border-white/30 transition-transform duration-300 hover:scale-110" />
                ) : (
                  <div className="h-12 w-12 bg-[var(--color-foreground)] rounded-full flex items-center justify-center text-[var(--color-background)] text-lg font-bold border border-white/30 transition-transform duration-300 hover:scale-110">
                    {user?.name?.charAt(0) || "U"}
                  </div>
                )}
                <div className="ml-3">
                  <p className="text-[var(--color-background)] font-medium truncate max-w-[180px]">{user?.name}</p>
                  <p className="text-[var(--color-background)] text-xs truncate max-w-[180px]">{user?.email}</p>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-black/20 hover:bg-black/30 transition-all duration-300">
                <button
                  onClick={() => {
                    setShowAuthModal(true);
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center text-white w-full transition-transform duration-300 hover:scale-105"
                >
                  <div className="h-12 w-12 bg-[var(--color-foreground)] rounded-full flex items-center justify-center mr-3 border border-white/40 transition-transform duration-300 hover:scale-110">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transition-transform duration-300 hover:rotate-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-lg">Se connecter</p>
                    <p className="text-sm text-[var(--color-background)]">Accéder à votre espace</p>
                  </div>
                </button>
              </div>
            )}
            {/* Navigation mobile */}
            <div className="px-2 py-3">
              <div className="space-y-1">
                <Link
                  href="/lecture"
                  className={`flex items-center px-3 py-3 rounded-lg transition-all duration-300 hover:translate-x-2 ${
                    isActive("/lecture")
                      ? "bg-white/20 text-white shadow-lg scale-105"
                      : "text-white hover:text-[var(--color-background)] hover:bg-white/10"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 transition-transform duration-300 hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="var(--color-muted)">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <span className="text-lg text-[var(--color-muted)]">Lecture</span>
                </Link>
                <Link
                  href="/ecoute"
                  className={`flex items-center px-3 py-3 rounded-lg transition-all duration-300 hover:translate-x-2 ${
                    isActive("/ecoute")
                      ? "bg-white/20 text-white shadow-lg scale-105"
                      : "text-white hover:text-[var(--color-background)] hover:bg-white/10"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 transition-transform duration-300 hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="var(--color-muted)">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                  <span className="text-lg text-[var(--color-muted)]">Écoute</span>
                </Link>
                <Link
                  href="/quizz"
                  className={`flex items-center px-3 py-3 rounded-lg transition-all duration-300 hover:translate-x-2 ${
                    isActive("/quizz")
                      ? "bg-white/20 text-white shadow-lg scale-105"
                      : "text-white hover:text-[var(--color-background)] hover:bg-white/10"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 transition-transform duration-300 hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="var(--color-muted)">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-lg text-[var(--color-muted)]">Quizz</span>
                </Link>
                <Link
                  href="/horaires"
                  className={`flex items-center px-3 py-3 rounded-lg transition-all duration-300 hover:translate-x-2 ${
                    isActive("/horaires")
                      ? "bg-white/20 text-white shadow-lg scale-105"
                      : "text-white hover:text-[var(--color-background)] hover:bg-white/10"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 transition-transform duration-300 hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="var(--color-muted)">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <span className="text-lg text-[var(--color-muted)]">Horaires</span>
                </Link>
                <Link
                  href="/about"
                  className={`flex items-center px-3 py-3 rounded-lg transition-all duration-300 hover:translate-x-2 ${
                    isActive("/about")
                      ? "bg-white/20 text-white shadow-lg scale-105"
                      : "text-white hover:text-[var(--color-background)] hover:bg-white/10"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 transition-transform duration-300 hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="var(--color-muted)">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-lg text-[var(--color-muted)]">À propos</span>
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
                    className="flex w-full items-center px-3 py-3 rounded-lg text-red-300 hover:bg-red-900/30 hover:text-red-100 transition-all duration-300 hover:translate-x-2"
                    variant="ghost"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 transition-transform duration-300 hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span className="text-lg">Déconnexion</span>
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
