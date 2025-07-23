"use client";

import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export interface UseReadingTracker {
  isTracking: boolean;
  startReading: () => void;
  stopReading: () => void;
  recordVerse: (surahNumber: number, verseNumber: number, surahName: string) => Promise<void>;
}

export const useReadingTracker = (): UseReadingTracker => {
  const { recordReadingProgress, user } = useAuth();
  const [isTracking, setIsTracking] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<number | null>(null);

  const startReading = () => {
    if (user) {
      setIsTracking(true);
      setStartTime(Date.now());
    }
  };

  const stopReading = () => {
    setIsTracking(false);
    setStartTime(null);
  };

  const recordVerse = async (
    surahNumber: number,
    verseNumber: number,
    surahName: string
  ) => {
    if (!user) return;
    const readingTime = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0;
    try {
      await recordReadingProgress(surahNumber, verseNumber, surahName, readingTime);
      // Optionally add a toast/notification here
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du verset:", error);
    }
  };

  return {
    isTracking,
    startReading,
    stopReading,
    recordVerse,
  };
};
