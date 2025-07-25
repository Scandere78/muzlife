"use client";

import React, { useState, useEffect } from "react";
import { QuizQuestion, getRandomQuestions } from "../lib/quizzquestions";
import { useAuth } from "../contexts/AuthContext";

interface QuizProps {
  difficulty: 'facile' | 'moyen' | 'difficile';
}

const Quiz: React.FC<QuizProps> = ({ difficulty }) => {
  const { user, saveQuizResult } = useAuth();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [quizStarted, setQuizStarted] = useState(false);
  const [usedHint, setUsedHint] = useState(false);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [totalCorrectAnswers, setTotalCorrectAnswers] = useState(0);

  // Initialiser les questions au démarrage
  useEffect(() => {
    const randomQuestions = getRandomQuestions(difficulty, 10);
    setQuestions(randomQuestions);
  }, [difficulty]);

  // Timer selon la difficulté
  useEffect(() => {
    if (!quizStarted || showExplanation || showResults) return;
    
    if (timeLeft === 0) {
      setShowCorrectAnswer(true);
      setShowExplanation(true);
      setIsCorrect(false);
      return;
    }
    
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, quizStarted, showExplanation, showResults]);

  // Définir le temps selon la difficulté
  useEffect(() => {
    if (difficulty === "facile") setTimeLeft(45);
    else if (difficulty === "difficile") setTimeLeft(15);
    else setTimeLeft(30);
  }, [difficulty, quizStarted]);

  // Passer à la question suivante
  useEffect(() => {
    if (showExplanation && quizStarted && !showResults) {
      const timeout = setTimeout(() => {
        if (currentQuestionIndex + 1 < questions.length) {
          setCurrentQuestionIndex((i) => i + 1);
          setSelectedAnswer(null);
          setIsCorrect(null);
          setShowExplanation(false);
          setShowCorrectAnswer(false);
          setUsedHint(false);
          setTimeLeft(difficulty === "facile" ? 45 : difficulty === "difficile" ? 15 : 30);
        } else {
          setShowResults(true);
        }
      }, 2500);
      return () => clearTimeout(timeout);
    }
  }, [showExplanation, currentQuestionIndex, difficulty, quizStarted, showResults, questions.length]);

  const startQuiz = () => {
    setQuizStarted(true);
    setShowResults(false);
    setScore(0);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setShowExplanation(false);
    setShowCorrectAnswer(false);
    setUsedHint(false);
    setTotalCorrectAnswers(0);
    setTimeLeft(difficulty === "facile" ? 45 : difficulty === "difficile" ? 15 : 30);
  };

  const handleAnswer = (option: string) => {
    if (selectedAnswer) return;
    
    setSelectedAnswer(option);
    const correct = questions[currentQuestionIndex].answer === option;
    setIsCorrect(correct);
    setShowExplanation(true);
    setShowCorrectAnswer(true);
    
    if (correct) {
      setScore((s) => s + 1);
      setTotalCorrectAnswers((c) => c + 1);
    }

    // Sauvegarder le résultat si l'utilisateur est connecté
    if (user && saveQuizResult) {
      saveQuizResult({
        correctAnswers: correct ? 1 : 0,
        score: score + (correct ? 1 : 0),
        category: questions[currentQuestionIndex].category,
        difficulty,
        totalQuestions: questions.length,
        percentage: ((score + (correct ? 1 : 0)) / questions.length) * 100,
      });
    }
  };

  const useHint = () => {
    setUsedHint(true);
  };

  const resetQuiz = () => {
    setQuizStarted(false);
    setShowResults(false);
    setScore(0);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setShowExplanation(false);
    setShowCorrectAnswer(false);
    setUsedHint(false);
    setTotalCorrectAnswers(0);
    setTimeLeft(difficulty === "facile" ? 45 : difficulty === "difficile" ? 15 : 30);
    
    // Générer de nouvelles questions
    const randomQuestions = getRandomQuestions(difficulty, 10);
    setQuestions(randomQuestions);
  };

  if (questions.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-accent)] mx-auto"></div>
        <p className="mt-4 text-[var(--color-foreground)]">Chargement des questions...</p>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="max-w-2xl mx-auto">
      {!quizStarted && !showResults && (
        <div className="flex flex-col items-center gap-4">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-[var(--color-accent)] mb-2">
              Quiz - Niveau {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            </h2>
            <p className="text-[var(--color-muted)]">
              {questions.length} questions • {difficulty === "facile" ? "45" : difficulty === "difficile" ? "15" : "30"} secondes par question
            </p>
          </div>
          <button
            className="px-8 py-3 rounded-full bg-[var(--color-accent)] text-white font-bold text-lg shadow hover:bg-[var(--color-accent-dark)] transition-all"
            onClick={startQuiz}
          >
            Commencer le quiz
          </button>
        </div>
      )}

      {quizStarted && !showResults && (
        <div className="bg-[var(--color-muted)] rounded-xl shadow-lg p-6 mt-4 border border-[var(--color-border)]">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[var(--color-accent)] font-semibold">
              Question {currentQuestionIndex + 1} / {questions.length}
            </span>
            <span className="text-[var(--color-foreground)] font-mono">
              ⏰ {timeLeft}s
            </span>
          </div>
          
          <div className="mb-4">
            <span className="text-sm text-[var(--color-muted)] bg-[var(--color-background)] px-2 py-1 rounded">
              {currentQuestion.category}
            </span>
          </div>

          <h2 className="text-xl font-bold mb-4 text-[var(--color-foreground)]">
            {currentQuestion.question}
          </h2>

          <div className="flex flex-col gap-3 mb-4">
            {currentQuestion.choices.map((option) => (
              <button
                key={option}
                className={`px-4 py-3 rounded-lg border text-lg transition-all text-left ${
                  selectedAnswer === option
                    ? isCorrect && option === currentQuestion.answer
                      ? "bg-green-600 text-white border-green-700"
                      : !isCorrect && option === selectedAnswer
                        ? "bg-red-600 text-white border-red-700"
                        : "bg-[var(--color-background)] text-[var(--color-foreground)] border-[var(--color-border)]"
                    : showCorrectAnswer && option === currentQuestion.answer
                      ? "bg-green-700 text-white border-green-800"
                      : "bg-[var(--color-background)] text-[var(--color-foreground)] border-[var(--color-border)] hover:bg-[var(--color-accent)]/10 hover:border-[var(--color-accent)]"
                }`}
                onClick={() => handleAnswer(option)}
                disabled={!!selectedAnswer || showExplanation}
              >
                {option}
              </button>
            ))}
          </div>

          <div className="flex justify-between items-center">
            <button
              className="text-[var(--color-accent)] underline text-sm hover:text-[var(--color-accent-dark)]"
              onClick={useHint}
              disabled={usedHint || !!selectedAnswer}
            >
              {usedHint ? "Indice utilisé" : "Utiliser un indice"}
            </button>
            <span className="text-[var(--color-muted)] text-sm">
              Difficulté : {difficulty}
            </span>
          </div>

          {usedHint && !selectedAnswer && (
            <div className="mt-4 p-3 bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20 rounded-lg">
              <p className="text-[var(--color-foreground)] text-sm">
                💡 <strong>Indice :</strong> {currentQuestion.indice}
              </p>
            </div>
          )}

          {showExplanation && (
            <div className={`mt-4 p-4 rounded-lg ${
              isCorrect 
                ? "bg-green-900/60 text-green-200 border border-green-700/30" 
                : "bg-red-900/60 text-red-200 border border-red-700/30"
            }`}>
              <p className="font-semibold mb-2">
                {isCorrect ? "✅ Correct !" : "❌ Incorrect"}
              </p>
              <p>{currentQuestion.explanation}</p>
            </div>
          )}
        </div>
      )}

      {showResults && (
        <div className="bg-[var(--color-muted)] rounded-xl shadow-lg p-8 mt-8 text-center border border-[var(--color-border)]">
          <h2 className="text-2xl font-bold text-[var(--color-accent)] mb-4">
            Résultats du quiz
          </h2>
          <p className="text-lg text-[var(--color-foreground)] mb-2">
            Score : <span className="font-bold text-[var(--color-accent)]">
              {score} / {questions.length}
            </span>
          </p>
          <p className="text-[var(--color-muted)] mb-4">
            Bonnes réponses : {totalCorrectAnswers}
          </p>
          <p className="text-[var(--color-foreground)] mb-6">
            Pourcentage : <span className="font-bold text-[var(--color-accent)]">
              {Math.round((score / questions.length) * 100)}%
            </span>
          </p>
          <button
            className="px-6 py-2 rounded-full bg-[var(--color-accent)] text-white font-bold mt-4 hover:bg-[var(--color-accent-dark)] transition-all"
            onClick={resetQuiz}
          >
            Rejouer
          </button>
        </div>
      )}
    </div>
  );
};

export default Quiz; 