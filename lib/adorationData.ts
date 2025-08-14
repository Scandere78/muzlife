// Types pour les différentes sections d'adoration

export interface Dhikr {
  id: number;
  titre: string;
  texte_arabe: string;
  phonetique: string;
  traduction: string;
  source: string;
  reference_complete: string;
  reference_courte: string;
  slug: string;
  moment?: string;
  repetitions: string;
  bienfaits: string;
  contexte?: string;
  merite?: string;
  explication?: string;
  facilite?: boolean; // Pour les dhikr faciles à retenir
  recommande_prophete?: boolean;
}

export interface Duah {
  id: number;
  titre: string;
  texte_arabe: string;
  phonetique: string;
  traduction: string;
  source: string;
  reference_complete: string;
  reference_courte: string;
  slug: string;
  occasion: string; // Matin, soir, avant de dormir, etc.
  categorie: string; // Protection, guidance, santé, etc.
  bienfaits: string;
  contexte: string;
  merite?: string;
  explication: string;
  frequence_recommandee: string;
  prophete_recitait?: boolean;
}

export interface InvocationDetaille {
  id: number;
  titre: string;
  texte_arabe: string;
  phonetique: string;
  traduction: string;
  source: string;
  reference_complete: string;
  reference_courte: string;
  slug: string;
  occasion: string; // Occasion spécifique (voyage, maladie, etc.)
  bienfaits: string;
  contexte: string;
  merite?: string;
  explication: string;
  hadith_contexte?: string;
  note_importante?: string;
  duree_recommandee?: string;
}

export interface Perle {
  id: number;
  titre: string;
  texte_arabe: string;
  phonetique: string;
  traduction: string;
  source: string;
  reference_complete: string;
  reference_courte: string;
  slug: string;
  type: 'istighfar' | 'tasbih' | 'tahmid' | 'takbir' | 'tahlil' | 'salawat' | 'other';
  repetitions: string;
  recompense: string;
  facilite: boolean;
  moment_ideal: string;
  bienfaits: string;
  variantes?: string[];
}

export interface HadithEdifiant {
  id: number;
  titre: string;
  texte_arabe: string;
  phonetique?: string;
  traduction: string;
  source: string;
  reference_complete: string;
  reference_courte: string;
  slug: string;
  narrateur: string;
  theme: string;
  lecon: string;
  contexte: string;
  application_pratique: string;
  degre_authenticite: 'sahih' | 'hassan' | 'daif';
  explication_savants?: string;
}

export interface CategorieAdoration {
  slug: string;
  nom: string;
  description: string;
  icone: string;
  couleur: string;
  sous_titre: string;
}

// Catégories principales d'adoration
export const categoriesAdoration: CategorieAdoration[] = [
  {
    slug: "dhikr",
    nom: "Dhikr (Invocations Quotidiennes)",
    description: "Évocations quotidiennes simples et puissantes pour maintenir la connexion avec Allah",
    icone: "📿",
    couleur: "from-emerald-400 to-cyan-500",
    sous_titre: "Remembrance of Allah"
  },
  {
    slug: "invocations",
    nom: "Invocations Spécifiques",
    description: "Duahs détaillées pour des occasions et situations particulières",
    icone: "🤲",
    couleur: "from-blue-500 to-indigo-600",
    sous_titre: "Specific Supplications"
  },
  {
    slug: "duahs",
    nom: "Duahs Prophétiques",
    description: "Invocations authentiques enseignées par le Prophète ﷺ",
    icone: "🌙",
    couleur: "from-teal-500 to-emerald-600",
    sous_titre: "Prophetic Supplications"
  },
  {
    slug: "perles",
    nom: "Perles Spirituelles",
    description: "Invocations courtes aux immenses récompenses - Les gemmes du dhikr",
    icone: "💎",
    couleur: "from-purple-500 to-pink-500",
    sous_titre: "Spiritual Gems"
  },
  {
    slug: "hadiths",
    nom: "Hadiths Édifiants",
    description: "Paroles prophétiques inspirantes pour nourrir l'âme et guider la conduite",
    icone: "🕌",
    couleur: "from-amber-500 to-orange-600",
    sous_titre: "Prophetic Teachings"
  }
];

