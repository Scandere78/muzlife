import React, { useRef, useState, useEffect } from "react";

interface AudioPlayerProps {
  src: string;
  title: string;
  reciter: string;
  image?: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ src, title, reciter, image }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  // Utilise l'image passée en prop si disponible, sinon fallback sur la logique existante
  const reciters = [
    { id: 'balilah', name: 'Bandar Balilah', image: '/img/bandar-balila.jpg' },
    { id: 'jhn', name: 'Jahan', image: '/img/al.jpg' },
    { id: 'aabd-lrhmn-lshh-t', name: 'Abderrahman Al Shahat', image: '/img/abderrahman-shahat.jpg' },
    { id: 'afs', name: 'Alafasy', image: '/img/mishary.webp' },
    { id: 'maher', name: 'Maher Al-Muaiqly', image: '/img/Maher.png' },
    { id: 'h_dukhain', name: 'Haitham Dukhain', image: '/img/haitham.webp' },
    { id: 'islam', name: 'Islam Sobhi', image: '/img/islam.png' },
    { id: 'soufi-1', name: 'Soufi', image: '/img/abdul-rashid-ali-sufi.png' },
    { id: 'sds', name: 'Saad Al-Ghamdi', image: '/img/saad-al-ghamdi.jpg' },
  ];
  const reciterObj = reciters.find(r => r.name === reciter || r.id === reciter);
  const reciterImage = image || reciterObj?.image;

  useEffect(() => {
    if (!audioRef.current) return;
    const audio = audioRef.current;
    const updateProgress = () => {
      setProgress(audio.currentTime);
    };
    const updateDuration = () => {
      setDuration(audio.duration);
    };
    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", () => setIsPlaying(false));
    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", () => setIsPlaying(false));
    };
  }, []);

  const handlePlay = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };
  const handlePause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Number(e.target.value);
      setProgress(Number(e.target.value));
    }
  };
  const handleForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(audioRef.current.currentTime + 10, duration);
    }
  };
  const handleBackward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(audioRef.current.currentTime - 10, 0);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-center px-2 py-2" style={{ minHeight: 90 }}>
      <div className="w-full mx-auto flex flex-col items-center justify-center rounded-2xl bg-white/20 backdrop-blur-lg shadow-2xl border border-gray-800 px-4 py-3" style={{ maxWidth: 400 }}>
        <div className="flex items-center gap-3 mb-2 w-full justify-center">
          <img
            src={reciterImage || '/img/default.png'}
            alt={reciter}
            className="w-12 h-12 rounded-full object-cover border-2 border-white/40 shadow-lg"
            style={{ background: '#222', objectFit: 'cover' }}
          />
          <div className="flex flex-col justify-center ml-2">
            <span className="font-bold text-base leading-tight text-white drop-shadow-sm truncate" style={{ maxWidth: 140 }}>{title}</span>
            <span className="text-xs text-gray-200 mt-1 font-medium truncate" style={{ maxWidth: 140 }}>{reciter}</span>
          </div>
        </div>
        <audio ref={audioRef} src={src} preload="metadata" />
        <div className="flex items-center gap-3 mb-2 w-full justify-center">
          <button onClick={handleBackward} className="px-3 py-2 rounded-full bg-white/30 hover:bg-green-600/80 text-lg font-bold transition-all duration-150 shadow-md flex items-center justify-center">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zm-2 8a1 1 0 011-1h5a1 1 0 110 2h-5a1 1 0 01-1-1z"/></svg>
            <span className="ml-1 text-xs">10s</span>
          </button>
          <button
            onClick={isPlaying ? handlePause : handlePlay}
            className={`px-5 py-2 rounded-full ${isPlaying ? "bg-red-500" : "bg-green-500"} text-white font-bold shadow-lg transition-all duration-200 flex items-center justify-center`}
          >
            {isPlaying ? (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><rect x="6" y="5" width="2" height="10"/><rect x="12" y="5" width="2" height="10"/></svg>
            ) : (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><polygon points="7,5 15,10 7,15"/></svg>
            )}
          </button>
          <button onClick={handleForward} className="px-3 py-2 rounded-full bg-white/30 hover:bg-green-600/80 text-lg font-bold transition-all duration-150 shadow-md flex items-center justify-center">
            <span className="mr-1 text-xs">10s</span>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zm2 8a1 1 0 00-1-1H6a1 1 0 100 2h5a1 1 0 001-1z"/></svg>
          </button>
        </div>
        <div className="flex items-center gap-2 w-full justify-center">
          <input
            type="range"
            min={0}
            max={duration || 0}
            value={progress}
            onChange={handleSeek}
            className="w-full h-2 accent-green-500 bg-white/30 rounded-lg shadow-inner"
            style={{ maxWidth: 220 }}
          />
          <span className="text-xs text-gray-200 font-mono">{Math.floor(progress / 60)}:{String(Math.floor(progress % 60)).padStart(2, "0")}/{Math.floor(duration / 60)}:{String(Math.floor(duration % 60)).padStart(2, "0")}</span>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
