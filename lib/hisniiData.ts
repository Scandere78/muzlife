// Données Hisnii - Invocations et Duahs authentiques
// Basé sur le contenu de https://hisnii.com/

export interface HisniiInvocation {
  id: number;
  titre: string;
  texte_arabe: string;
  phonetique: string;
  traduction: string;
  source: string;
  reference: string;
  slug: string;
  categorie: string;
  moment: string;
  bienfaits: string;
  contexte: string;
  repetitions?: string;
  note?: string;
}

export interface HisniiDuah {
  id: number;
  titre: string;
  texte_arabe: string;
  phonetique: string;
  traduction: string;
  source: string;
  reference: string;
  slug: string;
  occasion: string;
  bienfaits: string;
  contexte: string;
  frequence: string;
  authentique: boolean;
}

export interface HisniiRabbana {
  id: number;
  titre: string;
  texte_arabe: string;
  phonetique: string;
  traduction: string;
  sourate: string;
  verset: number;
  slug: string;
  contexte: string;
  enseignement: string;
}

export interface HisniiCategorie {
  slug: string;
  nom: string;
  description: string;
  icone: string;
  couleur: string;
  total_invocations: number;
}

// Catégories Hisnii
export const hisniiCategories: HisniiCategorie[] = [
  {
    slug: "matin",
    nom: "Invocations du Matin",
    description: "Invocations authentiques à réciter au lever du soleil pour commencer la journée dans la baraka",
    icone: "🌅",
    couleur: "from-yellow-400 to-orange-500",
    total_invocations: 7
  },
  {
    slug: "soir",
    nom: "Invocations du Soir",
    description: "Invocations du coucher du soleil pour la protection et la sérénité de la nuit",
    icone: "🌆",
    couleur: "from-purple-500 to-indigo-600",
    total_invocations: 7
  },
  {
    slug: "protection",
    nom: "Invocations de Protection",
    description: "Invocations pour se protéger des djinns, du mauvais œil et de la sorcellerie",
    icone: "🛡️",
    couleur: "from-emerald-500 to-teal-600",
    total_invocations: 8
  },
  {
    slug: "sommeil",
    nom: "Invocations avant de Dormir",
    description: "Invocations prophétiques pour une nuit paisible et protégée",
    icone: "🌙",
    couleur: "from-indigo-500 to-purple-600",
    total_invocations: 6
  },
  {
    slug: "voyage",
    nom: "Invocations du Voyageur",
    description: "Duahs authentiques pour la protection et la facilité durant les voyages",
    icone: "🧳",
    couleur: "from-blue-500 to-cyan-600",
    total_invocations: 4
  },
  {
    slug: "rabbana",
    nom: "Les 40 Rabbana",
    description: "Les invocations du Coran commençant par 'Rabbana' (Notre Seigneur)",
    icone: "📖",
    couleur: "from-green-500 to-emerald-600",
    total_invocations: 40
  },
  {
    slug: "tristesse",
    nom: "Invocations contre la Tristesse",
    description: "Duahs prophétiques pour surmonter l'angoisse et la mélancolie",
    icone: "💚",
    couleur: "from-pink-500 to-rose-600",
    total_invocations: 3
  },
  {
    slug: "istikhara",
    nom: "Prière de Consultation",
    description: "La Salat al-Istikhara pour demander guidance à Allah dans nos décisions",
    icone: "🤲",
    couleur: "from-amber-500 to-yellow-600",
    total_invocations: 1
  }
];