// DHIKR - Évocations quotidiennes
export const dhikrData: Dhikr[] = [
  {
    id: 1,
    titre: "SubhanAllah wa bihamdihi (Gloire et louange à Allah)",
    texte_arabe: "سُبْحَانَ اللهِ وَبِحَمْدِهِ",
    phonetique: "Subhâna-llâhi wa bi-hamdih",
    traduction: "Gloire et pureté à Allah, et à Lui la louange",
    source: "Hadith",
    reference_complete: "Sahîh Al-Bukhari n° 6404, Sahîh Muslim n° 2692",
    reference_courte: "Sahîh Al-Bukhari n° 6404",
    slug: "subhanallah-wa-bihamdihi",
    moment: "À tout moment, surtout matin et soir",
    repetitions: "100 fois par jour",
    bienfaits: "Un palmier planté au Paradis pour chaque récitation",
    contexte: "Ce dhikr combine la glorification (tasbih) et la louange (hamd) d'Allah",
    merite: "Le Prophète (ﷺ) a dit : 'Celui qui dit SubhanAllah wa bihamdihi 100 fois par jour, ses péchés sont effacés même s'ils étaient comme l'écume de la mer'",
    explication: "Subhan = Gloire, pureté, exemption de tout défaut. Hamd = Louange pour Ses bienfaits",
    facilite: true,
    recommande_prophete: true
  },
  {
    id: 2,
    titre: "La ilaha illa Allah (Il n'y a de divinité qu'Allah)",
    texte_arabe: "لَا إِلَهَ إِلَّا اللهُ",
    phonetique: "Lâ ilâha illâ Allah",
    traduction: "Il n'y a de divinité digne d'adoration qu'Allah",
    source: "Hadith",
    reference_complete: "Sahîh Muslim n° 2691, Jami' At-Tirmidhi n° 3383",
    reference_courte: "Sahîh Muslim n° 2691",
    slug: "la-ilaha-illa-allah",
    moment: "À tout moment",
    repetitions: "Sans limite - le plus souvent possible",
    bienfaits: "Renouvellement de la foi, purification du cœur, protection",
    contexte: "La plus grande des paroles, essence du message de tous les prophètes",
    merite: "Le Prophète (ﷺ) a dit : 'Le meilleur dhikr est Lâ ilâha illâ Allah'",
    explication: "Négation (Lâ ilâha) de toute divinité puis affirmation (illâ Allah) d'Allah comme seule divinité",
    facilite: true,
    recommande_prophete: true
  },
  {
    id: 3,
    titre: "Istighfar (Demande de pardon)",
    texte_arabe: "أَسْتَغْفِرُ اللهَ",
    phonetique: "Astaghfiru-llâh",
    traduction: "Je demande pardon à Allah",
    source: "Hadith",
    reference_complete: "Sahîh Al-Bukhari n° 6307, Sahîh Muslim n° 2702",
    reference_courte: "Sahîh Al-Bukhari n° 6307",
    slug: "istighfar-simple",
    moment: "Constamment, surtout après les péchés",
    repetitions: "Minimum 70 fois par jour",
    bienfaits: "Effacement des péchés, ouverture des portes de sustenance, protection",
    contexte: "L'istighfar était constamment sur les lèvres du Prophète (ﷺ)",
    merite: "Le Prophète (ﷺ) demandait pardon plus de 70 fois par jour",
    explication: "Demande sincère de pardon accompagnée du regret et de la résolution de ne plus recommencer",
    facilite: true,
    recommande_prophete: true
  }
];

