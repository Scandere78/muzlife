"use client";

import React, { useState, useRef, useEffect } from "react";
import AudioPlayer from "./AudioPlayer";
import Link from "next/link";

import ReciterSelector, { RECITERS } from './ReciterSelector';

interface SourateDetailProps {
  sourate: any;
  translation: any;
  transliteration?: any;
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
    ? `https://server14.mp3quran.net/islam/Rewayat-Hafs-A-n-Assem/${paddedId}).mp3`
    : reciterId === "soufi-1"
    ? `https://server16.mp3quran.net/soufi/Rewayat-Khalaf-A-n-Hamzah/${paddedId}.mp3`
    : reciterId === "sds"
    ? `https://server11.mp3quran.net/sds/${paddedId}.mp3`
    : `https://www.al-hamdoulillah.com/coran/mp3/files/${reciterId}/${paddedId}.mp3`;
};

const SourateDetail: React.FC<SourateDetailProps> = ({ sourate, translation, transliteration, showReciterSelector, showPlayAllButton }) => {
  const [playingAyah, setPlayingAyah] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [selectedReciter, setSelectedReciter] = useState<string>(RECITERS[0].id);
  const [showGlobalPlayer, setShowGlobalPlayer] = useState(false);
  const [globalPlayerProps, setGlobalPlayerProps] = useState<{src: string; title: string; reciter: string} | null>(null);
  
  // Mode automatique
  const [autoMode, setAutoMode] = useState(false);
  const [currentAutoAyah, setCurrentAutoAyah] = useState<number | null>(null);
  const [autoProgress, setAutoProgress] = useState(0);
  const [showAutoPlayer, setShowAutoPlayer] = useState(false);

  const sourateId = sourate?.number;
  const totalAyahs = sourate?.numberOfAyahs || 0;

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

    // Masquer le player de lecture complète quand on commence à écouter les versets
    if (showGlobalPlayer) {
      setShowGlobalPlayer(false);
      setGlobalPlayerProps(null);
    }

    // Créer et jouer le nouvel audio
    const audio = new Audio(audioUrl);
    audioRef.current = audio;
    
    audio.addEventListener('ended', () => {
      setPlayingAyah(null);
      setIsPaused(false);
      audioRef.current = null;
      
      // Mode automatique : passer au verset suivant
      if (autoMode && currentAutoAyah && currentAutoAyah < totalAyahs) {
        const nextAyah = currentAutoAyah + 1;
        const nextAyahElement = sourate.ayahs.find((ayah: any) => ayah.numberInSurah === nextAyah);
        if (nextAyahElement) {
          const nextAudioUrl = nextAyahElement.audio; // Utiliser l'audio du verset spécifique
          
          setTimeout(() => {
            // Mettre à jour le verset en cours pour l'effet visuel
            setCurrentAutoAyah(nextAyah);
            setAutoProgress(((nextAyah - 1) / totalAyahs) * 100);
            
            // Jouer le verset suivant
            const nextAudio = new Audio(nextAudioUrl);
            audioRef.current = nextAudio;
            
            nextAudio.addEventListener('ended', () => {
              setPlayingAyah(null);
              setIsPaused(false);
              audioRef.current = null;
              
              // Continuer avec le verset suivant si on n'est pas au dernier
              if (nextAyah < totalAyahs) {
                const nextNextAyah = nextAyah + 1;
                const nextNextAyahElement = sourate.ayahs.find((ayah: any) => ayah.numberInSurah === nextNextAyah);
                if (nextNextAyahElement) {
                  const nextNextAudioUrl = nextNextAyahElement.audio; // Utiliser l'audio du verset spécifique
                  
                  setTimeout(() => {
                    setCurrentAutoAyah(nextNextAyah);
                    setAutoProgress(((nextNextAyah - 1) / totalAyahs) * 100);
                    handleAutoPlayNext(nextNextAyah, nextNextAudioUrl);
                  }, 1000);
                }
              } else {
                // Fin de la sourate
                setCurrentAutoAyah(null);
                setAutoProgress(100);
                setShowAutoPlayer(false);
                setAutoMode(false);
              }
            });
            
            nextAudio.play();
            setPlayingAyah(nextAyah);
            setIsPaused(false);
          }, 1000); // Délai de 1 seconde entre les versets
        }
      } else if (autoMode && currentAutoAyah && currentAutoAyah >= totalAyahs) {
        // Fin de la sourate
        setCurrentAutoAyah(null);
        setAutoProgress(100);
        setShowAutoPlayer(false);
        setAutoMode(false);
      }
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
    
    // Mettre à jour le mode automatique
    if (autoMode) {
      setCurrentAutoAyah(ayahNumber);
      setAutoProgress(((ayahNumber - 1) / totalAyahs) * 100);
      setShowAutoPlayer(true);
    }
  };

  // Fonction récursive pour la lecture automatique
  const handleAutoPlayNext = (ayahNumber: number, audioUrl: string) => {
    if (!autoMode || ayahNumber > totalAyahs) {
      // Fin de la sourate
      setCurrentAutoAyah(null);
      setAutoProgress(100);
      setShowAutoPlayer(false);
      setAutoMode(false);
      return;
    }

    const audio = new Audio(audioUrl);
    audioRef.current = audio;
    
    audio.addEventListener('ended', () => {
      setPlayingAyah(null);
      setIsPaused(false);
      audioRef.current = null;
      
      // Passer au verset suivant
      if (ayahNumber < totalAyahs) {
        const nextAyah = ayahNumber + 1;
        const nextAyahElement = sourate.ayahs.find((ayah: any) => ayah.numberInSurah === nextAyah);
        if (nextAyahElement) {
          const nextAudioUrl = nextAyahElement.audio; // Utiliser l'audio du verset spécifique
          
          setTimeout(() => {
            setCurrentAutoAyah(nextAyah);
            setAutoProgress(((nextAyah - 1) / totalAyahs) * 100);
            handleAutoPlayNext(nextAyah, nextAudioUrl);
          }, 1000);
        }
      } else {
        // Fin de la sourate
        setCurrentAutoAyah(null);
        setAutoProgress(100);
        setShowAutoPlayer(false);
        setAutoMode(false);
      }
    });
    
    audio.play();
    setPlayingAyah(ayahNumber);
    setIsPaused(false);
  };

  // Mettre à jour la progression automatique
  useEffect(() => {
    if (autoMode && currentAutoAyah) {
      setAutoProgress(((currentAutoAyah - 1) / totalAyahs) * 100);
    }
  }, [currentAutoAyah, autoMode, totalAyahs]);

  // Arrêter le mode automatique si on clique sur pause
  const handleAutoPause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPaused(true);
    }
  };

  const handleAutoPlay = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPaused(false);
    }
  };

  const handleAutoStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setPlayingAyah(null);
    setIsPaused(false);
    setCurrentAutoAyah(null);
    setAutoProgress(0);
    setShowAutoPlayer(false);
    setAutoMode(false);
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

      {/* 
        Explication :
        On veut que le sélecteur d'imam, le bouton "Lecture complète" et le texte d'information
        soient tous alignés horizontalement, sur une même ligne, pour une meilleure lisibilité.
        On utilise flex-row et on gère l'espace entre chaque élément.
        Le texte d'information n'apparaît que si ce n'est pas Alafasy.
      */}
      {showReciterSelector && (
        <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full max-w-3xl mx-auto">
          {/* Sélecteur d'imam */}
          <div className="w-full sm:w-auto">
            <ReciterSelector selectedReciter={selectedReciter} onChange={setSelectedReciter} />
          </div>
          
          {/* Contrôles de lecture */}
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            {/* Toggle Mode Automatique */}
            <button
              className={`px-4 py-2 rounded text-white font-semibold transition text-sm sm:text-base ${
                autoMode 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-gray-500 hover:bg-gray-600'
              }`}
              onClick={() => {
                const newAutoMode = !autoMode;
                setAutoMode(newAutoMode);
                
                // Masquer le player de lecture complète quand on active le mode automatique
                if (newAutoMode && showGlobalPlayer) {
                  setShowGlobalPlayer(false);
                  setGlobalPlayerProps(null);
                }
              }}
            >
              {autoMode ? 'Mode Auto ✓' : 'Mode Auto'}
            </button>
            
            {/* Bouton Lecture complète */}
            {showPlayAllButton && (
              <button
                className="w-full sm:w-auto px-4 py-2 rounded bg-gold-500 text-white font-semibold hover:bg-green-700 transition text-sm sm:text-base"
                onClick={() => {
                  // Désactiver le mode automatique si il était actif
                  if (autoMode) {
                    setAutoMode(false);
                    setCurrentAutoAyah(null);
                    setAutoProgress(0);
                    setShowAutoPlayer(false);
                    
                    // Arrêter l'audio en cours si il y en a un
                    if (audioRef.current) {
                      audioRef.current.pause();
                      audioRef.current.currentTime = 0;
                    }
                    setPlayingAyah(null);
                    setIsPaused(false);
                  }
                  
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
            )}
          </div>
        </div>
      )}
      
      {/* Message d'information aligné sur la même ligne */}
      {selectedReciter !== 'afs' && (
        <div className="p-3 rounded bg-yellow-100 text-yellow-900 text-sm border border-yellow-300">
          La lecture verset par verset n'est disponible que pour Sheikh Alafasy. Pour les autres imams, cliquer sur un verset joue la sourate entière.
        </div>
      )}

      {/* En-tête de la sourate */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-[var(--color-muted)] mb-2">{sourate.name}</h1>
        <p className="text-[var(--color-foreground)] text-lg">{sourate.englishName}</p>
        <p className="text-[var(--color-foreground)] text-sm mt-1">{sourate.revelationType} • {sourate.numberOfAyahs} versets</p>
      </div>

      {/* Liste des versets */}
      <div className="space-y-6">
        {sourate.ayahs.map((ayah: any, index: number) => {
          const translationAyah = translation?.ayahs?.[index];
          const isCurrentlyPlaying = playingAyah === ayah.numberInSurah;
          const isThisPaused = isCurrentlyPlaying && isPaused;
          const isAutoPlaying = autoMode && currentAutoAyah === ayah.numberInSurah;
          
          // Pour Alafasy, jouer l'audio du verset. Pour les autres, jouer la sourate complète.
          const ayahAudioUrl = selectedReciter === 'afs'
            ? ayah.audio // audio du verset fourni par l'API pour Alafasy
            : ayah.audio; // Utiliser l'audio du verset même pour les autres récitateurs
          
          return (
            <div 
              key={ayah.number} 
              className={`rounded-lg p-6 shadow-sm border transition-all duration-300 ${
                isAutoPlaying 
                  ? 'bg-green-100 border-green-300 shadow-lg scale-105' 
                  : isCurrentlyPlaying
                  ? 'bg-green-100 border-green-300 shadow-lg scale-105' // Même effet que le mode auto
                  : 'bg-[var(--color-muted)] border-[var(--color-border)] hover:bg-[var(--color-muted)]/80'
              }`}
            >
              {/* En-tête du verset */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                    isAutoPlaying 
                      ? 'bg-green-500 text-white animate-pulse' 
                      : isCurrentlyPlaying
                      ? 'bg-green-500 text-white animate-pulse' // Même effet que le mode auto
                      : 'bg-[var(--color-accent)] text-white'
                  }`}>
                    {ayah.numberInSurah}
                  </div>
                  <span className="text-[var(--color-foreground)] font-medium">Verset {ayah.numberInSurah}</span>
                  {(isAutoPlaying || isCurrentlyPlaying) && (
                    <span className="text-green-600 text-sm font-semibold animate-pulse">
                      ● En cours
                    </span>
                  )}
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
                <div className="mb-1 inline-flex items-center gap-2 px-2 py-0.5 rounded-full bg-[var(--color-accent)]/20 text-black text-xs font-semibold">
                  Arabe
                </div>
                <p className="text-right text-2xl leading-loose font-amiri text-[var(--color-foreground)]">
                  {ayah.text}
                </p>
              </div>

              {/* Translittération (lecture phonétique) */}
              {(() => {
                const translitAyah = transliteration?.ayahs?.[index]?.text;
                return translitAyah ? (
                  <div className="pt-4 border-t border-[var(--color-border)]">
                    <div className="mb-1 inline-flex items-center gap-2 px-2 py-0.5 rounded-full bg-emerald-500/20 text-black text-xs font-semibold">
                      Phonétique
                    </div>
                    <p className="text-left text-lg leading-relaxed italic text-black">
                      {translitAyah}
                    </p>
                  </div>
                ) : null;
              })()}

              {/* Traduction française */}
              {translationAyah && (
                <div className="pt-4 border-t border-[var(--color-border)]">
                  <div className="mb-1 inline-flex items-center gap-2 px-2 py-0.5 rounded-full bg-blue-500/20 text-black text-xs font-semibold">
                    Français
                  </div>
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
          sourate={sourate.nom_phonetique}
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
       {/* Player de progression automatique */}
       {showAutoPlayer && autoMode && currentAutoAyah && (
         <div className="fixed bottom-0 z-50 flex items-center justify-center px-2 py-2 left-1/2 transform -translate-x-1/2 transition-all duration-700 ease-out">
           <div className="w-full mx-auto flex flex-col items-center justify-center rounded-2xl bg-[var(--color-foreground)]/80 backdrop-blur-lg shadow-2xl border-2 border-gold px-4 py-3 relative transform transition-all duration-500 ease-out hover:scale-105" style={{ minHeight: 90 }}>
             <div className="flex items-center gap-3 mb-2 w-full justify-left">
               <div className="w-12 h-12 rounded-full flex items-center justify-center bg-green-500 text-white font-bold text-lg border-2 border-white/40 shadow-lg">
                 <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                   <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                 </svg>
               </div>
               <div className="flex flex-col justify-center ml-2">
                 <span className="font-bold text-base leading-tight text-white drop-shadow-sm truncate" style={{ maxWidth: 140 }}>
                   Mode Auto - Verset {currentAutoAyah} / {totalAyahs}
                 </span>
                 <span className="text-xs text-gray-200 mt-1 font-medium truncate" style={{ maxWidth: 140 }}>
                   {Math.round(autoProgress)}% terminé
                 </span>
               </div>
             </div>
             
             <div className="flex items-center gap-3 mb-2 w-full justify-center">
               <button
                 onClick={isPaused ? handleAutoPlay : handleAutoPause}
                 className="px-5 py-2 rounded-full bg-green-500 text-white font-bold shadow-lg transition-all duration-200 flex items-center justify-center"
               >
                 {isPaused ? (
                   <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                     <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                   </svg>
                 ) : (
                   <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                     <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                   </svg>
                 )}
               </button>
               <button
                 onClick={handleAutoStop}
                 className="px-5 py-2 rounded-full bg-red-500 hover:bg-red-600 text-white font-bold shadow-lg transition-all duration-200 flex items-center justify-center"
                 title="Arrêter le mode automatique"
               >
                 <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                   <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                 </svg>
               </button>
             </div>
             
             {/* Barre de progression */}
             <div className="flex items-center gap-2 w-full justify-center">
               <div className="w-full bg-gray-700 rounded-full h-3" style={{ maxWidth: 220 }}>
                 <div 
                   className="bg-gradient-to-r from-green-500 to-green-400 h-3 rounded-full transition-all duration-500 ease-out"
                   style={{ width: `${autoProgress}%` }}
                 ></div>
               </div>
             </div>
           </div>
         </div>
       )}
    </main>
  );
};

export default SourateDetail; 