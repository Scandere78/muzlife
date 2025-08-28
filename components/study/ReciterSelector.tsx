import React from 'react';
import { ChevronDown, User } from 'lucide-react';

export interface Reciter {
  id: string;
  name: string;
  image: string;
  description?: string;
}

export const RECITERS: Reciter[] = [
  { 
    id: 'afs', 
    name: 'Sheikh Alafasy', 
    image: '/img/mishary.webp',
    description: 'Récitation claire et précise'
  },
  { 
    id: 'sds', 
    name: 'Saad Al-Ghamdi', 
    image: '/img/saad-al-ghamdi.jpg',
    description: 'Voix mélodieuse'
  },
  { 
    id: 'maher', 
    name: 'Maher Al-Muaiqly', 
    image: '/img/Maher.png',
    description: 'Style émouvant'
  },
  { 
    id: 'balilah', 
    name: 'Bandar Balilah', 
    image: '/img/bandar-balila.jpg',
    description: 'Récitation jeune et moderne'
  },
  { 
    id: 'aabd-lrhmn-lshh-t', 
    name: 'Abderrahman Al Shahat', 
    image: '/img/abderrahman-shahat.jpg',
    description: 'Voix profonde'
  },
  { 
    id: 'h_dukhain', 
    name: 'Haitham Dukhain', 
    image: '/img/haitham.webp',
    description: 'Style traditionnel'
  },
  { 
    id: 'islam', 
    name: 'Islam Sobhi', 
    image: '/img/islam.png',
    description: 'Récitation expressive'
  },
  { 
    id: 'soufi-1', 
    name: 'Abdul Rashid Ali Sufi', 
    image: '/img/abdul-rashid-ali-sufi.png',
    description: 'Style soufi'
  },
  { 
    id: 'jhn', 
    name: 'Jahan', 
    image: '/img/al.jpg',
    description: 'Voix unique'
  },
];

// Fonction utilitaire pour obtenir l'URL de récitation complète d'une sourate
export const getRecitationUrl = (reciterId: string, sourateId: number): string => {
  const paddedId = String(sourateId).padStart(3, '0');
  
  switch (reciterId) {
    case 'balilah':
      return `https://server6.mp3quran.net/balilah/${paddedId}.mp3`;
    case 'jhn':
      return `https://server13.mp3quran.net/jhn/${paddedId}.mp3`;
    case 'aabd-lrhmn-lshh-t':
      return `https://server16.mp3quran.net/a_alshahhat/Rewayat-Hafs-A-n-Assem/${paddedId}.mp3`;
    case 'afs':
      return `https://server8.mp3quran.net/afs/${paddedId}.mp3`;
    case 'maher':
      return `https://server12.mp3quran.net/maher/${paddedId}.mp3`;
    case 'h_dukhain':
      return `https://server16.mp3quran.net/h_dukhain/Rewayat-Hafs-A-n-Assem/${paddedId}.mp3`;
    case 'islam':
      return `https://server14.mp3quran.net/islam/Rewayat-Hafs-A-n-Assem/${paddedId}.mp3`;
    case 'soufi-1':
      return `https://server16.mp3quran.net/soufi/Rewayat-Khalaf-A-n-Hamzah/${paddedId}.mp3`;
    case 'sds':
      return `https://server11.mp3quran.net/sds/${paddedId}.mp3`;
    default:
      return `https://www.al-hamdoulillah.com/coran/mp3/files/${reciterId}/${paddedId}.mp3`;
  }
};

// Fonction utilitaire pour obtenir l'URL audio d'un verset spécifique
export const getVerseAudioUrl = (reciterId: string, sourateId: number, verseNumber: number): string => {
  const paddedSurah = String(sourateId).padStart(3, '0');
  const paddedVerse = String(verseNumber).padStart(3, '0');
  
  // Utilisation de l'API EveryAyah.com qui fournit des fichiers audio par verset
  switch (reciterId) {
    case 'afs': // Mishary Alafasy
      return `https://everyayah.com/data/Alafasy_128kbps/${paddedSurah}${paddedVerse}.mp3`;
    case 'sds': // Saad Al-Ghamdi
      return `https://everyayah.com/data/Ghamadi_40kbps/${paddedSurah}${paddedVerse}.mp3`;
    case 'maher': // Maher Al-Muaiqly
      return `https://everyayah.com/data/MaherAlMuaiqly128kbps/${paddedSurah}${paddedVerse}.mp3`;
    case 'h_dukhain': // Haitham Dukhain
      return `https://everyayah.com/data/Haitham_Dakhain_128kbps/${paddedSurah}${paddedVerse}.mp3`;
    default:
      // Fallback vers Alafasy pour les récitateurs non supportés
      return `https://everyayah.com/data/Alafasy_128kbps/${paddedSurah}${paddedVerse}.mp3`;
  }
};

interface ReciterSelectorProps {
  selectedReciter: string;
  onChange: (id: string) => void;
  showImages?: boolean;
  compact?: boolean;
}

const ReciterSelector: React.FC<ReciterSelectorProps> = ({ 
  selectedReciter, 
  onChange, 
  showImages = false, 
  compact = false 
}) => {
  const selectedReciterData = RECITERS.find(r => r.id === selectedReciter) || RECITERS[0];

  if (compact) {
    return (
      <div className="relative">
        <select
          value={selectedReciter}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-2 pr-8 rounded-lg bg-white/10 border border-white/20 text-white appearance-none cursor-pointer hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
        >
          {RECITERS.map((reciter) => (
            <option key={reciter.id} value={reciter.id} className="bg-gray-800 text-white">
              {reciter.name}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-gray-300 flex items-center space-x-2">
        <User size={16} />
        <span>Récitateur</span>
      </h4>
      
      {showImages ? (
        <div className="grid grid-cols-3 gap-2">
          {RECITERS.slice(0, 6).map((reciter) => (
            <button
              key={reciter.id}
              onClick={() => onChange(reciter.id)}
              className={`p-3 rounded-lg border transition-all text-center ${
                selectedReciter === reciter.id
                  ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/20 shadow-lg'
                  : 'border-white/10 bg-white/5 hover:bg-white/10'
              }`}
            >
              <div className="w-12 h-12 mx-auto mb-2 rounded-full overflow-hidden bg-gray-700">
                <img 
                  src={reciter.image} 
                  alt={reciter.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              </div>
              <span className="text-xs font-medium text-white block truncate">
                {reciter.name}
              </span>
            </button>
          ))}
        </div>
      ) : (
        <div className="relative">
          <select
            value={selectedReciter}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-4 py-3 pr-10 rounded-lg bg-white/10 border border-white/20 text-white appearance-none cursor-pointer hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
          >
            {RECITERS.map((reciter) => (
              <option key={reciter.id} value={reciter.id} className="bg-gray-800 text-white">
                {reciter.name}
                {reciter.description && ` - ${reciter.description}`}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
        </div>
      )}
      
      {/* Informations sur le récitateur sélectionné */}
      <div className="flex items-center space-x-3 p-3 rounded-lg bg-white/5 border border-white/10">
        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-700 flex-shrink-0">
          <img 
            src={selectedReciterData.image} 
            alt={selectedReciterData.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white font-medium truncate">{selectedReciterData.name}</p>
          {selectedReciterData.description && (
            <p className="text-gray-400 text-sm truncate">{selectedReciterData.description}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReciterSelector;