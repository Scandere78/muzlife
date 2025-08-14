export interface Invocation {
  id: number;
  titre: string;
  texte_arabe: string;
  phonetique: string;
  traduction: string;
  source: string;
  reference_complete: string;
  reference_courte: string;
  theme: string;
  slug: string;
  moment?: string;
  repetitions?: string;
  bienfaits?: string;
  contexte?: string;
  merite?: string;
  explication?: string;
  hadith_contexte?: string;
  note_importante?: string;
}

export interface ThemeInvocation {
  slug: string;
  nom: string;
  description: string;
  icone: string;
  couleur: string;
  invocations: Invocation[];
}

// Données des invocations par thèmes - Version enrichie avec sources authentiques
export const invocationsData: ThemeInvocation[] = [
  {
    slug: "matin-soir",
    nom: "Invocations du Matin et du Soir",
    description: "Dhikr et invocations essentiels pour débuter et terminer la journée selon la Sunnah",
    icone: "🌅",
    couleur: "from-yellow-400 to-orange-500",
    invocations: [
      {
        id: 1,
        titre: "Ayat Al-Kursi (Verset du Trône)",
        texte_arabe: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ",
        phonetique: "Allâhu lâ ilâha illâ huwa-l-hayyu-l-qayyûm. Lâ ta'khudhuhu sinatun wa lâ nawm. Lahu mâ fî-s-samâwâti wa mâ fî-l-ard. Man dhâ-lladhî yashfa'u 'indahu illâ bi-idhnih. Ya'lamu mâ bayna aydîhim wa mâ khalfahum. Wa lâ yuhîtûna bi-shay'in min 'ilmihi illâ bi-mâ shâ'. Wasi'a kursiyyuhu-s-samâwâti wa-l-ard. Wa lâ ya'ûduhu hifzhuhuma wa huwa-l-'aliyyu-l-'azhîm.",
        traduction: "Allah ! Point de divinité à part Lui, le Vivant, Celui qui n'a besoin de rien et dont toute chose dépend. Ni somnolence ni sommeil ne Le saisissent. À Lui appartient tout ce qui est dans les cieux et sur la terre. Qui peut intercéder auprès de Lui sans Sa permission ? Il connaît leur passé et leur futur. Et, de Sa science, ils n'embrassent que ce qu'Il veut. Son Kursî (Piédestal) déborde les cieux et la terre et leur garde ne Lui coûte aucune peine. Et Il est le Très Haut, l'Immense.",
        source: "Coran",
        reference_complete: "Sourate Al-Baqarah, verset 255 - Sahîh Al-Kalim At-Tayyib n° 22",
        reference_courte: "Sourate Al-Baqarah (2:255)",
        theme: "matin-soir",
        slug: "ayat-al-kursi",
        moment: "Matin et soir",
        repetitions: "1 fois",
        bienfaits: "Protection contre les djinns et les démons, protection durant le sommeil",
        contexte: "Ce verset est considéré comme le plus grand verset du Coran. Il résume parfaitement les attributs d'Allah et Sa souveraineté absolue.",
        merite: "Celui qui récite Ayat Al-Kursi après chaque prière obligatoire, rien ne l'empêchera d'entrer au Paradis si ce n'est la mort. Et celui qui la récite en se couchant, Allah lui assigne un gardien qui le protégera jusqu'au matin.",
        explication: "Ce verset établit l'unicité d'Allah (Tawhid), Sa vie éternelle (Al-Hayy), Sa capacité à maintenir toute chose (Al-Qayyum), Sa science parfaite, et Son autorité absolue sur toute la création.",
        hadith_contexte: "D'après Abu Umamah (qu'Allah l'agrée), le Prophète (ﷺ) a dit : « Celui qui récite Ayat Al-Kursi après chaque prière obligatoire, rien ne l'empêchera d'entrer au Paradis si ce n'est la mort. » (Rapporté par An-Nasa'i et authentifié par Al-Albani)",
        note_importante: "Ce verset doit être récité avec méditation et présence du cœur, en réfléchissant aux magnifiques attributs d'Allah qu'il contient."
      },
      {
        id: 2,
        titre: "Les trois dernières sourates (Al-Ikhlas, Al-Falaq, An-Nas)",
        texte_arabe: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ﴿قُلْ هُوَ اللَّهُ أَحَدٌ ۞ اللَّهُ الصَّمَدُ ۞ لَمْ يَلِدْ وَلَمْ يُولَدْ ۞ وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ﴾\n\nبِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ﴿قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ۞ مِن شَرِّ مَا خَلَقَ ۞ وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ ۞ وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ ۞ وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ﴾\n\nبِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ﴿قُلْ أَعُوذُ بِرَبِّ النَّاسِ ۞ مَلِكِ النَّاسِ ۞ إِلَٰهِ النَّاسِ ۞ مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ ۞ الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ ۞ مِنَ الْجِنَّةِ وَالنَّاسِ﴾",
        phonetique: "Bismillâhi-r-rahmâni-r-rahîm. Qul huwa-llâhu ahad. Allâhu-s-samad. Lam yalid wa lam yûlad. Wa lam yakun lahu kufuwan ahad.\n\nBismillâhi-r-rahmâni-r-rahîm. Qul a'ûdhu bi-rabbi-l-falaq. Min sharri mâ khalaq. Wa min sharri ghâsiqin idhâ waqab. Wa min sharri-n-naffâthâti fî-l-'uqad. Wa min sharri hâsidin idhâ hasad.\n\nBismillâhi-r-rahmâni-r-rahîm. Qul a'ûdhu bi-rabbi-n-nâs. Maliki-n-nâs. Ilâhi-n-nâs. Min sharri-l-waswâsi-l-khannâs. Alladhî yuwaswisu fî sudûri-n-nâs. Mina-l-jinnati wa-n-nâs.",
        traduction: "Au nom d'Allah, le Tout Miséricordieux, le Très Miséricordieux. Dis : « Il est Allah, Unique. Allah, Le Seul à être imploré pour ce que nous désirons. Il n'a jamais engendré, n'a pas été engendré non plus. Et nul n'est égal à Lui. »\n\nAu nom d'Allah, le Tout Miséricordieux, le Très Miséricordieux. Dis : « Je cherche protection auprès du Seigneur de l'aube naissante, contre le mal des êtres qu'Il a créés, contre le mal de l'obscurité quand elle s'approfondit, contre le mal de celles qui soufflent sur les nœuds, et contre le mal de l'envieux quand il envie. »\n\nAu nom d'Allah, le Tout Miséricordieux, le Très Miséricordieux. Dis : « Je cherche protection auprès du Seigneur des hommes, Le Souverain des hommes, Dieu des hommes, contre le mal du mauvais conseiller, furtif, qui souffle le mal dans les poitrines des hommes, qu'il soit un djinn, ou un être humain. »",
        source: "Coran",
        reference_complete: "Sourates 112, 113, 114 - Sahîh At-Tirmidhî n° 3575",
        reference_courte: "Sourates Al-Ikhlas, Al-Falaq, An-Nas",
        theme: "matin-soir",
        slug: "trois-dernieres-sourates",
        moment: "Matin et soir",
        repetitions: "3 fois chacune",
        bienfaits: "Protection complète contre tous les types de mal : sorcellerie, mauvais œil, jalousie, djinns",
        contexte: "Ces trois sourates forment un ensemble de protection spirituelle complète. Al-Ikhlas affirme l'unicité d'Allah, tandis qu'Al-Falaq et An-Nas demandent Sa protection.",
        merite: "Le Prophète (ﷺ) les récitait chaque soir, soufflait dans ses mains et se les passait sur tout le corps. Il a dit qu'elles équivalent au tiers du Coran (pour Al-Ikhlas).",
        explication: "Al-Ikhlas (Le Monothéisme pur) : établit l'unicité absolue d'Allah. Al-Falaq (L'Aube naissante) : protection contre les maux extérieurs. An-Nas (Les Hommes) : protection contre les maux intérieurs (waswas).",
        hadith_contexte: "D'après 'Aishah (qu'Allah l'agrée) : « Chaque soir, quand le Prophète (ﷺ) se couchait, il joignait ses mains, y récitait les sourates Al-Ikhlas, Al-Falaq et An-Nas, puis soufflait dedans et se les passait sur tout le corps en commençant par la tête et le visage, et tout ce qu'il pouvait atteindre de son corps. Il faisait cela trois fois. » (Rapporté par Al-Bukhari)",
        note_importante: "Il est recommandé de souffler légèrement dans ses mains après la récitation et de se les passer sur le corps, à l'exemple du Prophète (ﷺ)."
      },
      {
        id: 3,
        titre: "La protection d'Allah par Son Nom",
        texte_arabe: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ",
        phonetique: "Bi-smi-llâhi-lladhî lâ yadurru ma'a-smihi shay'un fî-l-ardi wa lâ fî-s-samâ'i wa huwa-s-Samî'u-l-'Alîm",
        traduction: "Au nom d'Allah, tel qu'en compagnie de Son Nom rien sur Terre ni au ciel ne peut nuire, Lui l'Audient, l'Omniscient.",
        source: "Hadith",
        reference_complete: "Sahîh At-Tirmidhî n° 3388, Sahîh Abu Dawud n° 5088",
        reference_courte: "Sahîh At-Tirmidhî n° 3388",
        theme: "matin-soir",
        slug: "protection-nom-allah",
        moment: "Matin et soir",
        repetitions: "3 fois",
        bienfaits: "Protection absolue contre tout mal pendant la journée et la nuit",
        contexte: "Cette invocation constitue une protection complète basée sur la puissance du Nom d'Allah. Elle exprime une confiance totale en Allah.",
        merite: "Celui qui la dit trois fois le matin ne sera atteint par aucun mal jusqu'au soir, et celui qui la dit trois fois le soir ne sera atteint par aucun mal jusqu'au matin.",
        explication: "Cette invocation met l'accent sur la protection divine obtenue par l'invocation du Nom d'Allah. Les attributs 'As-Samî' (L'Audient) et 'Al-'Alîm' (L'Omniscient) rappellent qu'Allah entend et sait tout.",
        hadith_contexte: "D'après 'Uthman ibn 'Affan (qu'Allah l'agrée), le Prophète (ﷺ) a dit : « Il n'y a pas un serviteur qui dit, matin et soir : 'Au nom d'Allah, tel qu'en compagnie de Son Nom rien sur Terre ni au ciel ne peut nuire, Lui l'Audient, l'Omniscient' trois fois, sans qu'il ne soit atteint par quoi que ce soit. » (Rapporté par Abu Dawud et At-Tirmidhi)",
        note_importante: "Cette invocation doit être récitée avec une foi ferme en la protection d'Allah et une certitude absolue en Son pouvoir."
      },
      {
        id: 4,
        titre: "Invocation du matin - Reconnaissance et demande",
        texte_arabe: "اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ",
        phonetique: "Allâhumma bika asbahnâ, wa bika amsaynâ, wa bika nahyâ, wa bika namût, wa ilayka-n-nushûr",
        traduction: "Ô Allah ! C'est par Toi que nous nous retrouvons au matin et c'est par Toi que nous nous retrouvons au soir. C'est par Toi que nous vivons et c'est par Toi que nous mourons et c'est vers Toi que se fera la Résurrection.",
        source: "Hadith",
        reference_complete: "As-Sahîhah n° 262, Sahîh At-Tirmidhi",
        reference_courte: "As-Sahîhah n° 262",
        theme: "matin-soir",
        slug: "invocation-matin-reconnaissance",
        moment: "Matin",
        repetitions: "1 fois",
        bienfaits: "Reconnaissance de la dépendance totale envers Allah, augmentation de la foi",
        contexte: "Cette invocation exprime la reconnaissance que tout dans notre existence dépend d'Allah : le réveil, le coucher, la vie, la mort et la résurrection.",
        merite: "Renforce la connexion avec Allah et rappelle constamment notre dépendance totale envers Lui",
        explication: "Cette invocation établit le principe fondamental que toute notre existence, du lever au coucher, de la vie à la mort, jusqu'à la résurrection, est entièrement entre les mains d'Allah.",
        hadith_contexte: "Cette invocation fait partie des dhikr recommandés le matin selon la tradition prophétique, exprimant la soumission totale à Allah et la reconnaissance de Sa souveraineté sur nos vies.",
        note_importante: "Il faut réciter cette invocation avec conscience de sa signification profonde, en méditant sur notre dépendance absolue envers Allah."
      }
    ]
  },
  {
    slug: "protection",
    nom: "Invocations de Protection",
    description: "Duahs authentiques pour se protéger du mal, de la sorcellerie et des épreuves",
    icone: "🛡️",
    couleur: "from-blue-500 to-indigo-600",
    invocations: [
      {
        id: 5,
        titre: "Refuge contre Satan le lapidé",
        texte_arabe: "أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ",
        phonetique: "A'ûdhu billâhi mina-sh-shaytâni-r-rajîm",
        traduction: "Je cherche refuge auprès d'Allah contre Satan le lapidé",
        source: "Coran",
        reference_complete: "Mentionnée dans plusieurs versets du Coran, notamment avant la récitation",
        reference_courte: "Coran - Sourate An-Nahl (16:98)",
        theme: "protection",
        slug: "refuge-contre-satan",
        moment: "Avant la récitation du Coran, lors des tentations",
        repetitions: "1 fois ou plus selon le besoin",
        bienfaits: "Protection contre les tentations de Satan et ses waswas (chuchotements)",
        contexte: "Cette formule est prescrite dans le Coran avant la récitation. Elle constitue un bouclier spirituel contre l'influence démoniaque.",
        merite: "Constitue une protection immédiate contre Satan. Allah ordonne de la réciter dans le Coran.",
        explication: "'A'ûdhu' signifie chercher refuge, protection. 'Rajîm' signifie lapidé, chassé, maudit, car Satan a été chassé de la miséricorde d'Allah.",
        hadith_contexte: "Allah dit dans le Coran : 'Lorsque tu lis le Coran, demande la protection d'Allah contre le Diable banni' (Sourate An-Nahl, 16:98)",
        note_importante: "À réciter sincèrement avec la certitude qu'Allah est capable de nous protéger contre Satan."
      },
      {
        id: 6,
        titre: "Protection complète matin et soir",
        texte_arabe: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ",
        phonetique: "A'ûdhu bi-kalimâti-llâhi-t-tâmmâti min sharri mâ khalaq",
        traduction: "Je cherche protection par les paroles parfaites d'Allah contre le mal qu'Il a créé",
        source: "Hadith",
        reference_complete: "Sahîh Muslim n° 2708, Sahîh At-Tirmidhi n° 3604",
        reference_courte: "Sahîh Muslim n° 2708",
        theme: "protection",
        slug: "protection-paroles-parfaites",
        moment: "Matin, soir, et à tout moment",
        repetitions: "3 fois",
        bienfaits: "Protection contre tout type de mal : animaux venimeux, djinns, sorcellerie",
        contexte: "Cette invocation utilise les 'paroles parfaites' d'Allah, qui désignent le Coran et Ses noms et attributs.",
        merite: "Celui qui la récite ne sera pas atteint par quoi que ce soit qui pourrait lui nuire",
        explication: "Les 'kalimât tâmmât' (paroles parfaites) désignent les paroles d'Allah qui sont parfaites en vérité et en justice, incluant le Coran et Ses beaux noms.",
        hadith_contexte: "D'après Abu Hurayrah (qu'Allah l'agrée), le Prophète (ﷺ) a dit : 'Celui qui dit le soir : Je cherche protection par les paroles parfaites d'Allah contre le mal qu'Il a créé, trois fois, ne sera piqué par aucun animal venimeux cette nuit-là.' (Rapporté par Muslim)",
        note_importante: "Particulièrement efficace contre les piqûres d'animaux venimeux et les nuisances des créatures nocturnes."
      }
    ]
  },
  {
    slug: "repas",
    nom: "Invocations des Repas",
    description: "Duahs pour bénir la nourriture et remercier Allah pour Ses bienfaits",
    icone: "🍽️",
    couleur: "from-green-400 to-emerald-500",
    invocations: [
      {
        id: 7,
        titre: "Avant le repas - Bismillah",
        texte_arabe: "بِسْمِ اللَّهِ",
        phonetique: "Bismillâh",
        traduction: "Au nom d'Allah",
        source: "Hadith",
        reference_complete: "Sahîh Abu Dawud n° 3767, Sahîh At-Tirmidhi n° 1858",
        reference_courte: "Sahîh Abu Dawud n° 3767",
        theme: "repas",
        slug: "avant-repas-bismillah",
        moment: "Avant chaque repas",
        repetitions: "1 fois",
        bienfaits: "Bénédiction de la nourriture, protection contre Satan qui partage le repas",
        contexte: "Cette invocation simple mais essentielle place le repas sous la bénédiction d'Allah et empêche Satan d'y participer.",
        merite: "Satan ne peut partager le repas avec celui qui mentionne le nom d'Allah",
        explication: "Mentionner le nom d'Allah avant manger sanctifie l'acte de se nourrir et le transforme en acte d'adoration.",
        hadith_contexte: "Le Prophète (ﷺ) a dit : 'Lorsque l'homme mange sa nourriture et dit : Bismillah, Satan dit : Vous n'avez ni gîte ni repas. Mais s'il ne dit pas Bismillah, Satan dit : Vous avez trouvé gîte et repas.' (Rapporté par Muslim)",
        note_importante: "Si on oublie de dire Bismillah au début, on peut dire : 'Bismillahi awwalahu wa âkhirahu' (Au nom d'Allah, au début et à la fin)."
      }
    ]
  },
  {
    slug: "sommeil",
    nom: "Invocations du Sommeil",
    description: "Duahs pour se coucher et se réveiller dans la protection d'Allah",
    icone: "🌙",
    couleur: "from-indigo-500 to-purple-600",
    invocations: [
      {
        id: 8,
        titre: "Avant de dormir - Remise de l'âme à Allah",
        texte_arabe: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
        phonetique: "Bismika-llâhumma amûtu wa ahyâ",
        traduction: "En Ton nom, ô Allah, je meurs et je vis",
        source: "Hadith",
        reference_complete: "Sahîh Al-Bukhari n° 6312, Sahîh Muslim n° 2711",
        reference_courte: "Sahîh Al-Bukhari n° 6312",
        theme: "sommeil",
        slug: "avant-dormir-remise-ame",
        moment: "Avant de dormir",
        repetitions: "1 fois",
        bienfaits: "Protection durant le sommeil, remise confiante de l'âme à Allah",
        contexte: "Cette invocation exprime la reconnaissance que le sommeil est une forme de mort temporaire et le réveil une résurrection quotidienne.",
        merite: "Place le sommeil sous la protection d'Allah et exprime la confiance totale en Lui",
        explication: "Le sommeil est comparé à la mort car l'âme quitte partiellement le corps. Cette invocation remet notre sort entre les mains d'Allah.",
        hadith_contexte: "D'après Hudhayfah (qu'Allah l'agrée) : 'Lorsque le Prophète (ﷺ) voulait dormir, il plaçait sa main droite sous sa joue et disait : En Ton nom, ô Allah, je meurs et je vis.' (Rapporté par Al-Bukhari)",
        note_importante: "Il est recommandé de placer la main droite sous la joue droite en récitant cette invocation."
      }
    ]
  }
];

// Fonction pour obtenir toutes les invocations
export const getAllInvocations = (): Invocation[] => {
  return invocationsData.flatMap(theme => theme.invocations);
};

// Fonction pour obtenir les invocations par thème
export const getInvocationsByTheme = (themeSlug: string): ThemeInvocation | undefined => {
  return invocationsData.find(theme => theme.slug === themeSlug);
};

// Fonction pour obtenir une invocation spécifique
export const getInvocationById = (id: number): Invocation | undefined => {
  const allInvocations = getAllInvocations();
  return allInvocations.find(invocation => invocation.id === id);
};

// Fonction pour obtenir tous les thèmes
export const getAllThemes = (): Omit<ThemeInvocation, 'invocations'>[] => {
  return invocationsData.map(({ slug, nom, description, icone, couleur }) => ({
    slug,
    nom,
    description,
    icone,
    couleur
  }));
};
