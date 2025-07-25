"use client";

import React, { useState } from "react";
import Quiz from "../../components/Quiz";
import "../../styles/globals.css";

export default function QuizPage() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<'facile' | 'moyen' | 'difficile'>('moyen');

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 min-h-screen" style={{ background: 'var(--color-background)', color: 'var(--color-foreground)' }}>
      <h1 className="text-3xl font-bold text-[var(--color-accent)] text-center mb-6">Quiz Islamique</h1>
      
      {/* Sélection de difficulté */}
      <div className="flex justify-center gap-4 mb-8">
        <button
          className={`px-6 py-3 rounded-full font-medium border transition-all ${
            selectedDifficulty === 'facile'
              ? "bg-[var(--color-accent)] text-white border-[var(--color-accent-dark)] shadow"
              : "bg-[var(--color-muted)] text-[var(--color-foreground)] border-[var(--color-border)] hover:bg-[var(--color-accent)]/10"
          }`}
          onClick={() => setSelectedDifficulty('facile')}
        >
          Facile
        </button>
        <button
          className={`px-6 py-3 rounded-full font-medium border transition-all ${
            selectedDifficulty === 'moyen'
              ? "bg-[var(--color-accent)] text-white border-[var(--color-accent-dark)] shadow"
              : "bg-[var(--color-muted)] text-[var(--color-foreground)] border-[var(--color-border)] hover:bg-[var(--color-accent)]/10"
          }`}
          onClick={() => setSelectedDifficulty('moyen')}
        >
          Moyen
        </button>
        <button
          className={`px-6 py-3 rounded-full font-medium border transition-all ${
            selectedDifficulty === 'difficile'
              ? "bg-[var(--color-accent)] text-white border-[var(--color-accent-dark)] shadow"
              : "bg-[var(--color-muted)] text-[var(--color-foreground)] border-[var(--color-border)] hover:bg-[var(--color-accent)]/10"
          }`}
          onClick={() => setSelectedDifficulty('difficile')}
        >
          Difficile
        </button>
      </div>

      {/* Informations sur la difficulté */}
      <div className="text-center mb-8">
        <div className="bg-[var(--color-muted)] rounded-lg p-4 border border-[var(--color-border)]">
          <h3 className="font-semibold text-[var(--color-accent)] mb-2">
            Niveau {selectedDifficulty.charAt(0).toUpperCase() + selectedDifficulty.slice(1)}
          </h3>
          <div className="text-sm text-[var(--color-foreground)] space-y-1">
            {selectedDifficulty === 'facile' && (
              <>
                <p>• 45 secondes par question</p>
                <p>• Questions de base sur l'Islam</p>
                <p>• Idéal pour débuter</p>
              </>
            )}
            {selectedDifficulty === 'moyen' && (
              <>
                <p>• 30 secondes par question</p>
                <p>• Questions intermédiaires</p>
                <p>• Pour les pratiquants réguliers</p>
              </>
            )}
            {selectedDifficulty === 'difficile' && (
              <>
                <p>• 15 secondes par question</p>
                <p>• Questions avancées</p>
                <p>• Pour les experts</p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Composant Quiz */}
      <Quiz difficulty={selectedDifficulty} />
    </div>
  );
}
