"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Square, SkipForward, SkipBack, Volume2, ChevronUp, ChevronDown, Minimize2, Maximize2 } from 'lucide-react';

interface AutoPlayerControlsProps {
  isVisible: boolean;
  isPlaying: boolean;
  currentVerse: number;
  totalVerses: number;
  progress: number;
  surahName: string;
  reciterName: string;
  isMinimized?: boolean;
  onPlayPause: () => void;
  onStop: () => void;
  onToggleMinimize?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  onProgressChange?: (progress: number) => void;
}

const AutoPlayerControls: React.FC<AutoPlayerControlsProps> = ({
  isVisible,
  isPlaying,
  currentVerse,
  totalVerses,
  progress,
  surahName,
  reciterName,
  isMinimized = false,
  onPlayPause,
  onStop,
  onToggleMinimize,
  onNext,
  onPrevious,
  onProgressChange,
}) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ 
            y: 0, 
            opacity: 1,
            height: isMinimized ? "auto" : "auto"
          }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className={`fixed bottom-0 left-1/2 transform -translate-x-1/2 z-50 w-full ${
            isMinimized ? 'max-w-sm' : 'max-w-md'
          } mx-auto mb-4 px-4`}
        >
          <div className="bg-gray-900/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden">
            {/* Barre de progression (toujours visible) */}
            <div className="relative h-1 bg-gray-700">
              <motion.div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-500 to-green-400"
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
              
              {/* Barre de progression interactive */}
              {onProgressChange && !isMinimized && (
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={progress}
                  onChange={(e) => onProgressChange(Number(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              )}
            </div>

            {/* Mode minimisé */}
            {isMinimized ? (
              <div className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">
                      <Volume2 size={14} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">
                        {surahName}
                      </p>
                      <p className="text-gray-400 text-xs truncate">
                        Verset {currentVerse}/{totalVerses}
                      </p>
                    </div>
                  </div>
                  
                  {/* Contrôles minimisés */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={onPlayPause}
                      className="w-8 h-8 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center transition-colors"
                      title={isPlaying ? "Pause" : "Play"}
                    >
                      {isPlaying ? (
                        <Pause size={14} className="text-white" />
                      ) : (
                        <Play size={14} className="text-white ml-0.5" />
                      )}
                    </button>
                    
                    {onToggleMinimize && (
                      <button
                        onClick={onToggleMinimize}
                        className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                        title="Agrandir"
                      >
                        <ChevronUp size={14} className="text-white" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              /* Mode normal */
              <div className="p-4">
                {/* En-tête avec bouton minimiser */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold shadow-lg">
                      <Volume2 size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-semibold text-sm truncate">
                        {surahName}
                      </h3>
                      <p className="text-gray-400 text-xs truncate">
                        {reciterName} • Verset {currentVerse} / {totalVerses}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {/* Indicateur de statut */}
                    {isPlaying && (
                      <div className="flex space-x-1">
                        <div className="w-1 h-4 bg-green-400 rounded-full animate-pulse" />
                        <div className="w-1 h-4 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }} />
                        <div className="w-1 h-4 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                      </div>
                    )}
                    
                    {/* Bouton minimiser */}
                    {onToggleMinimize && (
                      <button
                        onClick={onToggleMinimize}
                        className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                        title="Minimiser"
                      >
                        <ChevronDown size={16} className="text-white" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Contrôles principaux */}
                <div className="flex items-center justify-center space-x-4">
                  {/* Bouton précédent */}
                  {onPrevious && (
                    <button
                      onClick={onPrevious}
                      disabled={currentVerse <= 1}
                      className="p-2 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      title="Verset précédent"
                    >
                      <SkipBack size={18} className="text-white" />
                    </button>
                  )}

                  {/* Bouton play/pause principal */}
                  <button
                    onClick={onPlayPause}
                    className="w-12 h-12 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center shadow-lg transition-colors group"
                    title={isPlaying ? "Mettre en pause" : "Reprendre"}
                  >
                    {isPlaying ? (
                      <Pause size={20} className="text-white group-hover:scale-110 transition-transform" />
                    ) : (
                      <Play size={20} className="text-white ml-0.5 group-hover:scale-110 transition-transform" />
                    )}
                  </button>

                  {/* Bouton suivant */}
                  {onNext && (
                    <button
                      onClick={onNext}
                      disabled={currentVerse >= totalVerses}
                      className="p-2 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      title="Verset suivant"
                    >
                      <SkipForward size={18} className="text-white" />
                    </button>
                  )}

                  {/* Bouton stop */}
                  <button
                    onClick={onStop}
                    className="p-2 rounded-full bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 transition-colors"
                    title="Arrêter"
                  >
                    <Square size={16} className="text-red-400" />
                  </button>
                </div>

                {/* Progress text */}
                <div className="mt-3 text-center">
                  <span className="text-xs text-gray-400">
                    {Math.round(progress)}% terminé • {totalVerses - currentVerse} versets restants
                  </span>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AutoPlayerControls;