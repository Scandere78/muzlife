"use client";

import React, { useState, useEffect, useRef } from "react";
import Quiz from "../../components/Quiz";
import "../../styles/globals.css";

export default function QuizPage() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<'facile' | 'moyen' | 'difficile'>('moyen');
  const [showQuiz, setShowQuiz] = useState(false);
  const difficultyRef = useRef<HTMLDivElement>(null);

  // Scroll au centre des boutons de difficulté au chargement de la page
  useEffect(() => {
    // Petit délai pour s'assurer que le DOM est prêt
    setTimeout(() => {
      if (difficultyRef.current) {
        // Calculer la position pour centrer l'élément dans la fenêtre
        const elementRect = difficultyRef.current.getBoundingClientRect();
        const absoluteElementTop = elementRect.top + window.pageYOffset;
        const middle = absoluteElementTop - (window.innerHeight / 2) + (elementRect.height / 2);
        
        // Scroller jusqu'à cette position
        window.scrollTo({
          top: middle,
          behavior: 'smooth' // ou 'instant' pour un scroll immédiat
        });
      }
    }, 100); // 100ms de délai pour laisser le temps au DOM de se charger
  }, []); // Se déclenche uniquement au montage du composant

  const startQuiz = () => {
    setShowQuiz(true);
  };

  if (showQuiz) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-start bg-transparent" style={{ color: 'var(--color-foreground)' }}>
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Quiz difficulty={selectedDifficulty} onBackToMenu={() => setShowQuiz(false)} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-transparent" style={{ color: 'var(--color-foreground)' }}>
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header avec animations légères */}
        <div className="text-center mb-12">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-accent)]/20 to-[var(--color-foreground)]/20 rounded-3xl blur-2xl animate-pulse"></div>
            <h1 className="relative text-5xl sm:text-6xl font-black bg-gradient-to-r from-[var(--color-foreground)] via-[var(--color-accent)] to-[var(--color-foreground)] bg-clip-text text-transparent mb-4 px-6 py-4 drop-shadow-lg">
              Quiz Islamique
            </h1>
          </div>
          <p className="text-xl text-[var(--color-foreground)]/80 font-medium">
            Testez vos connaissances religieuses
          </p>
        </div>

        {/* Sélection de difficulté */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-[var(--color-foreground)] mb-4">
              Choisissez votre niveau de difficulté
            </h2>
            <p className="text-lg text-[var(--color-foreground)]/70">
              Sélectionnez le niveau qui vous convient le mieux
            </p>
          </div>

          {/* Options de difficulté */}
          <div ref={difficultyRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <button
              className={`group p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
                selectedDifficulty === 'facile'
                  ? '!bg-green-500 !border-green-600 !text-white shadow-xl scale-105'
                  : '!bg-white/50 dark:!bg-gray-800/80 border-green-300 !text-black dark:!text-white hover:!bg-green-100 dark:hover:!bg-green-900/30 hover:!border-green-400 active:scale-95'
              }`}
              onClick={() => setSelectedDifficulty('facile')}
            >
              <div className="text-center">
                <div className="text-4xl mb-3">⭐</div>
                <div className="font-bold text-xl mb-2">FACILE</div>
                <div className={`text-sm ${selectedDifficulty === 'facile' ? '!text-white/90' : '!text-black dark:!text-white opacity-60'}`}>
                  45 secondes par question
                </div>
                <div className={`text-xs mt-1 ${selectedDifficulty === 'facile' ? '!text-white/80' : '!text-black dark:!text-white opacity-50'}`}>
                  Questions de base
                </div>
              </div>
            </button>

            <button
              className={`group p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
                selectedDifficulty === 'moyen'
                  ? '!bg-yellow-500 !border-yellow-600 !text-white shadow-xl scale-105'
                  : '!bg-white/50 dark:!bg-gray-800/80 border-yellow-300 !text-black dark:!text-white hover:!bg-yellow-100 dark:hover:!bg-yellow-900/30 hover:!border-yellow-400 active:scale-95'
              }`}
              onClick={() => setSelectedDifficulty('moyen')}
            >
              <div className="text-center">
                <div className="text-4xl mb-3">⭐⭐</div>
                <div className="font-bold text-xl mb-2">MOYEN</div>
                <div className={`text-sm ${selectedDifficulty === 'moyen' ? '!text-white/90' : '!text-black dark:!text-white opacity-60'}`}>
                  30 secondes par question
                </div>
                <div className={`text-xs mt-1 ${selectedDifficulty === 'moyen' ? '!text-white/80' : '!text-black dark:!text-white opacity-50'}`}>
                  Questions intermédiaires
                </div>
              </div>
            </button>

            <button
              className={`group p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
                selectedDifficulty === 'difficile'
                  ? '!bg-red-500 !border-red-600 !text-white shadow-xl scale-105'
                  : '!bg-white/50 dark:!bg-gray-800/80 border-red-300 !text-black dark:!text-white hover:!bg-red-100 dark:hover:!bg-red-900/30 hover:!border-red-400 active:scale-95'
              }`}
              onClick={() => setSelectedDifficulty('difficile')}
            >
              <div className="text-center">
                <div className="text-4xl mb-3">⭐⭐⭐</div>
                <div className="font-bold text-xl mb-2">DIFFICILE</div>
                <div className={`text-sm ${selectedDifficulty === 'difficile' ? '!text-white/90' : '!text-black dark:!text-white opacity-60'}`}>
                  15 secondes par question
                </div>
                <div className={`text-xs mt-1 ${selectedDifficulty === 'difficile' ? '!text-white/80' : '!text-black dark:!text-white opacity-50'}`}>
                  Questions avancées
                </div>
              </div>
            </button>
          </div>

          {/* Bouton pour commencer */}
          <div className="text-center">
            <div className="relative group inline-block">
              <div className="absolute inset-0 bg-white rounded-3xl blur-xl animate-pulse scale-110"></div>
              <button
                className="relative group px-12 py-6 !bg-gray-100 dark:!bg-gray-800/90 !text-black dark:!text-white font-bold text-xl rounded-3xl shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-500 overflow-hidden"
                onClick={startQuiz}
              >
                {/* Effet de brillance */}
                <div className="absolute inset-0 bg-white transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                
                <span className="relative flex items-center gap-4">
                  <span className="text-2xl animate-bounce">🚀</span>
                  <span>Commencer le Quiz</span>
                  <span className="text-2xl animate-bounce" style={{ animationDelay: '0.3s' }}>🎯</span>
                </span>
              </button>
            </div>
            
            <p className="mt-4 text-sm text-black dark:!text-white opacity-70">
              Niveau sélectionné: <span className="font-semibold text-black dark:!text-white">
                {selectedDifficulty.charAt(0).toUpperCase() + selectedDifficulty.slice(1)}
              </span>
            </p>
          </div>
        </div>

        {/* Informations rapides */}
        {/*<div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
          <div className="group !bg-white/50 dark:!bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-[var(--color-accent)]/20 hover:border-[var(--color-accent)]/40 transition-all duration-300 hover:scale-105">
            <div className="text-3xl mb-3 text-center group-hover:scale-110 transition-transform duration-300">📚</div>
            <div className="text-center">
              <div className="font-bold text-lg !text-black dark:!text-white">10 Questions</div>
              <div className="text-sm !text-black dark:!text-white opacity-70">Par partie</div>
            </div>
          </div>
          
          <div className="group !bg-white/50 dark:!bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-[var(--color-accent)]/20 hover:border-[var(--color-accent)]/40 transition-all duration-300 hover:scale-105">
            <div className="text-3xl mb-3 text-center group-hover:scale-110 transition-transform duration-300">⏱️</div>
            <div className="text-center">
              <div className="font-bold text-lg !text-black dark:!text-white">3 Niveaux</div>
              <div className="text-sm !text-black dark:!text-white opacity-70">De facile à expert</div>
            </div>
          </div>
          
          <div className="group !bg-white/50 dark:!bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-[var(--color-accent)]/20 hover:border-[var(--color-accent)]/40 transition-all duration-300 hover:scale-105">
            <div className="text-3xl mb-3 text-center group-hover:scale-110 transition-transform duration-300">🏆</div>
            <div className="text-center">
              <div className="font-bold text-lg !text-black dark:!text-white">Score</div>
              <div className="text-sm !text-black dark:!text-white opacity-70">Et streaks</div>
            </div>
          </div>
        </div>*/}
      </div>
    </div>
  );
}