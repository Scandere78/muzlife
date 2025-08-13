"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useStudySession } from "../../hooks/useStudySession";
import { useVerseProgress } from "../../hooks/useVerseProgress";
import { useUserPreferences } from "../../hooks/useUserPreferences";
import { useAudioManager } from "../../hooks/useAudioManager";
import VerseCard from "./VerseCard";
import StudyControls from "./StudyControls";
import StudySettingsModal from "./StudySettingsModal";
import AutoPlayerControls from "./AutoPlayerControls";
import { motion } from "framer-motion";
import { RECITERS, getVerseAudioUrl } from "./ReciterSelector";

interface StudyMode {
  mode: 'READING' | 'MEMORIZATION';
  showArabic: boolean;
  showPhonetics: boolean;
  showTranslation: boolean;
}

interface SourateStudyPageProps {
  sourate: {
    number: number;
    name: string;
    englishName: string;
    englishNameTranslation: string;
    ayahs: Array<{
      text: string;
      numberInSurah: number;
      transliteration?: string;
      translation: string;
    }>;
  };
  surahNumber: number;
}

export default function SourateStudyPage({ sourate, surahNumber }: SourateStudyPageProps) {
  const { user } = useAuth();
  const [studyMode, setStudyMode] = useState<StudyMode>({
    mode: 'READING',
    showArabic: true,
    showPhonetics: true,
    showTranslation: true,
  });
  const [showSettings, setShowSettings] = useState(false);
  const [isPlayerMinimized, setIsPlayerMinimized] = useState(false);
  
  // Hooks pour la gestion de l'étude
  const studySession = useStudySession();
  const verseProgress = useVerseProgress(surahNumber);
  const userPreferences = useUserPreferences();
  
  // Hook pour la gestion audio unifiée
  const audioManager = useAudioManager({
    onVerseComplete: (verseNumber: number) => {
      handleVerseRead(verseNumber, 0); // Marquer comme lu quand l'audio se termine
    },
    onSessionComplete: () => {
      console.log('Session audio terminée');
    },
    onError: (error: string) => {
      console.error('Erreur audio:', error);
    },
  });
  
  // Initialiser le mode d'étude avec les préférences utilisateur
  useEffect(() => {
    if (userPreferences.preferences) {
      setStudyMode({
        mode: userPreferences.preferences.defaultStudyMode,
        showArabic: true,
        showPhonetics: userPreferences.preferences.showPhonetics,
        showTranslation: userPreferences.preferences.showTranslation,
      });
    }
  }, [userPreferences.preferences]);
  
  // Préférences par défaut si null
  const currentPreferences = userPreferences.preferences || {
    id: 'default',
    userId: user?.email || 'anonymous',
    arabicFontSize: 20,
    phoneticFontSize: 16,
    translationFontSize: 14,
    preferredLanguage: 'fr',
    preferredReciter: 'afs',
    defaultPlaybackSpeed: 1.0,
    autoPlayNext: false,
    repeatCount: 1,
    defaultStudyMode: 'READING' as const,
    showPhonetics: true,
    showTranslation: true,
    enableNotifications: true,
    dailyReadingGoal: 10,
    dailyMemorizationGoal: 3,
    weeklyStudyTimeGoal: 300,
    studyDaysOfWeek: [1, 2, 3, 4, 5],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  const handleStartSession = (mode: string) => {
    if (sourate?.ayahs) {
      studySession.startSession(surahNumber, mode, sourate.ayahs.length);
    }
  };
  
  const handleEndSession = () => {
    studySession.endSession();
  };
  
  const handleVerseRead = (verseNumber: number, timeSpent: number) => {
    verseProgress.markVerseRead(verseNumber, timeSpent);
    studySession.addVerseStudied(verseNumber);
  };
  
  const handleVerseMemorized = (verseNumber: number, timeSpent: number) => {
    verseProgress.markVerseMemorized(verseNumber, timeSpent);
    studySession.addVerseCompleted(verseNumber);
  };
  
  const handleVerseFavoriteToggle = async (verseNumber: number) => {
    // Si l'utilisateur n'est pas connecté, ouvrir le modal d'authentification
    if (!user) {
      // Stocker les données du verset à ajouter en favoris après connexion
      sessionStorage.setItem('pendingFavorite', JSON.stringify({
        surahNumber,
        verseNumber,
        action: 'toggle'
      }));
      
      // Ici, nous devons trouver un moyen d'ouvrir le modal d'auth
      // Pour l'instant, on va utiliser un event custom ou passer par le parent
      const event = new CustomEvent('openAuthModal', { 
        detail: { 
          reason: 'favorite',
          surahNumber,
          verseNumber 
        } 
      });
      window.dispatchEvent(event);
      return;
    }
    
    // Si connecté, utiliser la fonction existante
    await verseProgress.toggleVerseFavorite(verseNumber);
  };
  
  const handlePronunciationTime = (verseNumber: number, timeSpent: number) => {
    verseProgress.updatePronunciationTime(verseNumber, timeSpent);
  };
  
  // Handlers pour la gestion audio
  const handleStartAudioMode = (mode: 'auto' | 'complete') => {
    if (!sourate?.ayahs) return;
    
    if (mode === 'auto') {
      // Commencer la lecture automatique depuis le premier verset
      const versesWithAudio = sourate.ayahs.map(ayah => ({
        ...ayah,
        audio: `https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/${ayah.numberInSurah}.mp3`
      }));
      audioManager.playAutoMode(1, versesWithAudio, surahNumber);
    } else {
      // Lecture complète de la sourate
      audioManager.playComplete(surahNumber);
    }
  };
  
  const handleStopAudio = () => {
    audioManager.stopAudio();
  };
  
  const handleToggleMinimizePlayer = () => {
    setIsPlayerMinimized(!isPlayerMinimized);
  };
  
  const handleShowPlayer = () => {
    setIsPlayerMinimized(false);
  };
  
  const handlePlayPauseAudio = () => {
    if (audioManager.audioState.isPlaying) {
      audioManager.pauseAudio();
    } else if (audioManager.audioState.isPaused) {
      audioManager.resumeAudio();
    }
  };
  
  // Nom du récitateur sélectionné
  const getReciterName = (reciterId: string) => {
    const reciter = RECITERS.find(r => r.id === reciterId);
    return reciter?.name || 'Sheikh Alafasy';
  };
  
  if (!sourate) {
    return (
      <main className="max-w-4xl mx-auto py-10 px-4">
        <div className="mb-6">
          <Link
            href="/lecture"
            className="inline-flex items-center px-4 py-2 rounded-full bg-[var(--color-accent)] hover:scale-105 text-white font-medium transition-colors shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Retour à la liste
          </Link>
        </div>
        <div className="text-red-500 text-lg font-semibold">Impossible de charger la sourate. Veuillez réessayer plus tard.</div>
      </main>
    );
  }
  
  if (userPreferences.loading) {
    return (
      <main className="max-w-4xl mx-auto py-10 px-4">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-accent)]"></div>
        </div>
      </main>
    );
  }
  
  return (
    <main className="max-w-6xl mx-auto py-10 px-4">
      {/* En-tête avec navigation */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <Link
          href="/lecture"
          className="inline-flex items-center px-4 py-2 rounded-full bg-[var(--color-background)] hover:scale-105 text-white font-medium transition-colors shadow-sm mb-4"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Retour à la liste
        </Link>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[var(--color-accent)] mb-2">{sourate.name}</h1>
            <div className="text-gray-400 text-lg">
              Sourate n°{sourate.number} • {sourate.englishName} • {sourate.englishNameTranslation}
            </div>
          </div>
        </div>
      </motion.div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Panneau de contrôles (sticky) */}
        <div className="lg:col-span-1">
          <StudyControls
            currentSession={studySession.currentSession}
            isSessionActive={studySession.isSessionActive}
            sessionDuration={studySession.sessionDuration}
            focusTime={studySession.focusTime}
            studyMode={studyMode}
            surahStats={verseProgress.surahStats}
            preferences={currentPreferences}
            selectedReciter={audioManager.selectedReciter}
            audioMode={audioManager.audioState.currentMode}
            isAudioPlaying={audioManager.audioState.isPlaying}
            onStudyModeChange={setStudyMode}
            onStartSession={handleStartSession}
            onEndSession={handleEndSession}
            onPauseSession={studySession.pauseSession}
            onResumeSession={studySession.resumeSession}
            onSettingsOpen={() => setShowSettings(true)}
            isPlayerMinimized={isPlayerMinimized}
            onReciterChange={audioManager.setSelectedReciter}
            onStartAudioMode={handleStartAudioMode}
            onStopAudio={handleStopAudio}
            onShowPlayer={handleShowPlayer}
          />
        </div>
        
        {/* Contenu principal - Liste des versets */}
        <div className="lg:col-span-3">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            {sourate.ayahs.map((ayah: any, index: number) => {
              const isCurrentlyPlaying = audioManager.audioState.currentVerse === ayah.numberInSurah && audioManager.audioState.isPlaying;
              const isCurrentlyPaused = audioManager.audioState.currentVerse === ayah.numberInSurah && audioManager.audioState.isPaused;
              
              return (
                <VerseCard
                  key={ayah.numberInSurah}
                  verse={ayah}
                  surahNumber={surahNumber}
                  verseState={verseProgress.getVerseState(ayah.numberInSurah)}
                  studyMode={studyMode}
                  preferences={currentPreferences}
                  isCurrentlyPlaying={isCurrentlyPlaying}
                  isCurrentlyPaused={isCurrentlyPaused}
                  onVerseRead={handleVerseRead}
                  onVerseMemorized={handleVerseMemorized}
                  onVerseUnread={(verseNumber) => {
                    verseProgress.resetVerseRead(verseNumber);
                  }}
                  onVerseUnmemorized={(verseNumber) => {
                    verseProgress.resetVerseMemorization(verseNumber);
                  }}
                  onVerseFavoriteToggle={handleVerseFavoriteToggle}
                  onPronunciationTime={handlePronunciationTime}
                  onPlayVerse={(verseNumber: number, audioUrl: string) => {
                    // Préparer tous les versets avec leurs URLs audio correctes pour la navigation
                    const versesWithAudio = sourate.ayahs.map(ayah => ({
                      ...ayah,
                      audio: getVerseAudioUrl(currentPreferences.preferredReciter, surahNumber, ayah.numberInSurah)
                    }));
                    audioManager.playVerse(verseNumber, audioUrl, versesWithAudio, surahNumber);
                  }}
                />
              );
            })}
          </motion.div>
        </div>
      </div>
      
      {/* Contrôles audio flottants */}
      <AutoPlayerControls
        isVisible={audioManager.audioState.currentMode !== null && (audioManager.audioState.isPlaying || audioManager.audioState.isPaused)}
        isPlaying={audioManager.audioState.isPlaying}
        isMinimized={isPlayerMinimized}
        currentVerse={audioManager.audioState.currentVerse || 1}
        totalVerses={sourate?.ayahs?.length || 0}
        progress={audioManager.audioState.progress}
        surahName={`${sourate?.englishName} (${sourate?.name})`}
        reciterName={getReciterName(audioManager.selectedReciter)}
        onPlayPause={handlePlayPauseAudio}
        onStop={handleStopAudio}
        onToggleMinimize={handleToggleMinimizePlayer}
        onNext={audioManager.nextVerse}
        onPrevious={audioManager.previousVerse}
        onProgressChange={audioManager.seekTo}
      />
      
      {/* Modal des paramètres */}
      <StudySettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        preferences={currentPreferences}
        onUpdatePreferences={userPreferences.updatePreferences}
        onResetPreferences={userPreferences.resetPreferences}
      />
    </main>
  );
}