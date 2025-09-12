"use client";

import React, { useState, useEffect } from "react";
import { QuizQuestion, getRandomQuestions } from "../lib/quizzquestions";
import { useAuth } from "../contexts/AuthContext";
import { useQuizContext, QuizAnswer } from "../contexts/QuizContext";
import QuizSummary from "./QuizSummary";

interface QuizProps {
  difficulty: 'facile' | 'moyen' | 'difficile';
  onBackToMenu?: () => void;
}

const Quiz: React.FC<QuizProps> = ({ difficulty, onBackToMenu }) => {
  const { user, saveQuizResult } = useAuth();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [quizStarted, setQuizStarted] = useState(true); // Démarre directement à true
  const [usedHint, setUsedHint] = useState(false);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [totalCorrectAnswers, setTotalCorrectAnswers] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  // const [showConfetti, setShowConfetti] = useState(false); // Supprimé pour simplifier
  const [questionProgress, setQuestionProgress] = useState(0);
  const [isAnswering, setIsAnswering] = useState(false);
  const [showSkipButton, setShowSkipButton] = useState(false);
  const [questionStartTime, setQuestionStartTime] = useState<Date>(new Date());
  const [showSummary, setShowSummary] = useState(false);
  
  const { startQuizSession, addAnswer, finishQuizSession, getLastSession } = useQuizContext();

  // Scroll to top au montage du composant (important pour mobile)
  useEffect(() => {
    // Scroll immédiat sans animation pour éviter tout décalage
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []); // Vide pour n'exécuter qu'au montage

  // Initialiser les questions et la session au démarrage
  useEffect(() => {
    const randomQuestions = getRandomQuestions(difficulty, 10);
    setQuestions(randomQuestions);
    // Démarrer la session de quiz immédiatement
    startQuizSession(randomQuestions, difficulty);
    setQuestionStartTime(new Date());
  }, [difficulty]);

  // Timer selon la difficulté
  useEffect(() => {
    if (!quizStarted || showExplanation || showResults) return;
    
    if (timeLeft === 0) {
      setShowCorrectAnswer(true);
      setShowExplanation(true);
      setIsCorrect(false);
      
      // Enregistrer une réponse vide (temps écoulé)
      const timeSpent = Math.floor((new Date().getTime() - questionStartTime.getTime()) / 1000);
      const quizAnswer: QuizAnswer = {
        questionIndex: currentQuestionIndex,
        question: questions[currentQuestionIndex],
        userAnswer: null,
        correctAnswer: questions[currentQuestionIndex].answer,
        isCorrect: false,
        timeSpent,
        usedHint,
        explanation: questions[currentQuestionIndex].explanation,
      };
      addAnswer(quizAnswer);
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

  // Afficher le bouton suivant quand l'explication est visible
  useEffect(() => {
    if (showExplanation && quizStarted && !showResults) {
      setShowSkipButton(true);
    }
  }, [showExplanation, quizStarted, showResults]);

  // Cette fonction n'est plus nécessaire car le quiz démarre automatiquement
  // mais on la garde vide pour éviter les erreurs si elle est appelée quelque part
  const startQuiz = () => {};

  const handleAnswer = (option: string) => {
    if (selectedAnswer || isAnswering) return;
    
    setIsAnswering(true);
    setSelectedAnswer(option);
    const correct = questions[currentQuestionIndex].answer === option;
    setIsCorrect(correct);
    setShowExplanation(true);
    setShowCorrectAnswer(true);
    
    if (correct) {
      setScore((s) => s + 1);
      setTotalCorrectAnswers((c) => c + 1);
      setStreak((s) => s + 1);
      setMaxStreak((ms) => Math.max(ms, streak + 1));
      
      // Animation de confetti supprimée pour simplifier l'interface
    } else {
      setStreak(0);
    }
    
    // Enregistrer la réponse dans le context
    const timeSpent = Math.floor((new Date().getTime() - questionStartTime.getTime()) / 1000);
    const quizAnswer: QuizAnswer = {
      questionIndex: currentQuestionIndex,
      question: questions[currentQuestionIndex],
      userAnswer: option,
      correctAnswer: questions[currentQuestionIndex].answer,
      isCorrect: correct,
      timeSpent,
      usedHint,
      explanation: questions[currentQuestionIndex].explanation,
    };
    addAnswer(quizAnswer);

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

    // Animation de progression
    setTimeout(() => {
      setQuestionProgress(((currentQuestionIndex + 1) / questions.length) * 100);
      setIsAnswering(false);
    }, 500);
  };

  const skipToNextQuestion = () => {
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex((i) => i + 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
      setShowExplanation(false);
      setShowCorrectAnswer(false);
      setUsedHint(false);
      setShowSkipButton(false);
      setQuestionStartTime(new Date());
      setTimeLeft(difficulty === "facile" ? 45 : difficulty === "difficile" ? 15 : 30);
    } else {
      // Terminer la session de quiz
      finishQuizSession(score, maxStreak);
      setShowResults(true);
    }
  };

  const useHint = () => {
    setUsedHint(true);
  };

  const resetQuiz = () => {
    setShowResults(false);
    setScore(0);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setShowExplanation(false);
    setShowCorrectAnswer(false);
    setUsedHint(false);
    setTotalCorrectAnswers(0);
    setStreak(0);
    setMaxStreak(0);
    // setShowConfetti(false);
    setQuestionProgress(0);
    setIsAnswering(false);
    setShowSkipButton(false);
    setTimeLeft(difficulty === "facile" ? 45 : difficulty === "difficile" ? 15 : 30);
    setQuestionStartTime(new Date());
    
    // Générer de nouvelles questions
    const randomQuestions = getRandomQuestions(difficulty, 10);
    setQuestions(randomQuestions);
    
    // Démarrer une nouvelle session de quiz
    startQuizSession(randomQuestions, difficulty);
    
    // Garder quizStarted à true pour que le bouton skip fonctionne
    setQuizStarted(true);
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
    <div className="w-full flex justify-center">
      <div className="w-full max-w-4xl mx-auto px-4 relative">

      {!showResults && (
        <div className="relative">
          {/* Header simplifié avec statistiques */}
          <div className="!bg-white/50 dark:!bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-[var(--color-accent)]/20">
            {/* Bouton retour au menu */}
            {onBackToMenu && (
              <div className="mb-4">
                <button
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
                  onClick={onBackToMenu}
                >
                  ← Retour au menu
                </button>
              </div>
            )}
            
            <div className="flex flex-wrap justify-between items-center gap-4">
              {/* Progression simplifiée */}
              <div className="!text-black dark:!text-white">
                <div className="text-sm opacity-70">Question</div>
                <div className="font-bold text-2xl">
                  {currentQuestionIndex + 1} / {questions.length}
                </div>
              </div>
                
              {/* Score et streak simplifiés */}
              <div className="flex items-center gap-4">
                <div className="!text-black dark:!text-white">
                  <div className="text-sm opacity-70">Score</div>
                  <div className="font-bold text-2xl">
                    {score}
                  </div>
                </div>
                
                {streak > 0 && (
                  <div className="text-[var(--color-accent)]">
                    <div className="text-sm opacity-70 !text-black dark:!text-white">Streak</div>
                    <div className="font-bold text-2xl !text-black dark:!text-white">
                      🔥 {streak}
                    </div>
                  </div>
                )}
              </div>
                
              {/* Timer simplifié */}
              <div className={`${
                timeLeft <= 10 ? '!text-red-500' : '!text-black dark:!text-white'
              }`}>
                <div className="text-sm opacity-70">Temps</div>
                <div className="font-bold text-2xl">
                  {timeLeft <= 10 ? '⚠️' : '⏰'} {timeLeft}s
                </div>
              </div>
            </div>
              
            {/* Barre de progression simple */}
            <div className="mt-4 bg-gray-200 rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-[var(--color-accent)] rounded-full transition-all duration-500"
                style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Container principal de la question simplifié */}
          <div className="!bg-white/50 dark:!bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-[var(--color-accent)]/20">
            
            {/* Catégorie simplifiée */}
            <div className="px-6 py-4 border-b border-[var(--color-accent)]/20">
              <div className="flex items-center justify-between">
                <span className="!text-black dark:!text-white text-sm opacity-80">
                  {currentQuestion.category}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  difficulty === 'facile' ? 'bg-green-100 text-green-700' :
                  difficulty === 'moyen' ? 'bg-[var(--color-accent)]/20 text-[var(--color-accent)]' :
                  'bg-red-100 text-red-700'
                }`}>
                  {difficulty.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Question simplifiée */}
            <div className="p-4">
              <h2 className="text-lg font-bold mb-4 !text-black dark:!text-white text-center">
                {currentQuestion.question}
              </h2>

              {/* Options de réponse simplifiées */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                {currentQuestion.choices.map((option, index) => {
                  const colors = [
                    '!bg-blue-500 hover:!bg-blue-600',
                    '!bg-red-500 hover:!bg-red-600', 
                    '!bg-green-500 hover:!bg-green-600',
                    '!bg-purple-500 hover:!bg-purple-600'
                  ];
                  
                  return (
                    <button
                      key={option}
                      className={`p-3 rounded-lg border-2 text-left transition-all duration-200 hover:scale-[1.02] min-h-[60px] flex items-center ${
                        showCorrectAnswer 
                          ? option === currentQuestion.answer
                            ? "!bg-green-500 text-white border-green-500"
                            : option === selectedAnswer && !isCorrect
                              ? "!bg-red-500 text-white border-red-500"
                              : "!bg-gray-400 text-gray-600 border-gray-400"
                          : isAnswering
                            ? "!bg-gray-100 text-gray-500 border-gray-300 cursor-not-allowed"
                            : `${colors[index % 4]} text-white border-transparent`
                      }`}
                      onClick={() => handleAnswer(option)}
                      disabled={!!selectedAnswer || showExplanation || isAnswering}
                    >
                      <div className="flex items-center gap-3 w-full">
                        <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center font-bold text-sm">
                          {String.fromCharCode(65 + index)}
                        </div>
                        <span className="flex-1 font-semibold text-sm">{option}</span>
                        
                        {/* Icônes de feedback */}
                        {selectedAnswer === option && isCorrect && option === currentQuestion.answer && (
                          <div className="text-lg">✅</div>
                        )}
                        {selectedAnswer === option && !isCorrect && (
                          <div className="text-lg">❌</div>
                        )}
                        {showCorrectAnswer && option === currentQuestion.answer && selectedAnswer !== option && (
                          <div className="text-lg">⭐</div>
                        )}
                      </div>
                    </button>
                  );
                })}
                </div>
              </div>

              {/* Actions simplifiées - Cache le bouton indice pendant l'explication */}
              {!showExplanation ? (
                <div className="py-3 flex justify-center items-center mb-3">
                  <button
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors duration-200 text-sm ${
                      usedHint || selectedAnswer
                        ? '!bg-gray-800  text-gray-400 cursor-not-allowed'
                        : '!bg-blue-500 text-white hover:!bg-blue -600'
                    }`}
                    onClick={useHint}
                    disabled={usedHint || !!selectedAnswer}
                  >
                    <span>💡</span>
                    <span className="font-medium text-sm">
                      {usedHint ? "Indice utilisé" : "Utiliser un indice"}
                    </span>
                  </button>
                  
                  {/* Streak indicator */}
                  {streak >= 3 && (
                    <div className="flex items-center gap-2 bg-red-400 text-white px-3 py-1 rounded-lg font-semibold text-sm">
                      <span>🔥</span>
                      <span>EN FEU! {streak}</span>
                    </div>
                  )}
                </div>
              ) : (
                /* Affiche seulement le streak pendant l'explication */
                streak >= 3 && (
                  <div className="flex justify-center mb-3">
                    <div className="flex items-center gap-2 bg-[var(--color-accent)] text-white px-3 py-1 rounded-lg font-semibold text-sm">
                      <span>🔥</span>
                      <span>EN FEU! {streak}</span>
                    </div>
                  </div>
                )
              )}

              {/* Indice simplifié */}
              {usedHint && !selectedAnswer && (
                <div className="flex justify-center mb-3">
                  <div className="mb-2 p-2 bg-blue-50 border border-blue-200 rounded-md max-w-xs w-full text-sm">
                    <div className="flex items-start gap-2">
                      <div className="w-5 h-5 bg-blue-500 rounded-sm flex items-center justify-center text-white text-xs">
                        💡
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-blue-900 mb-1 text-xs">Indice</div>
                        <p className="text-blue-800 text-xs leading-tight truncate">{currentQuestion.indice}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Bouton Suivant - affiché AVANT l'explication */}
              {showExplanation && showSkipButton && (
                <div className="mt-4 text-center">
                  <button
                    className="px-6 py-3 !bg-blue-600 text-white rounded-lg hover:!bg-blue-700 transform hover:scale-105 transition-all duration-200 font-bold text-base shadow-lg"
                    onClick={skipToNextQuestion}
                  >
                    {currentQuestionIndex + 1 < questions.length ? 'Question Suivante →' : 'Voir les Résultats →'}
                  </button>
                </div>
              )}

              {/* Explication avec plus de visibilité et temps de lecture */}
              {showExplanation && (
                <div className="mt-3">
                  <div className={`p-4 rounded-lg border-2 animate-slide-up ${
                    isCorrect 
                      ? "bg-gradient-to-r from-green-500 to-emerald-500 border-green-300" 
                      : "bg-gradient-to-r from-green-500 to-emerald-300 border-green-300"
                  }`}>
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-sm ${
                        isCorrect ? 'bg-green-500' : 'bg-white/20'
                      }`}>
                        {isCorrect ? "💡" : "💡"}
                      </div>
                      <div className="flex-1">
                        <p className={`font-bold text-sm mb-1 ${
                          isCorrect ? 'text-green-200 dark:text-gray-300' : 'text-green-200 dark:text-black'
                        }`}>
                          {isCorrect ? "Excellente réponse !" : "Pas tout à fait..."}
                        </p>
                        <p className={`leading-relaxed text-sm font-bold ${
                          isCorrect ? 'text-gray-800' : 'text-gray-800 dark:text-black'
                        }`}>
                          {currentQuestion.explanation}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        
      )}

      {showResults && (
        <div className="relative py-8">
          {/* Effet de feu d'artifice pour les bons scores */}
          {score >= questions.length * 0.8 && (
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(30)].map((_, i) => (
                <div
                  key={i}
                  className="absolute animate-ping"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 3}s`,
                  }}
                >
                  ⭐
                </div>
              ))}
            </div>
          )}

          {/* Header de résultats COMPACT avec animation et couleurs du site */}
          <div className="text-center mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-foreground)]/20 via-[var(--color-accent)]/20 to-[var(--color-foreground)]/20 rounded-2xl blur-xl animate-pulse"></div>
              <div className="relative !bg-white/50 dark:!bg-gray-800/80 rounded-2xl p-4 shadow-2xl border border-[var(--color-accent)]/30">
                
                {/* Score et titre sur une ligne */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-bold shadow-lg transform transition-all duration-500 ${
                      score >= questions.length * 0.9 ? 'bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-dark)] animate-bounce' :
                      score >= questions.length * 0.7 ? 'bg-gradient-to-br from-green-400 to-emerald-500' :
                      score >= questions.length * 0.5 ? 'bg-gradient-to-br from-[var(--color-foreground)] to-green-600' :
                      'bg-gradient-to-br from-gray-400 to-gray-500'
                    }`}>
                      {score >= questions.length * 0.9 ? '🏆' :
                       score >= questions.length * 0.7 ? '🥇' :
                       score >= questions.length * 0.5 ? '🥈' : '📚'}
                    </div>
                    <div className="text-left">
                      <h2 className="text-2xl font-bold !text-black dark:!text-white">
                        Score: {score}/{questions.length}
                      </h2>
                      <p className="text-sm !text-black dark:!text-white opacity-80">
                        {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} • Quiz terminé
                      </p>
                    </div>
                  </div>
                  
                  {/* Badge de pourcentage et performance */}
                  <div className="flex flex-col items-end gap-1">
                    <div className={`px-4 py-2 rounded-full font-bold text-lg ${
                      score >= questions.length * 0.9
                        ? 'bg-[var(--color-accent)]/20 text-[var(--color-accent-dark)]'
                        : score >= questions.length * 0.7
                        ? 'bg-green-100 text-green-800'
                        : score >= questions.length * 0.5
                        ? 'bg-[var(--color-foreground)]/10 text-[var(--color-foreground)]'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {Math.round((score / questions.length) * 100)}%
                    </div>
                    <span className="text-xs font-semibold !text-black dark:!text-white opacity-70">
                      {score >= questions.length * 0.9 ? 'Maître' :
                       score >= questions.length * 0.7 ? 'Expert' :
                       score >= questions.length * 0.5 ? 'Intermédiaire' : 'Débutant'}
                    </span>
                  </div>
                </div>

                {/* Stats en ligne horizontale */}
                <div className="flex justify-around items-center py-3 mb-3 bg-white/30 dark:bg-gray-900/30 rounded-xl">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">✅</span>
                    <span className="font-bold text-lg !text-black dark:!text-white">{totalCorrectAnswers}</span>
                    <span className="text-xs !text-black dark:!text-white opacity-60">Bonnes</span>
                  </div>
                  <div className="w-px h-8 bg-gray-300 dark:bg-gray-600"></div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🔥</span>
                    <span className="font-bold text-lg !text-black dark:!text-white">{maxStreak}</span>
                    <span className="text-xs !text-black dark:!text-white opacity-60">Streak</span>
                  </div>
                  <div className="w-px h-8 bg-gray-300 dark:bg-gray-600"></div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">⭐</span>
                    <span className="font-bold text-lg !text-black dark:!text-white">
                      {score >= questions.length * 0.9 ? 'A+' :
                       score >= questions.length * 0.7 ? 'A' :
                       score >= questions.length * 0.5 ? 'B' : 'C'}
                    </span>
                    <span className="text-xs !text-black dark:!text-white opacity-60">Note</span>
                  </div>
                </div>

                {/* Message de motivation court */}
                <div className={`px-4 py-2 rounded-xl mb-4 ${
                  score >= questions.length * 0.9 ? 'bg-gradient-to-r from-[var(--color-accent)]/20 to-[var(--color-accent)]/30' :
                  score >= questions.length * 0.7 ? 'bg-gradient-to-r from-green-100 to-emerald-100' :
                  score >= questions.length * 0.5 ? 'bg-gradient-to-r from-[var(--color-foreground)]/10 to-[var(--color-foreground)]/20' :
                  'bg-gray-100 dark:bg-gray-800'
                }`}>
                  <p className="text-center font-semibold !text-black dark:!text-white">
                    {score >= questions.length * 0.9 ? '🌟 Extraordinaire ! Maîtrise parfaite !' :
                     score >= questions.length * 0.7 ? '🎉 Excellent travail ! Continue ainsi !' :
                     score >= questions.length * 0.5 ? '👏 Bien joué ! Tu progresses bien !' : 
                     '💪 Continue tes efforts, tu vas y arriver !'}
                  </p>
                </div>

                {/* Boutons d'action avec couleurs du site */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    className="group relative px-8 py-4 rounded-xl !bg-blue-500 text-white hover:bg-blue-300 font-bold text-lg shadow-xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
                    onClick={() => setShowSummary(true)}
                  >
                    <span className="relative flex items-center gap-3">
                      <span className="text-xl">📋</span>
                      Voir le récapitulatif
                      <span className="text-xl">🔍</span>
                    </span>
                  </button>
                  
                  <button
                    className="group relative px-8 py-4 rounded-xl !bg-blue-600 text-white font-bold text-lg shadow-xl transform dark:hover:bg-red-600 hover:scale-105 transition-all duration-300 overflow-hidden"
                    onClick={resetQuiz}
                  >
                    <span className="absolute inset-0 w-full h-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    <span className="relative flex items-center gap-3">
                      <span className="text-xl">🔄</span>
                      Rejouer
                      <span className="text-xl">🎯</span>
                    </span>
                  </button>
                  
                  {onBackToMenu && (
                    <button
                      className="group relative px-8 py-4 rounded-xl bg-gradient-to-r from-gray-500 via-gray-600 to-gray-700 text-white font-bold text-lg shadow-xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
                      onClick={onBackToMenu}
                    >
                      <span className="relative flex items-center gap-3">
                        <span className="text-xl">↩️</span>
                        Changer de difficulté
                        <span className="text-xl">⚙️</span>
                      </span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Affichage du récapitulatif */}
      {showSummary && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <QuizSummary
              session={getLastSession()!}
              onClose={() => setShowSummary(false)}
              onRetakeQuiz={() => {
                setShowSummary(false);
                resetQuiz();
              }}
            />
          </div>
        </div>
      )}

      {/* Styles CSS pour les animations */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes countdown {
          from { width: 100%; }
          to { width: 0%; }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        
        .animate-slide-down {
          animation: slide-down 0.4s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 0.4s ease-out;
        }
        
        .animate-countdown {
          animation: countdown 10s linear;
        }
        
        .animation-delay-300 {
          animation-delay: 0.3s;
        }
      `}</style>
      </div>
    </div>
  );
};

export default Quiz; 