// INVOCATIONS DU MATIN
export const invocationsMatin: HisniiInvocation[] = [
  {
    id: 1,
    titre: "Âyatu-l-Kursî",
    texte_arabe: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ",
    phonetique: "Allâhu lâ ilâha illâ huwa-l-hayyu-l-qayyûm, lâ ta'khudhuhû sinatun wa lâ nawm. Lahû mâ fi-s-samâwâti wa mâ fi-l-ard. Man dhâ-lladhî yashfa'u 'indahû illâ bi idhnih. Ya'lamu mâ bayna aydîhim wa mâ khalfahum wa lâ yuhîtûna bishay'in min 'ilmihî illâ bimâ shâ'. Wasi'a kursiyyuhu-s-samâwâti wa-l-ard wa lâ ya'ûduhû hifzhuhuma wa huwa-l-'aliyyu-l-'azhîm.",
    traduction: "Allah ! Point de divinité à part Lui, le Vivant, Celui qui subsiste par lui-même. Ni somnolence ni sommeil ne Le saisissent. A lui appartient tout ce qui est dans les cieux et sur la terre. Qui peut intercéder auprès de Lui sans Sa permission ? Il connaît leur passé et leur futur. Et, de Sa science, ils n'embrassent que ce qu'Il veut. Son Trône déborde les cieux et la terre, dont la garde ne Lui coûte aucune peine. Et Il est le Très Haut, le Très Grand.",
    source: "Coran",
    reference: "Sourate Al-Baqarah, verset 255",
    slug: "ayat-al-kursi",
    categorie: "matin",
    moment: "Matin et soir",
    bienfaits: "Protection contre les démons jusqu'au soir. Celui qui la récite ne sera pas approché par un démon jusqu'au matin.",
    contexte: "Le plus grand verset du Coran selon le Prophète ﷺ",
    repetitions: "1 fois",
    note: "À réciter également avant de dormir"
  },
  {
    id: 2,
    titre: "Sourate Al-Ikhlas",
    texte_arabe: "قُلْ هُوَ اللَّهُ أَحَدٌ ۝ اللَّهُ الصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝ وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ",
    phonetique: "Qul huwa-llâhu ahad. Allâhu-s-samad. Lam yalid wa lam yûlad. Wa lam yakun lahû kufuwan ahad.",
    traduction: "Dis : Il est Allah, Unique. Allah, Le Seul à être imploré pour ce que nous désirons. Il n'a jamais engendré, n'a pas été engendré non plus. Et nul n'est égal à Lui.",
    source: "Coran",
    reference: "Sourate Al-Ikhlas (112)",
    slug: "sourate-al-ikhlas",
    categorie: "matin",
    moment: "Matin et soir",
    bienfaits: "Équivaut au tiers du Coran. Protection et purification spirituelle.",
    contexte: "Sourate qui résume l'unicité d'Allah",
    repetitions: "3 fois",
    note: "À réciter avec Al-Falaq et An-Nas"
  },
  {
    id: 3,
    titre: "Sourate Al-Falaq",
    texte_arabe: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ۝ مِنْ شَرِّ مَا خَلَقَ ۝ وَمِنْ شَرِّ غَاسِقٍ إِذَا وَقَبَ ۝ وَمِنْ شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ ۝ وَمِنْ شَرِّ حَاسِدٍ إِذَا حَسَدَ",
    phonetique: "Qul a'ûdhu birabbi-l-falaq. Min sharri mâ khalaq. Wa min sharri ghâsiqin idhâ waqab. Wa min sharri-n-naffâthâti fi-l-'uqad. Wa min sharri hâsidin idhâ hasad.",
    traduction: "Dis : Je cherche protection auprès du Seigneur de l'aube naissante, contre le mal des êtres qu'Il a créés, contre le mal de l'obscurité quand elle s'approfondit, contre le mal de celles qui soufflent sur les nœuds, et contre le mal de l'envieux quand il envie.",
    source: "Coran",
    reference: "Sourate Al-Falaq (113)",
    slug: "sourate-al-falaq",
    categorie: "matin",
    moment: "Matin et soir",
    bienfaits: "Protection contre la sorcellerie, le mauvais œil et tous les maux",
    contexte: "Sourate de protection révélée contre la sorcellerie",
    repetitions: "3 fois"
  },
  {
    id: 4,
    titre: "Sourate An-Nas",
    texte_arabe: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ ۝ مَلِكِ النَّاسِ ۝ إِلَٰهِ النَّاسِ ۝ مِنْ شَرِّ الْوَسْوَاسِ الْخَنَّاسِ ۝ الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ ۝ مِنَ الْجِنَّةِ وَالنَّاسِ",
    phonetique: "Qul a'ûdhu birabbi-n-nâs. Maliki-n-nâs. Ilâhi-n-nâs. Min sharri-l-waswâsi-l-khannâs. Alladhî yuwaswisu fî sudûri-n-nâs. Mina-l-jinnati wa-n-nâs.",
    traduction: "Dis : Je cherche protection auprès du Seigneur des hommes, le Souverain des hommes, Dieu des hommes, contre le mal du mauvais conseiller, furtif, qui souffle le mal dans les poitrines des hommes, qu'il soit un djinn ou un être humain.",
    source: "Coran",
    reference: "Sourate An-Nas (114)",
    slug: "sourate-an-nas",
    categorie: "matin",
    moment: "Matin et soir",
    bienfaits: "Protection contre les waswas (suggestions) du diable et des djinns",
    contexte: "Dernière sourate du Coran, protection contre les suggestions diaboliques",
    repetitions: "3 fois"
  },
  {
    id: 5,
    titre: "Invocation de protection générale",
    texte_arabe: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ، رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَٰذَا الْيَوْمِ وَخَيْرَ مَا بَعْدَهُ، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَٰذَا الْيَوْمِ وَشَرِّ مَا بَعْدَهُ، رَبِّ أَعُوذُ بِكَ مِنَ الْكَسَلِ وَسُوءِ الْكِبَرِ، رَبِّ أَعُوذُ بِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي الْقَبْرِ",
    phonetique: "Asbahnâ wa asbaha-l-mulku lillâh, wa-l-hamdu lillâh, lâ ilâha illâ-llâhu wahdahû lâ sharîka lah, lahu-l-mulku wa lahu-l-hamdu wa huwa 'alâ kulli shay'in qadîr. Rabbi as'aluka khayra mâ fî hâdhâ-l-yawmi wa khayra mâ ba'dah, wa a'ûdhu bika min sharri mâ fî hâdhâ-l-yawmi wa sharri mâ ba'dah. Rabbi a'ûdhu bika mina-l-kasali wa sû'i-l-kibar. Rabbi a'ûdhu bika min 'adhâbin fi-n-nâri wa 'adhâbin fi-l-qabr.",
    traduction: "Nous voici au matin et le règne appartient à Allah. Louange à Allah ! Il n'y a de divinité qu'Allah Unique, sans associé. À Lui la royauté, à Lui la louange et Il est capable de toute chose. Seigneur ! Je Te demande le bien de ce jour et le bien de ce qui vient après. Je cherche refuge auprès de Toi contre le mal de ce jour et le mal de ce qui vient après. Seigneur ! Je cherche refuge auprès de Toi contre la paresse et la vieillesse dans le mal. Seigneur ! Je cherche refuge auprès de Toi contre le châtiment du Feu et le châtiment de la tombe.",
    source: "Hadith",
    reference: "Rapporté par Muslim",
    slug: "invocation-matin-protection",
    categorie: "matin",
    moment: "Au lever",
    bienfaits: "Protection complète pour la journée, demande du bien et éloignement du mal",
    contexte: "Invocation globale pour débuter la journée",
    repetitions: "1 fois"
  }
];

