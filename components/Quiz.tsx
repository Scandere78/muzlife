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
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [questionProgress, setQuestionProgress] = useState(0);
  const [isAnswering, setIsAnswering] = useState(false);

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
      }, 4500); // Augmenté de 2500ms à 4500ms pour laisser plus de temps pour lire
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
    setStreak(0);
    setMaxStreak(0);
    setShowConfetti(false);
    setQuestionProgress(0);
    setIsAnswering(false);
    setTimeLeft(difficulty === "facile" ? 45 : difficulty === "difficile" ? 15 : 30);
  };

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
      
      // Animation de confetti pour les bonnes réponses
      if (streak + 1 >= 3) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 2000);
      }
    } else {
      setStreak(0);
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

    // Animation de progression
    setTimeout(() => {
      setQuestionProgress(((currentQuestionIndex + 1) / questions.length) * 100);
      setIsAnswering(false);
    }, 500);
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
    setStreak(0);
    setMaxStreak(0);
    setShowConfetti(false);
    setQuestionProgress(0);
    setIsAnswering(false);
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
    <div className="w-full flex justify-center">
      <div className="w-full max-w-4xl mx-auto px-4 relative">
        {/* Effet de confetti amélioré */}
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50">
            {[...Array(100)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-ping"
                style={{
                  left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                backgroundColor: ['#c7a96b', '#174c43', '#10b981', '#3b82f6', '#f59e0b', '#ef4444'][Math.floor(Math.random() * 6)],
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${0.5 + Math.random() * 1.5}s`,
                width: `${4 + Math.random() * 8}px`,
                height: `${4 + Math.random() * 8}px`,
                borderRadius: Math.random() > 0.5 ? '50%' : '0%',
              }}
            />
          ))}
          {/* Particules dorées spéciales */}
          {[...Array(20)].map((_, i) => (
            <div
              key={`special-${i}`}
              className="absolute text-2xl animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random()}s`
              }}
            >
              {['🌟', '✨', '💫', '⭐', '🎉'][Math.floor(Math.random() * 5)]}
            </div>
          ))}
        </div>
      )}

      {!quizStarted && !showResults && (
        <div className="flex flex-col items-center gap-6 py-8">
          {/* Header animé avec couleurs du site et effets améliorés */}
          <div className="text-center mb-8 relative">
            {/* Effet de lueur animée */}
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-foreground)]/30 via-[var(--color-accent)]/40 to-[var(--color-foreground)]/30 rounded-3xl blur-2xl animate-pulse scale-110"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-accent)]/20 via-[var(--color-foreground)]/20 to-[var(--color-accent)]/20 rounded-3xl blur-xl animate-pulse scale-105"></div>
            
            <div className="relative bg-gradient-to-br from-[var(--color-background)] via-white to-[var(--color-background)] backdrop-blur-sm rounded-3xl p-8 shadow-2xl border-2 border-[var(--color-accent)]/40 overflow-hidden">
              {/* Motif décoratif en arrière-plan */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-4 left-4 w-20 h-20 border-4 border-[var(--color-accent)] rounded-full animate-spin" style={{ animationDuration: '20s' }}></div>
                <div className="absolute bottom-4 right-4 w-16 h-16 border-4 border-[var(--color-foreground)] rounded-lg animate-bounce" style={{ animationDuration: '3s' }}></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-[var(--color-accent)] rounded-full animate-pulse"></div>
              </div>
              
              <div className="relative z-10">
                {/* En-tête avec icônes animées */}
                <div className="flex items-center justify-center gap-6 mb-6">
                  <div className="relative group">
                    <div className="w-20 h-20 bg-gradient-to-br from-[var(--color-foreground)] via-[var(--color-accent)] to-[var(--color-foreground)] rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-2xl transform rotate-3 hover:rotate-6 transition-all duration-500 hover:scale-110">
                      🧠
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"></div>
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-[var(--color-accent)] rounded-full animate-ping"></div>
                  </div>
                  
                  <div className="text-center">
                    <h2 className="text-5xl font-bold text-[var(--color-foreground)] mb-2 animate-fade-in drop-shadow-lg">
                      Quiz Islamique
                    </h2>
                    <div className="h-1 w-32 bg-gradient-to-r from-transparent via-[var(--color-accent)] to-transparent mx-auto rounded-full animate-pulse"></div>
                  </div>
                  
                  <div className="relative group">
                    <div className="w-20 h-20 bg-gradient-to-br from-[var(--color-accent)] via-[var(--color-accent-dark)] to-[var(--color-accent)] rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-2xl transform -rotate-3 hover:-rotate-6 transition-all duration-500 hover:scale-110">
                      🕌
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"></div>
                    </div>
                    <div className="absolute -top-2 -left-2 w-6 h-6 bg-[var(--color-foreground)] rounded-full animate-ping"></div>
                  </div>
                </div>
                
                {/* Badge de niveau stylisé */}
                <div className="inline-flex items-center gap-3 bg-gradient-to-r from-[var(--color-muted)] via-white to-[var(--color-muted)] px-8 py-4 rounded-full mb-6 border-2 border-[var(--color-accent)]/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="w-10 h-10 bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-dark)] rounded-full flex items-center justify-center animate-spin" style={{ animationDuration: '3s' }}>
                    <span className="text-white text-xl animate-bounce">🎯</span>
                  </div>
                  <span className="font-bold text-xl text-[var(--color-foreground)]">
                    Niveau {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                  </span>
                  <div className="w-2 h-2 bg-[var(--color-accent)] rounded-full animate-ping"></div>
                </div>
                
                {/* Cartes d'information améliorées */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                  <div className="group bg-gradient-to-br from-[var(--color-muted)] to-white rounded-2xl p-6 border-2 border-[var(--color-accent)]/30 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:border-[var(--color-accent)]/60 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-dark)] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                    <div className="text-4xl mb-3 transform group-hover:scale-110 transition-transform duration-300">📚</div>
                    <div className="font-bold text-lg text-[var(--color-foreground)]">{questions.length} Questions</div>
                    <div className="text-sm text-[var(--color-foreground)]/70 mt-1">Sélectionnées pour vous</div>
                  </div>
                  
                  <div className="group bg-gradient-to-br from-[var(--color-muted)] to-white rounded-2xl p-6 border-2 border-[var(--color-accent)]/30 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:border-[var(--color-accent)]/60 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--color-foreground)] to-[var(--color-accent)] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                    <div className="text-4xl mb-3 transform group-hover:scale-110 transition-transform duration-300">⏱️</div>
                    <div className="font-bold text-lg text-[var(--color-foreground)]">
                      {difficulty === "facile" ? "45" : difficulty === "difficile" ? "15" : "30"}s / question
                    </div>
                    <div className="text-sm text-[var(--color-foreground)]/70 mt-1">Chronomètre activé</div>
                  </div>
                  
                  <div className="group bg-gradient-to-br from-[var(--color-muted)] to-white rounded-2xl p-6 border-2 border-[var(--color-accent)]/30 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:border-[var(--color-accent)]/60 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--color-accent-dark)] to-[var(--color-foreground)] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                    <div className="text-4xl mb-3 transform group-hover:scale-110 transition-transform duration-300">🏆</div>
                    <div className="font-bold text-lg text-[var(--color-foreground)]">Système de streak</div>
                    <div className="text-sm text-[var(--color-foreground)]/70 mt-1">Bonus de performance</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Bouton de démarrage ultra-stylisé */}
          <button
            className="group relative px-16 py-6 rounded-3xl bg-gradient-to-r from-[var(--color-foreground)] via-[var(--color-accent)] to-[var(--color-foreground)] text-white font-bold text-2xl shadow-2xl transform hover:scale-110 transition-all duration-500 overflow-hidden"
            onClick={startQuiz}
          >
            {/* Effet de brillance animée */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            
            {/* Fond animé au hover */}
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[var(--color-accent)] via-[var(--color-accent-dark)] to-[var(--color-accent)] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
            
            {/* Contenu du bouton */}
            <span className="relative flex items-center gap-4">
              <div className="relative">
                <span className="text-3xl animate-bounce">🚀</span>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
              </div>
              <span className="text-white group-hover:text-yellow-200 transition-all duration-300 font-bold">
                Commencer le quiz
              </span>
              <div className="relative">
                <span className="text-3xl animate-bounce animation-delay-300">⚡</span>
                <div className="absolute -top-1 -left-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping animation-delay-500"></div>
              </div>
            </span>
            
            {/* Effet de lueur */}
            <div className="absolute inset-0 -top-2 -left-2 bg-gradient-to-r from-[var(--color-foreground)] via-[var(--color-accent)] to-[var(--color-foreground)] rounded-3xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-500 -z-10"></div>
            
            {/* Particules flottantes */}
            <div className="absolute inset-0 overflow-hidden rounded-3xl">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    left: `${20 + i * 10}%`,
                    top: `${30 + (i % 2) * 40}%`,
                    animationDelay: `${i * 0.1}s`,
                  }}
                ></div>
              ))}
            </div>
          </button>
        </div>
      )}

      {quizStarted && !showResults && (
        <div className="relative">
          {/* Header avec statistiques en temps réel - design amélioré */}
          <div className="relative bg-gradient-to-r from-[var(--color-foreground)] via-[var(--color-accent)] to-[var(--color-foreground)] rounded-3xl p-8 mb-8 text-white shadow-2xl overflow-hidden">
            {/* Motif de fond animé */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-20 h-20 border-2 border-white rounded-full animate-spin" style={{ animationDuration: '15s' }}></div>
              <div className="absolute bottom-0 right-0 w-16 h-16 border-2 border-white rounded-lg animate-bounce" style={{ animationDuration: '2s' }}></div>
              <div className="absolute top-1/2 right-1/4 w-12 h-12 border border-white rounded-full animate-pulse"></div>
            </div>
            
            <div className="relative z-10">
              <div className="flex flex-wrap justify-between items-center gap-6">
                {/* Progression stylisée */}
                <div className="flex items-center gap-4 bg-white/10 rounded-2xl px-6 py-4 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300">
                  <div className="w-16 h-16 bg-gradient-to-br from-white/30 to-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/30">
                    <span className="text-2xl animate-pulse">📊</span>
                  </div>
                  <div>
                    <div className="text-sm opacity-90 font-medium">Progression</div>
                    <div className="font-bold text-2xl flex items-center gap-2">
                      {currentQuestionIndex + 1} / {questions.length}
                      <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                    </div>
                  </div>
                </div>
                
                {/* Score et streak améliorés */}
                <div className="flex items-center gap-6">
                  <div className="bg-white/10 rounded-2xl px-6 py-4 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                    <div className="text-xs opacity-90 font-medium">Score</div>
                    <div className="font-bold text-2xl flex items-center gap-2">
                      <span className="text-yellow-300 animate-bounce">🎯</span> 
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-white">{score}</span>
                    </div>
                  </div>
                  
                  {streak > 0 && (
                    <div className="bg-gradient-to-r from-[var(--color-accent)]/40 to-[var(--color-accent-dark)]/40 rounded-2xl px-6 py-4 backdrop-blur-sm border-2 border-[var(--color-accent)]/50 animate-pulse hover:scale-105 transition-all duration-300">
                      <div className="text-xs opacity-90 font-medium">Streak</div>
                      <div className="font-bold text-2xl flex items-center gap-2">
                        <span className="text-orange-300 animate-bounce">🔥</span> 
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-200 to-yellow-200">{streak}</span>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Timer ultra-stylisé */}
                <div className="flex items-center gap-4 bg-white/10 rounded-2xl px-6 py-4 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center backdrop-blur-sm transition-all duration-300 border-2 ${
                    timeLeft <= 10 
                      ? 'bg-red-500/40 border-red-400/60 animate-pulse' 
                      : 'bg-white/20 border-white/30'
                  }`}>
                    <span className={`text-2xl ${timeLeft <= 10 ? 'animate-bounce' : 'animate-pulse'}`}>
                      {timeLeft <= 10 ? '⚠️' : '⏰'}
                    </span>
                  </div>
                  <div>
                    <div className="text-sm opacity-90 font-medium">Temps</div>
                    <div className={`font-bold text-2xl transition-all duration-300 flex items-center gap-2 ${
                      timeLeft <= 10 ? 'text-red-200 animate-pulse' : 'text-white'
                    }`}>
                      {timeLeft}s
                      {timeLeft <= 10 && <div className="w-2 h-2 bg-red-400 rounded-full animate-ping"></div>}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Barre de progression ultra-améliorée */}
              <div className="mt-6 bg-white/20 rounded-full h-3 overflow-hidden border border-white/30">
                <div className="relative h-full">
                  <div 
                    className="h-full bg-gradient-to-r from-[var(--color-accent)] via-yellow-400 to-[var(--color-accent-dark)] rounded-full transition-all duration-500 ease-out relative overflow-hidden"
                    style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                  >
                    {/* Effet de brillance mobile */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent transform -skew-x-12 animate-shimmer"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Container principal de la question - design ultra-moderne */}
          <div className="relative bg-gradient-to-br from-[var(--color-background)] via-white to-[var(--color-background)] rounded-3xl shadow-2xl overflow-hidden border-2 border-[var(--color-accent)]/40">
            {/* Effet de lueur en arrière-plan */}
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-accent)]/5 via-transparent to-[var(--color-foreground)]/5"></div>
            
            {/* Catégorie avec style premium */}
            <div className="relative bg-gradient-to-r from-[var(--color-muted)] via-white to-[var(--color-muted)] px-8 py-6 border-b-2 border-[var(--color-accent)]/30">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-[var(--color-foreground)] to-[var(--color-accent)] rounded-2xl flex items-center justify-center text-white text-lg font-bold shadow-lg">
                    📖
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-[var(--color-accent)] rounded-full animate-ping"></div>
                </div>
                <div className="flex-1">
                  <span className="inline-block font-bold text-[var(--color-foreground)] bg-white px-4 py-2 rounded-full text-sm shadow-md border-2 border-[var(--color-accent)]/20 hover:border-[var(--color-accent)]/50 transition-all duration-300">
                    {currentQuestion.category}
                  </span>
                </div>
                <div className={`px-4 py-2 rounded-full text-xs font-bold shadow-md ${
                  difficulty === 'facile' ? 'bg-green-100 text-green-700 border-2 border-green-300' :
                  difficulty === 'moyen' ? 'bg-gradient-to-r from-[var(--color-accent)]/20 to-[var(--color-accent)]/30 text-[var(--color-accent-dark)] border-2 border-[var(--color-accent)]/40' :
                  'bg-red-100 text-red-700 border-2 border-red-300'
                }`}>
                  {difficulty.toUpperCase()}
                </div>
              </div>
            </div>

            {/* Question avec animation et style amélioré */}
            <div className="relative p-10">
              {/* Motifs décoratifs subtils */}
              <div className="absolute top-4 right-4 w-16 h-16 border border-[var(--color-accent)]/20 rounded-full animate-spin" style={{ animationDuration: '20s' }}></div>
              <div className="absolute bottom-4 left-4 w-12 h-12 border border-[var(--color-foreground)]/20 rounded-lg animate-pulse"></div>
              
              <div className="relative z-10">
                <h2 className="text-3xl font-bold mb-10 text-[var(--color-foreground)] leading-relaxed text-center animate-fade-in">
                  <span className="relative">
                    {currentQuestion.question}
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-[var(--color-accent)] to-transparent rounded-full"></div>
                  </span>
                </h2>

                {/* Options de réponse style Kahoot ultra-amélioré */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {currentQuestion.choices.map((option, index) => {
                    // Couleurs Kahoot améliorées avec les couleurs du site
                    const kahootColors = [
                      { 
                        bg: 'from-red-500 to-red-600', 
                        hover: 'hover:from-red-400 hover:to-red-500', 
                        border: 'border-red-500', 
                        text: 'text-white',
                        shadow: 'shadow-red-200'
                      },
                      { 
                        bg: 'from-blue-500 to-blue-600', 
                        hover: 'hover:from-blue-400 hover:to-blue-500', 
                        border: 'border-blue-500', 
                        text: 'text-white',
                        shadow: 'shadow-blue-200'
                      },
                      { 
                        bg: 'from-[var(--color-accent)] to-[var(--color-accent-dark)]', 
                        hover: 'hover:from-[var(--color-accent-dark)] hover:to-[var(--color-accent)]', 
                        border: 'border-[var(--color-accent)]', 
                        text: 'text-white',
                        shadow: 'shadow-yellow-200'
                      },
                      { 
                        bg: 'from-[var(--color-foreground)] to-green-700', 
                        hover: 'hover:from-green-600 hover:to-[var(--color-foreground)]', 
                        border: 'border-[var(--color-foreground)]', 
                        text: 'text-white',
                        shadow: 'shadow-green-200'
                      }
                    ];
                    
                    const colorScheme = kahootColors[index % 4];
                    
                    return (
                      <button
                        key={option}
                        className={`group relative px-8 py-8 rounded-3xl border-4 text-left transition-all duration-300 transform hover:scale-[1.03] min-h-[140px] flex items-center overflow-hidden ${
                          selectedAnswer === option
                            ? isCorrect && option === currentQuestion.answer
                              ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white border-green-500 shadow-2xl shadow-green-200 scale-105"
                              : !isCorrect && option === selectedAnswer
                                ? "bg-gradient-to-r from-red-500 to-pink-600 text-white border-red-500 shadow-2xl shadow-red-200 scale-105"
                                : "bg-gray-100 text-gray-800 border-gray-300"
                            : showCorrectAnswer && option === currentQuestion.answer
                              ? "bg-gradient-to-r from-green-600 to-emerald-700 text-white border-green-600 shadow-2xl shadow-green-300 animate-pulse scale-105"
                              : isAnswering
                                ? "bg-gray-50 text-gray-600 border-gray-200 cursor-not-allowed"
                                : `bg-gradient-to-r ${colorScheme.bg} ${colorScheme.text} ${colorScheme.border} ${colorScheme.hover} shadow-2xl hover:shadow-3xl ${colorScheme.shadow} active:scale-95`
                        }`}
                        onClick={() => handleAnswer(option)}
                        disabled={!!selectedAnswer || showExplanation || isAnswering}
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        {/* Effet de brillance animée */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                        
                        <div className="flex items-center gap-6 w-full relative z-10">
                          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-xl transition-all duration-300 flex-shrink-0 border-2 ${
                            selectedAnswer === option
                              ? isCorrect && option === currentQuestion.answer
                                ? "bg-white/30 text-white border-white/50"
                                : !isCorrect && option === selectedAnswer
                                  ? "bg-white/30 text-white border-white/50"
                                  : "bg-gray-200 text-gray-600 border-gray-400"
                              : showCorrectAnswer && option === currentQuestion.answer
                                ? "bg-white/30 text-white border-white/50"
                                : "bg-white/30 text-white backdrop-blur-sm border-white/50"
                          }`}>
                            {String.fromCharCode(65 + index)}
                          </div>
                          <span className="flex-1 font-bold text-xl leading-tight">{option}</span>
                          
                          {/* Icônes de feedback améliorées */}
                          {selectedAnswer === option && isCorrect && option === currentQuestion.answer && (
                            <div className="text-white text-3xl animate-bounce">✅</div>
                          )}
                          {selectedAnswer === option && !isCorrect && (
                            <div className="text-white text-3xl animate-bounce">❌</div>
                          )}
                          {showCorrectAnswer && option === currentQuestion.answer && selectedAnswer !== option && (
                            <div className="text-white text-3xl animate-pulse">⭐</div>
                          )}
                        </div>
                        
                        {/* Effet de particules au hover */}
                        <div className="absolute inset-0 overflow-hidden rounded-3xl">
                          {[...Array(3)].map((_, i) => (
                            <div
                              key={i}
                              className="absolute w-2 h-2 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-bounce"
                              style={{
                                left: `${30 + i * 20}%`,
                                top: `${40 + (i % 2) * 20}%`,
                                animationDelay: `${i * 0.2}s`,
                              }}
                            ></div>
                          ))}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Actions avec couleurs du site */}
              <div className="flex justify-between items-center mb-4">
                <button
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                    usedHint || selectedAnswer
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-[var(--color-muted)] text-[var(--color-foreground)] hover:bg-[var(--color-accent)]/20 active:scale-95 border border-[var(--color-accent)]/30'
                  }`}
                  onClick={useHint}
                  disabled={usedHint || !!selectedAnswer}
                >
                  <span className="text-lg">💡</span>
                  <span className="font-medium">
                    {usedHint ? "Indice utilisé" : "Utiliser un indice"}
                  </span>
                </button>
                
                {/* Streak indicator avec couleurs du site */}
                {streak >= 3 && (
                  <div className="flex items-center gap-2 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-dark)] text-white px-4 py-2 rounded-lg font-bold animate-pulse">
                    <span className="text-lg">🔥</span>
                    <span>EN FEU! {streak} de suite!</span>
                  </div>
                )}
              </div>

              {/* Indice avec style du site */}
              {usedHint && !selectedAnswer && (
                <div className="mb-6 p-4 bg-gradient-to-r from-[var(--color-muted)] to-[var(--color-background)] border border-[var(--color-accent)]/30 rounded-xl animate-slide-down">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-[var(--color-accent)] rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0">
                      💡
                    </div>
                    <div>
                      <div className="font-bold text-[var(--color-foreground)] mb-1">Indice</div>
                      <p className="text-[var(--color-foreground)]">{currentQuestion.indice}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Explication avec animation et couleurs du site */}
              {showExplanation && (
                <div className={`p-6 rounded-xl border-2 animate-slide-up ${
                  isCorrect 
                    ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-300" 
                    : "bg-gradient-to-r from-red-50 to-pink-50 border-red-300"
                }`}>
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white text-xl ${
                      isCorrect ? 'bg-green-500' : 'bg-red-500'
                    }`}>
                      {isCorrect ? "✅" : "❌"}
                    </div>
                    <div className="flex-1">
                      <p className={`font-bold text-lg mb-2 ${
                        isCorrect ? 'text-green-800' : 'text-red-800'
                      }`}>
                        {isCorrect ? "Excellente réponse !" : "Pas tout à fait..."}
                      </p>
                      <p className={`leading-relaxed ${
                        isCorrect ? 'text-green-700' : 'text-red-700'
                      }`}>
                        {currentQuestion.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
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

          {/* Header de résultats avec animation et couleurs du site */}
          <div className="text-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-foreground)]/20 via-[var(--color-accent)]/20 to-[var(--color-foreground)]/20 rounded-3xl blur-xl animate-pulse"></div>
              <div className="relative bg-[var(--color-background)] rounded-3xl p-8 shadow-2xl border border-[var(--color-accent)]/30">
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-4xl font-bold shadow-lg transform transition-all duration-500 ${
                    score >= questions.length * 0.9 ? 'bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-dark)] animate-bounce' :
                    score >= questions.length * 0.7 ? 'bg-gradient-to-br from-green-400 to-emerald-500' :
                    score >= questions.length * 0.5 ? 'bg-gradient-to-br from-[var(--color-foreground)] to-green-600' :
                    'bg-gradient-to-br from-gray-400 to-gray-500'
                  }`}>
                    {score >= questions.length * 0.9 ? '🏆' :
                     score >= questions.length * 0.7 ? '🥇' :
                     score >= questions.length * 0.5 ? '🥈' : '📚'}
                  </div>
                  <div>
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-[var(--color-foreground)] via-[var(--color-accent)] to-[var(--color-foreground)] bg-clip-text text-transparent mb-2">
                      {score >= questions.length * 0.9 ? 'Extraordinaire !' :
                       score >= questions.length * 0.7 ? 'Excellent travail !' :
                       score >= questions.length * 0.5 ? 'Bien joué !' : 'Continue tes efforts !'}
                    </h2>
                    <p className="text-lg text-[var(--color-foreground)]">
                      Quiz terminé • Niveau {difficulty}
                    </p>
                  </div>
                </div>

                {/* Score principal avec animation et couleurs du site */}
                <div className="mb-8">
                  <div className="text-6xl font-bold text-center mb-4">
                    <span className="bg-gradient-to-r from-[var(--color-foreground)] to-[var(--color-accent)] bg-clip-text text-transparent">
                      {score}
                    </span>
                    <span className="text-gray-400 text-4xl"> / {questions.length}</span>
                  </div>
                  <div className="text-center">
                    <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-xl ${
                      score >= questions.length * 0.9 ? 'bg-[var(--color-accent)]/20 text-[var(--color-accent-dark)]' :
                      score >= questions.length * 0.7 ? 'bg-green-100 text-green-800' :
                      score >= questions.length * 0.5 ? 'bg-[var(--color-foreground)]/10 text-[var(--color-foreground)]' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      <span className="text-2xl">
                        {score >= questions.length * 0.9 ? '🔥' :
                         score >= questions.length * 0.7 ? '⚡' :
                         score >= questions.length * 0.5 ? '👍' : '💪'}
                      </span>
                      {Math.round((score / questions.length) * 100)}%
                    </div>
                  </div>
                </div>

                {/* Statistiques détaillées avec couleurs du site */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center text-white text-xl">
                        ✅
                      </div>
                      <div>
                        <div className="text-green-800 font-bold text-lg">Bonnes réponses</div>
                        <div className="text-green-600 text-sm">Réponses correctes</div>
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-green-700">{totalCorrectAnswers}</div>
                  </div>

                  <div className="bg-gradient-to-br from-[var(--color-accent)]/10 to-[var(--color-accent)]/20 rounded-2xl p-6 border border-[var(--color-accent)]/30">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-[var(--color-accent)] rounded-xl flex items-center justify-center text-white text-xl">
                        🔥
                      </div>
                      <div>
                        <div className="text-[var(--color-accent-dark)] font-bold text-lg">Meilleur streak</div>
                        <div className="text-[var(--color-accent-dark)] text-sm">Série de bonnes réponses</div>
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-[var(--color-accent-dark)]">{maxStreak}</div>
                  </div>

                  <div className="bg-gradient-to-br from-[var(--color-foreground)]/10 to-[var(--color-foreground)]/20 rounded-2xl p-6 border border-[var(--color-foreground)]/30">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-[var(--color-foreground)] rounded-xl flex items-center justify-center text-white text-xl">
                        ⭐
                      </div>
                      <div>
                        <div className="text-[var(--color-foreground)] font-bold text-lg">Performance</div>
                        <div className="text-[var(--color-foreground)] text-sm">Niveau atteint</div>
                      </div>
                    </div>
                    <div className="text-lg font-bold text-[var(--color-foreground)]">
                      {score >= questions.length * 0.9 ? 'Maître' :
                       score >= questions.length * 0.7 ? 'Expert' :
                       score >= questions.length * 0.5 ? 'Intermédiaire' : 'Débutant'}
                    </div>
                  </div>
                </div>

                {/* Barre de progression du score avec couleurs du site */}
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-[var(--color-foreground)]">Progression du score</span>
                    <span className="text-sm font-bold text-[var(--color-accent)]">{Math.round((score / questions.length) * 100)}%</span>
                  </div>
                  <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[var(--color-foreground)] via-[var(--color-accent)] to-[var(--color-accent-dark)] rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${(score / questions.length) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Message de motivation avec couleurs du site */}
                <div className={`p-6 rounded-2xl mb-6 ${
                  score >= questions.length * 0.9 ? 'bg-gradient-to-r from-[var(--color-accent)]/20 to-[var(--color-accent)]/30 border border-[var(--color-accent)]/50' :
                  score >= questions.length * 0.7 ? 'bg-gradient-to-r from-green-100 to-emerald-100 border border-green-300' :
                  score >= questions.length * 0.5 ? 'bg-gradient-to-r from-[var(--color-foreground)]/10 to-[var(--color-foreground)]/20 border border-[var(--color-foreground)]/30' :
                  'bg-gradient-to-r from-gray-100 to-slate-100 border border-gray-300'
                }`}>
                  <div className="text-center">
                    <div className="text-lg font-bold mb-2 text-[var(--color-foreground)]">
                      {score >= questions.length * 0.9 ? '🌟 Performance exceptionnelle !' :
                       score >= questions.length * 0.7 ? '🎉 Très bonne maîtrise !' :
                       score >= questions.length * 0.5 ? '👏 Bonne progression !' : '💪 Continue à apprendre !'}
                    </div>
                    <p className="text-sm text-[var(--color-foreground)] opacity-80">
                      {score >= questions.length * 0.9 ? 'Vous maîtrisez parfaitement ce niveau. Essayez un niveau plus difficile !' :
                       score >= questions.length * 0.7 ? 'Excellente connaissance du sujet. Quelques révisions et vous serez parfait !' :
                       score >= questions.length * 0.5 ? 'Vous êtes sur la bonne voie. Continuez à étudier pour améliorer vos résultats !' :
                       'Ne vous découragez pas. Chaque quiz vous aide à progresser !'}
                    </p>
                  </div>
                </div>

                {/* Boutons d'action avec couleurs du site */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    className="group relative px-8 py-4 rounded-xl bg-gradient-to-r from-[var(--color-foreground)] via-[var(--color-accent)] to-[var(--color-foreground)] text-white font-bold text-lg shadow-xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
                    onClick={resetQuiz}
                  >
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[var(--color-accent)] via-[var(--color-accent-dark)] to-[var(--color-accent)] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    <span className="relative flex items-center gap-3">
                      <span className="text-xl">🔄</span>
                      Rejouer
                      <span className="text-xl">🎯</span>
                    </span>
                  </button>
                  
                  {score < questions.length * 0.7 && (
                    <button
                      className="px-8 py-4 rounded-xl bg-[var(--color-background)] text-[var(--color-foreground)] font-bold text-lg shadow-xl border-2 border-[var(--color-accent)] hover:bg-[var(--color-muted)] transform hover:scale-105 transition-all duration-300"
                      onClick={() => {
                        // Logic to retry with easier difficulty or review mode
                        resetQuiz();
                      }}
                    >
                      <span className="flex items-center gap-3">
                        <span className="text-xl">📚</span>
                        Réviser
                      </span>
                    </button>
                  )}
                </div>
              </div>
            </div>
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
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        
        .animate-slide-down {
          animation: slide-down 0.4s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 0.4s ease-out;
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