import React from "react";

interface Sourate {
  name: string;
  number: number;
}

const sourates: Sourate[] = [
  { name: "Al-Fatiha", number: 1 },
  { name: "Al-Baqarah", number: 2 },
  { name: "Aal-E-Imran", number: 3 },
  { name: "An-Nisa", number: 4 },
  { name: "Al-Ma'idah", number: 5 },
  { name: "Al-An'am", number: 6 },
  { name: "Al-A'raf", number: 7 },
  { name: "Al-Anfal", number: 8 },
  { name: "At-Tawbah", number: 9 },
  { name: "Yunus", number: 10 },
  { name: "Hud", number: 11 },
  { name: "Yusuf", number: 12 },
  { name: "Ar-Ra'd", number: 13 },
  { name: "Ibrahim", number: 14 },
  { name: "Al-Hijr", number: 15 },
  { name: "An-Nahl", number: 16 },
  { name: "Al-Isra", number: 17 },
  { name: "Al-Kahf", number: 18 },
  { name: "Maryam", number: 19 },
  { name: "Ta-Ha", number: 20 },
  { name: "Al-Anbiya", number: 21 },
  { name: "Al-Hajj", number: 22 },
  { name: "Al-Mu'minun", number: 23 },
  { name: "An-Nur", number: 24 },
  { name: "Al-Furqan", number: 25 },
  { name: "Ash-Shu'ara", number: 26 },
  { name: "An-Naml", number: 27 },
  { name: "Al-Qasas", number: 28 },
  { name: "Al-Ankabut", number: 29 },
  { name: "Ar-Rum", number: 30 },
  { name: "Luqman", number: 31 },
  { name: "As-Sajda", number: 32 },
  { name: "Al-Ahzab", number: 33 },
  { name: "Saba", number: 34 },
  { name: "Fatir", number: 35 },
  { name: "Ya-Sin", number: 36 },
  { name: "As-Saffat", number: 37 },
  { name: "Sad", number: 38 },
  { name: "Az-Zumar", number: 39 },
  { name: "Ghafir", number: 40 },
  { name: "Fussilat", number: 41 },
  { name: "Ash-Shura", number: 42 },
  { name: "Az-Zukhruf", number: 43 },
  { name: "Ad-Dukhan", number: 44 },
  { name: "Al-Jathiya", number: 45 },
  { name: "Al-Ahqaf", number: 46 },
  { name: "Muhammad", number: 47 },
  { name: "Al-Fath", number: 48 },
  { name: "Al-Hujurat", number: 49 },
  { name: "Qaf", number: 50 },
  { name: "Adh-Dhariyat", number: 51 },
  { name: "At-Tur", number: 52 },
  { name: "An-Najm", number: 53 },
  { name: "Al-Qamar", number: 54 },
  { name: "Ar-Rahman", number: 55 },
  { name: "Al-Waqi'a", number: 56 },
  { name: "Al-Hadid", number: 57 },
  { name: "Al-Mujadila", number: 58 },
  // ... compléter la liste si besoin
];

const SouratesList: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {sourates.map((sourate) => (
        <div key={sourate.number} className="bg-white rounded-lg shadow p-4 flex items-center justify-between">
          <span className="font-semibold text-lg text-gray-800">{sourate.name}</span>
          <span className="text-gray-400">{sourate.number}</span>
        </div>
      ))}
    </div>
  );
};

export default SouratesList;
