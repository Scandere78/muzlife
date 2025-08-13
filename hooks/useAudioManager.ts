import { useState, useRef, useCallback, useEffect } from 'react';
import { getRecitationUrl, RECITERS } from '@/components/study/ReciterSelector';

export interface AudioState {
  isPlaying: boolean;
  isPaused: boolean;
  currentVerse: number | null;
  currentMode: 'verse' | 'auto' | 'complete' | null;
  progress: number;
  duration: number;
  currentTime: number;
}

export interface AudioManagerOptions {
  onVerseComplete?: (verseNumber: number) => void;
  onSessionComplete?: () => void;
  onError?: (error: string) => void;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
}

export interface UseAudioManagerReturn {
  audioState: AudioState;
  selectedReciter: string;
  setSelectedReciter: (reciter: string) => void;
  playVerse: (verseNumber: number, audioUrl: string, verses?: any[], surahNumber?: number) => Promise<void>;
  playAutoMode: (startVerse: number, verses: any[], surahNumber: number) => void;
  playComplete: (surahNumber: number) => void;
  pauseAudio: () => void;
  resumeAudio: () => void;
  stopAudio: () => void;
  seekTo: (progress: number) => void;
  setVolume: (volume: number) => void;
  nextVerse: () => void;
  previousVerse: () => void;
}

