// Métadonnées des sourates du Coran (114 sourates)
// Source: Coran original avec traductions en français

export type SurahInfo = {
  number: number;
  arabicName: string;
  frenchName: string;
  englishName: string;
  verseCount: number;
  revelation: 'meccan' | 'medinan';
  order: number;
};

export const SURAH_DATA: SurahInfo[] = [
  { number: 1, arabicName: 'الفاتحة', frenchName: 'L\'Ouverture', englishName: 'Al-Fatiha', verseCount: 7, revelation: 'meccan', order: 5 },
  { number: 2, arabicName: 'البقرة', frenchName: 'La Vache', englishName: 'Al-Baqarah', verseCount: 286, revelation: 'medinan', order: 87 },
  { number: 3, arabicName: 'آل عمران', frenchName: 'La Famille d\'Imran', englishName: 'Aal-E-Imran', verseCount: 200, revelation: 'medinan', order: 89 },
  { number: 4, arabicName: 'النساء', frenchName: 'Les Femmes', englishName: 'An-Nisa', verseCount: 176, revelation: 'medinan', order: 92 },
  { number: 5, arabicName: 'المائدة', frenchName: 'La Table', englishName: 'Al-Maidah', verseCount: 120, revelation: 'medinan', order: 112 },
  { number: 6, arabicName: 'الأنعام', frenchName: 'Les Bestiaux', englishName: 'Al-Anam', verseCount: 165, revelation: 'meccan', order: 55 },
  { number: 7, arabicName: 'الأعراف', frenchName: 'Les Murailles', englishName: 'Al-Araf', verseCount: 206, revelation: 'meccan', order: 39 },
  { number: 8, arabicName: 'الأنفال', frenchName: 'Le Butin', englishName: 'Al-Anfal', verseCount: 75, revelation: 'medinan', order: 88 },
  { number: 9, arabicName: 'التوبة', frenchName: 'Le Repentir', englishName: 'At-Tawbah', verseCount: 129, revelation: 'medinan', order: 113 },
  { number: 10, arabicName: 'يونس', frenchName: 'Jonas', englishName: 'Yunus', verseCount: 109, revelation: 'meccan', order: 51 },
  { number: 11, arabicName: 'هود', frenchName: 'Houd', englishName: 'Hud', verseCount: 123, revelation: 'meccan', order: 52 },
  { number: 12, arabicName: 'يوسف', frenchName: 'Joseph', englishName: 'Yusuf', verseCount: 111, revelation: 'meccan', order: 53 },
  { number: 13, arabicName: 'الرعد', frenchName: 'Le Tonnerre', englishName: 'Ar-Rad', verseCount: 43, revelation: 'medinan', order: 96 },
  { number: 14, arabicName: 'إبراهيم', frenchName: 'Abraham', englishName: 'Ibrahim', verseCount: 52, revelation: 'meccan', order: 72 },
  { number: 15, arabicName: 'الحجر', frenchName: 'Al-Hijr', englishName: 'Al-Hijr', verseCount: 99, revelation: 'meccan', order: 54 },
  { number: 16, arabicName: 'النحل', frenchName: 'Les Abeilles', englishName: 'An-Nahl', verseCount: 128, revelation: 'meccan', order: 70 },
  { number: 17, arabicName: 'الإسراء', frenchName: 'Le Voyage Nocturne', englishName: 'Al-Isra', verseCount: 111, revelation: 'meccan', order: 50 },
  { number: 18, arabicName: 'الكهف', frenchName: 'La Caverne', englishName: 'Al-Kahf', verseCount: 110, revelation: 'meccan', order: 69 },
  { number: 19, arabicName: 'مريم', frenchName: 'Marie', englishName: 'Maryam', verseCount: 98, revelation: 'meccan', order: 44 },
  { number: 20, arabicName: 'طه', frenchName: 'Ta-Ha', englishName: 'Taha', verseCount: 135, revelation: 'meccan', order: 45 },
  { number: 21, arabicName: 'الأنبياء', frenchName: 'Les Prophètes', englishName: 'Al-Anbya', verseCount: 112, revelation: 'meccan', order: 73 },
  { number: 22, arabicName: 'الحج', frenchName: 'Le Pèlerinage', englishName: 'Al-Hajj', verseCount: 78, revelation: 'medinan', order: 103 },
  { number: 23, arabicName: 'المؤمنون', frenchName: 'Les Croyants', englishName: 'Al-Muminun', verseCount: 118, revelation: 'meccan', order: 74 },
  { number: 24, arabicName: 'النور', frenchName: 'La Lumière', englishName: 'An-Nur', verseCount: 64, revelation: 'medinan', order: 102 },
  { number: 25, arabicName: 'الفرقان', frenchName: 'Le Discernement', englishName: 'Al-Furqan', verseCount: 77, revelation: 'meccan', order: 42 },
  { number: 26, arabicName: 'الشعراء', frenchName: 'Les Poètes', englishName: 'Ash-Shuara', verseCount: 227, revelation: 'meccan', order: 47 },
  { number: 27, arabicName: 'النمل', frenchName: 'Les Fourmis', englishName: 'An-Naml', verseCount: 93, revelation: 'meccan', order: 48 },
  { number: 28, arabicName: 'القصص', frenchName: 'Le Récit', englishName: 'Al-Qasas', verseCount: 88, revelation: 'meccan', order: 49 },
  { number: 29, arabicName: 'العنكبوت', frenchName: 'L\'Araignée', englishName: 'Al-Ankabut', verseCount: 69, revelation: 'meccan', order: 85 },
  { number: 30, arabicName: 'الروم', frenchName: 'Les Romains', englishName: 'Ar-Rum', verseCount: 60, revelation: 'meccan', order: 84 },
  { number: 31, arabicName: 'لقمان', frenchName: 'Luqman', englishName: 'Luqman', verseCount: 34, revelation: 'meccan', order: 57 },
  { number: 32, arabicName: 'السجدة', frenchName: 'La Prosternation', englishName: 'As-Sajdah', verseCount: 30, revelation: 'meccan', order: 75 },
  { number: 33, arabicName: 'الأحزاب', frenchName: 'Les Coalisés', englishName: 'Al-Ahzab', verseCount: 73, revelation: 'medinan', order: 90 },
  { number: 34, arabicName: 'سبأ', frenchName: 'Saba', englishName: 'Saba', verseCount: 54, revelation: 'meccan', order: 58 },
  { number: 35, arabicName: 'فاطر', frenchName: 'Le Créateur', englishName: 'Fatir', verseCount: 45, revelation: 'meccan', order: 43 },
  { number: 36, arabicName: 'يس', frenchName: 'Ya-Sin', englishName: 'Ya-Sin', verseCount: 83, revelation: 'meccan', order: 41 },
  { number: 37, arabicName: 'الصافات', frenchName: 'Les Rangés', englishName: 'As-Saffat', verseCount: 182, revelation: 'meccan', order: 56 },
  { number: 38, arabicName: 'ص', frenchName: 'Sad', englishName: 'Sad', verseCount: 88, revelation: 'meccan', order: 38 },
  { number: 39, arabicName: 'الزمر', frenchName: 'Les Groupes', englishName: 'Az-Zumar', verseCount: 75, revelation: 'meccan', order: 59 },
  { number: 40, arabicName: 'غافر', frenchName: 'Le Pardonneur', englishName: 'Ghafir', verseCount: 85, revelation: 'meccan', order: 60 },
  { number: 41, arabicName: 'فصلت', frenchName: 'Les Versets Détaillés', englishName: 'Fussilat', verseCount: 54, revelation: 'meccan', order: 61 },
  { number: 42, arabicName: 'الشورى', frenchName: 'La Consultation', englishName: 'Ash-Shuraa', verseCount: 53, revelation: 'meccan', order: 62 },
  { number: 43, arabicName: 'الزخرف', frenchName: 'L\'Ornement', englishName: 'Az-Zukhruf', verseCount: 89, revelation: 'meccan', order: 63 },
  { number: 44, arabicName: 'الدخان', frenchName: 'La Fumée', englishName: 'Ad-Dukhan', verseCount: 59, revelation: 'meccan', order: 64 },
  { number: 45, arabicName: 'الجاثية', frenchName: 'L\'Agenouillée', englishName: 'Al-Jathiyah', verseCount: 37, revelation: 'meccan', order: 65 },
  { number: 46, arabicName: 'الأحقاف', frenchName: 'Al-Ahqaf', englishName: 'Al-Ahqaf', verseCount: 35, revelation: 'meccan', order: 66 },
  { number: 47, arabicName: 'محمد', frenchName: 'Mohammed', englishName: 'Muhammad', verseCount: 38, revelation: 'medinan', order: 95 },
  { number: 48, arabicName: 'الفتح', frenchName: 'La Victoire', englishName: 'Al-Fath', verseCount: 29, revelation: 'medinan', order: 111 },
  { number: 49, arabicName: 'الحجرات', frenchName: 'Les Appartements', englishName: 'Al-Hujurat', verseCount: 18, revelation: 'medinan', order: 106 },
  { number: 50, arabicName: 'ق', frenchName: 'Qaf', englishName: 'Qaf', verseCount: 45, revelation: 'meccan', order: 34 },
  { number: 51, arabicName: 'الذاريات', frenchName: 'Qui Éparpillent', englishName: 'Adh-Dhariyat', verseCount: 60, revelation: 'meccan', order: 67 },
  { number: 52, arabicName: 'الطور', frenchName: 'At-Tur', englishName: 'At-Tur', verseCount: 49, revelation: 'meccan', order: 76 },
  { number: 53, arabicName: 'النجم', frenchName: 'L\'Étoile', englishName: 'An-Najm', verseCount: 62, revelation: 'meccan', order: 23 },
  { number: 54, arabicName: 'القمر', frenchName: 'La Lune', englishName: 'Al-Qamar', verseCount: 55, revelation: 'meccan', order: 37 },
  { number: 55, arabicName: 'الرحمن', frenchName: 'Le Tout Miséricordieux', englishName: 'Ar-Rahman', verseCount: 78, revelation: 'medinan', order: 97 },
  { number: 56, arabicName: 'الواقعة', frenchName: 'L\'Événement', englishName: 'Al-Waqiah', verseCount: 96, revelation: 'meccan', order: 46 },
  { number: 57, arabicName: 'الحديد', frenchName: 'Le Fer', englishName: 'Al-Hadid', verseCount: 29, revelation: 'medinan', order: 94 },
  { number: 58, arabicName: 'المجادلة', frenchName: 'La Discussion', englishName: 'Al-Mujadila', verseCount: 22, revelation: 'medinan', order: 105 },
  { number: 59, arabicName: 'الحشر', frenchName: 'L\'Exode', englishName: 'Al-Hashr', verseCount: 24, revelation: 'medinan', order: 101 },
  { number: 60, arabicName: 'الممتحنة', frenchName: 'L\'Éprouvée', englishName: 'Al-Mumtahanah', verseCount: 13, revelation: 'medinan', order: 91 },
  { number: 61, arabicName: 'الصف', frenchName: 'Le Rang', englishName: 'As-Saff', verseCount: 14, revelation: 'medinan', order: 109 },
  { number: 62, arabicName: 'الجمعة', frenchName: 'Le Vendredi', englishName: 'Al-Jumua', verseCount: 11, revelation: 'medinan', order: 110 },
  { number: 63, arabicName: 'المنافقون', frenchName: 'Les Hypocrites', englishName: 'Al-Munafiqun', verseCount: 11, revelation: 'medinan', order: 104 },
  { number: 64, arabicName: 'التغابن', frenchName: 'La Révélation Réciproque', englishName: 'At-Taghabun', verseCount: 18, revelation: 'medinan', order: 108 },
  { number: 65, arabicName: 'الطلاق', frenchName: 'Le Divorce', englishName: 'At-Talaq', verseCount: 12, revelation: 'medinan', order: 99 },
  { number: 66, arabicName: 'التحريم', frenchName: 'L\'Interdiction', englishName: 'At-Tahrim', verseCount: 12, revelation: 'medinan', order: 107 },
  { number: 67, arabicName: 'الملك', frenchName: 'La Royauté', englishName: 'Al-Mulk', verseCount: 30, revelation: 'meccan', order: 77 },
  { number: 68, arabicName: 'القلم', frenchName: 'La Plume', englishName: 'Al-Qalam', verseCount: 52, revelation: 'meccan', order: 2 },
  { number: 69, arabicName: 'الحاقة', frenchName: 'Celle qui Montre la Vérité', englishName: 'Al-Haqqah', verseCount: 52, revelation: 'meccan', order: 78 },
  { number: 70, arabicName: 'المعارج', frenchName: 'Les Voies d\'Ascension', englishName: 'Al-Maarij', verseCount: 44, revelation: 'meccan', order: 79 },
  { number: 71, arabicName: 'نوح', frenchName: 'Noé', englishName: 'Nuh', verseCount: 28, revelation: 'meccan', order: 71 },
  { number: 72, arabicName: 'الجن', frenchName: 'Les Djinns', englishName: 'Al-Jinn', verseCount: 28, revelation: 'meccan', order: 40 },
  { number: 73, arabicName: 'المزمل', frenchName: 'L\'Enveloppé', englishName: 'Al-Muzzammil', verseCount: 20, revelation: 'meccan', order: 3 },
  { number: 74, arabicName: 'المدثر', frenchName: 'Le Revêtu d\'un Manteau', englishName: 'Al-Muddathir', verseCount: 56, revelation: 'meccan', order: 4 },
  { number: 75, arabicName: 'القيامة', frenchName: 'La Résurrection', englishName: 'Al-Qiyamah', verseCount: 40, revelation: 'meccan', order: 31 },
  { number: 76, arabicName: 'الإنسان', frenchName: 'L\'Homme', englishName: 'Al-Insan', verseCount: 31, revelation: 'medinan', order: 98 },
  { number: 77, arabicName: 'المرسلات', frenchName: 'Les Envoyés', englishName: 'Al-Mursalat', verseCount: 50, revelation: 'meccan', order: 33 },
  { number: 78, arabicName: 'النبأ', frenchName: 'La Nouvelle', englishName: 'An-Naba', verseCount: 40, revelation: 'meccan', order: 80 },
  { number: 79, arabicName: 'النازعات', frenchName: 'Les Anges qui Arrachent les Âmes', englishName: 'An-Naziat', verseCount: 46, revelation: 'meccan', order: 81 },
  { number: 80, arabicName: 'عبس', frenchName: 'Il s\'est Renfrogné', englishName: 'Abasa', verseCount: 42, revelation: 'meccan', order: 24 },
  { number: 81, arabicName: 'التكوير', frenchName: 'L\'Obscurcissement', englishName: 'At-Takwir', verseCount: 29, revelation: 'meccan', order: 7 },
  { number: 82, arabicName: 'الانفطار', frenchName: 'La Rupture', englishName: 'Al-Infitar', verseCount: 19, revelation: 'meccan', order: 82 },
  { number: 83, arabicName: 'المطففين', frenchName: 'Les Fraudeurs', englishName: 'Al-Mutaffifin', verseCount: 36, revelation: 'meccan', order: 86 },
  { number: 84, arabicName: 'الانشقاق', frenchName: 'La Déchirure', englishName: 'Al-Inshiqaq', verseCount: 25, revelation: 'meccan', order: 83 },
  { number: 85, arabicName: 'البروج', frenchName: 'Les Constellations', englishName: 'Al-Buruj', verseCount: 22, revelation: 'meccan', order: 27 },
  { number: 86, arabicName: 'الطارق', frenchName: 'L\'Astre Nocturne', englishName: 'At-Tariq', verseCount: 17, revelation: 'meccan', order: 36 },
  { number: 87, arabicName: 'الأعلى', frenchName: 'Le Très-Haut', englishName: 'Al-Ala', verseCount: 19, revelation: 'meccan', order: 8 },
  { number: 88, arabicName: 'الغاشية', frenchName: 'L\'Enveloppante', englishName: 'Al-Ghashiyah', verseCount: 26, revelation: 'meccan', order: 68 },
  { number: 89, arabicName: 'الفجر', frenchName: 'L\'Aube', englishName: 'Al-Fajr', verseCount: 30, revelation: 'meccan', order: 10 },
  { number: 90, arabicName: 'البلد', frenchName: 'La Cité', englishName: 'Al-Balad', verseCount: 20, revelation: 'meccan', order: 35 },
  { number: 91, arabicName: 'الشمس', frenchName: 'Le Soleil', englishName: 'Ash-Shams', verseCount: 15, revelation: 'meccan', order: 26 },
  { number: 92, arabicName: 'الليل', frenchName: 'La Nuit', englishName: 'Al-Layl', verseCount: 21, revelation: 'meccan', order: 9 },
  { number: 93, arabicName: 'الضحى', frenchName: 'Le Jour Montant', englishName: 'Ad-Duhaa', verseCount: 11, revelation: 'meccan', order: 11 },
  { number: 94, arabicName: 'الشرح', frenchName: 'L\'Ouverture', englishName: 'Ash-Sharh', verseCount: 8, revelation: 'meccan', order: 12 },
  { number: 95, arabicName: 'التين', frenchName: 'Le Figuier', englishName: 'At-Tin', verseCount: 8, revelation: 'meccan', order: 28 },
  { number: 96, arabicName: 'العلق', frenchName: 'L\'Adhérence', englishName: 'Al-Alaq', verseCount: 19, revelation: 'meccan', order: 1 },
  { number: 97, arabicName: 'القدر', frenchName: 'La Destinée', englishName: 'Al-Qadr', verseCount: 5, revelation: 'meccan', order: 25 },
  { number: 98, arabicName: 'البينة', frenchName: 'La Preuve', englishName: 'Al-Bayyinah', verseCount: 8, revelation: 'medinan', order: 100 },
  { number: 99, arabicName: 'الزلزلة', frenchName: 'La Secousse', englishName: 'Az-Zalzalah', verseCount: 8, revelation: 'medinan', order: 93 },
  { number: 100, arabicName: 'العاديات', frenchName: 'Les Coursiers', englishName: 'Al-Adiyat', verseCount: 11, revelation: 'meccan', order: 14 },
  { number: 101, arabicName: 'القارعة', frenchName: 'Le Fracas', englishName: 'Al-Qariah', verseCount: 11, revelation: 'meccan', order: 30 },
  { number: 102, arabicName: 'التكاثر', frenchName: 'La Course aux Richesses', englishName: 'At-Takathur', verseCount: 8, revelation: 'meccan', order: 16 },
  { number: 103, arabicName: 'العصر', frenchName: 'Le Temps', englishName: 'Al-Asr', verseCount: 3, revelation: 'meccan', order: 13 },
  { number: 104, arabicName: 'الهمزة', frenchName: 'Les Calomniateurs', englishName: 'Al-Humazah', verseCount: 9, revelation: 'meccan', order: 32 },
  { number: 105, arabicName: 'الفيل', frenchName: 'L\'Éléphant', englishName: 'Al-Fil', verseCount: 5, revelation: 'meccan', order: 19 },
  { number: 106, arabicName: 'قريش', frenchName: 'Quraych', englishName: 'Quraysh', verseCount: 4, revelation: 'meccan', order: 29 },
  { number: 107, arabicName: 'الماعون', frenchName: 'L\'Ustensile', englishName: 'Al-Maun', verseCount: 7, revelation: 'meccan', order: 17 },
  { number: 108, arabicName: 'الكوثر', frenchName: 'L\'Abondance', englishName: 'Al-Kawthar', verseCount: 3, revelation: 'meccan', order: 15 },
  { number: 109, arabicName: 'الكافرون', frenchName: 'Les Infidèles', englishName: 'Al-Kafirun', verseCount: 6, revelation: 'meccan', order: 18 },
  { number: 110, arabicName: 'النصر', frenchName: 'Les Secours', englishName: 'An-Nasr', verseCount: 3, revelation: 'medinan', order: 114 },
  { number: 111, arabicName: 'المسد', frenchName: 'Les Fibres', englishName: 'Al-Masad', verseCount: 5, revelation: 'meccan', order: 6 },
  { number: 112, arabicName: 'الإخلاص', frenchName: 'Le Monothéisme Pur', englishName: 'Al-Ikhlas', verseCount: 4, revelation: 'meccan', order: 22 },
  { number: 113, arabicName: 'الفلق', frenchName: 'L\'Aube Naissante', englishName: 'Al-Falaq', verseCount: 5, revelation: 'meccan', order: 20 },
  { number: 114, arabicName: 'الناس', frenchName: 'Les Hommes', englishName: 'An-Nas', verseCount: 6, revelation: 'meccan', order: 21 },
];