// INVOCATIONS DU SOIR
export const invocationsSoir: HisniiInvocation[] = [
  {
    id: 6,
    titre: "Invocation du soir",
    texte_arabe: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ، رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَٰذِهِ اللَّيْلَةِ وَخَيْرَ مَا بَعْدَهَا، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَٰذِهِ اللَّيْلَةِ وَشَرِّ مَا بَعْدَهَا، رَبِّ أَعُوذُ بِكَ مِنَ الْكَسَلِ وَسُوءِ الْكِبَرِ، رَبِّ أَعُوذُ بِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي الْقَبْرِ",
    phonetique: "Amsaynâ wa amsâ-l-mulku lillâh, wa-l-hamdu lillâh, lâ ilâha illâ-llâhu wahdahû lâ sharîka lah, lahu-l-mulku wa lahu-l-hamdu wa huwa 'alâ kulli shay'in qadîr. Rabbi as'aluka khayra mâ fî hâdhihi-l-laylati wa khayra mâ ba'dahâ, wa a'ûdhu bika min sharri mâ fî hâdhihi-l-laylati wa sharri mâ ba'dahâ. Rabbi a'ûdhu bika mina-l-kasali wa sû'i-l-kibar. Rabbi a'ûdhu bika min 'adhâbin fi-n-nâri wa 'adhâbin fi-l-qabr.",
    traduction: "Nous voici au soir et le règne appartient à Allah. Louange à Allah ! Il n'y a de divinité qu'Allah Unique, sans associé. À Lui la royauté, à Lui la louange et Il est capable de toute chose. Seigneur ! Je Te demande le bien de cette nuit et le bien de ce qui vient après. Je cherche refuge auprès de Toi contre le mal de cette nuit et le mal de ce qui vient après. Seigneur ! Je cherche refuge auprès de Toi contre la paresse et la vieillesse dans le mal. Seigneur ! Je cherche refuge auprès de Toi contre le châtiment du Feu et le châtiment de la tombe.",
    source: "Hadith",
    reference: "Rapporté par Muslim",
    slug: "invocation-soir-protection",
    categorie: "soir",
    moment: "Au coucher du soleil",
    bienfaits: "Protection pour la nuit, demande du bien et éloignement du mal",
    contexte: "Version soir de l'invocation de protection générale",
    repetitions: "1 fois"
  }
];

