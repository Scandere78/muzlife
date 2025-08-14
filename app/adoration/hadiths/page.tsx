"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { hadithsEdifiants, getCategorieBySlug } from "@/lib/adorationData";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, User, Target, Copy, CheckCircle, AlertCircle, Info } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "../../../components";

export default function HadithsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTheme, setSelectedTheme] = useState("all");
  const [selectedAuthenticite, setSelectedAuthenticite] = useState("all");

  const categorie = getCategorieBySlug("hadiths");

  if (!categorie) {
    return <div>Catégorie non trouvée</div>;
  }

  // Configuration pour les degrés d'authenticité
  const authenticitConfig = {
    sahih: { 
      color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300", 
      icon: <CheckCircle className="w-4 h-4" />, 
      label: "Sahîh (Authentique)" 
    },
    hassan: { 
      color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300", 
      icon: <AlertCircle className="w-4 h-4" />, 
      label: "Hassan (Bon)" 
    },
    daif: { 
      color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300", 
      icon: <Info className="w-4 h-4" />, 
      label: "Da&apos;îf (Faible)" 
    }
  };

  // Filtrage des hadiths
  const filteredHadiths = hadithsEdifiants.filter(hadith => {
    const matchesSearch = hadith.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         hadith.lecon.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         hadith.theme.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTheme = selectedTheme === "all" || hadith.theme === selectedTheme;
    const matchesAuthenticite = selectedAuthenticite === "all" || hadith.degre_authenticite === selectedAuthenticite;
    
    return matchesSearch && matchesTheme && matchesAuthenticite;
  });

  // Obtenir tous les thèmes uniques
  const themes = [...new Set(hadithsEdifiants.map(h => h.theme))];

  return (
    <div className="min-h-screen page-container py-12 navbar-safe" style={{ background: 'transparent', color: 'var(--color-foreground)' }}>
      <Navbar />
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Navigation */}
        <div className="mb-6">
          <Link href="/adoration">
            <Button variant="outline" className="flex items-center gap-2 bg-[var(--color-muted)]/60 border-[var(--color-border)] text-green-800 dark:text-white hover:bg-[var(--color-accent)]/20">
              <ArrowLeft className="w-4 h-4" />
              Retour à l&apos;Adoration
            </Button>
          </Link>
        </div>

        {/* En-tête de la section */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 mx-auto rounded-full bg-[var(--color-accent)]/20 border-2 border-[var(--color-accent)]/50 flex items-center justify-center mb-6 shadow-lg backdrop-blur-sm">
            <span className="text-3xl">📖</span>
          </div>
        <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-foreground)] dark:text-white mb-4 drop-shadow">
          Hadiths Édifiants
        </h1>
        <p className="text-lg text-[var(--color-foreground)] dark:text-gray-200 max-w-3xl mx-auto leading-relaxed mb-6">
          Découvrez la sagesse prophétique à travers des hadiths authentiques qui illuminent votre chemin spirituel
        </p>

        {/* Recherche et Filtres */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Recherche */}
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher un hadith..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[var(--color-muted)]/60 backdrop-blur-sm border border-[var(--color-border)] text-[var(--color-foreground)] dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/50"
              />
            </div>
            
            {/* Filtre par thème */}
            <select
              value={selectedTheme}
              onChange={(e) => setSelectedTheme(e.target.value)}
              className="px-4 py-3 rounded-xl bg-[var(--color-muted)]/60 backdrop-blur-sm border border-[var(--color-border)] text-[var(--color-foreground)] dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/50"
            >
              <option value="all">Tous les thèmes</option>
              {themes.map(theme => (
                <option key={theme} value={theme}>{theme}</option>
              ))}
            </select>
            
            {/* Filtre par authenticité */}
            <select
              value={selectedAuthenticite}
              onChange={(e) => setSelectedAuthenticite(e.target.value)}
              className="px-4 py-3 rounded-xl bg-[var(--color-muted)]/60 backdrop-blur-sm border border-[var(--color-border)] text-[var(--color-foreground)] dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/50"
            >
              <option value="all">Toutes authenticités</option>
              <option value="sahih">Sahîh (Authentique)</option>
              <option value="hassan">Hassan (Bon)</option>
              <option value="daif">Da&apos;îf (Faible)</option>
            </select>
          </div>
        </div>

        {/* Statistiques */}
        <div className="flex justify-center items-center gap-4 mb-8 text-sm text-[var(--color-foreground)] dark:text-gray-400">
          <span className="px-3 py-1 bg-[var(--color-accent)]/10 rounded-full border border-[var(--color-border)]">
            {filteredHadiths.length} hadith(s) trouvé(s)
          </span>
          <span className="px-3 py-1 bg-[var(--color-accent)]/10 rounded-full border border-[var(--color-border)]">
            {themes.length} thèmes disponibles
          </span>
        </div>
      </div>

      {/* Introduction spécifique aux Hadiths */}
      <div className="mb-12 bg-[var(--color-muted)]/40 backdrop-blur-sm rounded-xl p-8 border border-[var(--color-border)]">
        <h2 className="text-2xl font-bold text-[var(--color-foreground)] dark:text-white mb-4 flex items-center gap-2 drop-shadow">
          <BookOpen className="w-6 h-6" />
          La Sagesse Prophétique : Guidance pour la Vie
        </h2>
        <div className="grid md:grid-cols-2 gap-6 text-sm">
          <div>
            <h3 className="font-semibold text-[var(--color-accent)] mb-2">Importance des Hadiths :</h3>
            <ul className="space-y-1 text-[var(--color-foreground)] dark:text-gray-300">
              <li>• Explication du Coran par le Prophète ﷺ</li>
              <li>• Exemples concrets de conduite</li>
              <li>• Sagesse pratique pour la vie quotidienne</li>
              <li>• Enseignements spirituels profonds</li>
              <li>• Guidance dans les épreuves</li>
              <li>• Motivation pour les bonnes actions</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-[var(--color-accent)] mb-2">Parole Divine :</h3>
            <div className="bg-[var(--color-accent)]/10 backdrop-blur-sm rounded-lg p-4 italic border border-[var(--color-border)]">
              <p className="text-[var(--color-foreground)] dark:text-gray-300 mb-2">
                &quot;Il ne prononce rien sous l&apos;effet de la passion ; 
                ce n&apos;est rien d&apos;autre qu&apos;une révélation inspirée.&quot;
              </p>
              <p className="text-[var(--color-accent)] text-xs font-medium">
                - Sourate An-Najm (53:3-4)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des Hadiths */}
      <div className="grid gap-8">
        {filteredHadiths.map((hadith) => {
          const authenticitInfo = authenticitConfig[hadith.degre_authenticite];
          
          return (
            <motion.div
              key={hadith.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.01 }}
            >
              <Card className="border-2 border-[var(--color-border)] bg-[var(--color-muted)]/60 backdrop-blur-sm hover:shadow-xl hover:shadow-[var(--color-accent)]/20 transition-all duration-300 hover:border-[var(--color-accent)]/50">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl font-bold text-green-800 dark:text-white mb-2 drop-shadow">
                        {hadith.titre}
                      </CardTitle>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className={`${authenticitInfo.color} px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1`}>
                          {authenticitInfo.icon}
                          {authenticitInfo.label}
                        </span>
                        <span className="bg-[var(--color-accent)]/20 text-[var(--color-accent)] px-3 py-1 rounded-full text-xs font-medium border border-[var(--color-border)]">
                          📚 {hadith.theme}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigator.clipboard.writeText(`${hadith.texte_arabe}\n\n"${hadith.traduction}"\n\n- ${hadith.source}`)}
                      className="text-[var(--color-accent)] hover:text-[var(--color-accent-dark)] hover:bg-[var(--color-accent)]/10"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* Texte Arabe */}
                  <div className="text-center">
                    <div className="bg-[var(--color-muted)]/40 backdrop-blur-sm rounded-lg p-6 mb-4 border border-[var(--color-border)]">
                      <p className="text-xl md:text-2xl font-arabic text-green-800 dark:text-white leading-relaxed mb-4 drop-shadow" dir="rtl">
                        {hadith.texte_arabe}
                      </p>
                      {/* Phonétique (si disponible) */}
                      {hadith.phonetique && (
                        <p className="text-lg italic text-green-600 dark:text-gray-400 mb-3">
                          &quot;{hadith.phonetique}&quot;
                        </p>
                      )}
                    </div>
                    
                    {/* Traduction */}
                    <div className="bg-[var(--color-accent)]/10 backdrop-blur-sm rounded-lg p-4 border-l-4 border-[var(--color-accent)]">
                      <p className="text-lg font-medium text-green-700 dark:text-gray-200 italic">
                        &quot;{hadith.traduction}&quot;
                      </p>
                    </div>
                  </div>

                  {/* Informations sur le narrateur et la source */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-[var(--color-muted)]/40 backdrop-blur-sm rounded-lg p-4 border border-[var(--color-border)]">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="w-4 h-4 text-[var(--color-accent)]" />
                        <span className="font-semibold text-green-800 dark:text-white">Narrateur</span>
                      </div>
                      <p className="text-sm text-green-700 dark:text-gray-300">{hadith.narrateur}</p>
                    </div>

                    <div className="bg-[var(--color-muted)]/40 backdrop-blur-sm rounded-lg p-4 border border-[var(--color-border)]">
                      <div className="flex items-center gap-2 mb-2">
                        <BookOpen className="w-4 h-4 text-[var(--color-accent)]" />
                        <span className="font-semibold text-green-800 dark:text-white">Source</span>
                      </div>
                      <p className="text-sm text-green-700 dark:text-gray-300">{hadith.reference_courte}</p>
                    </div>
                  </div>

                  {/* Leçon principale */}
                  <div className="bg-[var(--color-accent)]/10 backdrop-blur-sm rounded-lg p-4 border border-[var(--color-border)]">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="w-4 h-4 text-[var(--color-accent)]" />
                      <h4 className="font-semibold text-[var(--color-accent)] drop-shadow">💡 Leçon Principale</h4>
                    </div>
                    <p className="text-sm text-green-700 dark:text-gray-300 font-medium">{hadith.lecon}</p>
                  </div>

                  {/* Contexte */}
                  <div className="bg-[var(--color-muted)]/40 backdrop-blur-sm rounded-lg p-4 border border-[var(--color-border)]">
                    <h4 className="font-semibold text-green-800 dark:text-white mb-2 drop-shadow">📍 Contexte :</h4>
                    <p className="text-sm text-green-700 dark:text-gray-300">{hadith.contexte}</p>
                  </div>

                  {/* Application pratique */}
                  <div className="bg-[var(--color-accent)]/10 backdrop-blur-sm rounded-lg p-4 border border-[var(--color-border)]">
                    <h4 className="font-semibold text-[var(--color-accent)] mb-2 drop-shadow">🎯 Application Pratique :</h4>
                    <p className="text-sm text-green-700 dark:text-gray-300">{hadith.application_pratique}</p>
                  </div>

                  {/* Explication des savants (si disponible) */}
                  {hadith.explication_savants && (
                    <div className="bg-[var(--color-muted)]/40 backdrop-blur-sm rounded-lg p-4 border border-[var(--color-border)]">
                      <h4 className="font-semibold text-green-800 dark:text-white mb-2 drop-shadow">👨‍🏫 Explication des Savants :</h4>
                      <p className="text-sm text-green-700 dark:text-gray-300 italic">{hadith.explication_savants}</p>
                    </div>
                  )}

                  {/* Bouton pour voir le détail */}
                  <div className="pt-4 border-t border-[var(--color-border)]">
                    <Link href={`/adoration/hadiths/${hadith.slug}`}>
                      <Button className="w-full bg-[var(--color-accent)] hover:bg-[var(--color-accent-dark)] text-white shadow-lg">
                        Lire le hadith complet →
                      </Button>
                    </Link>
                  </div>

                  {/* Source complète */}
                  <div className="border-t border-[var(--color-border)] pt-4">
                    <p className="text-xs text-green-600 dark:text-gray-400">
                      <span className="font-medium">Source complète :</span> {hadith.reference_complete}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Footer inspirant */}
      <div className="mt-12 text-center bg-[var(--color-muted)]/40 backdrop-blur-sm rounded-lg p-6 border border-[var(--color-border)]">
        <p className="text-sm text-green-600 dark:text-gray-400 italic max-w-3xl mx-auto">
          &quot;J&apos;ai laissé parmi vous deux choses : tant que vous vous y accrocherez, vous ne vous égarerez jamais : 
          le Livre d&apos;Allah et ma Sunnah.&quot;
          <span className="font-medium"> - Hadith rapporté par Malik dans Al-Muwatta</span>
        </p>
      </div>
      </div>
    </div>
  );
}