// Fonction utilitaire pour obtenir les informations d'une sourate
export function getSurahInfo(surahNumber: number): SurahInfo | null {
  if (surahNumber < 1 || surahNumber > 114) return null;
  return SURAH_DATA[surahNumber - 1];
}

// Fonction pour filtrer les sourates
export function filterSurahs(query: string): SurahInfo[] {
  if (!query.trim()) return SURAH_DATA;
  
  const searchTerm = query.toLowerCase();
  return SURAH_DATA.filter(surah => 
    surah.frenchName.toLowerCase().includes(searchTerm) ||
    surah.englishName.toLowerCase().includes(searchTerm) ||
    surah.arabicName.includes(searchTerm) ||
    surah.number.toString().includes(searchTerm)
  );
}

// Fonction pour trier les sourates
export type SurahSortBy = 'number' | 'name' | 'revelation' | 'verseCount';

export function sortSurahs(surahs: SurahInfo[], sortBy: SurahSortBy): SurahInfo[] {
  return [...surahs].sort((a, b) => {
    switch (sortBy) {
      case 'number':
        return a.number - b.number;
      case 'name':
        return a.frenchName.localeCompare(b.frenchName, 'fr');
      case 'revelation':
        return a.revelation.localeCompare(b.revelation);
      case 'verseCount':
        return b.verseCount - a.verseCount; // Décroissant
      default:
        return a.number - b.number;
    }
  });
}