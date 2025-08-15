"use client";

import React, { useState } from "react";
import Quiz from "../../components/Quiz";
import "../../styles/globals.css";

export default function QuizPage() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<'facile' | 'moyen' | 'difficile'>('moyen');

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start bg-transparent" style={{ color: 'var(--color-foreground)' }}>
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header principal avec animation - parfaitement centré */}
        <div className="flex flex-col items-center text-center mb-12 sm:mb-16">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-accent)]/30 to-[var(--color-foreground)]/30 rounded-3xl blur-2xl animate-pulse scale-110"></div>
            <h1 className="relative text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black bg-gradient-to-r from-[var(--color-foreground)] via-[var(--color-accent)] to-[var(--color-foreground)] bg-clip-text text-transparent mb-4 px-8 py-6 drop-shadow-lg">
              Quiz Sur l&apos;Islam
            </h1>
          </div>
          <p className="text-base sm:text-lg lg:text-xl text-[var(--color-foreground)]/80 font-medium max-w-2xl">
            Testez vos connaissances religieuses avec style
          </p>
        </div>
        
        {/* Sélection de difficulté - Design ultra-responsive et centré */}
        <div className="w-full flex flex-col items-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--color-foreground)] text-center mb-8 sm:mb-10">
            Choisissez votre niveau
          </h2>
          
          {/* Boutons ultra-visibles avec design amélioré */}
          <div className="w-full max-w-5xl flex flex-col lg:flex-row justify-center items-center gap-6 lg:gap-8">
            <button
              className={`group relative w-full lg:w-80 px-8 py-6 sm:py-8 rounded-3xl font-black text-lg sm:text-xl lg:text-2xl transition-all duration-500 transform hover:scale-110 active:scale-95 shadow-2xl hover:shadow-3xl overflow-hidden border-4 ${
                selectedDifficulty === 'facile'
                  ? "bg-gradient-to-br from-green-400 via-green-500 to-emerald-600 text-black dark:text-white shadow-green-300 scale-110 border-green-300 ring-4 ring-green-200"
                  : "bg-gradient-to-br from-white via-gray-50 to-green-50 text-black dark:text-white hover:from-green-100 hover:to-emerald-100 border-green-300 hover:border-green-400 shadow-green-100 hover:shadow-green-200"
              }`}
              onClick={() => setSelectedDifficulty('facile')}
            >
              {/* Effet de brillance renforcé */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              
              {/* Effet de lueur */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-200/30 to-emerald-300/30 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 scale-125"></div>
              
              <div className="relative flex flex-col items-center justify-center gap-3">
                <span className="text-4xl sm:text-5xl drop-shadow-lg">😊</span>
                <div className="text-center">
                  <div className="font-black text-green-800 dark:text-green-200 text-xl sm:text-2xl mb-1">FACILE</div>
                  <div className="text-sm sm:text-base text-green-800 dark:text-green-300 opacity-90 font-semibold">45 secondes par question</div>
                  <div className="text-xs sm:text-sm text-green-800 dark:text-green-400 opacity-75 mt-1">Parfait pour débuter</div>
                </div>
              </div>
            </button>
            
            <button
              className={`group relative w-full lg:w-80 px-8 py-6 sm:py-8 rounded-3xl font-black text-lg sm:text-xl lg:text-2xl transition-all duration-500 transform hover:scale-110 active:scale-95 shadow-2xl hover:shadow-3xl overflow-hidden border-4 ${
                selectedDifficulty === 'moyen'
                  ? "bg-gradient-to-br from-[var(--color-accent)] via-[var(--color-accent-dark)] to-[var(--color-foreground)] text-white shadow-[var(--color-accent)]/50 scale-110 border-[var(--color-accent)] ring-4 ring-[var(--color-accent)]/30"
                  : "bg-gradient-to-br from-white via-gray-50 to-[var(--color-accent)]/10 text-black dark:text-white hover:from-[var(--color-accent)]/20 hover:to-[var(--color-accent)]/30 border-[var(--color-accent)]/50 hover:border-[var(--color-accent)] shadow-[var(--color-accent)]/20 hover:shadow-[var(--color-accent)]/40"
              }`}
              onClick={() => setSelectedDifficulty('moyen')}
            >
              {/* Effet de brillance renforcé */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              
              {/* Effet de lueur */}
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-accent)]/30 to-[var(--color-foreground)]/30 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 scale-125"></div>
              
              <div className="relative flex flex-col items-center justify-center gap-3">
                <span className="text-4xl sm:text-5xl drop-shadow-lg">🎯</span>
                <div className="text-center">
                  <div className="font-black text-xl text-gray-600 dark:text-gray-200 sm:text-2xl mb-1">MOYEN</div>
                  <div className="text-sm sm:text-base text-gray-600 dark:text-gray-300 opacity-90 font-semibold">30 secondes par question</div>
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 opacity-75 mt-1">Pour les connaisseurs</div>
                </div>
              </div>
            </button>
            
            <button
              className={`group relative w-full lg:w-80 px-8 py-6 sm:py-8 rounded-3xl font-black text-lg sm:text-xl lg:text-2xl transition-all duration-500 transform hover:scale-110 active:scale-95 shadow-2xl hover:shadow-3xl overflow-hidden border-4 ${
                selectedDifficulty === 'difficile'
                  ? "bg-gradient-to-br from-red-400 via-red-500 to-red-600 text-white shadow-red-300 scale-110 border-red-300 ring-4 ring-red-200"
                  : "bg-gradient-to-br from-white via-gray-50 to-red-50 text-black dark:text-white hover:from-red-100 hover:to-pink-100 border-red-300 hover:border-red-400 shadow-red-100 hover:shadow-red-200"
              }`}
              onClick={() => setSelectedDifficulty('difficile')}
            >
              {/* Effet de brillance renforcé */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              
              {/* Effet de lueur */}
              <div className="absolute inset-0 bg-gradient-to-br from-red-200/30 to-pink-300/30 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 scale-125"></div>
              
              <div className="relative flex flex-col items-center justify-center gap-3">
                <span className="text-4xl sm:text-5xl drop-shadow-lg">🔥</span>
                <div className="text-center">
                  <div className="font-black text-xl text-gray-700 dark:text-gray-200 sm:text-2xl mb-1">DIFFICILE</div>
                  <div className="text-sm sm:text-base text-gray-700 dark:text-gray-300 opacity-90 font-semibold">15 secondes par question</div>
                  <div className="text-xs sm:text-sm text-gray-800 dark:text-white opacity-75 mt-1">Réservé aux experts</div>
                </div>
              </div>
            </button>
          </div>
        </div>
        {/* Informations sur la difficulté - Design ultra-modernisé et parfaitement centré */}
        <div className="w-full flex justify-center mb-12 sm:mb-16">
          <div className="max-w-2xl w-full relative group">
            {/* Effet de lueur amélioré */}
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-accent)]/30 to-[var(--color-foreground)]/30 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500 scale-105"></div>
            
            <div className="relative bg-gradient-to-br from-white via-gray-50 to-[var(--color-background)] rounded-3xl p-8 sm:p-12 border-4 border-[var(--color-accent)]/40 shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden backdrop-blur-sm">
              {/* Motifs décoratifs améliorés */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[var(--color-accent)]/20 to-transparent rounded-bl-3xl"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-[var(--color-foreground)]/20 to-transparent rounded-tr-3xl"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-radial from-[var(--color-accent)]/5 to-transparent rounded-full"></div>
              
              <div className="relative z-10">
                {/* Icône et titre ultra-stylisés */}
                <div className="flex flex-col items-center gap-6 mb-8">
                  <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center text-white font-black text-3xl sm:text-4xl shadow-2xl transform transition-all duration-500 hover:scale-125 hover:rotate-12 border-4 border-white/30 ${
                    selectedDifficulty === 'facile' ? 'bg-gradient-to-br from-green-400 via-green-500 to-emerald-600 shadow-green-300' :
                    selectedDifficulty === 'moyen' ? 'bg-gradient-to-br from-[var(--color-accent)] via-[var(--color-accent-dark)] to-[var(--color-foreground)] shadow-[var(--color-accent)]/50' :
                    'bg-gradient-to-br from-red-400 via-red-500 to-red-600 shadow-red-300'
                  }`}>
                    {selectedDifficulty === 'facile' ? '😊' :
                     selectedDifficulty === 'moyen' ? '🎯' : '🔥'}
                  </div>
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[var(--color-foreground)] dark:text-white text-center">
                    Niveau {selectedDifficulty.charAt(0).toUpperCase() + selectedDifficulty.slice(1)}
                  </h3>
                </div>
                
                {/* Informations détaillées ultra-visibles */}
                <div className="grid gap-4 sm:gap-6 text-base sm:text-lg text-[var(--color-foreground)] dark:text-gray-200">
                  {selectedDifficulty === 'facile' && (
                    <>
                      <div className="flex items-center justify-center gap-4 p-4 sm:p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border-2 border-green-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                        <span className="text-green-600 text-2xl sm:text-3xl">⏱️</span>
                        <span className="font-bold text-green-800 dark:text-white">45 secondes par question</span>
                      </div>
                      <div className="flex items-center justify-center gap-4 p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border-2 border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                        <span className="text-blue-600 text-2xl sm:text-3xl">📚</span>
                        <span className="font-bold text-blue-800 dark:text-white">Questions de base sur l&apos;Islam</span>
                      </div>
                      <div className="flex items-center justify-center gap-4 p-4 sm:p-6 bg-gradient-to-r from-purple-50 to-violet-50 rounded-2xl border-2 border-purple-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                        <span className="text-purple-600 text-2xl sm:text-3xl">🌟</span>
                        <span className="font-bold text-purple-800 dark:text-white">Idéal pour débuter</span>
                      </div>
                    </>
                  )}
                  {selectedDifficulty === 'moyen' && (
                    <>
                      <div className="flex items-center justify-center gap-4 p-4 sm:p-6 bg-gradient-to-r from-[var(--color-accent)]/10 to-[var(--color-accent)]/20 rounded-2xl border-2 border-[var(--color-accent)]/40 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                        <span className="text-[var(--color-accent)] text-2xl sm:text-3xl">⏱️</span>
                        <span className="font-bold" style={{ color: 'var(--color-accent)' }}>30 secondes par question</span>
                      </div>
                      <div className="flex items-center justify-center gap-4 p-4 sm:p-6 bg-gradient-to-r from-[var(--color-foreground)]/10 to-[var(--color-foreground)]/20 rounded-2xl border-2 border-[var(--color-foreground)]/40 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                        <span style={{ color: 'var(--color-foreground)' }} className="text-2xl sm:text-3xl">📖</span>
                        <span className="font-bold dark:text-white" style={{ color: 'var(--color-foreground)' }}>Questions intermédiaires</span>
                      </div>
                      <div className="flex items-center justify-center gap-4 p-4 sm:p-6 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl border-2 border-indigo-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                        <span className="text-indigo-600 text-2xl sm:text-3xl">👥</span>
                        <span className="font-bold text-indigo-800 dark:text-indigo-200">Pour les pratiquants réguliers</span>
                      </div>
                    </>
                  )}
                  {selectedDifficulty === 'difficile' && (
                    <>
                      <div className="flex items-center justify-center gap-4 p-4 sm:p-6 bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl border-2 border-red-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                        <span className="text-red-600 text-2xl sm:text-3xl">⚡</span>
                        <span className="font-bold text-red-800">15 secondes par question</span>
                      </div>
                      <div className="flex items-center justify-center gap-4 p-4 sm:p-6 bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl border-2 border-orange-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                        <span className="text-orange-600 text-2xl sm:text-3xl">🎓</span>
                        <span className="font-bold text-orange-800">Questions avancées</span>
                      </div>
                      <div className="flex items-center justify-center gap-4 p-4 sm:p-6 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl border-2 border-amber-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                        <span className="text-amber-600 text-2xl sm:text-3xl">👑</span>
                        <span className="font-bold text-amber-800">Réservé aux experts</span>
                      </div>
                    </>
                  )}
                </div>
                
                {/* Barre de difficulté ultra-stylisée */}
                <div className="mt-8 sm:mt-10">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm sm:text-base font-bold text-[var(--color-foreground)]/80">Niveau de difficulté</span>
                    <span className="text-lg sm:text-xl font-black text-[var(--color-accent)]">
                      {selectedDifficulty === 'facile' ? '⭐⭐' :
                       selectedDifficulty === 'moyen' ? '⭐⭐⭐' : '⭐⭐⭐⭐⭐'}
                    </span>
                  </div>
                  <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden shadow-inner border-2 border-gray-300">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 shadow-lg relative overflow-hidden ${
                        selectedDifficulty === 'facile' ? 'w-2/5 bg-gradient-to-r from-green-400 via-green-500 to-emerald-500' :
                        selectedDifficulty === 'moyen' ? 'w-3/5 bg-gradient-to-r from-[var(--color-accent)] via-[var(--color-accent-dark)] to-[var(--color-foreground)]' :
                        'w-full bg-gradient-to-r from-red-400 via-red-500 to-red-600'
                      }`}
                    >
                      {/* Effet de brillance animée sur la barre */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Composant Quiz - parfaitement centré */}
        <div className="w-full flex justify-center">
          <div className="w-full max-w-5xl">
            <Quiz difficulty={selectedDifficulty} />
          </div>
        </div>
      </div>
    </div>
  );
}
