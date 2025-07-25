"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";

interface SourateDetailProps {
  sourate: any;
  translation: any;
}

const SourateDetail: React.FC<SourateDetailProps> = ({ sourate, translation }) => {
  const [playingAyah, setPlayingAyah] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleAudioPlay = (ayahNumber: number, audioUrl: string) => {
    // Si on clique sur le même verset qui joue déjà
    if (playingAyah === ayahNumber) {
      if (audioRef.current) {
        if (isPaused) {
          // Reprendre la lecture
          audioRef.current.play();
          setIsPaused(false);
        } else {
          // Mettre en pause
          audioRef.current.pause();
          setIsPaused(true);
        }
      }
      return;
    }

    // Arrêter l'audio précédent s'il y en a un
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    // Créer et jouer le nouvel audio
    const audio = new Audio(audioUrl);
    audioRef.current = audio;
    
    audio.addEventListener('ended', () => {
      setPlayingAyah(null);
      setIsPaused(false);
      audioRef.current = null;
    });

    audio.addEventListener('pause', () => {
      if (audio.currentTime > 0 && audio.currentTime < audio.duration) {
        setIsPaused(true);
      }
    });

    audio.addEventListener('play', () => {
      setIsPaused(false);
    });

    audio.play();
    setPlayingAyah(ayahNumber);
    setIsPaused(false);
  };

  return (
    <main className="max-w-3xl mx-auto py-10 px-4">
      {/* Bouton retour */}
      <div className="mb-6">
        <Link href="/sourates" className="inline-flex items-center px-4 py-2 rounded-full bg-[var(--color-muted)] hover:bg-[var(--color-accent-dark)] text-white font-medium transition-colors shadow-sm">
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
          const isCurrentlyPlaying = playingAyah === ayah.numberInSurah;
          const isThisPaused = isCurrentlyPlaying && isPaused;
          
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
                  className={`p-2 rounded-full transition-colors ${
                    isCurrentlyPlaying 
                      ? 'bg-[var(--color-foreground)] hover:bg-[var(--color-foreground)]/80' 
                      : 'bg-[var(--color-accent)] hover:bg-[var(--color-accent-dark)]'
                  }`}
                  onClick={() => handleAudioPlay(ayah.numberInSurah, ayah.audio)}
                  aria-label={isCurrentlyPlaying ? (isThisPaused ? 'Reprendre le verset' : 'Mettre en pause') : 'Écouter le verset'}
                >
                  {isCurrentlyPlaying ? (
                    isThisPaused ? (
                      // Icône play (reprendre)
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      // Icône pause
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    )
                  ) : (
                    // Icône play (démarrer)
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                  )}
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