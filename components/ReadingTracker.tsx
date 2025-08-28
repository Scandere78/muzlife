"use client";

import React, { useEffect } from "react";
// import { Button } from "./ui/button";
import { useAuth } from "../contexts/AuthContext";



interface ReadingTrackerProps {
  surahNumber: number;
  surahName: string;
  onVerseRead?: (verse: number) => void;
}

const ReadingTracker: React.FC<ReadingTrackerProps> = ({ surahNumber }) => {
  const { user, getReadingProgress } = useAuth();

  useEffect(() => {
    const fetchProgress = async () => {
      if (user) {
        await getReadingProgress();
      }
    };
    fetchProgress();
  }, [user, getReadingProgress, surahNumber]);

  // ...compléter la logique et le rendu selon besoin
  return null;
};

export default ReadingTracker;
