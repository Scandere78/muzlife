"use client";

import React from "react";
import Link from "next/link";

interface SourateDetailProps {
  sourate: any;
  translation: any;
}

const SourateDetail: React.FC<SourateDetailProps> = ({ sourate, translation }) => {
  return (
    <main className="max-w-3xl mx-auto py-10 px-4">
      {/* Bouton retour */}
      <div className="mb-6">
        <Link href="/sourates" className="inline-flex items-center px-4 py-2 rounded-full bg-[var(--color-accent)] hover:bg-[var(--color-accent-dark)] text-white font-medium transition-colors shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Retour à la liste
        </Link>
      </div>

      {/* En-tête de la sourate */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-[var(--color-accent)] mb-2">{sourate.name}</h1>
        <p className="text-[var(--color-foreground)] text-lg">{sourate.englishName}</p>
        <p className="text-[var(--color-muted)] text-sm mt-1">{sourate.revelationType} • {sourate.numberOfAyahs} versets</p>
      </div>

      {/* Liste des versets */}
      <div className="space-y-6">
        {sourate.ayahs.map((ayah: any, index: number) => {
          const translationAyah = translation?.ayahs?.[index];
          
          return (
            <div key={ayah.number} className="bg-[var(--color-muted)] rounded-lg p-6 shadow-sm border border-[var(--color-border)]">
              {/* En-tête du verset */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-[var(--color-accent)] text-white rounded-full flex items-center justify-center text-sm font-semibold">
                    {ayah.numberInSurah}
                  </div>
                  <span className="text-[var(--color-foreground)] font-medium">Verset {ayah.numberInSurah}</span>
                </div>
                <button 
                  className="p-2 rounded-full bg-[var(--color-accent)] hover:bg-[var(--color-accent-dark)] transition-colors"
                  onClick={() => {
                    const audio = new Audio(ayah.audio);
                    audio.play();
                  }}
                  aria-label="Écouter le verset"
                >
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>

              {/* Texte arabe */}
              <div className="mb-4">
                <p className="text-right text-2xl leading-loose font-amiri text-[var(--color-foreground)]">
                  {ayah.text}
                </p>
              </div>

              {/* Traduction française */}
              {translationAyah && (
                <div className="pt-4 border-t border-[var(--color-border)]">
                  <p className="text-[var(--color-foreground)] leading-relaxed">
                    {translationAyah.text}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
};

export default SourateDetail; 