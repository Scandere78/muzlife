"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Settings, 
  BookOpen, 
  Brain, 
  Volume2, 
  Eye,
  Target,
  Clock,
  BarChart3,
  ChevronDown,
  ChevronUp,
  Users,
  Repeat,
  PlayCircle,
  Square,
  Maximize2
} from 'lucide-react';
import ReciterSelector from './ReciterSelector';

interface StudyMode {
  mode: 'READING' | 'MEMORIZATION';
  showArabic: boolean;
  showPhonetics: boolean;
  showTranslation: boolean;
}

interface StudySession {
  id: string;
  surahNumber: number;
  studyMode: string;
  startedAt: Date;
  duration?: number;
  versesStudied: number[];
  versesCompleted: number[];
  totalVerses: number;
  completedVerses: number;
}

interface SurahStats {
  totalVerses: number;
  readVerses: number;
  memorizedVerses: number;
  favoriteVerses: number;
  readingProgress: number;
  memorizationProgress: number;
  totalStudyTime: number;
}

interface StudyControlsProps {
  currentSession: StudySession | null;
  isSessionActive: boolean;
  sessionDuration: number;
  focusTime: number;
  studyMode: StudyMode;
  surahStats: SurahStats | null;
  preferences: {
    defaultPlaybackSpeed: number;
    repeatCount: number;
    autoPlayNext: boolean;
    dailyReadingGoal: number;
    dailyMemorizationGoal: number;
  } | null;
  // Audio props
  selectedReciter: string;
  audioMode: 'auto' | 'complete' | 'verse' | null;
  isAudioPlaying: boolean;
  isPlayerMinimized?: boolean;
  onStudyModeChange: (mode: StudyMode) => void;
  onStartSession: (mode: string) => void;
  onEndSession: () => void;
  onPauseSession: () => void;
  onResumeSession: () => void;
  onSettingsOpen: () => void;
  // Audio handlers
  onReciterChange: (reciterId: string) => void;
  onStartAudioMode: (mode: 'auto' | 'complete') => void;
  onStopAudio: () => void;
  onShowPlayer?: () => void;
  className?: string;
}

const studyModes = [
  {
    key: 'READING',
    label: 'Lecture',
    icon: BookOpen,
    description: 'Lecture complète avec tous les textes visibles',
    color: 'text-blue-400',
    bgColor: 'bg-blue-400/29',
  },
  {
    key: 'MEMORIZATION',
    label: 'Apprentissage',
    icon: Brain,
    description: 'Masquez/affichez les textes pour vous entraîner',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-400/20',
  },
];

