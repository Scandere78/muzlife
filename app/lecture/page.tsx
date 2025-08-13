"use client";

import "../../styles/globals.css";
import Link from "next/link";
import ReadingTracker from "../../components/ReadingTracker";
import { sourates } from "../../lib/sourateSlugs";
import { useState } from "react";
import { useFavoriteSurahs } from "../../hooks/useFavoriteSurahs";
import { useAuth } from "../../contexts/AuthContext";
import AuthModal from "../../components/auth/AuthModal";


interface Sourate {
  position: number;
  nom: string;
  nom_phonetique: string;
  englishNameTranslation: string;
}

// Fonction utilitaire pour générer un slug à partir du nom phonétique
function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function Lecture() {
  const { user } = useAuth();
  const { isFavorite, toggleFavorite, loading: favoritesLoading } = useFavoriteSurahs();
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Filtrer les sourates en fonction de la recherche
  const filteredSourates = sourates.filter(sourate => 
    sourate.nom_phonetique.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFavoriteToggle = async (sourate: any) => {
    if (!user) {
      // Si l'utilisateur n'est pas connecté, ouvrir le modal d'authentification
      setShowAuthModal(true);
      return;
    }

    try {
      await toggleFavorite({
        surahNumber: sourate.number,
        surahName: sourate.nom_phonetique,
        surahSlug: sourate.slug,
      });
    } catch (error) {
      console.error('Erreur lors du toggle favori:', error);
    }
  };

  const handleCloseAuthModal = () => {
    setShowAuthModal(false);
  };

  return (
    <div className="page-container navbar-safe px-4 py-6 sm:py-8 flex flex-col items-center min-h-screen w-full overflow-x-visible" style={{ background: 'transparent', color: 'var(--color-foreground)' }}>
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--color-accent)] mb-3 sm:mb-4 drop-shadow-lg animate-fade-in">
          📖 Lecture des Sourates
        </h1>
        <p className="text-base sm:text-lg text-[var(--color-foreground)] max-w-2xl mx-auto animate-fade-in">
          Explorez et lisez les 114 sourates du Saint Coran avec des traductions détaillées
        </p>
      </div>

      <div className="w-full max-w-4xl">
        {/* Barre de recherche */}
        <div className="flex items-center gap-2 mb-6">
          <input 
            type="text" 
            placeholder="Rechercher une sourate..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-muted)]/60 text-[var(--color-foreground)] placeholder-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent transition-all duration-300" 
          />
          <button className="px-6 py-3 rounded-lg text-white font-bold text-lg border-accent bg-[var(--color-accent)] hover:shadow-lg hover:shadow-[var(--color-accent)]/20 transition-all duration-300 transform hover:-translate-y-1">
            Rechercher
          </button>
        </div>

        <div className="grid gap-4 sm:gap-6">
          {filteredSourates.map((sourate, index) => {
            const detailsUrl = `/lecture/${sourate.slug}`;
            return (
              <div
                key={sourate.number}
                className="bg-[var(--color-muted)] rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-[var(--color-border)] p-6 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center justify-between">
                  <Link href={detailsUrl} className="flex-1 group">
                    <div className="cursor-pointer">
                                             <h2 className="text-xl sm:text-2xl font-bold text-[var(--color-foreground)] group-hover:text-[var(--color-accent)] transition-colors duration-300">
                         <span className="text-[var(--color-accent)] text-lg sm:text-xl mr-2">{sourate.number}.</span>
                         {sourate.nom_phonetique}
                       </h2>
                       <p className="text-[var(--color-muted)] text-sm sm:text-base mt-1">
                         Sourate {sourate.number} du Coran
                       </p>
                      <span className="text-[var(--color-accent)] hover:text-[var(--color-foreground)] transition-all duration-300 inline-block mt-3 text-sm font-medium">
                        📖 Lire la sourate →
                      </span>
                    </div>
                  </Link>
                  <div className="flex items-center gap-3 ml-6">
                    {/* Coeur cliquable (favori) */}
                    <button
                      onClick={() => handleFavoriteToggle(sourate)}
                      disabled={favoritesLoading}
                      aria-label={isFavorite(sourate.number) ? "Supprimer des favoris" : "Ajouter aux favoris"}
                      className={`p-3 rounded-full transition-all duration-300 group ${
                        isFavorite(sourate.number)
                          ? 'bg-red-500/20 hover:bg-red-500/30'
                          : 'hover:bg-[var(--color-muted)]/20'
                      } ${favoritesLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        fill={isFavorite(sourate.number) ? "currentColor" : "none"} 
                        viewBox="0 0 24 24" 
                        strokeWidth={1.5} 
                        stroke="currentColor" 
                        className={`w-6 h-6 transition-colors ${
                          isFavorite(sourate.number)
                            ? 'text-red-400 group-hover:text-red-300'
                            : 'text-[var(--color-foreground)] group-hover:text-[var(--color-accent)]'
                        }`}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.75a5.25 5.25 0 00-4.5 2.472A5.25 5.25 0 007.5 3.75 5.25 5.25 0 003 9c0 7.25 9 11.25 9 11.25s9-4 9-11.25a5.25 5.25 0 00-5.25-5.25z" />
                      </svg>
                    </button>
                    {/* Bouton de partage */}
                    <button 
                  aria-label="Partager la sourate" 
                  className="p-2 rounded-full hover:bg-[var(--color-foreground)]/20 transition-colors"
                  onClick={async () => {
                    await navigator.clipboard.writeText(window.location.origin + `/lecture/${sourate.slug}`);
                    setCopiedSlug(sourate.slug);
                    setTimeout(() => setCopiedSlug(null), 1500);
                  }}
                >
                  {copiedSlug === sourate.slug ? (
                    <span className="text-white font-semibold text-sm">copié !</span>
                  ) : (
                    <svg fill="white" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0-3.933-2.185 2.25 2.25 0 0 0 3.933 2.185Z" />
                    </svg>
                  )}
                </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reading Tracker pour la page générale */}
      <div className="mt-8">
        <ReadingTracker
          surahNumber={1}
          surahName="Liste des Sourates"
          onVerseRead={(verse: number) => console.log(`Verset ${verse} lu`)}
        />
      </div>

      {/* Animations utilitaires */}
      <style>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: none; } }
        .animate-fade-in { animation: fade-in 0.7s cubic-bezier(.4,0,.2,1) both; }
      `}</style>

      {/* Modal d'authentification */}
      <AuthModal
        isOpen={showAuthModal}
        onCloseAction={handleCloseAuthModal}
      />
    </div>
  );
}