// INVOCATIONS DE PROTECTION
export const invocationsProtection: HisniiInvocation[] = [
  {
    id: 10,
    titre: "Protection contre le mauvais œil",
    texte_arabe: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ",
    phonetique: "A'ûdhu bi kalimâti-llâhi-t-tâmmâti min sharri mâ khalaq",
    traduction: "Je cherche protection auprès des paroles parfaites d'Allah contre le mal de ce qu'Il a créé",
    source: "Hadith",
    reference: "Rapporté par Muslim",
    slug: "protection-mauvais-oeil",
    categorie: "protection",
    moment: "À tout moment",
    bienfaits: "Protection contre tous les maux et créatures nuisibles",
    contexte: "Invocation universelle de protection",
    repetitions: "3 fois",
    note: "Particulièrement efficace contre le mauvais œil"
  }
];

// INVOCATIONS AVANT DE DORMIR
export const invocationsSommeil: HisniiInvocation[] = [
  {
    id: 15,
    titre: "Invocation avant de dormir",
    texte_arabe: "اللَّهُمَّ بِاسْمِكَ أَمُوتُ وَأَحْيَا",
    phonetique: "Allâhumma bismika amûtu wa ahyâ",
    traduction: "Ô Allah ! C'est en Ton nom que je meurs et que je vis",
    source: "Hadith",
    reference: "Rapporté par Al-Bukhari",
    slug: "invocation-avant-dormir",
    categorie: "sommeil",
    moment: "Avant de s'endormir",
    bienfaits: "Remise de l'âme à Allah pour la nuit",
    contexte: "Dernière invocation avant le sommeil",
    repetitions: "1 fois"
  }
];

// DUAHS PROPHÉTIQUES
export const duahsProphetiques: HisniiDuah[] = [
  {
    id: 100,
    titre: "Duah contre la tristesse et l'angoisse",
    texte_arabe: "اللَّهُمَّ إِنِّي عَبْدُكَ، ابْنُ عَبْدِكَ، ابْنُ أَمَتِكَ، نَاصِيَتِي بِيَدِكَ، مَاضٍ فِيَّ حُكْمُكَ، عَدْلٌ فِيَّ قَضَاؤُكَ، أَسْأَلُكَ بِكُلِّ اسْمٍ هُوَ لَكَ سَمَّيْتَ بِهِ نَفْسَكَ، أَوْ أَنْزَلْتَهُ فِي كِتَابِكَ، أَوْ عَلَّمْتَهُ أَحَدًا مِنْ خَلْقِكَ، أَوِ اسْتَأْثَرْتَ بِهِ فِي عِلْمِ الْغَيْبِ عِنْدَكَ، أَنْ تَجْعَلَ الْقُرْآنَ رَبِيعَ قَلْبِي، وَنُورَ صَدْرِي، وَجِلَاءَ حُزْنِي، وَذَهَابَ هَمِّي",
    phonetique: "Allâhumma innî 'abduka, ibnu 'abdika, ibnu amatika, nâsiyatî bi yadika, mâdin fiyya hukmuka, 'adlun fiyya qadâ'uka. As'aluka bi kulli ismin huwa laka sammayta bihi nafsaka, aw anzaltahu fî kitâbika, aw 'allamtahu ahadan min khalqika, awi-sta'tharta bihi fî 'ilmi-l-ghaybi 'indaka, an taj'ala-l-qur'âna rabî'a qalbî, wa nûra sadrî, wa jalâ'a huznî, wa dhahâba hammî",
    traduction: "Ô Allah ! Je suis Ton serviteur, fils de Ton serviteur, fils de Ta servante. Mon toupet est dans Ta main, Ton jugement sur moi est en cours d'exécution, Ton décret sur moi est juste. Je Te demande par tout nom qui T'appartient, par lequel Tu T'es nommé, ou que Tu as fait descendre dans Ton Livre, ou que Tu as enseigné à l'une de Tes créatures, ou que Tu as gardé secret dans Ta science de l'Invisible, de faire du Coran le printemps de mon cœur, la lumière de ma poitrine, ce qui dissipe ma tristesse et fait partir mes soucis.",
    source: "Hadith",
    reference: "Rapporté par Ahmad",
    slug: "duah-contre-tristesse",
    occasion: "Tristesse, angoisse, dépression",
    bienfaits: "Allah enlève la tristesse et remplace par la joie",
    contexte: "Duah très puissante pour surmonter les épreuves morales",
    frequence: "Autant que nécessaire",
    authentique: true
  }
];