// INVOCATIONS DÉTAILLÉES - Pour occasions spécifiques
export const invocationsDetaillees: InvocationDetaille[] = [
  {
    id: 1,
    titre: "Invocation du voyageur en détresse",
    texte_arabe: "لَا إِلَهَ إِلَّا اللهُ الْعَظِيمُ الْحَلِيمُ، لَا إِلَهَ إِلَّا اللهُ رَبُّ الْعَرْشِ الْعَظِيمِ، لَا إِلَهَ إِلَّا اللهُ رَبُّ السَّمَوَاتِ وَرَبُّ الْأَرْضِ وَرَبُّ الْعَرْشِ الْكَرِيمِ",
    phonetique: "Lâ ilâha illâ-llâhu-l-'Adhîmu-l-Halîm. Lâ ilâha illâ-llâhu Rabbu-l-'Arshi-l-'Adhîm. Lâ ilâha illâ-llâhu Rabbu-s-samâwâti wa Rabbu-l-ardi wa Rabbu-l-'Arshi-l-Karîm",
    traduction: "Il n'y a de divinité qu'Allah, l'Immense, le Clément. Il n'y a de divinité qu'Allah, Seigneur du Trône immense. Il n'y a de divinité qu'Allah, Seigneur des cieux, Seigneur de la terre et Seigneur du Trône noble",
    source: "Hadith",
    reference_complete: "Sahîh Al-Bukhari n° 6345, Sahîh Muslim n° 2730",
    reference_courte: "Sahîh Al-Bukhari n° 6345",
    slug: "invocation-voyageur-detresse",
    occasion: "En cas de détresse, d'angoisse ou de difficulté",
    bienfaits: "Soulagement immédiat de l'angoisse, aide divine",
    contexte: "Le Prophète (ﷺ) récitait cette invocation lors des moments difficiles",
    merite: "Allah accorde Sa miséricorde et Son aide à celui qui L'invoque ainsi",
    explication: "Cette invocation répète trois fois la shahada en mentionnant différents attributs d'Allah",
    hadith_contexte: "D'après Ibn Abbas (qu'Allah les agrée), le Prophète (ﷺ) disait lors des soucis et chagrins : [cette invocation]",
    duree_recommandee: "Répéter jusqu'à ressentir l'apaisement"
  },
  {
    id: 2,
    titre: "Invocation pour la guidance (Istikhara du cœur)",
    texte_arabe: "اللَّهُمَّ اهْدِنِي فِيمَنْ هَدَيْتَ، وَعَافِنِي فِيمَنْ عَافَيْتَ، وَتَوَلَّنِي فِيمَنْ تَوَلَّيْتَ، وَبَارِكْ لِي فِيمَا أَعْطَيْتَ، وَقِنِي شَرَّ مَا قَضَيْتَ",
    phonetique: "Allâhumma hdinî fî-man hadayt, wa 'âfinî fî-man 'âfayt, wa tawallanî fî-man tawallayt, wa bârik lî fî-mâ a'tayt, wa qinî sharra mâ qadayt",
    traduction: "Ô Allah ! Guide-moi parmi ceux que Tu as guidés, préserve-moi parmi ceux que Tu as préservés, prends-moi sous Ta protection parmi ceux que Tu as pris sous Ta protection, bénis-moi ce que Tu m'as donné et protège-moi du mal de ce que Tu as décrété",
    source: "Hadith",
    reference_complete: "Sunan Abu Dawud n° 1425, Sunan At-Tirmidhi n° 464",
    reference_courte: "Sunan Abu Dawud n° 1425",
    slug: "invocation-guidance-istikhara",
    occasion: "Lors de prises de décision importantes, dans la prière de consultation",
    bienfaits: "Guidance divine, protection, bénédiction dans les choix",
    contexte: "Invocation du Qunut, récitée aussi lors des moments d'incertitude",
    merite: "Demande la guidance divine dans tous les aspects de la vie",
    explication: "Cinq demandes essentielles : guidance, préservation, protection, bénédiction, protection du mal",
    duree_recommandee: "Réciter avec concentration et sincérité"
  }
];

