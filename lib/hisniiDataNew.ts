// Données Hisnii - Invocations et Duahs authentiques basées sur https://hisnii.com/

export interface HisniiCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
  slug: string;
  items: HisniiItem[];
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
}

export interface HisniiItem {
  id: string;
  title: string;
  arabicText: string;
  transliteration: string;
  translation: string;
  source: string;
  category: string;
  benefits?: string;
  context?: string;
}

export const hisniiCategories: HisniiCategory[] = [
  {
    id: 'invocations-matin',
    title: 'Invocations du Matin',
    description: 'Les invocations authentiques à réciter chaque matin',
    icon: '🌅',
    slug: 'invocations-matin',
    colors: {
      primary: 'from-orange-500 to-amber-600',
      secondary: 'bg-orange-50 border-orange-200',
      accent: 'text-orange-600',
      background: 'bg-orange-500/10'
    },
    items: [
      {
        id: 'ayat-kursi-matin',
        title: 'Âyatu-l-Kursî',
        arabicText: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ',
        transliteration: 'Allahu la ilaha illa huwa al-hayyu al-qayyum la ta\'khudhuhu sinatun wa la nawm, lahu ma fi as-samawati wa ma fi al-ard, man dha alladhi yashfa\'u \'indahu illa bi-idhnih, ya\'lamu ma bayna aydihim wa ma khalfahum, wa la yuhituna bi-shay\'in min \'ilmihi illa bima sha\'a, wasi\'a kursiyyuhu as-samawati wa al-ard, wa la ya\'uduhu hifzuhuma wa huwa al-\'aliyyu al-\'azim',
        translation: 'Allah ! Point de divinité à part Lui, le Vivant, Celui qui subsiste par lui-même « al-Qayyûm ». Ni somnolence ni sommeil ne Le saisissent. A lui appartient tout ce qui est dans les cieux et sur la terre. Qui peut intercéder auprès de Lui sans Sa permission ? Il connaît leur passé et leur futur. Et, de Sa science, ils n\'embrassent que ce qu\'Il veut. Son Trône « Kursî » déborde les cieux et la terre, dont la garde ne Lui coûte aucune peine. Et Il est le Très Haut, le Très Grand.',
        source: 'Coran 2:255',
        category: 'invocations-matin',
        benefits: 'Protection pour toute la journée'
      },
      {
        id: 'ikhlas-matin',
        title: 'Sourate Al-Ikhlâs (3 fois)',
        arabicText: 'قُلْ هُوَ اللَّهُ أَحَدٌ ۞ اللَّهُ الصَّمَدُ ۞ لَمْ يَلِدْ وَلَمْ يُولَدْ ۞ وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ',
        transliteration: 'Qul huwa Allahu ahad. Allahu as-samad. Lam yalid wa lam yulad. Wa lam yakun lahu kufuwan ahad.',
        translation: 'Dis : « Il est Allah, Unique. Allah, Le Seul à être imploré pour ce que nous désirons. Il n\'a jamais engendré, n\'a pas été engendré non plus. Et nul n\'est égal à Lui. »',
        source: 'Coran 112',
        category: 'invocations-matin'
      },
      {
        id: 'falaq-matin',
        title: 'Sourate Al-Falaq (3 fois)',
        arabicText: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ۞ مِن شَرِّ مَا خَلَقَ ۞ وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ ۞ وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ ۞ وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ',
        transliteration: 'Qul a\'udhu bi-rabbi al-falaq. Min sharri ma khalaq. Wa min sharri ghasiqin idha waqab. Wa min sharri an-naffathati fi al-\'uqad. Wa min sharri hasidin idha hasad.',
        translation: 'Dis : Je cherche protection auprès du Seigneur de l\'aube naissante, contre le mal des êtres qu\'Il a créés, contre le mal de l\'obscurité quand elle s\'approfondit, contre le mal de celles qui soufflent sur les nœuds, et contre le mal de l\'envieux quand il envie.',
        source: 'Coran 113',
        category: 'invocations-matin'
      },
      {
        id: 'nas-matin',
        title: 'Sourate An-Nâs (3 fois)',
        arabicText: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ ۞ مَلِكِ النَّاسِ ۞ إِلَٰهِ النَّاسِ ۞ مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ ۞ الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ ۞ مِنَ الْجِنَّةِ وَالنَّاسِ',
        transliteration: 'Qul a\'udhu bi-rabbi an-nas. Maliki an-nas. Ilahi an-nas. Min sharri al-waswasi al-khannas. Alladhi yuwaswisu fi suduri an-nas. Min al-jinnati wa an-nas.',
        translation: 'Dis : Je cherche protection auprès du Seigneur des hommes. Le Souverain des hommes, Dieu des hommes, contre le mal du mauvais conseiller, furtif, qui souffle le mal dans les poitrines des hommes, qu\'il (le conseiller) soit un djinn, ou un être humain.',
        source: 'Coran 114',
        category: 'invocations-matin'
      }
    ]
  },
  {
    id: 'invocations-soir',
    title: 'Invocations du Soir',
    description: 'Les invocations authentiques à réciter chaque soir',
    icon: '🌙',
    slug: 'invocations-soir',
    colors: {
      primary: 'from-indigo-500 to-purple-600',
      secondary: 'bg-indigo-50 border-indigo-200',
      accent: 'text-indigo-600',
      background: 'bg-indigo-500/10'
    },
    items: [
      {
        id: 'ayat-kursi-soir',
        title: 'Âyatu-l-Kursî',
        arabicText: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ',
        transliteration: 'Allahu la ilaha illa huwa al-hayyu al-qayyum...',
        translation: 'Allah ! Point de divinité à part Lui, le Vivant, Celui qui subsiste par lui-même « al-Qayyûm ». Ni somnolence ni sommeil ne Le saisissent...',
        source: 'Coran 2:255',
        category: 'invocations-soir',
        benefits: 'Protection pour toute la nuit'
      },
      {
        id: 'amsayna-soir',
        title: 'Amsaynâ wa amsa al-mulku lillah',
        arabicText: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذِهِ اللَّيْلَةِ وَخَيْرَ مَا بَعْدَهَا وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَذِهِ اللَّيْلَةِ وَشَرِّ مَا بَعْدَهَا',
        transliteration: 'Amsayna wa amsa al-mulku lillah, wa al-hamdu lillah, la ilaha illa Allah wahdahu la sharika lah, lahu al-mulku wa lahu al-hamd wa huwa \'ala kulli shay\'in qadir. Rabbi as\'aluka khayra ma fi hadhihi al-laylati wa khayra ma ba\'daha wa a\'udhu bika min sharri ma fi hadhihi al-laylati wa sharri ma ba\'daha.',
        translation: 'Nous voici au soir et le règne appartient à Allah. Louange à Allah. Il n\'y a de divinité qu\'Allah, Seul, sans associé. À Lui la royauté, à Lui la louange et Il est capable de toute chose. Mon Seigneur ! Je Te demande le bien de cette nuit et le bien de ce qui vient après elle. Et je cherche Ta protection contre le mal de cette nuit et le mal de ce qui vient après elle.',
        source: 'Muslim',
        category: 'invocations-soir'
      }
    ]
  },
  {
    id: 'quarante-rabbana',
    title: '40 Rabbana',
    description: 'Les 40 invocations commençant par Rabbana du Coran',
    icon: '📿',
    slug: 'quarante-rabbana',
    colors: {
      primary: 'from-emerald-500 to-teal-600',
      secondary: 'bg-emerald-50 border-emerald-200',
      accent: 'text-emerald-600',
      background: 'bg-emerald-500/10'
    },
    items: [
      {
        id: 'rabbana-1',
        title: 'Rabbana Taqabbal minna',
        arabicText: 'رَبَّنَا تَقَبَّلْ مِنَّا ۖ إِنَّكَ أَنتَ السَّمِيعُ الْعَلِيمُ',
        transliteration: 'Rabbana taqabbal minna innaka anta as-sameeʿu al-ʿaleem',
        translation: 'Ô notre Seigneur, accepte ceci de notre part ! Car c\'est Toi certes l\'Audient, l\'Omniscient.',
        source: 'Coran 2:127',
        category: 'quarante-rabbana',
        context: 'Invocation d\'Ibrahim et Ismaël lors de la construction de la Kaaba'
      },
      {
        id: 'rabbana-2',
        title: 'Rabbana wa aj\'alna muslimayni laka',
        arabicText: 'رَبَّنَا وَاجْعَلْنَا مُسْلِمَيْنِ لَكَ وَمِن ذُرِّيَّتِنَا أُمَّةً مُّسْلِمَةً لَّكَ وَأَرِنَا مَنَاسِكَنَا وَتُبْ عَلَيْنَا ۖ إِنَّكَ أَنتَ التَّوَّابُ الرَّحِيمُ',
        transliteration: 'Rabbana wa aj\'alna muslimayni laka wa min dhurriyyatina ummatan muslimatan laka wa arina manasikana wa tub \'alayna innaka anta at-tawwabu ar-raheem',
        translation: 'Et, ô notre Seigneur, fais de nous Tes Soumis, et de notre descendance une communauté soumise à Toi. Et montre-nous nos rites et accepte de nous le repentir. Car c\'est Toi certes l\'Accueillant au repentir, le Miséricordieux.',
        source: 'Coran 2:128',
        category: 'quarante-rabbana'
      },
      {
        id: 'rabbana-3',
        title: 'Rabbana atina fi ad-dunya hasanatan',
        arabicText: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
        transliteration: 'Rabbana atina fi ad-dunya hasanatan wa fi al-akhirati hasanatan wa qina \'adhab an-nar',
        translation: 'Seigneur ! Accorde-nous belle part ici-bas, et belle part aussi dans l\'au-delà ; et protège-nous du châtiment du Feu !',
        source: 'Coran 2:201',
        category: 'quarante-rabbana',
        context: 'Une des invocations les plus complètes'
      }
    ]
  },
  {
    id: 'invocations-protection',
    title: 'Invocations de Protection',
    description: 'Invocations pour se protéger du mal et des djinns',
    icon: '🛡️',
    slug: 'invocations-protection',
    colors: {
      primary: 'from-red-500 to-rose-600',
      secondary: 'bg-red-50 border-red-200',
      accent: 'text-red-600',
      background: 'bg-red-500/10'
    },
    items: [
      {
        id: 'protection-1',
        title: 'A\'udhu billahi min ash-shaytani\'r-rajeem',
        arabicText: 'أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ',
        transliteration: 'A\'udhu billahi min ash-shaytani\'r-rajeem',
        translation: 'Je cherche refuge auprès d\'Allah contre Satan le lapidé.',
        source: 'Coran 16:98',
        category: 'invocations-protection',
        benefits: 'Protection contre Satan'
      },
      {
        id: 'protection-2',
        title: 'A\'udhu bi kalimat Allah at-tammat',
        arabicText: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',
        transliteration: 'A\'udhu bi kalimat Allah at-tammat min sharri ma khalaq',
        translation: 'Je cherche protection par les paroles parfaites d\'Allah contre le mal de ce qu\'Il a créé.',
        source: 'Muslim',
        category: 'invocations-protection',
        benefits: 'Protection générale contre tout mal'
      }
    ]
  },
  {
    id: 'invocations-voyage',
    title: 'Invocations du Voyageur',
    description: 'Invocations pour le voyage et la route',
    icon: '🧳',
    slug: 'invocations-voyage',
    colors: {
      primary: 'from-blue-500 to-cyan-600',
      secondary: 'bg-blue-50 border-blue-200',
      accent: 'text-blue-600',
      background: 'bg-blue-500/10'
    },
    items: [
      {
        id: 'voyage-1',
        title: 'Invocation en montant dans un véhicule',
        arabicText: 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَٰذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ ۞ وَإِنَّا إِلَىٰ رَبِّنَا لَمُنقَلِبُونَ',
        transliteration: 'Subhana alladhi sakhkhara lana hadha wa ma kunna lahu muqrineen wa inna ila rabbina lamunqaliboon',
        translation: 'Gloire à Celui qui a mis ceci à notre service alors que nous n\'étions pas capables de les dominer. Et c\'est vers notre Seigneur que nous retournerons.',
        source: 'Coran 43:13-14',
        category: 'invocations-voyage'
      },
      {
        id: 'voyage-2',
        title: 'Invocation de départ en voyage',
        arabicText: 'اللَّهُمَّ إِنَّا نَسْأَلُكَ فِي سَفَرِنَا هَذَا الْبِرَّ وَالتَّقْوَى وَمِنَ الْعَمَلِ مَا تَرْضَى اللَّهُمَّ هَوِّنْ عَلَيْنَا سَفَرَنَا هَذَا وَاطْوِ عَنَّا بُعْدَهُ اللَّهُمَّ أَنْتَ الصَّاحِبُ فِي السَّفَرِ وَالْخَلِيفَةُ فِي الْأَهْلِ',
        transliteration: 'Allahumma inna nas\'aluka fi safarina hadha al-birra wa at-taqwa wa min al-\'amali ma tarda. Allahumma hawwin \'alayna safarana hadha wa atwi \'anna bu\'dah. Allahumma anta as-sahibu fi as-safari wa al-khalifatu fi al-ahl',
        translation: 'Ô Allah ! Nous Te demandons dans ce voyage la bonté pieuse, la piété et des œuvres qui Te satisfont. Ô Allah ! Facilite-nous ce voyage et rapproche-nous-en la distance. Ô Allah ! Tu es le Compagnon dans le voyage et le Successeur auprès de la famille.',
        source: 'Muslim',
        category: 'invocations-voyage'
      }
    ]
  },
  {
    id: 'invocations-dormir',
    title: 'Invocations avant de Dormir',
    description: 'Invocations à réciter avant de se coucher',
    icon: '🌙',
    slug: 'invocations-dormir',
    colors: {
      primary: 'from-violet-500 to-purple-600',
      secondary: 'bg-violet-50 border-violet-200',
      accent: 'text-violet-600',
      background: 'bg-violet-500/10'
    },
    items: [
      {
        id: 'dormir-1',
        title: 'Bismika Rabbi wada\'tu janbi',
        arabicText: 'بِاسْمِكَ رَبِّي وَضَعْتُ جَنْبِي وَبِكَ أَرْفَعُهُ فَإِنْ أَمْسَكْتَ نَفْسِي فَارْحَمْهَا وَإِنْ أَرْسَلْتَهَا فَاحْفَظْهَا بِمَا تَحْفَظُ بِهِ عِبَادَكَ الصَّالِحِينَ',
        transliteration: 'Bismika Rabbi wada\'tu janbi wa bika arfa\'uh, fa in amsakta nafsi farhamha wa in arsaltaha fahfazha bima tahfazu bihi \'ibadaka as-saliheen',
        translation: 'En Ton nom mon Seigneur, je pose mon flanc et par Toi je le relève. Si Tu retiens mon âme, fais-lui miséricorde, et si Tu la renvoies, préserve-la par ce par quoi Tu préserves Tes serviteurs pieux.',
        source: 'Bukhari et Muslim',
        category: 'invocations-dormir'
      }
    ]
  },
  {
    id: 'invocations-tristesse',
    title: 'Invocations contre la Tristesse',
    description: 'Invocations pour soulager la tristesse et l\'angoisse',
    icon: '💚',
    slug: 'invocations-tristesse',
    colors: {
      primary: 'from-green-500 to-emerald-600',
      secondary: 'bg-green-50 border-green-200',
      accent: 'text-green-600',
      background: 'bg-green-500/10'
    },
    items: [
      {
        id: 'tristesse-1',
        title: 'Allahumma inni \'abduka',
        arabicText: 'اللَّهُمَّ إِنِّي عَبْدُكَ ابْنُ عَبْدِكَ ابْنُ أَمَتِكَ نَاصِيَتِي بِيَدِكَ مَاضٍ فِيَّ حُكْمُكَ عَدْلٌ فِيَّ قَضَاؤُكَ أَسْأَلُكَ بِكُلِّ اسْمٍ هُوَ لَكَ سَمَّيْتَ بِهِ نَفْسَكَ أَوْ عَلَّمْتَهُ أَحَدًا مِنْ خَلْقِكَ أَوْ أَنزَلْتَهُ فِي كِتَابِكَ أَوْ اسْتَأْثَرْتَ بِهِ فِي عِلْمِ الْغَيْبِ عِندَكَ أَنْ تَجْعَلَ الْقُرْآنَ رَبِيعَ قَلْبِي وَنُورَ صَدْرِي وَجِلَاءَ حُزْنِي وَذَهَابَ هَمِّي',
        transliteration: 'Allahumma inni \'abduka ibnu \'abdika ibnu amatika nasiyati biyadika madin fiyya hukmuka \'adlun fiyya qada\'uka as\'aluka bi kulli ismin huwa laka sammayta bihi nafsaka aw \'allamtahu ahadan min khalqika aw anzaltahu fi kitabika aw ista\'tharta bihi fi \'ilm al-ghaybi \'indaka an taj\'al al-Qur\'ana rabi\'a qalbi wa nura sadri wa jala\'a huzni wa dhahaba hammi',
        translation: 'Ô Allah ! Je suis Ton serviteur, fils de Ton serviteur, fils de Ta servante. Mon toupet est dans Ta main, Ton jugement sur moi est exécutoire, Ton décret sur moi est juste. Je Te demande par chaque nom qui T\'appartient, par lequel Tu T\'es nommé, ou que Tu as enseigné à l\'une de Tes créatures, ou que Tu as fait descendre dans Ton Livre, ou que Tu as gardé par-devers Toi dans la science de l\'Invisible, de faire du Coran le printemps de mon cœur, la lumière de ma poitrine, ce qui dissipe ma tristesse et fait partir mon souci.',
        source: 'Ahmad et Ibn Hibban',
        category: 'invocations-tristesse',
        benefits: 'Allah enlèvera toute tristesse et remplacera l\'angoisse par la joie'
      }
    ]
  }
];

export const getHisniiCategoryBySlug = (slug: string): HisniiCategory | undefined => {
  return hisniiCategories.find(category => category.slug === slug);
};

export const getHisniiItemBySlug = (categorySlug: string, itemSlug: string): HisniiItem | undefined => {
  const category = getHisniiCategoryBySlug(categorySlug);
  if (!category) return undefined;
  
  return category.items.find(item => item.id === itemSlug);
};

export const getAllHisniiItems = (): HisniiItem[] => {
  return hisniiCategories.flatMap(category => category.items);
};