// LES 40 RABBANA (sélection)
export const rabbanaInvocations: HisniiRabbana[] = [
  {
    id: 200,
    titre: "Rabbana taqabbal minna",
    texte_arabe: "رَبَّنَا تَقَبَّلْ مِنَّا ۖ إِنَّكَ أَنتَ السَّمِيعُ الْعَلِيمُ",
    phonetique: "Rabbanâ taqabbal minnâ innaka anta-s-samî'u-l-'alîm",
    traduction: "Ô notre Seigneur, accepte ceci de notre part ! Car c'est Toi certes l'Audient, l'Omniscient",
    sourate: "Al-Baqarah",
    verset: 127,
    slug: "rabbana-taqabbal-minna",
    contexte: "Invocation d'Ibrahim et Ismail lors de la construction de la Kaaba",
    enseignement: "Importance de demander l'acceptation de nos œuvres par Allah"
  },
  {
    id: 201,
    titre: "Rabbana wa j'alna muslimayni laka",
    texte_arabe: "رَبَّنَا وَاجْعَلْنَا مُسْلِمَيْنِ لَكَ وَمِن ذُرِّيَّتِنَا أُمَّةً مُّسْلِمَةً لَّكَ وَأَرِنَا مَنَاسِكَنَا وَتُبْ عَلَيْنَا ۖ إِنَّكَ أَنتَ التَّوَّابُ الرَّحِيمُ",
    phonetique: "Rabbanâ wa-j'alnâ muslimayni laka wa min dhurriyyatinâ ummatan muslimatan laka wa arinâ manâsikanâ wa tub 'alaynâ innaka anta-t-tawwâbu-r-rahîm",
    traduction: "Ô notre Seigneur ! Fais de nous Tes Soumis, et de notre descendance une communauté soumise à Toi. Et montre-nous nos rites et reviens vers nous. Car c'est Toi certes l'Accueillant au repentir, le Miséricordieux !",
    sourate: "Al-Baqarah",
    verset: 128,
    slug: "rabbana-wa-jalna-muslimayni",
    contexte: "Suite de l'invocation d'Ibrahim et Ismail",
    enseignement: "Demander la guidance pour soi et sa descendance"
  }
];

// FONCTIONS UTILITAIRES
export function getHisniiCategorieBySlug(slug: string): HisniiCategorie | undefined {
  return hisniiCategories.find(cat => cat.slug === slug);
}

export function getInvocationsByCategorie(categorie: string): HisniiInvocation[] {
  const allInvocations = [
    ...invocationsMatin,
    ...invocationsSoir,
    ...invocationsProtection,
    ...invocationsSommeil
  ];
  return allInvocations.filter(inv => inv.categorie === categorie);
}

export function getInvocationBySlug(slug: string): HisniiInvocation | undefined {
  const allInvocations = [
    ...invocationsMatin,
    ...invocationsSoir,
    ...invocationsProtection,
    ...invocationsSommeil
  ];
  return allInvocations.find(inv => inv.slug === slug);
}

export function getDuahBySlug(slug: string): HisniiDuah | undefined {
  return duahsProphetiques.find(duah => duah.slug === slug);
}

export function getRabbanaBySlug(slug: string): HisniiRabbana | undefined {
  return rabbanaInvocations.find(rabbana => rabbana.slug === slug);
}

// Obtenir toutes les invocations de toutes les catégories
export function getAllHisniiInvocations(): HisniiInvocation[] {
  return [
    ...invocationsMatin,
    ...invocationsSoir,
    ...invocationsProtection,
    ...invocationsSommeil
  ];
}

// Recherche d'invocations par mot-clé
export function searchInvocations(keyword: string): HisniiInvocation[] {
  const allInvocations = getAllHisniiInvocations();
  const searchTerm = keyword.toLowerCase();
  
  return allInvocations.filter(inv => 
    inv.titre.toLowerCase().includes(searchTerm) ||
    inv.traduction.toLowerCase().includes(searchTerm) ||
    inv.bienfaits.toLowerCase().includes(searchTerm) ||
    inv.contexte.toLowerCase().includes(searchTerm)
  );
}