// PERLES SPIRITUELLES - Dhikr courts aux grandes récompenses
export const perlesSpirite: Perle[] = [
  {
    id: 1,
    titre: "La meilleure des paroles",
    texte_arabe: "لَا إِلَهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
    phonetique: "Lâ ilâha illâ-llâhu wahdahu lâ sharîka lah, lahu-l-mulku wa lahu-l-hamd, wa huwa 'alâ kulli shay'in qadîr",
    traduction: "Il n'y a de divinité qu'Allah, Seul sans associé. À Lui la royauté, à Lui la louange, et Il est capable de toute chose",
    source: "Hadith",
    reference_complete: "Sahîh Al-Bukhari n° 3293, Sahîh Muslim n° 2691",
    reference_courte: "Sahîh Al-Bukhari n° 3293",
    slug: "la-ilaha-illa-allah-wahdahu",
    type: "tahlil",
    repetitions: "10 fois après Fajr et Maghrib",
    recompense: "1000 bonnes actions, effacement de 1000 péchés, protection contre Satan",
    facilite: true,
    moment_ideal: "Après les prières obligatoires",
    bienfaits: "Protection divine, multiplication des récompenses, purification",
    variantes: ["Version complète avec 'yuhyi wa yumit' (Il donne la vie et la mort)"]
  },
  {
    id: 2,
    titre: "La perle de l'istighfar",
    texte_arabe: "أَسْتَغْفِرُ اللهَ الَّذِي لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ وَأَتُوبُ إِلَيْهِ",
    phonetique: "Astaghfiru-llâha-lladhî lâ ilâha illâ huwa-l-Hayyu-l-Qayyûmu wa atûbu ilayh",
    traduction: "Je demande pardon à Allah, il n'y a de divinité que Lui, le Vivant, Celui qui subsiste par Lui-même, et je me repens à Lui",
    source: "Hadith",
    reference_complete: "Sunan Abu Dawud n° 1517, Sunan At-Tirmidhi n° 3577",
    reference_courte: "Sunan Abu Dawud n° 1517",
    slug: "istighfar-complet",
    type: "istighfar",
    repetitions: "3 fois minimum, sans limite maximum",
    recompense: "Pardon garanti même pour les grands péchés",
    facilite: false,
    moment_ideal: "Après chaque prière, avant de dormir",
    bienfaits: "Pardon immédiat, ouverture des portes de sustenance",
    variantes: ["Version courte : Astaghfiru-llâh"]
  },
  {
    id: 3,
    titre: "La formule qui équivaut à un tiers du Coran",
    texte_arabe: "قُلْ هُوَ اللهُ أَحَدٌ ۞ اللهُ الصَّمَدُ ۞ لَمْ يَلِدْ وَلَمْ يُولَدْ ۞ وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ",
    phonetique: "Qul huwa-llâhu ahad. Allâhu-s-samad. Lam yalid wa lam yûlad. Wa lam yakun lahu kufuwan ahad",
    traduction: "Dis : Il est Allah, Unique. Allah, Le Seul à être imploré pour ce que nous désirons. Il n'a jamais engendré, n'a pas été engendré non plus. Et nul n'est égal à Lui",
    source: "Coran",
    reference_complete: "Sourate Al-Ikhlas (112) - Sahîh Al-Bukhari n° 5013",
    reference_courte: "Sourate Al-Ikhlas (112)",
    slug: "sourate-ikhlas",
    type: "tahlil",
    repetitions: "3 fois = récompense de la lecture complète du Coran",
    recompense: "Équivaut au tiers du Coran, amour d'Allah, entrée au Paradis",
    facilite: true,
    moment_ideal: "Matin, soir, après les prières",
    bienfaits: "Purification de la foi, affirmation du Tawhid",
    variantes: ["À réciter avec les deux sourates de protection (Al-Falaq et An-Nas)"]
  }
];

