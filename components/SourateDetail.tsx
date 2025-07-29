"use client";

import React, { useState, useRef } from "react";
import AudioPlayer from "./AudioPlayer";
import Link from "next/link";

import ReciterSelector, { RECITERS } from './ReciterSelector';

interface SourateDetailProps {
  sourate: any;
  translation: any;
  showReciterSelector?: boolean;
  showPlayAllButton?: boolean;
}

const getRecitationUrl = (reciterId: string, sourateId: number) => {
  // Pad surah number to 3 digits for mp3quran.net
  const paddedId = String(sourateId).padStart(3, '0');
  return reciterId === "balilah"
    ? `https://server6.mp3quran.net/balilah/${paddedId}.mp3`
    : reciterId === "jhn"
    ? `https://server13.mp3quran.net/jhn/${paddedId}.mp3`
    : reciterId === "aabd-lrhmn-lshh-t"
    ? `https://server16.mp3quran.net/a_alshahhat/Rewayat-Hafs-A-n-Assem/${paddedId}.mp3`
    : reciterId === "afs"
    ? `https://server8.mp3quran.net/afs/${paddedId}.mp3`
    : reciterId === "maher"
    ? `https://server12.mp3quran.net/maher/${paddedId}.mp3`
    : reciterId === "h_dukhain"
    ? `https://server16.mp3quran.net/h_dukhain/Rewayat-Hafs-A-n-Assem/${paddedId}.mp3`
    : reciterId === "islam"
    ? `https://server14.mp3quran.net/islam/Rewayat-Hafs-A-n-Assem/${paddedId}.mp3`
    : reciterId === "soufi-1"
    ? `https://server16.mp3quran.net/soufi/Rewayat-Khalaf-A-n-Hamzah/${paddedId}.mp3`
    : reciterId === "sds"
    ? `https://server11.mp3quran.net/sds/${paddedId}.mp3`
    : `https://www.al-hamdoulillah.com/coran/mp3/files/${reciterId}/${paddedId}.mp3`;
};

const SourateDetail: React.FC<SourateDetailProps> = ({ sourate, translation, showReciterSelector, showPlayAllButton }) => {
  const [playingAyah, setPlayingAyah] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [selectedReciter, setSelectedReciter] = useState<string>(RECITERS[0].id);
  const [showGlobalPlayer, setShowGlobalPlayer] = useState(false);
  const [globalPlayerProps, setGlobalPlayerProps] = useState<{src: string; title: string; reciter: string} | null>(null);

  const sourateId = sourate?.number;

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
        <Link href="/ecoute" className="inline-flex items-center px-4 py-2 rounded-full bg-[var(--color-muted)] hover:bg-[var(--color-accent-dark)] text-white font-medium transition-colors shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Retour à la liste
        </Link>
      </div>

      {/* Sélecteur d'imam */}
      {showReciterSelector && (
        <>
          <ReciterSelector selectedReciter={selectedReciter} onChange={setSelectedReciter} />
          {selectedReciter !== 'afs' && (
            <div className="mb-4 p-3 rounded bg-yellow-100 text-yellow-900 text-sm border border-yellow-300">
              La lecture verset par verset n'est disponible que pour Sheikh Alafasy. Pour les autres imams, cliquer sur un verset joue la sourate entière.
            </div>
          )}
        </>
      )}
      {/* Lecture complète */}
      {showPlayAllButton && (
        <div className="mb-4 flex flex-col items-center gap-2">
          <button
            className="px-4 py-2 rounded bg-green-600 text-white font-semibold hover:bg-green-700 transition"
            onClick={() => {
              setShowGlobalPlayer(true);
              setGlobalPlayerProps({
                src: getRecitationUrl(selectedReciter, sourateId),
                title: `${sourate.nom_phonetique} (${sourate.nom_arabe})`,
                reciter: RECITERS.find(r => r.id === selectedReciter)?.name || selectedReciter
              });
              setPlayingAyah(-1); // -1 = lecture complète
              setIsPaused(false);
            }}
          >
            Lecture complète
          </button>
        </div>
      )}

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
          // Pour Alafasy, jouer l'audio du verset. Pour les autres, jouer la sourate complète.
          const ayahAudioUrl = selectedReciter === 'afs'
            ? ayah.audio // audio du verset fourni par l'API pour Alafasy
            : getRecitationUrl(selectedReciter, sourateId); // audio de la sourate complète pour les autres
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
                  onClick={() => handleAudioPlay(ayah.numberInSurah, ayahAudioUrl)}
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
      {/* Affichage du lecteur global si demandé */}
      {showGlobalPlayer && globalPlayerProps && (
        <AudioPlayer
          src={globalPlayerProps.src}
          title={globalPlayerProps.title}
          reciter={globalPlayerProps.reciter}
          image={
            (() => {
              const reciters = [
                { id: 'balilah', name: 'Bandar Balilah', image: '/img/bandar-balila.jpg' },
                { id: 'jhn', name: 'Jahan', image: '/img/al.jpg' },
                { id: 'aabd-lrhmn-lshh-t', name: 'Abderrahman Al Shahat', image: '/img/abderrahman-shahat.jpg' },
                { id: 'afs', name: 'Alafasy', image: '/img/mishary.webp' },
                { id: 'maher', name: 'Maher Al-Muaiqly', image: '/img/Maher.png' },
                { id: 'h_dukhain', name: 'Haitham Dukhain', image: '/img/haitham.webp' },
                { id: 'islam', name: 'Islam Sobhi', image: '/img/islam.png' },
                { id: 'soufi-1', name: 'Soufi', image: '/img/abdul-rashid-ali-sufi.png' },
                { id: 'sds', name: 'Saad Al-Ghamdi', image: '/img/saad-al-ghamdi.jpg' },
              ];
              const reciterObj = reciters.find(r => r.name === globalPlayerProps.reciter || r.id === selectedReciter);
              return reciterObj?.image;
            })()
          }
        />
      )}
    </main>
  );
};

export default SourateDetail; 