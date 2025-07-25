export const sourates = [
  { number: 1, slug: "al-faatiha", nom_phonetique: "Al-Faatiha" },
  { number: 2, slug: "al-baqara", nom_phonetique: "Al-Baqara" },
  { number: 3, slug: "al-imran", nom_phonetique: "Al-Imran" },
  { number: 4, slug: "an-nisa", nom_phonetique: "An-Nisa" },
  { number: 5, slug: "al-ma-idah", nom_phonetique: "Al-Ma'idah" },
  { number: 6, slug: "al-an-am", nom_phonetique: "Al-An'am" },
  { number: 7, slug: "al-a-raf", nom_phonetique: "Al-A'raf" },
  { number: 8, slug: "al-anfal", nom_phonetique: "Al-Anfal" },
  { number: 9, slug: "at-tawbah", nom_phonetique: "At-Tawbah" },
  { number: 10, slug: "yunus", nom_phonetique: "Yunus" },
  { number: 11, slug: "hud", nom_phonetique: "Hud" },
  { number: 12, slug: "yusuf", nom_phonetique: "Yusuf" },
  { number: 13, slug: "ar-ra-d", nom_phonetique: "Ar-Ra’d" },
  { number: 14, slug: "ibrahim", nom_phonetique: "Ibrahim" },
  { number: 15, slug: "al-hijr", nom_phonetique: "Al-Hijr" },
  { number: 16, slug: "an-nahl", nom_phonetique: "An-Nahl" },
  { number: 17, slug: "al-isra", nom_phonetique: "Al-Isra" },
  { number: 18, slug: "al-kahf", nom_phonetique: "Al-Kahf" },
  { number: 19, slug: "maryam", nom_phonetique: "Maryam" },
  { number: 20, slug: "taha", nom_phonetique: "Taha" },
  { number: 21, slug: "al-anbiya", nom_phonetique: "Al-Anbiya" },
  { number: 22, slug: "al-hajj", nom_phonetique: "Al-Hajj" },
  { number: 23, slug: "al-mu-minun", nom_phonetique: "Al-Mu’minun" },
  { number: 24, slug: "an-nur", nom_phonetique: "An-Nur" },
  { number: 25, slug: "al-furqan", nom_phonetique: "Al-Furqan" },
  { number: 26, slug: "ash-shu-ara", nom_phonetique: "Ash-Shu’ara" },
  { number: 27, slug: "an-naml", nom_phonetique: "An-Naml" },
  { number: 28, slug: "al-qasas", nom_phonetique: "Al-Qasas" },
  { number: 29, slug: "al-ankabut", nom_phonetique: "Al-Ankabut" },
  { number: 30, slug: "ar-rum", nom_phonetique: "Ar-Rum" },
  { number: 31, slug: "luqman", nom_phonetique: "Luqman" },
  { number: 32, slug: "al-sajdah", nom_phonetique: "Al-Sajdah" },
  { number: 33, slug: "al-ahzab", nom_phonetique: "Al-Ahzab" },
  { number: 34, slug: "saba", nom_phonetique: "Saba" },
  { number: 35, slug: "fatir", nom_phonetique: "Fatir" },
  { number: 36, slug: "yasin", nom_phonetique: "Yasin" },
  { number: 37, slug: "as-saf", nom_phonetique: "As-Saf" },
  { number: 38, slug: "al-humazah", nom_phonetique: "Al-Humazah" },
  { number: 39, slug: "al-fil", nom_phonetique: "Al-Fil" },
  { number: 40, slug: "quraysh", nom_phonetique: "Quraysh" },
  { number: 41, slug: "al-ma-un", nom_phonetique: "Al-Ma’un" },
  { number: 42, slug: "al-kauthar", nom_phonetique: "Al-Kauthar" },
  { number: 43, slug: "al-kafirun", nom_phonetique: "Al-Kafirun" },
  { number: 44, slug: "an-nasr", nom_phonetique: "An-Nasr" },
  { number: 45, slug: "al-lahi", nom_phonetique: "Al-Lahi" },
  { number: 46, slug: "al-ikhlas", nom_phonetique: "Al-Ikhlas" },
  { number: 47, slug: "al-falaq", nom_phonetique: "Al-Falaq" },
  { number: 48, slug: "an-nas", nom_phonetique: "An-Nas" },
  { number: 49, slug: "al-masad", nom_phonetique: "Al-Masad" },
  { number: 50, slug: "al-ikhlas", nom_phonetique: "Al-Ikhlas" },
  { number: 51, slug: "al-falaq", nom_phonetique: "Al-Falaq" },
  { number: 52, slug: "an-nas", nom_phonetique: "An-Nas" },
  { number: 53, slug: "al-masad", nom_phonetique: "Al-Masad" },
  { number: 54, slug: "al-ikhlas", nom_phonetique: "Al-Ikhlas" },
  { number: 55, slug: "al-falaq", nom_phonetique: "Al-Falaq" },
  { number: 56, slug: "an-nas", nom_phonetique: "An-Nas" },
  { number: 57, slug: "al-masad", nom_phonetique: "Al-Masad" },
  { number: 58, slug: "al-ikhlas", nom_phonetique: "Al-Ikhlas" },
  { number: 59, slug: "al-falaq", nom_phonetique: "Al-Falaq" },
  { number: 60, slug: "an-nas", nom_phonetique: "An-Nas" },
  { number: 61, slug: "al-masad", nom_phonetique: "Al-Masad" },
  { number: 62, slug: "al-ikhlas", nom_phonetique: "Al-Ikhlas" },
  { number: 63, slug: "al-falaq", nom_phonetique: "Al-Falaq" },
  // ... complète la liste si besoin
];

export function slugToNumber(slug: string): number | null {
  const found = sourates.find(s => s.slug === slug);
  return found ? found.number : null;
}

export function numberToSlug(number: number): string | null {
  const found = sourates.find(s => s.number === number);
  return found ? found.slug : null;
}

export function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
} 