export default function StudyControls({
  currentSession,
  isSessionActive,
  sessionDuration,
  focusTime,
  studyMode,
  surahStats,
  preferences,
  selectedReciter,
  audioMode,
  isAudioPlaying,
  isPlayerMinimized = false,
  onStudyModeChange,
  onStartSession,
  onEndSession,
  onPauseSession,
  onResumeSession,
  onSettingsOpen,
  onReciterChange,
  onStartAudioMode,
  onStopAudio,
  onShowPlayer,
  className = '',
}: StudyControlsProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedMode, setSelectedMode] = useState(studyMode.mode);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleModeSelect = (modeKey: string) => {
    setSelectedMode(modeKey as StudyMode['mode']);
    
    const newStudyMode: StudyMode = {
      mode: modeKey as StudyMode['mode'],
      showArabic: true,
      showPhonetics: true,
      showTranslation: true,
    };
    
    onStudyModeChange(newStudyMode);
  };

  const handleSessionToggle = () => {
    if (isSessionActive) {
      if (currentSession) {
        onPauseSession();
      }
    } else {
      if (currentSession) {
        onResumeSession();
      } else {
        onStartSession(selectedMode);
      }
    }
  };

  const getProgressPercentage = () => {
    if (!surahStats || surahStats.totalVerses === 0) return 0;
    return Math.round((surahStats.memorizedVerses / surahStats.totalVerses) * 100);
  };

  const getTodayGoalProgress = () => {
    if (!surahStats || !preferences) return { reading: 0, memorization: 0 };
    
    return {
      reading: Math.min(100, (surahStats.readVerses / preferences.dailyReadingGoal) * 100),
      memorization: Math.min(100, (surahStats.memorizedVerses / preferences.dailyMemorizationGoal) * 100),
    };
  };

  const goalProgress = getTodayGoalProgress();

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`sticky top-20 z-20 bg-black/50 backdrop-blur-xl border border-white/20 rounded-xl overflow-hidden ${className}`}
    >
      {/* En-tête avec bouton de réduction */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-[var(--color-accent)]/20">
            <BarChart3 size={20} className="text-[var(--color-accent)]" />
          </div>
          <div>
            <h3 className="font-semibold !text-white/80">Contrôles d'étude</h3>
            <p className="text-sm text-gray-400">
              {isSessionActive ? 'Session active' : 'Prêt à commencer'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onSettingsOpen}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            title="Paramètres"
          >
            <Settings size={16} />
          </button>
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
          >
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {/* Contenu extensible */}
      <motion.div
        initial={false}
        animate={{ height: isExpanded ? 'auto' : 0 }}
        className="overflow-hidden transition"
      >
        <div className="p-4 space-y-6">
          {/* Sélection du mode d'étude */}
          <div>
            <h4 className="text-sm font-medium !text-white mb-3">Mode d'étude</h4>
            <div className="space-y-2">
              {studyModes.map((mode) => {
                const Icon = mode.icon;
                const isSelected = selectedMode === mode.key;
                
                return (
                  <button
                    key={mode.key}
                    onClick={() => handleModeSelect(mode.key)}
                    className={`w-full p-3 rounded-lg border transition-all text-left ${
                      isSelected
                        ? `${mode.bgColor} border-current ${mode.color}`
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                    title={mode.description}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon size={18} className={isSelected ? mode.color : 'text-gray-400'} />
                      <div>
                        <span className={`text-sm font-medium block ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                          {mode.label}
                        </span>
                        <span className="text-xs text-gray-400 mt-1 block">
                          {mode.description}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Statistiques de session */}
          {currentSession && (
            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-3">Session actuelle</h4>
              <div className="bg-white/5 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Temps d'étude</span>
                  <span className="text-lg font-mono text-[var(--color-accent)]">
                    {formatTime(sessionDuration)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Versets lus</span>
                  <span className="text-white">
                    {surahStats?.readVerses || 0}/{surahStats?.totalVerses || 0}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Progression</span>
                  <span className="text-emerald-400">{getProgressPercentage()}%</span>
                </div>

                {/* Barre de progression */}
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${getProgressPercentage()}%` }}
                    transition={{ duration: 0.5 }}
                    className="bg-gradient-to-r from-[var(--color-accent)] to-emerald-400 h-2 rounded-full"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Objectifs quotidiens */}
          {surahStats && preferences && (
            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-3">Objectifs du jour</h4>
              <div className="space-y-3">
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Lecture</span>
                    <span className="text-blue-400">
                      {surahStats.readVerses}/{preferences.dailyReadingGoal}
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-1.5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${goalProgress.reading}%` }}
                      className="bg-blue-400 h-1.5 rounded-full"
                    />
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Mémorisation</span>
                    <span className="text-emerald-400">
                      {surahStats.memorizedVerses}/{preferences.dailyMemorizationGoal}
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-1.5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${goalProgress.memorization}%` }}
                      className="bg-emerald-400 h-1.5 rounded-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Contrôles de session - visible uniquement en mode MEMORIZATION */}
          {selectedMode === 'MEMORIZATION' && (
            <div className="flex items-center space-x-3">
              <button
                onClick={handleSessionToggle}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-all ${
                  isSessionActive
                    ? 'bg-orange-500 hover:bg-orange-600 text-white'
                    : 'bg-[var(--color-accent)] hover:bg-[var(--color-accent)]/80 text-white'
                }`}
              >
                {isSessionActive ? (
                  <>
                    <Pause size={18} />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play size={18} />
                    <span>{currentSession ? 'Reprendre' : 'Commencer'}</span>
                  </>
                )}
              </button>

              {currentSession && (
                <button
                  onClick={onEndSession}
                  className="py-3 px-4 rounded-lg bg-red-500/20 border border-red-500/50 text-red-300 hover:bg-red-500/30 transition-colors"
                  title="Terminer la session"
                >
                  <RotateCcw size={18} />
                </button>
              )}
            </div>
          )}

          {/* Sélecteur de récitateur */}
          <div>
            <ReciterSelector
              selectedReciter={selectedReciter}
              onChange={onReciterChange}
              compact={true}
            />
          </div>

          {/* Contrôles audio */}
          <div>
            <h4 className="text-sm font-medium !text-gray-300 mb-3 flex items-center space-x-2">
              <Volume2 size={16} />
              <span>Audio</span>
            </h4>
            
            <div className="grid grid-cols-2 gap-2 mb-3">
              {/* Mode automatique */}
              <button
                onClick={() => audioMode === 'auto' ? onStopAudio() : onStartAudioMode('auto')}
                className={`flex items-center justify-center space-x-2 py-2 px-3 rounded-lg font-medium transition-all text-sm ${
                  audioMode === 'auto' && isAudioPlaying
                    ? 'bg-green-500 text-white shadow-lg'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                {audioMode === 'auto' && isAudioPlaying ? <Square size={14} /> : <Repeat size={14} />}
                <span>Auto</span>
              </button>
              
              {/* Lecture complète */}
              <button
                onClick={() => audioMode === 'complete' ? onStopAudio() : onStartAudioMode('complete')}
                className={`flex items-center justify-center space-x-2 py-2 px-3 rounded-lg font-medium transition-all text-sm ${
                  audioMode === 'complete' && isAudioPlaying
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                {audioMode === 'complete' && isAudioPlaying ? <Square size={14} /> : <PlayCircle size={14} />}
                <span>Complète</span>
              </button>
            </div>
            
            {/* Indicateur audio actif */}
            {audioMode && isAudioPlaying && (
              <div className="flex items-center space-x-2 p-2 rounded-lg bg-green-500/20 border border-green-500/30">
                <div className="flex space-x-1">
                  <div className="w-1 h-3 bg-green-400 rounded-full animate-pulse" />
                  <div className="w-1 h-3 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }} />
                  <div className="w-1 h-3 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                </div>
                <span className="text-green-400 text-xs font-medium">
                  {audioMode === 'auto' ? 'Mode automatique actif' : 'Lecture complète en cours'}
                </span>
              </div>
            )}
            
            {/* Bouton d'ouverture du player */}
            {audioMode && isAudioPlaying && isPlayerMinimized && onShowPlayer && (
              <button
                onClick={onShowPlayer}
                className="flex items-center justify-center space-x-2 py-2 px-3 rounded-lg font-medium transition-all text-sm bg-blue-500/20 border border-blue-500/30 text-blue-400 hover:bg-blue-500/30"
                title="Ouvrir le player audio"
              >
                <Maximize2 size={14} />
                <span>Ouvrir Player</span>
              </button>
            )}
          </div>

          {/* Statistiques rapides de la sourate */}
          {surahStats && (
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-white/5 rounded-lg p-3">
                <div className="text-blue-400 text-lg font-semibold">
                  {Math.round(surahStats.readingProgress)}%
                </div>
                <div className="text-xs text-gray-400">Lecture</div>
              </div>
              
              <div className="bg-white/5 rounded-lg p-3">
                <div className="text-emerald-400 text-lg font-semibold">
                  {Math.round(surahStats.memorizationProgress)}%
                </div>
                <div className="text-xs text-gray-400">Mémorisation</div>
              </div>
              
              <div className="bg-white/5 rounded-lg p-3">
                <div className="text-purple-400 text-lg font-semibold">
                  {Math.round(surahStats.totalStudyTime / 60)}min
                </div>
                <div className="text-xs text-gray-400">Temps total</div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}