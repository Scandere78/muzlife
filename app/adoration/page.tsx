"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Clock,
  ChevronRight,
  Search
} from "lucide-react";
import { Navbar } from "../../components";

const AdorationPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const adorationSections = [
    {
      id: "dhikr",
      title: "Dhikr",
      description: "Invocations et rappels d'Allah pour purifier le cœur",
      icon: "🤲",
      route: "/adoration/dhikr",
      count: "50+ invocations",
      tags: ["Purification", "Rappel", "Spiritualité"],
      moment: "Matin & Soir"
    },
    {
      id: "duahs",
      title: "Duahs",
      description: "Invocations prophétiques pour toutes les occasions",
      icon: "🌙",
      route: "/adoration/duahs",
      count: "100+ duahs",
      tags: ["Protection", "Guidance", "Bénédictions"],
      moment: "Quotidien"
    },
    {
      id: "invocations",
      title: "Invocations",
      description: "Invocations spécifiques selon les situations",
      icon: "⭐",
      route: "/adoration/invocations",
      count: "75+ invocations",
      tags: ["Situations", "Besoin", "Urgence"],
      moment: "Selon besoin"
    },
    {
      id: "perles",
      title: "Perles",
      description: "Perles spirituelles et sagesses prophétiques",
      icon: "💎",
      route: "/adoration/perles",
      count: "200+ perles",
      tags: ["Sagesse", "Tasbih", "Récompense"],
      moment: "Continu"
    },
    {
      id: "hadiths",
      title: "Hadiths",
      description: "Hadiths édifiants sur l'adoration et la spiritualité",
      icon: "📖",
      route: "/adoration/hadiths",
      count: "150+ hadiths",
      tags: ["Enseignement", "Exemple", "Guidée"],
      moment: "Étude"
    }
  ];

  const timeBasedSections = [
    {
      title: "Adoration du Matin",
      icon: "🌅",
      items: ["Adhkar du matin", "Duahs de réveil", "Invocations matinales"],
      route: "/adoration/theme/matin"
    },
    {
      title: "Adoration du Soir",
      icon: "🌙",
      items: ["Adhkar du soir", "Duahs de protection nocturne", "Invocations avant le sommeil"],
      route: "/adoration/theme/soir"
    },
    {
      title: "Moments Spéciaux",
      icon: "✨",
      items: ["Vendredi", "Ramadan", "Hajj", "Umrah"],
      route: "/adoration/theme/special"
    }
  ];

  const filteredSections = adorationSections.filter(section => {
    const matchesSearch = section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         section.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         section.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === "all" || 
                           section.tags.some(tag => tag.toLowerCase().includes(selectedCategory.toLowerCase()));
    
    return matchesSearch && matchesCategory;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  const cardHoverVariants = {
    hover: {
      scale: 1.03,
      rotateY: 2,
      transition: {
        duration: 0.4,
        ease: "easeOut" as const
      }
    }
  };

  return (
    <div className="min-h-screen page-container py-12 navbar-safe" style={{ background: 'transparent', color: 'var(--color-foreground)' }}>
      <Navbar />
      {/* Header Hero Section */}
      <div className="text-center px-4 max-w-6xl mx-auto mb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-[var(--color-accent)]/20 backdrop-blur-sm rounded-full mb-6 border border-[var(--color-border)]"
          >
            <span className="text-4xl">🕌</span>
          </motion.div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-green-800 dark:text-white mb-6 drop-shadow-lg">
            Espace d&apos;Adoration
          </h1>
          <p className="text-xl md:text-2xl text-green-700 dark:text-gray-200 mb-8 max-w-3xl mx-auto leading-relaxed">
            Découvrez les trésors de l&apos;adoration islamique : dhikr, duahs, invocations et perles spirituelles
            pour nourrir votre âme et renforcer votre lien avec Allah
          </p>
          
          {/* Search and Filter */}
          <div className="max-w-2xl mx-auto">
            <div className="relative mb-4">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-600 dark:text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher dans les adorations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-[var(--color-muted)]/60 backdrop-blur-sm border border-[var(--color-border)] text-green-800 dark:text-white placeholder-green-600 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/50"
              />
            </div>
            
            <div className="flex flex-wrap gap-2 justify-center">
              {["all", "purification", "protection", "guidance", "sagesse"].map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    selectedCategory === category
                      ? "bg-[var(--color-accent)] text-white shadow-lg"
                      : "bg-[var(--color-muted)]/60 text-green-700 dark:text-gray-200 hover:bg-[var(--color-accent)]/20 border border-[var(--color-border)]"
                  }`}
                >
                  {category === "all" ? "Tout" : category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Adoration Sections */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-20"
        >
          <motion.div
            variants={itemVariants}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-green-800 dark:text-white mb-4 drop-shadow">
              Sections d&apos;Adoration
            </h2>
            <p className="text-lg text-green-700 dark:text-gray-200 max-w-2xl mx-auto">
              Explorez chaque section pour enrichir votre vie spirituelle
            </p>
          </motion.div>

          <AnimatePresence>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              layout
            >
              {filteredSections.map((section) => {
                return (
                  <motion.div
                    key={section.id}
                    variants={itemVariants}
                    whileHover="hover"
                    layout
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="transition-all duration-500 transform hover:-translate-y-2"
                  >
                    <Link href={section.route}>
                      <motion.div
                        variants={cardHoverVariants}
                        className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--color-muted)]/80 via-[var(--color-background)]/60 to-[var(--color-muted)]/40 shadow-2xl hover:shadow-[var(--color-accent)]/30 transition-all duration-500 border border-[var(--color-border)]/50 h-full backdrop-filter backdrop-blur-20 hover:border-[var(--color-accent)]/70"
                      >
                        {/* Gradient Overlay Effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-accent)]/5 via-transparent to-[var(--color-accent)]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        
                        {/* Shimmer Effect */}
                        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100"></div>
                        
                        {/* Floating Icon Background */}
                        <div className="absolute -top-6 -right-6 w-24 h-24 bg-[var(--color-accent)]/5 rounded-full blur-xl group-hover:bg-[var(--color-accent)]/10 transition-all duration-500"></div>
                        
                        {/* Content */}
                        <div className="relative p-8 z-10">
                          {/* Enhanced Icon Section */}
                          <div className="flex items-start justify-between mb-6">
                            <div className="relative">
                              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--color-accent)]/20 to-[var(--color-accent)]/10 border-2 border-[var(--color-accent)]/30 shadow-lg group-hover:shadow-[var(--color-accent)]/50 group-hover:scale-110 transition-all duration-500">
                                <span className="text-3xl filter drop-shadow-sm group-hover:drop-shadow-md transition-all duration-300">{section.icon}</span>
                              </div>
                              {/* Pulse Effect */}
                              <div className="absolute inset-0 w-16 h-16 rounded-2xl bg-[var(--color-accent)]/20 animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            </div>
                            
                            <motion.div
                              whileHover={{ scale: 1.1, rotate: 5 }}
                              className="p-2 rounded-full bg-[var(--color-accent)]/10 group-hover:bg-[var(--color-accent)]/20 transition-all duration-300"
                            >
                              <ChevronRight className="w-5 h-5 text-green-600 dark:text-gray-400 group-hover:text-[var(--color-accent)] transition-all duration-300" />
                            </motion.div>
                          </div>
                          
                          {/* Enhanced Title with Gradient */}
                          <h3 className="text-2xl font-bold bg-gradient-to-r from-green-800 to-green-600 dark:from-white dark:to-gray-200 bg-clip-text text-transparent mb-3 group-hover:from-[var(--color-accent)] group-hover:to-[var(--color-accent-dark)] drop-shadow transition-all duration-500">
                            {section.title}
                          </h3>
                          
                          {/* Enhanced Description */}
                          <p className="text-green-700 dark:text-gray-200 mb-6 leading-relaxed text-sm group-hover:text-green-600 dark:group-hover:text-gray-100 transition-colors duration-300">
                            {section.description}
                          </p>
                          
                          {/* Enhanced Stats Section */}
                          <div className="flex items-center justify-between mb-6 p-3 rounded-lg bg-[var(--color-accent)]/5 border border-[var(--color-accent)]/20 group-hover:bg-[var(--color-accent)]/10 group-hover:border-[var(--color-accent)]/30 transition-all duration-300">
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-[var(--color-accent)] rounded-full animate-pulse"></div>
                              <span className="text-sm font-semibold text-green-600 dark:text-gray-400 group-hover:text-[var(--color-accent)] transition-colors duration-300">
                                {section.count}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-green-600 dark:text-gray-400 group-hover:text-[var(--color-accent)] transition-colors duration-300">
                              <Clock className="w-4 h-4" />
                              <span className="font-medium">{section.moment}</span>
                            </div>
                          </div>
                          
                          {/* Enhanced Tags with Better Spacing */}
                          <div className="flex flex-wrap gap-2">
                            {section.tags.map((tag, tagIndex) => (
                              <motion.span
                                key={tagIndex}
                                whileHover={{ scale: 1.05 }}
                                className="px-3 py-2 text-xs font-semibold bg-gradient-to-r from-[var(--color-accent)]/10 to-[var(--color-accent)]/5 text-[var(--color-accent)] rounded-full border border-[var(--color-accent)]/20 group-hover:from-[var(--color-accent)]/20 group-hover:to-[var(--color-accent)]/10 group-hover:border-[var(--color-accent)]/40 group-hover:text-[var(--color-accent-dark)] transition-all duration-300 shadow-sm hover:shadow-md"
                              >
                                {tag}
                              </motion.span>
                            ))}
                          </div>
                        </div>
                        
                        {/* Bottom Accent Line */}
                        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--color-accent)]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      </motion.div>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Time-Based Sections */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-20"
        >
          <motion.div
            variants={itemVariants}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-green-800 dark:text-white mb-4 drop-shadow">
              Adoration par Moments
            </h2>
            <p className="text-lg text-green-700 dark:text-gray-200 max-w-2xl mx-auto">
              Adorations spécifiques selon les moments de la journée
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {timeBasedSections.map((section, index) => {
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover="hover"
                  className="transition-all duration-500 transform hover:-translate-y-2"
                >
                  <Link href={section.route}>
                    <motion.div
                      variants={cardHoverVariants}
                      className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--color-muted)]/80 via-[var(--color-background)]/60 to-[var(--color-muted)]/40 shadow-2xl hover:shadow-[var(--color-accent)]/30 transition-all duration-500 border border-[var(--color-border)]/50 backdrop-filter backdrop-blur-20 hover:border-[var(--color-accent)]/70 h-full"
                    >
                      {/* Gradient Overlay Effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-accent)]/5 via-transparent to-[var(--color-accent)]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      {/* Shimmer Effect */}
                      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100"></div>
                      
                      {/* Floating Decoration */}
                      <div className="absolute -top-4 -right-4 w-20 h-20 bg-[var(--color-accent)]/5 rounded-full blur-xl group-hover:bg-[var(--color-accent)]/10 transition-all duration-500"></div>
                      
                      {/* Content */}
                      <div className="relative p-8 z-10">
                        {/* Enhanced Icon */}
                        <div className="relative mb-6">
                          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--color-accent)]/20 to-[var(--color-accent)]/10 border-2 border-[var(--color-accent)]/30 shadow-lg group-hover:shadow-[var(--color-accent)]/50 group-hover:scale-110 transition-all duration-500">
                            <span className="text-2xl filter drop-shadow-sm group-hover:drop-shadow-md transition-all duration-300">{section.icon}</span>
                          </div>
                          {/* Pulse Effect */}
                          <div className="absolute inset-0 w-14 h-14 rounded-2xl bg-[var(--color-accent)]/20 animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        </div>
                        
                        {/* Enhanced Title */}
                        <h3 className="text-xl font-bold bg-gradient-to-r from-green-800 to-green-600 dark:from-white dark:to-gray-200 bg-clip-text text-transparent mb-4 group-hover:from-[var(--color-accent)] group-hover:to-[var(--color-accent-dark)] drop-shadow transition-all duration-500">
                          {section.title}
                        </h3>
                        
                        {/* Enhanced Items List */}
                        <ul className="space-y-3">
                          {section.items.map((item, itemIndex) => (
                            <motion.li 
                              key={itemIndex} 
                              className="flex items-center text-green-700 dark:text-gray-200 group-hover:text-green-600 dark:group-hover:text-gray-100 transition-colors duration-300"
                              whileHover={{ x: 5 }}
                            >
                              <div className="w-2 h-2 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-dark)] rounded-full mr-4 group-hover:shadow-lg group-hover:shadow-[var(--color-accent)]/50 transition-all duration-300"></div>
                              <span className="text-sm font-medium">{item}</span>
                            </motion.li>
                          ))}
                        </ul>
                        
                        {/* Explore Button */}
                        <div className="mt-6 pt-4 border-t border-[var(--color-border)]/30">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-green-600 dark:text-gray-400 group-hover:text-[var(--color-accent)] font-medium transition-colors duration-300">
                              Explorer
                            </span>
                            <motion.div
                              whileHover={{ scale: 1.1, rotate: 5 }}
                              className="p-1 rounded-full bg-[var(--color-accent)]/10 group-hover:bg-[var(--color-accent)]/20 transition-all duration-300"
                            >
                              <ChevronRight className="w-4 h-4 text-[var(--color-accent)]" />
                            </motion.div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Bottom Accent Line */}
                      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--color-accent)]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </motion.div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-center bg-[var(--color-muted)]/60 backdrop-blur-sm rounded-2xl p-12 border border-[var(--color-border)]"
        >
          <div className="max-w-3xl mx-auto">
            <h3 className="text-3xl font-bold text-green-800 dark:text-white mb-4 drop-shadow">
              Commencez Votre Voyage Spirituel
            </h3>
            <p className="text-xl text-green-700 dark:text-gray-200 mb-8">
              Enrichissez votre quotidien avec ces trésors d&apos;adoration authentiques
            </p>
            <Link href="/dashboard">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center px-8 py-4 bg-[var(--color-accent)] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:bg-[var(--color-accent-dark)] transition-all duration-200"
              >
                Suivre mes Progrès
                <ChevronRight className="w-5 h-5 ml-2" />
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdorationPage;
