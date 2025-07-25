
"use client";

import React from "react";


import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaBookmark } from "react-icons/fa";
import ReadingTracker from "../../../components/ReadingTracker";
import { useAuth } from "../../../contexts/AuthContext";

// ...recitationsMap, recitersInfo, souratesNames (identiques à la version JS, typés ci-dessous)

const recitationsMap: Record<string, string> = {
  "abdul-basit": "abdelbasset-abdessamad",
  "mishary": "mishary-rashid",
  "saad": "saad-ghamidi",
  "yasser": "yasser-dossari",
  "balilah": "bandar-balila",
  "hussary": "mahmoud-khalil-hussary",
  "afs": "afs",
  "hudhaify": "hudhaify",
  "sds": "sudais",
  "maher": "maher",
  "h_dukhain": "h_dukhain",
  "soufi-1": "soufi-1",
  "jhn": "jhn",
  "aabd-lrhmn-lshh-t": "abdulrahman-al-shahat",
  "islam": "islam-subhi",
};

const recitersInfo: Record<string, { name: string; image: string }> = {
  "abdul-basit": { name: "Abdul Basit", image: "/img/abdul-basit.webp" },
  "saad": { name: "Saad Al-Ghamidi", image: "/img/saad-al-ghamdi.jpg" },
  "yasser": { name: "Yasser Al-Dossari", image: "/img/yasser-al-dossari.png" },
  "balilah": { name: "Bandar Balila", image: "/img/bandar-balila.jpg" },
  "hussary": { name: "Mahmoud Khalil Hussary", image: "/img/mahmoud.jpg" },
  "afs": { name: "Abu Faisal", image: "/img/mishary.webp" },
  "hudhaify": { name: "Hudhaify", image: "/images/hudhaify.jpg" },
  "sds": { name: "Abdul Rahman Al-Sudais", image: "/img/sudais.jpg" },
  "maher": { name: "Maher Al Meaqli", image: "/img/Maher.png" },
  "h_dukhain": { name: "Haitham Aldukhain", image: "/img/haitham.webp" },
  "soufi-1": { name: "Abderrashed Sofy", image: "/img/abdul-rashid-ali-sufi.png" },
  "jhn": { name: "Abdellah Al-Johany", image: "/img/al.jpg" },
  "aabd-lrhmn-lshh-t": { name: "Abdulrahman Al Shahat", image: "/img/abderrahman-shahat.jpg" },
  "islam": { name: "Islam Subhi", image: "/img/islam.png" },
};

const souratesNames: string[] = [
  "Al-Fatiha", "Al-Baqarah", "Aali Imran", "An-Nisa", "Al-Ma'idah", "Al-An'am", "Al-A'raf", "Al-Anfal", "At-Tawbah", "Yunus",
  "Hud", "Yusuf", "Ar-Ra'd", "Ibrahim", "Al-Hijr", "An-Nahl", "Al-Isra", "Al-Kahf", "Maryam", "Ta-Ha",
  "Al-Anbiya", "Al-Hajj", "Al-Muminun", "An-Nur", "Al-Furqan", "Ash-Shu'ara", "An-Naml", "Al-Qasas", "Al-Ankabut", "Ar-Rum",
  "Luqman", "As-Sajda", "Al-Ahzab", "Saba", "Fatir", "Ya-Sin", "As-Saffat", "Sad", "Az-Zumar", "Ghafir",
  "Fussilat", "Ash-Shura", "Az-Zukhruf", "Ad-Dukhan", "Al-Jathiya", "Al-Ahqaf", "Muhammad", "Al-Fath", "Al-Hujurat", "Qaf",
  "Adh-Dhariyat", "At-Tur", "An-Najm", "Al-Qamar", "Ar-Rahman", "Al-Waqia", "Al-Hadid", "Al-Mujadila", "Al-Hashr", "Al-Mumtahina",
  "As-Saff", "Al-Jumu'a", "Al-Munafiqun", "At-Taghabun", "At-Talaq", "At-Tahrim", "Al-Mulk", "Al-Qalam", "Al-Haqqa", "Al-Ma'arij",
  "Nuh", "Al-Jinn", "Al-Muzzammil", "Al-Muddathir", "Al-Qiyama", "Al-Insan", "Al-Mursalat", "An-Naba", "An-Nazi'at", "Abasa",
  "At-Takwir", "Al-Infitar", "Al-Mutaffifin", "Al-Inshiqaq", "Al-Buruj", "At-Tariq", "Al-A'la", "Al-Ghashiya", "Al-Fajr", "Al-Balad",
  "Ash-Shams", "Al-Lail", "Ad-Duhaa", "Ash-Sharh", "At-Tin", "Al-Alaq", "Al-Qadr", "Al-Bayyina", "Az-Zalzala", "Al-Adiyat",
  "Al-Qari'a", "At-Takathur", "Al-Asr", "Al-Humaza", "Al-Fil", "Quraish", "Al-Ma'un", "Al-Kawthar", "Al-Kafirun", "An-Nasr",
  "Al-Masad", "Al-Ikhlas", "Al-Falaq", "An-Nas"
];