export function useAudioManager(options: AudioManagerOptions = {}): UseAudioManagerReturn {
  const {
    onVerseComplete,
    onSessionComplete,
    onError,
    onTimeUpdate,
  } = options;

  const [audioState, setAudioState] = useState<AudioState>({
    isPlaying: false,
    isPaused: false,
    currentVerse: null,
    currentMode: null,
    progress: 0,
    duration: 0,
    currentTime: 0,
  });

  const [selectedReciter, setSelectedReciter] = useState<string>(RECITERS[0].id);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const versesRef = useRef<any[]>([]);
  const surahNumberRef = useRef<number>(0);
  const autoModeRef = useRef<boolean>(false);

  // Nettoyer l'audio précédent
  const cleanupAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.removeEventListener('ended', () => {});
      audioRef.current.removeEventListener('timeupdate', () => {});
      audioRef.current.removeEventListener('loadedmetadata', () => {});
      audioRef.current.removeEventListener('error', () => {});
      audioRef.current.pause();
      audioRef.current = null;
    }
  }, []);

  // Créer un nouvel audio avec les event listeners
  const createAudio = useCallback((url: string) => {
    cleanupAudio();
    
    const audio = new Audio(url);
    audioRef.current = audio;

    // Event listener pour la fin de l'audio
    audio.addEventListener('ended', () => {
      if (autoModeRef.current && audioState.currentVerse !== null) {
        const currentIndex = versesRef.current.findIndex(v => v.numberInSurah === audioState.currentVerse);
        const nextIndex = currentIndex + 1;
        
        if (nextIndex < versesRef.current.length) {
          // Jouer le verset suivant après 1 seconde
          setTimeout(() => {
            const nextVerse = versesRef.current[nextIndex];
            const nextAudio = createAudio(nextVerse.audio);
            setAudioState(prev => ({
              ...prev,
              currentVerse: nextVerse.numberInSurah,
              currentMode: 'auto',
              isPlaying: true,
              isPaused: false,
              progress: 0,
            }));
            nextAudio.play();
          }, 1000);
        } else {
          // Fin de la sourate
          setAudioState(prev => ({
            ...prev,
            isPlaying: false,
            currentMode: null,
            progress: 100,
          }));
          autoModeRef.current = false;
          onSessionComplete?.();
        }
      } else {
        // Fin d'un verset unique
        setAudioState(prev => ({
          ...prev,
          isPlaying: false,
          currentVerse: null,
          currentMode: null,
          progress: 0,
        }));
      }
      
      onVerseComplete?.(audioState.currentVerse || 0);
    });

    // Event listener pour les mises à jour de temps
    audio.addEventListener('timeupdate', () => {
      const currentTime = audio.currentTime;
      const duration = audio.duration || 0;
      const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
      
      setAudioState(prev => ({
        ...prev,
        currentTime,
        duration,
        progress: Math.min(progress, 100),
      }));
      
      onTimeUpdate?.(currentTime, duration);
    });

    // Event listener pour les métadonnées chargées
    audio.addEventListener('loadedmetadata', () => {
      setAudioState(prev => ({
        ...prev,
        duration: audio.duration || 0,
      }));
    });

    // Event listener pour les erreurs
    audio.addEventListener('error', (e) => {
      console.error('Erreur audio:', e);
      onError?.('Erreur lors du chargement de l\'audio');
      setAudioState(prev => ({
        ...prev,
        isPlaying: false,
        currentMode: null,
      }));
    });

    return audio;
  }, [audioState.currentVerse, onVerseComplete, onSessionComplete, onError, onTimeUpdate, cleanupAudio]);

  // Jouer un verset spécifique
  const playVerse = useCallback(async (verseNumber: number, audioUrl: string, verses?: any[], surahNumber?: number) => {
    try {
      // Mettre à jour les versets pour la navigation si fournis
      if (verses && verses.length > 0) {
        versesRef.current = verses;
      }
      
      // Mettre à jour le numéro de sourate si fourni
      if (surahNumber !== undefined) {
        surahNumberRef.current = surahNumber;
      }
      
      // Si c'est le même verset qui joue, basculer pause/play
      if (audioState.currentVerse === verseNumber && audioRef.current) {
        if (audioState.isPaused) {
          await audioRef.current.play();
          setAudioState(prev => ({ ...prev, isPlaying: true, isPaused: false }));
        } else {
          audioRef.current.pause();
          setAudioState(prev => ({ ...prev, isPlaying: false, isPaused: true }));
        }
        return;
      }

      const audio = createAudio(audioUrl);
      
      setAudioState(prev => ({
        ...prev,
        currentVerse: verseNumber,
        currentMode: 'verse',
        isPlaying: true,
        isPaused: false,
        progress: 0,
      }));

      await audio.play();
    } catch (error) {
      console.error('Erreur lecture audio:', error);
      onError?.('Impossible de lire l\'audio');
    }
  }, [audioState.currentVerse, audioState.isPaused, createAudio, onError]);

  // Mode automatique : lecture séquentielle
  const playAutoMode = useCallback((startVerse: number, verses: any[], surahNumber: number) => {
    versesRef.current = verses;
    surahNumberRef.current = surahNumber;
    autoModeRef.current = true;

    const firstVerse = verses.find(v => v.numberInSurah === startVerse);
    if (firstVerse) {
      const audio = createAudio(firstVerse.audio);
      
      setAudioState(prev => ({
        ...prev,
        currentVerse: firstVerse.numberInSurah,
        currentMode: 'auto',
        isPlaying: true,
        isPaused: false,
        progress: 0,
      }));
      
      audio.play();
    }
  }, [createAudio]);

  // Lecture complète de la sourate
  const playComplete = useCallback((surahNumber: number) => {
    const completeUrl = getRecitationUrl(selectedReciter, surahNumber);
    const audio = createAudio(completeUrl);
    
    setAudioState(prev => ({
      ...prev,
      currentMode: 'complete',
      currentVerse: -1, // -1 pour lecture complète
      isPlaying: true,
      isPaused: false,
      progress: 0,
    }));

    audio.play().catch(error => {
      console.error('Erreur lecture complète:', error);
      onError?.('Impossible de lire la sourate complète');
    });
  }, [selectedReciter, createAudio, onError]);

  // Contrôles de base
  const pauseAudio = useCallback(() => {
    if (audioRef.current && audioState.isPlaying) {
      audioRef.current.pause();
      setAudioState(prev => ({ ...prev, isPlaying: false, isPaused: true }));
    }
  }, [audioState.isPlaying]);

  const resumeAudio = useCallback(() => {
    if (audioRef.current && audioState.isPaused) {
      audioRef.current.play();
      setAudioState(prev => ({ ...prev, isPlaying: true, isPaused: false }));
    }
  }, [audioState.isPaused]);

  const stopAudio = useCallback(() => {
    cleanupAudio();
    autoModeRef.current = false;
    setAudioState({
      isPlaying: false,
      isPaused: false,
      currentVerse: null,
      currentMode: null,
      progress: 0,
      duration: 0,
      currentTime: 0,
    });
  }, [cleanupAudio]);

  const seekTo = useCallback((progress: number) => {
    if (audioRef.current && audioState.duration > 0) {
      const newTime = (progress / 100) * audioState.duration;
      audioRef.current.currentTime = newTime;
    }
  }, [audioState.duration]);

  const setVolume = useCallback((volume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = Math.max(0, Math.min(1, volume));
    }
  }, []);

  // Navigation entre versets (pour mode auto)
  const nextVerse = useCallback(() => {
    if (audioState.currentVerse !== null && versesRef.current.length > 0) {
      const currentIndex = versesRef.current.findIndex(v => v.numberInSurah === audioState.currentVerse);
      const nextIndex = currentIndex + 1;
      
      if (nextIndex < versesRef.current.length) {
        const nextVerseData = versesRef.current[nextIndex];
        // Activer le mode auto si on était en mode individuel
        if (audioState.currentMode === 'verse') {
          autoModeRef.current = true;
          setAudioState(prev => ({ ...prev, currentMode: 'auto' }));
        }
        
        // Utiliser l'URL audio du verset ou fallback si pas disponible
        const audioUrl = nextVerseData.audio || `https://everyayah.com/data/Alafasy_128kbps/${String(surahNumberRef.current).padStart(3, '0')}${String(nextVerseData.numberInSurah).padStart(3, '0')}.mp3`;
        playVerse(nextVerseData.numberInSurah, audioUrl);
      }
    }
  }, [audioState.currentVerse, audioState.currentMode, playVerse]);

  const previousVerse = useCallback(() => {
    if (audioState.currentVerse !== null && versesRef.current.length > 0) {
      const currentIndex = versesRef.current.findIndex(v => v.numberInSurah === audioState.currentVerse);
      const previousIndex = currentIndex - 1;
      
      if (previousIndex >= 0) {
        const previousVerseData = versesRef.current[previousIndex];
        // Activer le mode auto si on était en mode individuel
        if (audioState.currentMode === 'verse') {
          autoModeRef.current = true;
          setAudioState(prev => ({ ...prev, currentMode: 'auto' }));
        }
        
        // Utiliser l'URL audio du verset ou fallback si pas disponible
        const audioUrl = previousVerseData.audio || `https://everyayah.com/data/Alafasy_128kbps/${String(surahNumberRef.current).padStart(3, '0')}${String(previousVerseData.numberInSurah).padStart(3, '0')}.mp3`;
        playVerse(previousVerseData.numberInSurah, audioUrl);
      }
    }
  }, [audioState.currentVerse, audioState.currentMode, playVerse]);

  // Cleanup à la destruction du composant
  useEffect(() => {
    return () => {
      cleanupAudio();
    };
  }, [cleanupAudio]);

  return {
    audioState,
    selectedReciter,
    setSelectedReciter,
    playVerse,
    playAutoMode,
    playComplete,
    pauseAudio,
    resumeAudio,
    stopAudio,
    seekTo,
    setVolume,
    nextVerse,
    previousVerse,
  };
}