// HADITHS ÉDIFIANTS - Paroles prophétiques inspirantes
export const hadithsEdifiants: HadithEdifiant[] = [
  {
    id: 1,
    titre: "La valeur d'une bonne parole",
    texte_arabe: "الْكَلِمَةُ الطَّيِّبَةُ صَدَقَةٌ",
    phonetique: "Al-kalimatu-t-tayyibatu sadaqah",
    traduction: "La bonne parole est une aumône",
    source: "Hadith",
    reference_complete: "Sahîh Al-Bukhari n° 2989, Sahîh Muslim n° 1009",
    reference_courte: "Sahîh Al-Bukhari n° 2989",
    slug: "bonne-parole-aumone",
    narrateur: "Abu Hurayrah (qu'Allah l'agrée)",
    theme: "Bonnes actions et paroles",
    lecon: "Chaque bonne parole prononcée est récompensée comme une aumône par Allah",
    contexte: "Le Prophète (ﷺ) encourageait les bonnes paroles comme forme d'adoration",
    application_pratique: "Dire des mots gentils, encourageants, de dhikr, réciter le Coran, enseigner le bien",
    degre_authenticite: "sahih",
    explication_savants: "Les savants expliquent que cela inclut le dhikr, la récitation du Coran, les conseils bénéfiques, et toute parole qui apporte du bien"
  },
  {
    id: 2,
    titre: "La récompense du dhikr en assemblée",
    texte_arabe: "مَا اجْتَمَعَ قَوْمٌ فِي بَيْتٍ مِنْ بُيُوتِ اللهِ يَتْلُونَ كِتَابَ اللهِ وَيَتَدَارَسُونَهُ بَيْنَهُمْ إِلَّا نَزَلَتْ عَلَيْهِمُ السَّكِينَةُ وَغَشِيَتْهُمُ الرَّحْمَةُ وَحَفَّتْهُمُ الْمَلَائِكَةُ وَذَكَرَهُمُ اللهُ فِيمَنْ عِنْدَهُ",
    phonetique: "Mâ jtama'a qawmun fî baytin min buyûti-llâhi yatlûna kitâba-llâhi wa yatadarasûnahu baynahum illâ nazalat 'alayhimu-s-sakînatu wa ghashiyat-humu-r-rahmatu wa haffat-humu-l-malâ'ikatu wa dhakarahumu-llâhu fî-man 'indah",
    traduction: "Il n'y a pas un groupe de gens qui se réunissent dans une maison d'Allah pour réciter le Livre d'Allah et l'étudier ensemble, sans que la sérénité descende sur eux, que la miséricorde les enveloppe, que les anges les entourent et qu'Allah les mentionne parmi ceux qui sont auprès de Lui",
    source: "Hadith",
    reference_complete: "Sahîh Muslim n° 2699",
    reference_courte: "Sahîh Muslim n° 2699",
    slug: "recompense-dhikr-assemblee",
    narrateur: "Abu Hurayrah (qu'Allah l'agrée)",
    theme: "Mérites de l'étude en groupe",
    lecon: "L'étude collective du Coran et du dhikr apporte des bénédictions exceptionnelles",
    contexte: "Le Prophète (ﷺ) encourageait l'apprentissage religieux en groupe",
    application_pratique: "Participer à des cercles d'étude, groupes de dhikr, cours religieux en mosquée",
    degre_authenticite: "sahih",
    explication_savants: "Ce hadith montre les quatre bénédictions divines : sérénité, miséricorde, présence angélique, et mention auprès d'Allah"
  },
  {
    id: 3,
    titre: "Le dhikr qui protège de l'oubli",
    texte_arabe: "مَنْ قَالَ فِي يَوْمٍ مِائَةَ مَرَّةٍ لَا إِلَهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ كَانَتْ لَهُ عَدْلَ عَشْرِ رِقَابٍ وَكُتِبَتْ لَهُ مِائَةُ حَسَنَةٍ وَمُحِيَتْ عَنْهُ مِائَةُ سَيِّئَةٍ وَكَانَتْ لَهُ حِرْزًا مِنَ الشَّيْطَانِ يَوْمَهُ ذَلِكَ حَتَّى يُمْسِيَ",
    phonetique: "Man qâla fî yawmin mi'ata marratin lâ ilâha illâ-llâhu wahdahu lâ sharîka lah, lahu-l-mulku wa lahu-l-hamdu wa huwa 'alâ kulli shay'in qadîr, kânat lahu 'adla 'ashri riqâbin wa kutibat lahu mi'atu hasanatin wa muhiyat 'anhu mi'atu sayyi'atin wa kânat lahu hirzan mina-sh-shaytâni yawmahu dhâlika hattâ yumsî",
    traduction: "Celui qui dit dans une journée cent fois : 'Il n'y a de divinité qu'Allah, Seul sans associé, à Lui la royauté, à Lui la louange et Il est capable de toute chose', aura la récompense d'avoir affranchi dix esclaves, on lui inscrira cent bonnes actions, on lui effacera cent péchés et cela sera pour lui une protection contre Satan ce jour-là jusqu'au soir",
    source: "Hadith",
    reference_complete: "Sahîh Al-Bukhari n° 3293, Sahîh Muslim n° 2691",
    reference_courte: "Sahîh Al-Bukhari n° 3293",
    slug: "dhikr-protection-satan",
    narrateur: "Abu Hurayrah (qu'Allah l'agrée)",
    theme: "Mérites du dhikr quotidien",
    lecon: "Un dhikr simple répété apporte des récompenses immenses et une protection divine",
    contexte: "Le Prophète (ﷺ) enseignait des dhikr faciles aux grandes récompenses",
    application_pratique: "Réciter ce dhikr 100 fois par jour, idéalement réparti entre matin et soir",
    degre_authenticite: "sahih",
    explication_savants: "Ce hadith montre cinq bénéfices : récompense d'affranchissement, bonnes actions, effacement des péchés, protection contre Satan, et facilité de mémorisation"
  }
];

