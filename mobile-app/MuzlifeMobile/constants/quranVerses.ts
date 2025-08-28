// Données des versets du Coran
// Pour la démo, nous incluons quelques versets des sourates les plus communes

export type Verse = {
  number: number;
  arabic: string;
  french: string;
  transliteration?: string;
};

export type SurahVerses = {
  surahNumber: number;
  verses: Verse[];
};

// Quelques versets d'exemple pour les sourates les plus communes
export const QURAN_VERSES: Record<number, Verse[]> = {
  // Al-Fatiha (Sourate 1)
  1: [
    {
      number: 1,
      arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
      french: "Au nom d'Allah, le Tout Miséricordieux, le Très Miséricordieux.",
      transliteration: "Bismi Allahi ar-rahmani ar-raheem"
    },
    {
      number: 2,
      arabic: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
      french: "Louange à Allah, Seigneur de l'univers.",
      transliteration: "Alhamdu lillahi rabbi al-alameen"
    },
    {
      number: 3,
      arabic: "الرَّحْمَٰنِ الرَّحِيمِ",
      french: "Le Tout Miséricordieux, le Très Miséricordieux,",
      transliteration: "Ar-rahmani ar-raheem"
    },
    {
      number: 4,
      arabic: "مَالِكِ يَوْمِ الدِّينِ",
      french: "Maître du Jour de la rétribution.",
      transliteration: "Maliki yawmi ad-deen"
    },
    {
      number: 5,
      arabic: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
      french: "C'est Toi [Seul] que nous adorons, et c'est Toi [Seul] dont nous implorons secours.",
      transliteration: "Iyyaka na'budu wa-iyyaka nasta'een"
    },
    {
      number: 6,
      arabic: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ",
      french: "Guide-nous dans le droit chemin,",
      transliteration: "Ihdina as-sirata al-mustaqeem"
    },
    {
      number: 7,
      arabic: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ",
      french: "le chemin de ceux que Tu as comblés de faveurs, non pas de ceux qui ont encouru Ta colère, ni des égarés.",
      transliteration: "Sirata allatheena an'amta alayhim ghayri al-maghdoobi alayhim wa-la ad-dalleen"
    }
  ],
  
  // Al-Ikhlas (Sourate 112)
  112: [
    {
      number: 1,
      arabic: "قُلْ هُوَ اللَّهُ أَحَدٌ",
      french: "Dis : « Il est Allah, Unique.",
      transliteration: "Qul huwa Allahu ahad"
    },
    {
      number: 2,
      arabic: "اللَّهُ الصَّمَدُ",
      french: "Allah, Le Seul à être imploré pour ce que nous désirons.",
      transliteration: "Allahu as-samad"
    },
    {
      number: 3,
      arabic: "لَمْ يَلِدْ وَلَمْ يُولَدْ",
      french: "Il n'a jamais engendré, n'a pas été engendré non plus.",
      transliteration: "Lam yalid wa-lam yoolad"
    },
    {
      number: 4,
      arabic: "وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ",
      french: "Et nul n'est égal à Lui. »",
      transliteration: "Wa-lam yakun lahu kufuwan ahad"
    }
  ],

  // Al-Falaq (Sourate 113)
  113: [
    {
      number: 1,
      arabic: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ",
      french: "Dis : « Je cherche protection auprès du Seigneur de l'aube naissante,",
      transliteration: "Qul a'oodhu bi-rabbi al-falaq"
    },
    {
      number: 2,
      arabic: "مِنْ شَرِّ مَا خَلَقَ",
      french: "contre le mal des êtres qu'Il a créés,",
      transliteration: "Min sharri ma khalaq"
    },
    {
      number: 3,
      arabic: "وَمِنْ شَرِّ غَاسِقٍ إِذَا وَقَبَ",
      french: "contre le mal de l'obscurité quand elle s'approfondit,",
      transliteration: "Wa-min sharri ghasiqin itha waqab"
    },
    {
      number: 4,
      arabic: "وَمِنْ شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ",
      french: "contre le mal de celles qui soufflent sur les nœuds,",
      transliteration: "Wa-min sharri an-naffathati fi al-uqad"
    },
    {
      number: 5,
      arabic: "وَمِنْ شَرِّ حَاسِدٍ إِذَا حَسَدَ",
      french: "et contre le mal de l'envieux quand il envie. »",
      transliteration: "Wa-min sharri hasidin itha hasad"
    }
  ],

  // An-Nas (Sourate 114)
  114: [
    {
      number: 1,
      arabic: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ",
      french: "Dis : « Je cherche protection auprès du Seigneur des hommes.",
      transliteration: "Qul a'oodhu bi-rabbi an-nas"
    },
    {
      number: 2,
      arabic: "مَلِكِ النَّاسِ",
      french: "Le Souverain des hommes,",
      transliteration: "Maliki an-nas"
    },
    {
      number: 3,
      arabic: "إِلَٰهِ النَّاسِ",
      french: "Dieu des hommes,",
      transliteration: "Ilahi an-nas"
    },
    {
      number: 4,
      arabic: "مِنْ شَرِّ الْوَسْوَاسِ الْخَنَّاسِ",
      french: "contre le mal du mauvais conseiller, furtif,",
      transliteration: "Min sharri al-waswasi al-khannas"
    },
    {
      number: 5,
      arabic: "الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ",
      french: "qui souffle le mal dans les poitrines des hommes,",
      transliteration: "Alladhi yuwaswisu fi sudoori an-nas"
    },
    {
      number: 6,
      arabic: "مِنَ الْجِنَّةِ وَالنَّاسِ",
      french: "qu'il (le conseiller) soit un djinn, ou un être humain. »",
      transliteration: "Mina al-jinnati wa-an-nas"
    }
  ]
};

// Fonction pour obtenir les versets d'une sourate
export function getSurahVerses(surahNumber: number): Verse[] {
  return QURAN_VERSES[surahNumber] || generatePlaceholderVerses(surahNumber);
}

// Générer des versets d'exemple pour les sourates non implémentées
function generatePlaceholderVerses(surahNumber: number): Verse[] {
  // Import des métadonnées de sourate depuis quranData
  const surahInfo = require('./quranData').getSurahInfo(surahNumber);
  
  if (!surahInfo) return [];

  const placeholderVerses: Verse[] = [];
  
  // Créer des versets d'exemple pour la démo
  for (let i = 1; i <= Math.min(surahInfo.verseCount, 5); i++) {
    placeholderVerses.push({
      number: i,
      arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
      french: `Verset ${i} de la sourate ${surahInfo.frenchName} (contenu de démonstration).`,
      transliteration: "Bismillahi ar-rahmani ar-raheem"
    });
  }
  
  // Si la sourate a plus de 5 versets, ajouter une note
  if (surahInfo.verseCount > 5) {
    placeholderVerses.push({
      number: surahInfo.verseCount,
      arabic: "...",
      french: `... et ${surahInfo.verseCount - 5} autres versets.`,
      transliteration: "..."
    });
  }
  
  return placeholderVerses;
}

// Fonction pour vérifier si une sourate a du contenu réel ou des données d'exemple
export function hasSurahRealContent(surahNumber: number): boolean {
  return surahNumber in QURAN_VERSES;
}