type RecitationsProps = {
  params: { id: string };
};



type ProgressInfo = { status: "current"; verse: number } | "completed" | null;

export default function Recitations({ params }: RecitationsProps) {
  const { user, getReadingProgress } = useAuth();
  // Next.js 15+ : params est un Promise, il faut utiliser React.use avec typage strict
  // @ts-expect-error Next.js App Router param type workaround
  const usableParams = typeof React.use === "function" ? React.use(params) : params;
  const id = (usableParams as { id?: string })?.id ?? "";
  const reciterFolder = recitationsMap[id];
  const reciterInfo = recitersInfo[id];
  const [sourates, setSourates] = useState<{ id: string; name: string; audioUrl: string }[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [userProgress, setUserProgress] = useState<{
    userStats?: { currentSurah: number; currentVerse: number }
  } | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const fetchUserProgress = async () => {
      if (user) {
        const progress = await getReadingProgress();
        // Correction : on ne garde que les infos nécessaires pour l'affichage du marque-page
        if (
          progress &&
          progress.userStats &&
          typeof progress.userStats === "object" &&
          progress.userStats !== null &&
          "currentSurah" in progress.userStats &&
          "currentVerse" in progress.userStats &&
          typeof (progress.userStats as Record<string, unknown>)["currentSurah"] === "number" &&
          typeof (progress.userStats as Record<string, unknown>)["currentVerse"] === "number"
        ) {
          const currentSurah = (progress.userStats as Record<string, unknown>)["currentSurah"] as number;
          const currentVerse = (progress.userStats as Record<string, unknown>)["currentVerse"] as number;
          setUserProgress({ userStats: { currentSurah, currentVerse } });
        } else {
          setUserProgress(null);
        }
      }
    };
    fetchUserProgress();
  }, [user, getReadingProgress]);

  useEffect(() => {
    if (isClient) {
      audioRef.current = new Audio();
    }
  }, [isClient]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      setCurrentIndex(null);
      setIsPlaying(false);
      setProgress(0);
    }
  }, [id]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, []);

  useEffect(() => {
    if (!reciterFolder) return;
    const allSourates = souratesNames.map((name, i) => {
      const sourateId = String(i + 1).padStart(3, "0");
      const audioUrl =
        id === "balilah"
          ? `https://server6.mp3quran.net/balilah/${sourateId}.mp3`
          : id === "jhn"
          ? `https://server13.mp3quran.net/jhn/${sourateId}.mp3`
          : id === "aabd-lrhmn-lshh-t"
          ? `https://server16.mp3quran.net/a_alshahhat/Rewayat-Hafs-A-n-Assem/${sourateId}.mp3`
          : id === "afs"
          ? `https://server8.mp3quran.net/afs/${sourateId}.mp3`
          : id === "maher"
          ? `https://server12.mp3quran.net/maher/${sourateId}.mp3`
          : id === "h_dukhain"
          ? `https://server16.mp3quran.net/h_dukhain/Rewayat-Hafs-A-n-Assem/${sourateId}.mp3`
          : id === "islam"
          ? `https://server14.mp3quran.net/islam/Rewayat-Hafs-A-n-Assem/${sourateId}.mp3`
          : id === "soufi-1"
          ? `https://server16.mp3quran.net/soufi/Rewayat-Khalaf-A-n-Hamzah/${sourateId}.mp3`
          : id === "sds"
          ? `https://server11.mp3quran.net/sds/${sourateId}.mp3`
          : `https://www.al-hamdoulillah.com/coran/mp3/files/${reciterFolder}/${sourateId}.mp3`;
      return { id: sourateId, name, audioUrl };
    });
    setSourates(allSourates);
  }, [reciterFolder, id]);

  const playAudio = (index: number) => {
    if (!sourates[index]) return;
    const newAudioUrl = sourates[index].audioUrl;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = newAudioUrl;
      audioRef.current.load();
      audioRef.current.play();
    }
    setCurrentIndex(index);
    setIsPlaying(true);
    audioRef.current!.onloadedmetadata = () => setDuration(audioRef.current!.duration);
    audioRef.current!.ontimeupdate = () => {
      setProgress((audioRef.current!.currentTime / audioRef.current!.duration) * 100);
    };
    audioRef.current!.onended = () => setIsPlaying(false);
  };

  const getSurahProgress = (surahNumber: number): ProgressInfo => {
    if (!userProgress?.userStats) return null;
    const { currentSurah, currentVerse } = userProgress.userStats;
    if (surahNumber < currentSurah) {
      return "completed";
    } else if (surahNumber === currentSurah) {
      return { status: "current", verse: currentVerse };
    }
    return null;
  };

  if (!isClient) return null;
  return (
    <div className="p-2 sm:p-4 pb-28 sm:pb-20 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {reciterInfo && (
        <>
          <button
            onClick={() => window.location.href = '/sourates'}
            className="mb-4 px-4 py-2 rounded-lg bg-green-700 hover:bg-green-600 text-white font-semibold shadow transition-colors duration-200"
          >
            ← Retour au récitateur
          </button>
          <div className="flex flex-col items-center mb-6 animate-fade-in">
            <Image src={reciterInfo.image} alt={reciterInfo.name} width={120} height={128} className="mx-auto rounded-full shadow-lg border-4 border-green-500" />
            <h1 className="text-2xl sm:text-3xl font-bold text-green-500 mt-2 drop-shadow-lg">{reciterInfo.name}</h1>
          </div>
        </>
      )}
      <div className="w-full max-w-2xl mx-auto grid gap-2 sm:gap-4">
        {sourates.map((sourate, index) => {
          const surahNumber = index + 1;
          const progressInfo = getSurahProgress(surahNumber);
          return (
            <div
              key={sourate.id}
              className={`flex items-center justify-between p-3 sm:p-4 rounded-xl mb-1 sm:mb-2 transition-all duration-200 cursor-pointer shadow-sm border-2 ${
                progressInfo && typeof progressInfo === "object" && progressInfo.status === "current"
                  ? "bg-green-900/80 border-green-500 scale-[1.02]"
                  : progressInfo === "completed"
                  ? "bg-blue-900/80 border-blue-500 scale-[1.01]"
                  : "bg-gray-800/80 border-gray-700 hover:scale-[1.01] hover:border-green-400"
              } hover:shadow-lg active:scale-95`}
              onClick={() => playAudio(index)}
            >
              <div className="flex items-center gap-2 sm:gap-3">
                {progressInfo === "completed" && <div className="text-blue-400 text-lg sm:text-xl">✓</div>}
                {progressInfo && typeof progressInfo === "object" && progressInfo.status === "current" && (
                  <div className="text-green-400 text-lg sm:text-xl animate-bounce">
                    <FaBookmark />
                  </div>
                )}
                <span className="text-base sm:text-lg font-semibold text-white drop-shadow-sm">
                  <span className="inline-block bg-gray-700 text-green-400 rounded px-2 py-1 mr-2 text-xs sm:text-sm font-bold">{sourate.id}</span>
                  {sourate.name}
                </span>
                {progressInfo && typeof progressInfo === "object" && progressInfo.status === "current" && (
                  <span className="text-green-300 text-xs sm:text-sm bg-green-900 px-2 py-1 rounded animate-pulse">Verset {progressInfo.verse}</span>
                )}
              </div>
              <FaPlay className="text-green-400 text-xl sm:text-2xl group-hover:scale-110 transition-transform" />
            </div>
          );
        })}
      </div>
      {currentIndex !== null && (
        <div className="fixed bottom-4 inset-x-0 bg-gray-900/95 p-2 sm:p-4 flex flex-col sm:flex-row items-center justify-between shadow-2xl w-full h-28 sm:h-20 z-50 animate-slide-up">
          <div className="flex items-center gap-2">
            <Image src={reciterInfo.image} alt={reciterInfo.name} width={50} height={50} className="rounded-full border-2 border-green-400 shadow" />
            <div className="flex flex-col text-left">
              <span className="text-base font-bold text-green-300">{sourates[currentIndex].name}</span>
              <span className="text-xs text-gray-400">{(duration / 60).toFixed(2)} min</span>
            </div>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={isNaN(progress) ? 0 : progress}
            onChange={(e) => {
              const newTime = (Number(e.target.value) / 100) * (audioRef.current?.duration ?? 0);
              if (audioRef.current) audioRef.current.currentTime = newTime;
              setProgress(Number(e.target.value));
            }}
            className="w-full sm:w-40 mx-0 sm:mx-4 accent-green-400"
          />
          <div className="flex gap-2 sm:gap-4 mt-2 sm:mt-0">
            <FaStepBackward className="text-white text-2xl sm:text-3xl cursor-pointer hover:text-green-400 transition-colors" onClick={() => playAudio(Math.max(0, currentIndex - 1))} />
            {isPlaying ? (
              <FaPause className="text-green-400 text-3xl sm:text-4xl cursor-pointer hover:text-green-300 transition-colors" onClick={() => { audioRef.current!.pause(); setIsPlaying(false); }} />
            ) : (
              <FaPlay className="text-green-400 text-3xl sm:text-4xl cursor-pointer hover:text-green-300 transition-colors" onClick={() => playAudio(currentIndex)} />
            )}
            <FaStepForward className="text-white text-2xl sm:text-3xl cursor-pointer hover:text-green-400 transition-colors" onClick={() => playAudio(Math.min(sourates.length - 1, currentIndex + 1))} />
          </div>
        </div>
      )}
      <ReadingTracker
        surahNumber={currentIndex !== null ? currentIndex + 1 : 1}
        surahName={currentIndex !== null ? souratesNames[currentIndex] : "Récitation"}
        onVerseRead={(verse: number) => {
          console.log(`Verset ${verse} lu dans ${currentIndex !== null ? souratesNames[currentIndex] : "la récitation"}`);
        }}
      />
      {/* Animations utilitaires */}
      <style>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: none; } }
        .animate-fade-in { animation: fade-in 0.7s cubic-bezier(.4,0,.2,1) both; }
        @keyframes slide-up { from { opacity: 0; transform: translateY(100px); } to { opacity: 1; transform: none; } }
        .animate-slide-up { animation: slide-up 0.5s cubic-bezier(.4,0,.2,1) both; }
      `}</style>
    </div>
  );
}