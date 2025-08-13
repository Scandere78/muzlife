"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  Heart, 
  BookOpen, 
  CheckCircle,
  Clock,
  Eye,
  EyeOff,
  Copy,
  Check,
  Brain
} from 'lucide-react';
import { getVerseAudioUrl } from './ReciterSelector';

interface VerseData {
  text: string;
  numberInSurah: number;
  transliteration?: string;
  translation: string;
  audio?: string;
}

interface VerseState {
  isRead: boolean;
  isMemorized: boolean;
  isFavorite: boolean;
  readCount: number;
  memorizationLevel: number;
  readingTime: number;
  memorizationTime: number;
  pronunciationTime: number;
}

interface StudyMode {
  mode: 'READING' | 'MEMORIZATION';
  showArabic: boolean;
  showPhonetics: boolean;
  showTranslation: boolean;
}

interface VerseCardProps {
  verse: VerseData;
  verseState?: VerseState | null;
  studyMode: StudyMode;
  preferences: {
    arabicFontSize: number;
    phoneticFontSize: number;
    translationFontSize: number;
    preferredReciter: string;
    defaultPlaybackSpeed: number;
    repeatCount: number;
  } | null;
  surahNumber: number; // Ajouté pour générer l'URL audio correcte
  isCurrentlyPlaying?: boolean;
  isCurrentlyPaused?: boolean;
  onVerseRead: (verseNumber: number, timeSpent: number) => void;
  onVerseMemorized: (verseNumber: number, timeSpent: number) => void;
  onVerseUnread?: (verseNumber: number) => void;
  onVerseUnmemorized?: (verseNumber: number) => void;
  onVerseFavoriteToggle: (verseNumber: number) => void;
  onPronunciationTime: (verseNumber: number, timeSpent: number) => void;
  onPlayVerse?: (verseNumber: number, audioUrl: string) => void;
  className?: string;
}

export default function VerseCard({
  verse,
  verseState,
  studyMode,
  preferences,
  surahNumber,
  isCurrentlyPlaying = false,
  isCurrentlyPaused = false,
  onVerseRead,
  onVerseMemorized,
  onVerseUnread,
  onVerseUnmemorized,
  onVerseFavoriteToggle,
  onPronunciationTime,
  onPlayVerse,
  className = '',
}: VerseCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentRepeat, setCurrentRepeat] = useState(0);
  const [readingStartTime, setReadingStartTime] = useState<number | null>(null);
  const [showElements, setShowElements] = useState({
    arabic: studyMode.showArabic,
    phonetics: studyMode.showPhonetics,
    translation: studyMode.showTranslation,
  });
  const [copySuccess, setCopySuccess] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);

  // Préférences par défaut si null
  const defaultPreferences = {
    arabicFontSize: 24,
    phoneticFontSize: 16,
    translationFontSize: 14,
    preferredReciter: 'mishary',
    defaultPlaybackSpeed: 1.0,
    repeatCount: 1,
  };
  
  const currentPreferences = preferences || defaultPreferences;

  // Audio URL basé sur les préférences utilisateur pour ce verset spécifique
  const audioUrl = verse.audio || getVerseAudioUrl(
    currentPreferences.preferredReciter, 
    surahNumber, 
    verse.numberInSurah
  );

  // Démarrer le chrono de lecture quand le composant devient visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !readingStartTime) {
            setReadingStartTime(Date.now());
          }
        });
      },
      { threshold: 0.5 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, [readingStartTime]);

  // Calculer le temps passé et marquer comme lu lors du défilement (seulement en mode READING)
  useEffect(() => {
    return () => {
      if (readingStartTime && !verseState?.isRead && studyMode.mode === 'READING') {
        const timeSpent = Math.round((Date.now() - readingStartTime) / 1000);
        if (timeSpent >= 3) { // Au moins 3 secondes pour considérer comme "lu"
          onVerseRead(verse.numberInSurah, timeSpent);
        }
      }
    };
  }, [readingStartTime, verse.numberInSurah, onVerseRead, verseState?.isRead, studyMode.mode]);

  const handlePlayAudio = async () => {
    // Toujours utiliser le gestionnaire externe pour assurer qu'un seul verset joue à la fois
    if (onPlayVerse) {
      onPlayVerse(verse.numberInSurah, audioUrl);
      return;
    }
    
    // Logique locale uniquement si pas de gestionnaire externe (fallback)
    if (!audioRef.current) {
      audioRef.current = new Audio(audioUrl);
      audioRef.current.playbackRate = currentPreferences.defaultPlaybackSpeed;
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      const startTime = Date.now();
      setIsPlaying(true);
      
      try {
        await audioRef.current.play();
        audioRef.current.onended = () => {
          const pronunciationTime = Math.round((Date.now() - startTime) / 1000);
          onPronunciationTime(verse.numberInSurah, pronunciationTime);
          
          if (currentRepeat + 1 < currentPreferences.repeatCount) {
            setCurrentRepeat(prev => prev + 1);
            audioRef.current!.currentTime = 0;
            audioRef.current!.play();
          } else {
            setIsPlaying(false);
            setCurrentRepeat(0);
          }
        };
      } catch (error) {
        console.error('Erreur lecture audio:', error);
        setIsPlaying(false);
      }
    }
  };

  const handleMemorizeToggle = () => {
    if (verseState?.isMemorized) {
      // Démarquer comme mémorisé
      onVerseUnmemorized?.(verse.numberInSurah);
    } else {
      // Marquer comme mémorisé
      const memorizationTime = readingStartTime 
        ? Math.round((Date.now() - readingStartTime) / 1000)
        : 0;
      onVerseMemorized(verse.numberInSurah, memorizationTime);
    }
  };

  const handleReadToggle = () => {
    if (verseState?.isRead) {
      // Démarquer comme lu
      onVerseUnread?.(verse.numberInSurah);
    } else {
      // Marquer comme lu
      const readingTime = readingStartTime 
        ? Math.round((Date.now() - readingStartTime) / 1000)
        : 3; // Temps minimum pour marquer comme lu
      onVerseRead(verse.numberInSurah, readingTime);
    }
  };

  const toggleElementVisibility = (element: 'arabic' | 'phonetics' | 'translation') => {
    setShowElements(prev => ({
      ...prev,
      [element]: !prev[element],
    }));
  };
  
  const handleCopyVerseLink = async () => {
    try {
      const url = `${window.location.origin}${window.location.pathname}#verse-${verse.numberInSurah}`;
      await navigator.clipboard.writeText(url);
      setCopySuccess(true);
      
      // Reset success state after 2 seconds
      setTimeout(() => {
        setCopySuccess(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to copy verse link:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = `${window.location.origin}${window.location.pathname}#verse-${verse.numberInSurah}`;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } catch (fallbackError) {
        console.error('Fallback copy failed:', fallbackError);
      }
      document.body.removeChild(textArea);
    }
  };

  // Styles basés sur l'état du verset
  const cardStyle = {
    borderLeft: verseState?.isMemorized 
      ? '4px solid #10b981' 
      : verseState?.isRead 
      ? '4px solid #22c55e' 
      : '4px solid transparent',
  };


  // Déterminer si ce verset est en cours de lecture
  // Priorité à isCurrentlyPlaying (venant du gestionnaire externe)
  const isPlayingAudio = isCurrentlyPlaying || isPlaying;
  
  // Déterminer l'état réel du bouton play/pause
  // Si c'est le verset actuel et qu'il est en pause, on montre l'icône pause
  // Si c'est le verset actuel et qu'il joue, on montre l'icône pause
  // Sinon on montre l'icône play
  const shouldShowPauseIcon = isCurrentlyPlaying || (isPlaying && !isCurrentlyPaused);
  const isVerseActive = isCurrentlyPlaying || isCurrentlyPaused || isPlaying;

  return (
    <motion.div
      ref={cardRef}
      id={`verse-${verse.numberInSurah}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        scale: isPlayingAudio ? 1.02 : 1
      }}
      transition={{ duration: 0.3 }}
      className={`rounded-xl p-4 mb-4 border transition-all duration-300 hover:shadow-lg overflow-hidden ${
        isPlayingAudio 
          ? 'bg-green-900/70 border-green-300 shadow-lg shadow-green-500/20 backdrop-blur-sm' 
          : 'bg-black/60 backdrop-blur-sm border-white/10 hover:border-white/20'
      } ${className}`}
      style={cardStyle}
    >
      {/* En-tête avec numéro de verset et contrôles */}
      <div className="flex items-start justify-between mb-4 gap-4">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <motion.div 
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 flex-shrink-0 ${
              isPlayingAudio 
                ? 'bg-green-500 text-white' 
                : 'bg-[var(--color-accent)] text-white'
            }`}
            animate={isPlayingAudio ? {
              scale: [1, 1.1, 1],
              boxShadow: [
                '0 0 0 0 rgba(34, 197, 94, 0)',
                '0 0 0 6px rgba(34, 197, 94, 0.2)',
                '0 0 0 0 rgba(34, 197, 94, 0)'
              ]
            } : {}}
            transition={{
              duration: 2,
              repeat: isPlayingAudio ? Infinity : 0,
              ease: "easeInOut"
            }}
          >
            {verse.numberInSurah}
          </motion.div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <span className="text-white font-medium">Verset {verse.numberInSurah}</span>
              
              <AnimatePresence>
                {(isCurrentlyPlaying || isCurrentlyPaused) && (
                  <motion.span 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className={`text-xs font-semibold flex items-center space-x-1 ${
                      isCurrentlyPlaying ? 'text-green-400' : 'text-orange-400'
                    }`}
                  >
                    <motion.span 
                      className={`w-1.5 h-1.5 rounded-full ${
                        isCurrentlyPlaying ? 'bg-green-400' : 'bg-orange-400'
                      }`}
                      animate={isCurrentlyPlaying ? {
                        scale: [1, 1.3, 1],
                        opacity: [1, 0.6, 1]
                      } : {
                        scale: 1,
                        opacity: 0.8
                      }}
                      transition={{
                        duration: 1,
                        repeat: isCurrentlyPlaying ? Infinity : 0,
                        ease: "easeInOut"
                      }}
                    />
                    <motion.span
                      animate={isCurrentlyPlaying ? {
                        opacity: [1, 0.7, 1]
                      } : {
                        opacity: 0.8
                      }}
                      transition={{
                        duration: 2,
                        repeat: isCurrentlyPlaying ? Infinity : 0,
                        ease: "easeInOut"
                      }}
                    >
                      {isCurrentlyPlaying ? 'En cours' : 'En pause'}
                    </motion.span>
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
            
            {/* Indicateurs d'état */}
            <div className="flex items-center space-x-2 mt-1">
              <AnimatePresence>
                {verseState?.isRead && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="text-green-400"
                    title="Verset lu"
                    whileHover={{ scale: 1.2 }}
                  >
                    <Eye size={14} />
                  </motion.div>
                )}
              </AnimatePresence>
              
              <AnimatePresence>
                {verseState?.isMemorized && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="text-emerald-400"
                    title="Verset mémorisé"
                    whileHover={{ scale: 1.2 }}
                  >
                    <Brain size={14} />
                  </motion.div>
                )}
              </AnimatePresence>
              
              <AnimatePresence>
                {verseState?.memorizationLevel && verseState.memorizationLevel > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="flex items-center space-x-1"
                  >
                    {[1, 2, 3, 4, 5].map((level) => (
                      <motion.div
                        key={level}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: level * 0.1 }}
                        className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                          level <= (verseState?.memorizationLevel || 0)
                            ? 'bg-emerald-400'
                            : 'bg-gray-600'
                        }`}
                        whileHover={{
                          scale: level <= (verseState?.memorizationLevel || 0) ? 1.3 : 1.1,
                          backgroundColor: level <= (verseState?.memorizationLevel || 0) ? '#34d399' : '#6b7280'
                        }}
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Contrôles */}
        <div className="flex items-center space-x-1 flex-shrink-0">
          {/* Bouton lecture audio */}
          <motion.button
            onClick={handlePlayAudio}
            className={`p-2 rounded-lg transition-all duration-300 ${
              isVerseActive
                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                : 'bg-white/10 hover:bg-white/20'
            }`}
            title={
              shouldShowPauseIcon 
                ? "Mettre en pause" 
                : (isCurrentlyPaused ? "Reprendre" : "Écouter")
            }
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
          >
            {shouldShowPauseIcon ? <Pause size={16} /> : <Play size={16} />}
          </motion.button>

          {/* Bouton favori */}
          <motion.button
            onClick={() => onVerseFavoriteToggle(verse.numberInSurah)}
            className={`p-2 rounded-lg transition-all duration-300 ${
              verseState?.isFavorite
                ? 'text-red-400 bg-red-400/20'
                : 'bg-white/10 hover:bg-white/20'
            }`}
            title="Ajouter aux favoris"
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
          >
            <motion.div
              animate={{
                scale: verseState?.isFavorite ? [1, 1.2, 1] : 1,
                color: verseState?.isFavorite ? '#f87171' : undefined
              }}
              transition={{ duration: 0.3 }}
            >
              <Heart size={16} fill={verseState?.isFavorite ? 'currentColor' : 'none'} />
            </motion.div>
          </motion.button>

          {/* Bouton marquer comme lu */}
          <motion.button
            onClick={handleReadToggle}
            className={`p-2 rounded-lg transition-all duration-300 ${
              verseState?.isRead
                ? 'text-green-400 bg-green-400/20'
                : 'bg-white/10 hover:bg-white/20'
            }`}
            title={verseState?.isRead ? 'Marquer comme non lu' : 'Marquer comme lu'}
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
          >
            <motion.div
              animate={{
                scale: verseState?.isRead ? [1, 1.2, 1] : 1,
                color: verseState?.isRead ? '#22c55e' : undefined
              }}
              transition={{ duration: 0.3 }}
            >
              <Eye size={16} fill={verseState?.isRead ? 'currentColor' : 'none'} />
            </motion.div>
          </motion.button>

          {/* Bouton mémorisation - visible uniquement en mode MEMORIZATION */}
          {studyMode.mode === 'MEMORIZATION' && (
            <motion.button
              onClick={handleMemorizeToggle}
              className={`p-2 rounded-lg transition-all duration-300 ${
                verseState?.isMemorized
                  ? 'text-emerald-400 bg-emerald-400/20'
                  : 'bg-white/10 hover:bg-white/20'
              }`}
              title={verseState?.isMemorized ? 'Marquer comme non mémorisé' : 'Marquer comme mémorisé'}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                animate={{
                  scale: verseState?.isMemorized ? [1, 1.2, 1] : 1,
                  color: verseState?.isMemorized ? '#10b981' : undefined
                }}
                transition={{ duration: 0.3 }}
              >
                <Brain size={16} fill={verseState?.isMemorized ? 'currentColor' : 'none'} />
              </motion.div>
            </motion.button>
          )}

          {/* Bouton copier lien */}
          <motion.button
            onClick={handleCopyVerseLink}
            className={`p-2 rounded-lg transition-all duration-300 ${
              copySuccess
                ? 'text-green-400 bg-green-400/20'
                : 'bg-white/10 hover:bg-white/20'
            }`}
            title={copySuccess ? 'Lien copié !' : 'Copier le lien du verset'}
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={copySuccess ? 'check' : 'copy'}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {copySuccess ? <Check size={16} /> : <Copy size={16} />}
              </motion.div>
            </AnimatePresence>
          </motion.button>

          {/* Contrôles de visibilité pour mode d'étude */}
          {studyMode.mode !== 'READING' && (
            <div className="flex items-center space-x-1 ml-2 border-l border-white/20 pl-2">
              <motion.button
                onClick={() => toggleElementVisibility('phonetics')}
                className={`p-1 rounded transition-all duration-300 ${
                  showElements.phonetics ? 'text-blue-400 bg-blue-400/20' : 'text-gray-500 hover:text-blue-400'
                }`}
                title="Afficher/Cacher phonétique"
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.1 }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={showElements.phonetics ? 'eye' : 'eye-off'}
                    initial={{ scale: 0.8, opacity: 0, rotate: -90 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    exit={{ scale: 0.8, opacity: 0, rotate: 90 }}
                    transition={{ duration: 0.2 }}
                  >
                    {showElements.phonetics ? <Eye size={14} /> : <EyeOff size={14} />}
                  </motion.div>
                </AnimatePresence>
              </motion.button>
              
              <motion.button
                onClick={() => toggleElementVisibility('translation')}
                className={`p-1 rounded transition-all duration-300 ${
                  showElements.translation ? 'text-green-400 bg-green-400/20' : 'text-gray-500 hover:text-green-400'
                }`}
                title="Afficher/Cacher traduction"
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.1 }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={showElements.translation ? 'eye' : 'eye-off'}
                    initial={{ scale: 0.8, opacity: 0, rotate: -90 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    exit={{ scale: 0.8, opacity: 0, rotate: 90 }}
                    transition={{ duration: 0.2 }}
                  >
                    {showElements.translation ? <Eye size={14} /> : <EyeOff size={14} />}
                  </motion.div>
                </AnimatePresence>
              </motion.button>
            </div>
          )}
        </div>
      </div>

      {/* Contenu du verset */}
      <div className="space-y-4">
        {/* Texte arabe */}
        <AnimatePresence>
          {showElements.arabic && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4"
            >
              <div className="mb-2 inline-flex items-center gap-2 px-2 py-0.5 rounded-full bg-[var(--color-accent)]/20 text-white text-xs font-semibold">
                Arabe
              </div>
              <p 
                className="text-right font-amiri leading-loose text-white break-words"
                style={{ 
                  fontSize: `${currentPreferences.arabicFontSize}px`,
                  wordWrap: 'break-word',
                  overflowWrap: 'break-word'
                }}
                dir="rtl"
              >
                {verse.text}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Translittération phonétique */}
        <AnimatePresence>
          {showElements.phonetics && verse.transliteration && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="pt-4 border-t border-white/10"
            >
              <div className="mb-2 inline-flex items-center gap-2 px-2 py-0.5 rounded-full bg-emerald-500/20 text-white text-xs font-semibold">
                Phonétique
              </div>
              <p 
                className="text-left leading-relaxed italic text-gray-300 break-words"
                style={{ 
                  fontSize: `${currentPreferences.phoneticFontSize}px`,
                  wordWrap: 'break-word',
                  overflowWrap: 'break-word'
                }}
              >
                {verse.transliteration}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Traduction française */}
        <AnimatePresence>
          {showElements.translation && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="pt-4 border-t border-white/10"
            >
              <div className="mb-2 inline-flex items-center gap-2 px-2 py-0.5 rounded-full bg-blue-500/20 text-white text-xs font-semibold">
                Français
              </div>
              <p 
                className="text-white leading-relaxed break-words"
                style={{ 
                  fontSize: `${currentPreferences.translationFontSize}px`,
                  wordWrap: 'break-word',
                  overflowWrap: 'break-word'
                }}
              >
                {verse.translation}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Statistiques en bas (mode debug/stats) */}
      {verseState && (verseState.readCount > 0 || verseState.readingTime > 0) && (
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10 text-xs text-gray-400">
          <div className="flex items-center space-x-4">
            {verseState.readCount > 0 && (
              <span className="flex items-center space-x-1">
                <BookOpen size={12} />
                <span>Lu {verseState.readCount}x</span>
              </span>
            )}
            
            {verseState.readingTime > 0 && (
              <span className="flex items-center space-x-1">
                <Clock size={12} />
                <span>{Math.round(verseState.readingTime / 60)}min</span>
              </span>
            )}
          </div>
          
          {currentRepeat > 0 && currentPreferences.repeatCount > 1 && (
            <span className="text-[var(--color-accent)]">
              Répétition {currentRepeat + 1}/{currentPreferences.repeatCount}
            </span>
          )}
        </div>
      )}
    </motion.div>
  );
}