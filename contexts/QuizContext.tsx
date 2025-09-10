"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { QuizQuestion } from '../lib/quizzquestions';

export interface QuizAnswer {
  questionIndex: number;
  question: QuizQuestion;
  userAnswer: string | null;
  correctAnswer: string;
  isCorrect: boolean;
  timeSpent: number; // temps passé sur la question en secondes
  usedHint: boolean;
  explanation: string;
}

export interface QuizSession {
  questions: QuizQuestion[];
  answers: QuizAnswer[];
  difficulty: 'facile' | 'moyen' | 'difficile';
  score: number;
  totalQuestions: number;
  percentage: number;
  maxStreak: number;
  startTime: Date;
  endTime?: Date;
  totalTime: number; // temps total en secondes
}

interface QuizContextType {
  currentSession: QuizSession | null;
  previousSessions: QuizSession[];
  startQuizSession: (questions: QuizQuestion[], difficulty: 'facile' | 'moyen' | 'difficile') => void;
  addAnswer: (answer: QuizAnswer) => void;
  finishQuizSession: (finalScore: number, maxStreak: number) => void;
  clearCurrentSession: () => void;
  getLastSession: () => QuizSession | null;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const useQuizContext = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuizContext must be used within a QuizProvider');
  }
  return context;
};

export const QuizProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentSession, setCurrentSession] = useState<QuizSession | null>(null);
  const [previousSessions, setPreviousSessions] = useState<QuizSession[]>([]);

  const startQuizSession = (questions: QuizQuestion[], difficulty: 'facile' | 'moyen' | 'difficile') => {
    const newSession: QuizSession = {
      questions,
      answers: [],
      difficulty,
      score: 0,
      totalQuestions: questions.length,
      percentage: 0,
      maxStreak: 0,
      startTime: new Date(),
      totalTime: 0,
    };
    setCurrentSession(newSession);
  };

  const addAnswer = (answer: QuizAnswer) => {
    if (!currentSession) return;
    
    setCurrentSession(prev => {
      if (!prev) return null;
      
      const updatedAnswers = [...prev.answers, answer];
      const correctAnswers = updatedAnswers.filter(a => a.isCorrect).length;
      
      return {
        ...prev,
        answers: updatedAnswers,
        score: correctAnswers,
        percentage: (correctAnswers / prev.totalQuestions) * 100,
      };
    });
  };

  const finishQuizSession = (finalScore: number, maxStreak: number) => {
    if (!currentSession) return;

    const finishedSession: QuizSession = {
      ...currentSession,
      score: finalScore,
      maxStreak,
      endTime: new Date(),
      totalTime: Math.floor((new Date().getTime() - currentSession.startTime.getTime()) / 1000),
      percentage: (finalScore / currentSession.totalQuestions) * 100,
    };

    setPreviousSessions(prev => [finishedSession, ...prev.slice(0, 9)]); // Garder les 10 dernières sessions
    setCurrentSession(null);
  };

  const clearCurrentSession = () => {
    setCurrentSession(null);
  };

  const getLastSession = () => {
    return previousSessions[0] || null;
  };

  const value: QuizContextType = {
    currentSession,
    previousSessions,
    startQuizSession,
    addAnswer,
    finishQuizSession,
    clearCurrentSession,
    getLastSession,
  };

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
};