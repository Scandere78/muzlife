import React from 'react';

export interface Reciter {
  id: string;
  name: string;
  image: string;
}

export const RECITERS: Reciter[] = [
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

interface ReciterSelectorProps {
  selectedReciter: string;
  onChange: (id: string) => void;
}

const ReciterSelector: React.FC<ReciterSelectorProps> = ({ selectedReciter, onChange }) => {
  return (
    <div className="mb-4 flex items-center gap-2">
        <label htmlFor="reciter-select" className="font-medium  bg-gold-500 rounded-full text-[var(--color-foreground)] px-4 py-2">Choix du récitant :</label>
      <select
        id="reciter-select" 
        value={selectedReciter}
        onChange={e => onChange(e.target.value)}
        className="px-3 py-2 rounded border border-[var(--color-foreground)] focus:outline-none focus:ring text-[var(--color-foreground)]"
      >
        {RECITERS.map(reciter => (
          <option key={reciter.id} value={reciter.id}>{reciter.name}</option>
        ))}
      </select>
    </div>
  );
};

export default ReciterSelector;
