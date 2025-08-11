"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Heart, 
  BookOpen, 
  Volume2, 
  CheckCircle,
  Clock,
  Eye,
  EyeOff,
  Copy,
  Check
} from 'lucide-react';

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
  isCurrentlyPlaying?: boolean;
  onVerseRead: (verseNumber: number, timeSpent: number) => void;
  onVerseMemorized: (verseNumber: number, timeSpent: number) => void;
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
  isCurrentlyPlaying = false,
  onVerseRead,
  onVerseMemorized,
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

  // Audio URL basé sur les préférences utilisateur ou fourni par le parent
  const audioUrl = verse.audio || `https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/${verse.numberInSurah}.mp3`;

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

  // Calculer le temps passé et marquer comme lu lors du défilement
  useEffect(() => {
    return () => {
      if (readingStartTime && !verseState?.isRead) {
        const timeSpent = Math.round((Date.now() - readingStartTime) / 1000);
        if (timeSpent >= 3) { // Au moins 3 secondes pour considérer comme "lu"
          onVerseRead(verse.numberInSurah, timeSpent);
        }
      }
    };
  }, [readingStartTime, verse.numberInSurah, onVerseRead, verseState?.isRead]);

  const handlePlayAudio = async () => {
    // Priorité au gestionnaire externe pour la cohérence globale
    if (onPlayVerse && verse.audio) {
      onPlayVerse(verse.numberInSurah, verse.audio);
      return;
    }
    
    // Logique locale uniquement si pas de gestionnaire externe
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
    if (!verseState?.isMemorized) {
      const memorizationTime = readingStartTime 
        ? Math.round((Date.now() - readingStartTime) / 1000)
        : 0;
      onVerseMemorized(verse.numberInSurah, memorizationTime);
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
      ? '4px solid #3b82f6' 
      : '4px solid transparent',
  };

  const getMemorizationColor = () => {
    if (!verseState?.memorizationLevel) return 'text-gray-400';
    const level = verseState.memorizationLevel;
    if (level >= 5) return 'text-emerald-500';
    if (level >= 3) return 'text-yellow-500';
    return 'text-orange-500';
  };

  // Déterminer si ce verset est en cours de lecture
  // Priorité à isCurrentlyPlaying (venant du gestionnaire externe)
  const isPlayingAudio = isCurrentlyPlaying || isPlaying;
  
  // State pour le bouton play/pause - synchronisé avec l'état global OU local
  const isVersePlayButtonActive = isCurrentlyPlaying || isPlaying;

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
          ? 'bg-green-100/20 border-green-300 shadow-lg backdrop-blur-sm' 
          : 'bg-black/50 backdrop-blur-sm border-white/10 hover:border-white/20'
      } ${className}`}
      style={cardStyle}
    >
      {/* En-tête avec numéro de verset et contrôles */}
      <div className="flex items-start justify-between mb-4 gap-4">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 flex-shrink-0 ${
            isPlayingAudio 
              ? 'bg-green-500 text-white animate-pulse' 
              : 'bg-[var(--color-accent)] text-white'
          }`}>
            {verse.numberInSurah}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <span className="text-white font-medium">Verset {verse.numberInSurah}</span>
              
              {isPlayingAudio && (
                <span className="text-green-400 text-xs font-semibold animate-pulse flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                  <span>En cours</span>
                </span>
              )}
            </div>
            
            {/* Indicateurs d'état */}
            <div className="flex items-center space-x-2 mt-1">
              {verseState?.isRead && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-blue-400"
                  title="Verset lu"
                >
                  <Eye size={14} />
                </motion.div>
              )}
              
              {verseState?.isMemorized && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-emerald-400"
                  title="Verset mémorisé"
                >
                  <CheckCircle size={14} />
                </motion.div>
              )}
              
              {verseState?.memorizationLevel && verseState.memorizationLevel > 0 && (
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div
                      key={level}
                      className={`w-1.5 h-1.5 rounded-full ${
                        level <= (verseState?.memorizationLevel || 0)
                          ? 'bg-emerald-400'
                          : 'bg-gray-600'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Contrôles */}
        <div className="flex items-center space-x-1 flex-shrink-0">
          {/* Bouton lecture audio */}
          <button
            onClick={handlePlayAudio}
            className={`p-2 rounded-lg transition-colors ${
              isVersePlayButtonActive
                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                : 'bg-white/10 hover:bg-white/20'
            }`}
            title={isVersePlayButtonActive ? "En cours de lecture" : "Écouter"}
          >
            {isVersePlayButtonActive ? <Pause size={16} /> : <Play size={16} />}
          </button>

          {/* Bouton favori */}
          <button
            onClick={() => onVerseFavoriteToggle(verse.numberInSurah)}
            className={`p-2 rounded-lg transition-colors ${
              verseState?.isFavorite
                ? 'text-red-400 bg-red-400/20'
                : 'bg-white/10 hover:bg-white/20'
            }`}
            title="Ajouter aux favoris"
          >
            <Heart size={16} fill={verseState?.isFavorite ? 'currentColor' : 'none'} />
          </button>

          {/* Bouton mémorisation */}
          <button
            onClick={handleMemorizeToggle}
            className={`p-2 rounded-lg transition-colors ${
              verseState?.isMemorized
                ? 'text-emerald-400 bg-emerald-400/20'
                : 'bg-white/10 hover:bg-white/20'
            }`}
            title={verseState?.isMemorized ? 'Mémorisé' : 'Marquer comme mémorisé'}
          >
            <CheckCircle size={16} />
          </button>

          {/* Bouton copier lien */}
          <button
            onClick={handleCopyVerseLink}
            className={`p-2 rounded-lg transition-colors ${
              copySuccess
                ? 'text-green-400 bg-green-400/20'
                : 'bg-white/10 hover:bg-white/20'
            }`}
            title={copySuccess ? 'Lien copié !' : 'Copier le lien du verset'}
          >
            {copySuccess ? <Check size={16} /> : <Copy size={16} />}
          </button>

          {/* Contrôles de visibilité pour mode d'étude */}
          {studyMode.mode !== 'READING' && (
            <div className="flex items-center space-x-1 ml-2 border-l border-white/20 pl-2">
              <button
                onClick={() => toggleElementVisibility('phonetics')}
                className={`p-1 rounded transition-colors ${
                  showElements.phonetics ? 'text-blue-400' : 'text-gray-500'
                }`}
                title="Afficher/Cacher phonétique"
              >
                {showElements.phonetics ? <Eye size={14} /> : <EyeOff size={14} />}
              </button>
              
              <button
                onClick={() => toggleElementVisibility('translation')}
                className={`p-1 rounded transition-colors ${
                  showElements.translation ? 'text-green-400' : 'text-gray-500'
                }`}
                title="Afficher/Cacher traduction"
              >
                {showElements.translation ? <Eye size={14} /> : <EyeOff size={14} />}
              </button>
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
                  fontSize: `${Math.min(currentPreferences.arabicFontSize, 20)}px`,
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
                  fontSize: `${Math.min(currentPreferences.phoneticFontSize, 16)}px`,
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
                  fontSize: `${Math.min(currentPreferences.translationFontSize, 16)}px`,
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