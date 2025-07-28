
"use client";

import Link from "next/link";
import ReadingTracker from "../../components/ReadingTracker";
import { sourates } from "../../lib/sourateSlugs";

export default function Lecture() {
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
        <div className="grid gap-4 sm:gap-6">
          {sourates.map((sourate, index) => {
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
                      <span className="text-[var(--color-accent)] hover:text-[var(--color-foreground)] transition-all duration-300 inline-block mt-3 text-sm font-medium">
                        📖 Lire la sourate →
                      </span>
                    </div>
                  </Link>
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
          onVerseRead={(verse) => console.log(`Verset ${verse} lu`)}
        />
      </div>

      {/* Animations utilitaires */}
      <style>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: none; } }
        .animate-fade-in { animation: fade-in 0.7s cubic-bezier(.4,0,.2,1) both; }
      `}</style>
    </div>
  );
}
