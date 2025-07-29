import React, { useRef, useState, useEffect } from "react";

interface AudioPlayerProps {
  src: string;
  title: string;
  sourate?: string;
  reciter: string;
  image?: string;
}

type PlayerPosition = 'left' | 'center' | 'right';

const AudioPlayer: React.FC<AudioPlayerProps> = ({ src, title, reciter, image }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState<PlayerPosition>('center');
  const [showSettings, setShowSettings] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

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

  // Sauvegarde la position dans le localStorage
  useEffect(() => {
    const savedPosition = localStorage.getItem('audioPlayerPosition') as PlayerPosition;
    if (savedPosition) {
      setPosition(savedPosition);
    }
  }, []);

  // Animation d'apparition
  useEffect(() => {
    // Petit délai pour déclencher l'animation après le montage
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Démarre automatiquement la lecture quand le composant est monté
  useEffect(() => {
    if (audioRef.current && src) {
      const audio = audioRef.current;
      audio.load(); // Charge l'audio
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch((error) => {
        console.error('Erreur lors du démarrage automatique:', error);
        setIsPlaying(false);
      });
    }
  }, [src]);

  const handlePositionChange = (newPosition: PlayerPosition) => {
    setPosition(newPosition);
    localStorage.setItem('audioPlayerPosition', newPosition);
    setShowSettings(false);
  };

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

  // Classes CSS pour les différentes positions
  const getPositionClasses = () => {
    switch (position) {
      case 'left':
        return 'left-4 right-auto';
      case 'right':
        return 'right-4 left-auto';
      case 'center':
      default:
        return 'left-1/2 transform -translate-x-1/2';
    }
  };

  return (
    <div 
      className={`fixed bottom-0 z-50 flex items-center justify-center px-2 py-2 ${getPositionClasses()} transition-all duration-700 ease-out ${
        isVisible 
          ? 'translate-y-0 opacity-100' 
          : 'translate-y-full opacity-0'
      }`} 
      style={{ minHeight: 90 }}
    >
      <div className="w-full mx-auto flex flex-col items-center justify-center rounded-2xl bg-[var(--color-foreground)]/80 backdrop-blur-lg shadow-2xl border-2 border-gold px-4 py-3 relative transform transition-all duration-500 ease-out hover:scale-105">
        {/* Bouton de configuration - dans la box verte, en haut à droite */}
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="absolute -top-2 -right-2 p-2 bg-[var(--color-accent)] rounded-full shadow-lg hover:bg-[var(--color-accent)]/80 hover:scale-110 transition-all duration-300 transform hover:shadow-xl z-10"
          title="Configurer la position"
        >
          <svg className={`w-4 h-4 text-white transition-transform duration-300 ${showSettings ? 'rotate-90' : 'rotate-0'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>

        {/* Menu de configuration avec animation */}
        {showSettings && (
          <div className="absolute -top-46 right-0 bg-[var(--color-foreground)]/80 rounded-lg shadow-xl border border-[var(--color-border)] p-3 min-w-48 animate-in slide-in-from-top-2 duration-300 z-20">
            <div className="text-white text-sm font-semibold mb-2">Position du player</div>
            <div className="space-y-2">
              <button
                onClick={() => handlePositionChange('left')}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-all duration-200 hover:scale-105 ${
                  position === 'left' 
                    ? 'bg-[var(--color-accent)] text-white shadow-lg' 
                    : 'text-gray-300 hover:bg-[var(--color-muted)]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                  Gauche
                </div>
              </button>
              <button
                onClick={() => handlePositionChange('center')}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-all duration-200 hover:scale-105 ${
                  position === 'center' 
                    ? 'bg-[var(--color-accent)] text-white shadow-lg' 
                    : 'text-gray-300 hover:bg-[var(--color-muted)]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                  Centre
                </div>
              </button>
              <button
                onClick={() => handlePositionChange('right')}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-all duration-200 hover:scale-105 ${
                  position === 'right' 
                    ? 'bg-[var(--color-accent)] text-white shadow-lg' 
                    : 'text-gray-300 hover:bg-[var(--color-muted)]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                  Droite
                </div>
              </button>
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 mb-2 w-full justify-left">
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
          <button onClick={handleBackward} className="px-3 py-2 rounded-full hover:bg-gold-500/20 text-lg font-bold transition-all duration-150 shadow-md flex items-center justify-center">
            <svg className="w-5 h-5" fill="white" viewBox="0 0 20 20"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zm-2 8a1 1 0 011-1h5a1 1 0 110 2h-5a1 1 0 01-1-1z"/></svg>
            <span className="ml-1 text-xs">10s</span>
          </button>
          <button
            onClick={isPlaying ? handlePause : handlePlay}
            className={`px-5 py-2 rounded-full ${isPlaying ? "bg-gold-500" : "bg-green-500"} text-white font-bold shadow-lg transition-all duration-200 flex items-center justify-center`}
          >
            {isPlaying ? (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><rect x="6" y="5" width="2" height="10"/><rect x="12" y="5" width="2" height="10"/></svg>
            ) : (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><polygon points="7,5 15,10 7,15"/></svg>
            )}
          </button>
          <button onClick={handleForward} className="px-3 py-2 rounded-full hover:bg-green-600/80 text-lg font-bold transition-all duration-150 shadow-md flex items-center justify-center">
            <span className="mr-1 text-xs">10s</span>
            <svg className="w-5 h-5" fill="white" viewBox="0 0 20 20"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zm2 8a1 1 0 00-1-1H6a1 1 0 100 2h5a1 1 0 001-1z"/></svg>
          </button>
        </div>
        <div className="flex items-center gap-2 w-full justify-center">
          <input
            type="range"
            min={0}
            max={duration || 0}
            value={progress}
            onChange={handleSeek}
            className="w-full h-2 accent-green-500 bg-blue-500/30 rounded-lg shadow-inner"
            style={{ maxWidth: 220 }}
          />
          <span className="text-xs text-gray-200 font-mono">{Math.floor(progress / 60)}:{String(Math.floor(progress % 60)).padStart(2, "0")}/{Math.floor(duration / 60)}:{String(Math.floor(duration % 60)).padStart(2, "0")}</span>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
