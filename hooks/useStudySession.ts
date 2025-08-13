import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface StudySession {
  id: string;
  surahNumber: number;
  studyMode: 'READING' | 'MEMORIZATION' | 'PRONUNCIATION' | 'REVIEW';
  startedAt: Date;
  endedAt?: Date;
  duration?: number;
  versesStudied: number[];
  versesCompleted: number[];
  totalVerses: number;
  completedVerses: number;
  accuracy?: number;
  focusTime?: number;
}

interface StudySessionData {
  totalVerses?: number;
  versesStudied?: number[];
  versesCompleted?: number[];
  focusTime?: number;
  accuracy?: number;
}

interface UseStudySessionReturn {
  currentSession: StudySession | null;
  isSessionActive: boolean;
  sessionDuration: number;
  focusTime: number;
  startSession: (surahNumber: number, studyMode: string, totalVerses: number) => Promise<void>;
  updateSession: (data: StudySessionData) => Promise<void>;
  endSession: (accuracy?: number) => Promise<void>;
  pauseSession: () => void;
  resumeSession: () => void;
  addVerseStudied: (verseNumber: number) => void;
  addVerseCompleted: (verseNumber: number) => void;
  loading: boolean;
  error: string | null;
}

export function useStudySession(): UseStudySessionReturn {
  const { user } = useAuth();
  const [currentSession, setCurrentSession] = useState<StudySession | null>(null);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [focusTime, setFocusTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const sessionStartTime = useRef<Date | null>(null);
  const pauseStartTime = useRef<Date | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Mettre à jour la durée de session en temps réel
  useEffect(() => {
    if (currentSession && !isPaused && sessionStartTime.current) {
      intervalRef.current = setInterval(() => {
        const now = new Date();
        const elapsed = Math.floor((now.getTime() - sessionStartTime.current!.getTime()) / 1000);
        setSessionDuration(elapsed);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [currentSession, isPaused]);

  // Nettoyer à la fermeture du composant
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const authenticatedFetch = useCallback(async (url: string, options: RequestInit = {}) => {
    const token = localStorage.getItem('token');
    return fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
    });
  }, []);

  const startSession = useCallback(async (
    surahNumber: number, 
    studyMode: string, 
    totalVerses: number
  ) => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await authenticatedFetch('/api/study/session', {
        method: 'POST',
        body: JSON.stringify({
          surahNumber,
          studyMode,
          action: 'start',
          sessionData: { totalVerses },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentSession(data.session);
        sessionStartTime.current = new Date();
        setSessionDuration(0);
        setFocusTime(0);
        setIsPaused(false);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Erreur lors du démarrage de la session');
      }
    } catch (err) {
      setError('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  }, [user, authenticatedFetch]);

  const updateSession = useCallback(async (data: StudySessionData) => {
    if (!currentSession || !user) return;
    
    try {
      const response = await authenticatedFetch('/api/study/session', {
        method: 'POST',
        body: JSON.stringify({
          action: 'update',
          sessionData: {
            sessionId: currentSession.id,
            ...data,
            focusTime,
          },
        }),
      });

      if (response.ok) {
        const responseData = await response.json();
        setCurrentSession(responseData.session);
      }
    } catch (err) {
      console.error('Erreur mise à jour session:', err);
    }
  }, [currentSession, user, authenticatedFetch, focusTime]);

  const endSession = useCallback(async (accuracy?: number) => {
    if (!currentSession || !user) return;
    
    setLoading(true);
    
    try {
      const response = await authenticatedFetch('/api/study/session', {
        method: 'POST',
        body: JSON.stringify({
          action: 'end',
          sessionData: {
            sessionId: currentSession.id,
            duration: sessionDuration,
            accuracy,
            totalVerses: currentSession.totalVerses,
          },
        }),
      });

      if (response.ok) {
        setCurrentSession(null);
        sessionStartTime.current = null;
        setSessionDuration(0);
        setFocusTime(0);
        setIsPaused(false);
      }
    } catch (err) {
      setError('Erreur lors de la fin de session');
    } finally {
      setLoading(false);
    }
  }, [currentSession, user, authenticatedFetch, sessionDuration]);

  const pauseSession = useCallback(() => {
    if (!currentSession || isPaused) return;
    
    setIsPaused(true);
    pauseStartTime.current = new Date();
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [currentSession, isPaused]);

  const resumeSession = useCallback(() => {
    if (!currentSession || !isPaused) return;
    
    setIsPaused(false);
    
    // Ajuster le temps de focus en retirant le temps de pause
    if (pauseStartTime.current && sessionStartTime.current) {
      const pauseDuration = (new Date().getTime() - pauseStartTime.current.getTime()) / 1000;
      setFocusTime(prev => Math.max(0, prev - pauseDuration));
      pauseStartTime.current = null;
    }
  }, [currentSession, isPaused]);

  const addVerseStudied = useCallback((verseNumber: number) => {
    if (!currentSession) return;
    
    const newVersesStudied = [...new Set([...currentSession.versesStudied, verseNumber])];
    const updatedSession = {
      ...currentSession,
      versesStudied: newVersesStudied,
    };
    
    setCurrentSession(updatedSession);
    updateSession({ versesStudied: newVersesStudied });
  }, [currentSession, updateSession]);

  const addVerseCompleted = useCallback((verseNumber: number) => {
    if (!currentSession) return;
    
    const newVersesCompleted = [...new Set([...currentSession.versesCompleted, verseNumber])];
    const updatedSession = {
      ...currentSession,
      versesCompleted: newVersesCompleted,
      completedVerses: newVersesCompleted.length,
    };
    
    setCurrentSession(updatedSession);
    updateSession({ versesCompleted: newVersesCompleted });
  }, [currentSession, updateSession]);

  // Calculer le temps de focus (temps total - temps de pause)
  useEffect(() => {
    if (sessionDuration > 0 && !isPaused) {
      setFocusTime(sessionDuration);
    }
  }, [sessionDuration, isPaused]);

  return {
    currentSession,
    isSessionActive: !!currentSession,
    sessionDuration,
    focusTime,
    startSession,
    updateSession,
    endSession,
    pauseSession,
    resumeSession,
    addVerseStudied,
    addVerseCompleted,
    loading,
    error,
  };
}