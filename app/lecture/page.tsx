"use client";

import "../../styles/globals.css";
import Link from "next/link";
import ReadingTracker from "../../components/ReadingTracker";
import { sourates } from "../../lib/sourateSlugs";
import { useState } from "react";


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
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  return (
    <div className="page-container navbar-safe px-10 min-h-screen" style={{ background: 'var(--color-background)', color: 'var(--color-foreground)' }}>
      <h1 className="text-3xl font-bold text-[var(--color-accent)] text-center mt-10">Liste des Sourates</h1>
      <div className="mt-10">
        <ul>
          {sourates.map((sourate) => {
            const detailsUrl = `/lecture/${sourate.slug}`;
            const fullUrl = typeof window !== 'undefined' ? window.location.origin + detailsUrl : detailsUrl;
            return (
              <li
                key={sourate.number}
                // On limite la largeur de chaque élément à la moitié de l'écran (50% sur desktop), tout en restant responsive sur mobile.
                className="mb-4 p-4 bg-[var(--color-muted)] rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border border-[var(--color-border)] w-full md:w-1/2 mx-auto"
              >
                <div className="flex items-center justify-between">
                  <Link href={detailsUrl} className="flex-1">
                    <div className="cursor-pointer">
                      <h2 className="text-xl font-bold text-[var(--color-foreground)]">
                        <span className="text-[var(--color-foreground)] text-lg">{sourate.number}. </span>
                        {sourate.nom_phonetique}
                      </h2>
                      <span className="text-[var(--color-foreground)] hover:text-[var(--color-accent)] transition-all duration-300 inline-block mt-2">
                        Voir les détails
                      </span>
                    </div>
                  </Link>
                  <div className="flex items-center gap-2 ml-4">
                    {/* Coeur cliquable (favori) */}
                    <button
                      aria-label="Ajouter aux favoris"
                      className="p-2 rounded-full hover:bg-[var(--color-foreground)]/20 transition-colors"
                      // TODO: Ajoute la logique de favoris ici
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.75a5.25 5.25 0 00-4.5 2.472A5.25 5.25 0 007.5 3.75 5.25 5.25 0 003 9c0 7.25 9 11.25 9 11.25s9-4 9-11.25a5.25 5.25 0 00-5.25-5.25z" />
                      </svg>
                    </button>
                    {/* Bouton de partage */}
                    <button
                      aria-label="Partager la sourate"
                      className="p-2 rounded-full hover:bg-[var(--color-foreground)]/20 transition-colors"
                      onClick={async () => {
                        await navigator.clipboard.writeText(window.location.origin + detailsUrl);
                        setCopiedSlug(sourate.slug);
                        setTimeout(() => setCopiedSlug(null), 1500);
                      }}
                    >
                      {copiedSlug === sourate.slug ? (
                        <span className="text-white font-semibold text-sm">Lien copié !</span>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M18 12l-3-3m0 0l3-3m-3 3h12" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      {/* Reading Tracker pour la page générale */}
      <ReadingTracker
        surahNumber={1}
        surahName="Liste des Sourates"
        onVerseRead={(verse: number) => console.log(`Verset ${verse} lu`)}
      />
    </div>
  );
}
