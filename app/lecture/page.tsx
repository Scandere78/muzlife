"use client";

import Link from "next/link";
import ReadingTracker from "../../components/ReadingTracker";


interface Sourate {
  position: number;
  nom: string;
  nom_phonetique: string;
  englishNameTranslation: string;
}

export default function Lecture() {
  // Liste des sourates (exemple simplifié)
  const sourates: Sourate[] = [
    { position: 1, nom: "سورة الفاتحة", nom_phonetique: "Al-Faatiha", englishNameTranslation: "The Opening" },
    { position: 2, nom: "سورة البقرة", nom_phonetique: "Al-Baqara", englishNameTranslation: "The Cow" },
    { position: 3, nom: "سورة آل عمران", nom_phonetique: "Al-Imran", englishNameTranslation: "The Family of Imran" },
    { position: 4, nom: "سورة النساء", nom_phonetique: "An-Nisa", englishNameTranslation: "The Women" },
    { position: 5, nom: "سورة المائدة", nom_phonetique: "Al-Ma'idah", englishNameTranslation: "The Table Spread" },
    { position: 6, nom: "سورة الأنعام", nom_phonetique: "Al-An'am", englishNameTranslation: "The Cattle" },
    { position: 7, nom: "سورة الأعراف", nom_phonetique: "Al-A'raf", englishNameTranslation: "The Heights" },
    { position: 8, nom: "سورة الأنفال", nom_phonetique: "Al-Anfal", englishNameTranslation: "The Spoils of War" },
    { position: 9, nom: "سورة التوبة", nom_phonetique: "At-Tawbah", englishNameTranslation: "The Repentance" },
    { position: 10, nom: "سورة يونس", nom_phonetique: "Yunus", englishNameTranslation: "Jonah" },
    { position: 11, nom: "سورة هود", nom_phonetique: "Hud", englishNameTranslation: "Hud" },
    { position: 12, nom: "سورة يوسف", nom_phonetique: "Yusuf", englishNameTranslation: "Joseph" },
    { position: 13, nom: "سورة الرعد", nom_phonetique: "Ar-Ra’d", englishNameTranslation: "The Thunder" },
    { position: 14, nom: "سورة إبراهيم", nom_phonetique: "Ibrahim", englishNameTranslation: "Abraham" },
    { position: 15, nom: "سورة الحجر", nom_phonetique: "Al-Hijr", englishNameTranslation: "The Rocky Tract" },
    { position: 16, nom: "سورة النحل", nom_phonetique: "An-Nahl", englishNameTranslation: "The Bee" },
    { position: 17, nom: "سورة الإسراء", nom_phonetique: "Al-Isra", englishNameTranslation: "The Night Journey" },
    { position: 18, nom: "سورة الكهف", nom_phonetique: "Al-Kahf", englishNameTranslation: "The Cave" },
    { position: 19, nom: "سورة مريم", nom_phonetique: "Maryam", englishNameTranslation: "Mary" },
    { position: 20, nom: "سورة طه", nom_phonetique: "Taha", englishNameTranslation: "Ta-Ha" },
    { position: 21, nom: "سورة الأنبياء", nom_phonetique: "Al-Anbiya", englishNameTranslation: "The Prophets" },
    { position: 22, nom: "سورة الحج", nom_phonetique: "Al-Hajj", englishNameTranslation: "The Pilgrimage" },
    { position: 23, nom: "سورة المؤمنون", nom_phonetique: "Al-Mu’minun", englishNameTranslation: "The Believers" },
    { position: 24, nom: "سورة النور", nom_phonetique: "An-Nur", englishNameTranslation: "The Light" },
    { position: 25, nom: "سورة الفرقان", nom_phonetique: "Al-Furqan", englishNameTranslation: "The Criterion" },
    { position: 26, nom: "سورة الشعراء", nom_phonetique: "Ash-Shu’ara", englishNameTranslation: "The Poets" },
    { position: 27, nom: "سورة النمل", nom_phonetique: "An-Naml", englishNameTranslation: "The Ant" },
    { position: 28, nom: "سورة القصص", nom_phonetique: "Al-Qasas", englishNameTranslation: "The Stories" },
    { position: 29, nom: "سورة العنكبوت", nom_phonetique: "Al-Ankabut", englishNameTranslation: "The Spider" },
    { position: 30, nom: "سورة الروم", nom_phonetique: "Ar-Rum", englishNameTranslation: "The Romans" },
    { position: 31, nom: "سورة لقمان", nom_phonetique: "Luqman", englishNameTranslation: "Luqman" },
    // ... (ajoute les autres sourates ici ou importe-les d'une source externe)
  ];

  return (
    <div className="page-container navbar-safe px-6">
      <h1 className="text-3xl font-bold text-green-500 text-center">Liste des Sourates</h1>
      <div className="mt-6">
        <ul>
          {sourates.map((sourate) => (
            <li
              key={sourate.position}
              className="mb-4 p-4 bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <Link href={`/lecture/${sourate.position}`}>
                <div className="cursor-pointer">
                  <h2 className="text-xl font-bold text-green-400">
                    <span className="text-green-300 text-lg">{sourate.position}. </span>
                    {sourate.nom}
                  </h2>
                  <p className="text-lg text-gray-300">{sourate.nom_phonetique}</p>
                  <span className="text-green-500 hover:text-green-300 transition-all duration-300 inline-block mt-2">
                    Voir les détails
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      {/* Reading Tracker pour la page générale */}
      <ReadingTracker
        surahNumber={1}
        surahName="Liste des Sourates"
        onVerseRead={(verse: number) => console.log(`Verset ${verse} lu`)}
      />
    </div>
  );
}