// DUAHS - Invocations prophétiques
export const duahsData: Duah[] = [
  {
    id: 1,
    titre: "Duah du matin - Protection divine",
    texte_arabe: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ للهِ وَالْحَمْدُ للهِ لاَ إِلَهَ إِلاَّ اللهُ وَحْدَهُ لاَ شَرِيكَ لَهُ",
    phonetique: "Asbahnâ wa asbaha-l-mulku lillâhi wa-l-hamdu lillâhi, lâ ilâha illâ-llâhu wahdahu lâ sharîka lah",
    traduction: "Nous voici au matin et le royaume appartient à Allah, la louange est à Allah, il n'y a de divinité qu'Allah Seul sans associé",
    source: "Hadith",
    reference_complete: "Sahîh Muslim n° 2723",
    reference_courte: "Muslim n° 2723",
    slug: "duah-matin-protection",
    occasion: "Au réveil, chaque matin",
    categorie: "Protection et guidance matinale",
    bienfaits: "Protection divine pour toute la journée, purification de l'âme",
    contexte: "Le Prophète ﷺ récitait cette invocation chaque matin sans exception",
    merite: "Celui qui récite cette duah le matin sera sous la protection d'Allah jusqu'au soir",
    explication: "Cette invocation reconnait la souveraineté absolue d'Allah et notre dépendance totale envers Lui",
    frequence_recommandee: "Une fois chaque matin au réveil",
    prophete_recitait: true
  },
  {
    id: 2,
    titre: "Duah du soir - Sérénité nocturne",
    texte_arabe: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ للهِ وَالْحَمْدُ للهِ لاَ إِلَهَ إِلاَّ اللهُ وَحْدَهُ لاَ شَرِيكَ لَهُ",
    phonetique: "Amsaynâ wa amsâ-l-mulku lillâhi wa-l-hamdu lillâhi, lâ ilâha illâ-llâhu wahdahu lâ sharîka lah",
    traduction: "Nous voici au soir et le royaume appartient à Allah, la louange est à Allah, il n'y a de divinité qu'Allah Seul sans associé",
    source: "Hadith",
    reference_complete: "Sahîh Muslim n° 2723",
    reference_courte: "Muslim n° 2723",
    slug: "duah-soir-serenite",
    occasion: "Le soir, avant le coucher",
    categorie: "Protection et sérénité nocturne",
    bienfaits: "Paix intérieure, protection pendant le sommeil, purification",
    contexte: "Invocation complémentaire de celle du matin, pour clôturer la journée en beauté",
    merite: "Protection divine pendant toute la nuit",
    explication: "Marque la fin de la journée avec gratitude et soumission à Allah",
    frequence_recommandee: "Une fois chaque soir",
    prophete_recitait: true
  },
  {
    id: 3,
    titre: "Duah avant de dormir",
    texte_arabe: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
    phonetique: "Bismika-llâhumma amûtu wa ahyâ",
    traduction: "En Ton nom, ô Allah, je meurs et je vis",
    source: "Hadith",
    reference_complete: "Sahîh Al-Bukhari n° 6312",
    reference_courte: "Bukhari n° 6312",
    slug: "duah-avant-dormir",
    occasion: "Juste avant de s'endormir",
    categorie: "Protection du sommeil",
    bienfaits: "Sommeil apaisé, protection contre les cauchemars",
    contexte: "Le Prophète ﷺ ne dormait jamais sans réciter cette invocation",
    merite: "Celui qui dit cela et meurt dans son sommeil, il meurt en état de fitrah (nature primordiale pure)",
    explication: "Confie son sommeil et son réveil à Allah, reconnaissant que la vie et la mort Lui appartiennent",
    frequence_recommandee: "Chaque nuit avant de dormir",
    prophete_recitait: true
  }
];

// Fonctions utilitaires
export const getDhikrBySlug = (slug: string): Dhikr | undefined => {
  return dhikrData.find(dhikr => dhikr.slug === slug);
};

export const getInvocationDetailsBySlug = (slug: string): InvocationDetaille | undefined => {
  return invocationsDetaillees.find(inv => inv.slug === slug);
};

export const getPerleBySlug = (slug: string): Perle | undefined => {
  return perlesSpirite.find(perle => perle.slug === slug);
};

export const getHadithBySlug = (slug: string): HadithEdifiant | undefined => {
  return hadithsEdifiants.find(hadith => hadith.slug === slug);
};

export const getDuahBySlug = (slug: string): Duah | undefined => {
  return duahsData.find(duah => duah.slug === slug);
};

export const getCategorieBySlug = (slug: string): CategorieAdoration | undefined => {
  return categoriesAdoration.find(cat => cat.slug === slug);
};
