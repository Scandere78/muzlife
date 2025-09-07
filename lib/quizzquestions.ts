export interface QuizQuestion {
  id: string;
  question: string;
  choices: string[];
  answer: string;
  difficulty: 'facile' | 'moyen' | 'difficile';
  indice: string;
  category: string;
  explanation: string;
}

export const quizQuestions: QuizQuestion[] = [
  // === QUESTIONS FACILES ===
  {
    id: "f1",
    question: "Combien y a-t-il de piliers de l'Islam ?",
    choices: ["3", "5", "7", "10"],
    answer: "5",
    difficulty: "facile",
    indice: "C'est un nombre impair entre 3 et 7",
    category: "Piliers de l'Islam",
    explanation: "Les 5 piliers de l'Islam sont : la Shahada (profession de foi), la Salat (prière), la Zakat (aumône), le Sawm (jeûne du Ramadan) et le Hajj (pèlerinage)."
  },
  {
    id: "f2",
    question: "Quel est le premier pilier de l'Islam ?",
    choices: ["La prière", "Le jeûne", "La Shahada", "La Zakat"],
    answer: "La Shahada",
    difficulty: "facile",
    indice: "C'est une déclaration de foi",
    category: "Piliers de l'Islam",
    explanation: "La Shahada est la déclaration de foi : 'Il n'y a pas de divinité en dehors d'Allah et Muhammad est Son messager'."
  },
  {
    id: "f3",
    question: "Combien y a-t-il de sourates dans le Coran ?",
    choices: ["100", "114", "120", "130"],
    answer: "114",
    difficulty: "facile",
    indice: "C'est un nombre entre 110 et 120",
    category: "Coran",
    explanation: "Le Coran contient 114 sourates, de la plus courte (Al-Kawthar) à la plus longue (Al-Baqara)."
  },
  {
    id: "f4",
    question: "Quel mois est sacré pour le jeûne ?",
    choices: ["Rajab", "Shawwal", "Ramadan", "Dhul Hijja"],
    answer: "Ramadan",
    difficulty: "facile",
    indice: "C'est le 9ème mois du calendrier islamique",
    category: "Ramadan",
    explanation: "Le Ramadan est le mois sacré du jeûne, le 9ème mois du calendrier islamique."
  },
  {
    id: "f5",
    question: "Qui est le dernier prophète de l'Islam ?",
    choices: ["Moussa", "Issa", "Muhammad", "Ibrahim"],
    answer: "Muhammad",
    difficulty: "facile",
    indice: "Il est appelé le 'Sceau des Prophètes'",
    category: "Prophètes",
    explanation: "Le Prophète Muhammad (ﷺ) est le dernier prophète envoyé par Allah, appelé 'Khatam an-Nabiyyin'."
  },
  {
    id: "f6",
    question: "Combien de rakats y a-t-il dans la prière du Fajr ?",
    choices: ["2", "3", "4", "5"],
    answer: "2",
    difficulty: "facile",
    indice: "C'est la prière de l'aube",
    category: "Piliers de l'Islam",
    explanation: "La prière du Fajr (aube) contient 2 rakats obligatoires."
  },
  {
    id: "f7",
    question: "Quelle est la plus longue sourate du Coran ?",
    choices: ["Al-Fatiha", "Al-Baqara", "Al-Ikhlas", "Ya-Sin"],
    answer: "Al-Baqara",
    difficulty: "facile",
    indice: "Elle contient 286 versets",
    category: "Coran",
    explanation: "Al-Baqara (La Vache) est la plus longue sourate avec 286 versets."
  },
  {
    id: "f8",
    question: "À quelle heure doit-on rompre le jeûne ?",
    choices: ["Aube", "Coucher du soleil", "Minuit", "Midi"],
    answer: "Coucher du soleil",
    difficulty: "facile",
    indice: "C'est le moment de la prière du Maghrib",
    category: "Ramadan",
    explanation: "Le jeûne est rompu au coucher du soleil (Maghrib), généralement avec des dattes et de l'eau."
  },
  {
    id: "f9",
    question: "Qui est le premier calife de l'Islam ?",
    choices: ["Abu Bakr", "Umar", "Uthman", "Ali"],
    answer: "Abu Bakr",
    difficulty: "facile",
    indice: "Il était le meilleur ami du Prophète",
    category: "Califes et Sahaba",
    explanation: "Abu Bakr As-Siddiq fut le premier calife des musulmans après la mort du Prophète Muhammad (ﷺ)."
  },
  {
    id: "f10",
    question: "Combien y a-t-il de prières obligatoires par jour ?",
    choices: ["3", "5", "7", "10"],
    answer: "5",
    difficulty: "facile",
    indice: "Fajr, Dhuhr, Asr, Maghrib, Isha",
    category: "Piliers de l'Islam",
    explanation: "Les musulmans accomplissent 5 prières obligatoires par jour : Fajr, Dhuhr, Asr, Maghrib et Isha."
  },
  {
    id: "f11",
    question: "Quelle est la première sourate du Coran ?",
    choices: ["Al-Baqara", "Al-Fatiha", "Al-Ikhlas", "An-Nas"],
    answer: "Al-Fatiha",
    difficulty: "facile",
    indice: "Elle est récitée dans chaque rakat de prière",
    category: "Coran",
    explanation: "Al-Fatiha (L'Ouverture) est la première sourate du Coran et doit être récitée dans chaque unité de prière."
  },
  {
    id: "f12",
    question: "Qui était la première épouse du Prophète Muhammad ?",
    choices: ["Aisha", "Khadija", "Hafsa", "Zaynab"],
    answer: "Khadija",
    difficulty: "facile",
    indice: "Elle était une riche commerçante",
    category: "Femmes en Islam",
    explanation: "Khadija bint Khuwaylid fut la première épouse du Prophète et la première à croire en lui."
  },
  {
    id: "f13",
    question: "Quel est le livre saint de l'Islam ?",
    choices: ["La Torah", "L'Evangile", "Le Coran", "La Bible"],
    answer: "Le Coran",
    difficulty: "facile",
    indice: "Il fut révélé au Prophète Muhammad",
    category: "Coran",
    explanation: "Le Coran est le livre saint de l'Islam, révélé au Prophète Muhammad par l'ange Jibril."
  },
  {
    id: "f14",
    question: "Vers quelle direction prient les musulmans ?",
    choices: ["L'Est", "L'Ouest", "La Mecque", "Jérusalem"],
    answer: "La Mecque",
    difficulty: "facile",
    indice: "C'est la direction de la Kaaba",
    category: "Piliers de l'Islam",
    explanation: "Les musulmans prient en direction de la Kaaba à La Mecque, cette direction s'appelle la Qibla."
  },
  {
    id: "f15",
    question: "Quel ange a apporté le Coran au Prophète ?",
    choices: ["Mikail", "Israfil", "Jibril", "Malik"],
    answer: "Jibril",
    difficulty: "facile",
    indice: "Il est aussi appelé Gabriel",
    category: "Coran",
    explanation: "L'ange Jibril (Gabriel) fut chargé d'apporter la révélation coranique au Prophète Muhammad."
  },
  {
    id: "f16",
    question: "Combien de fois par an les musulmans font-ils le pèlerinage ?",
    choices: ["Une fois", "Deux fois", "Trois fois", "Quand ils veulent"],
    answer: "Une fois",
    difficulty: "facile",
    indice: "C'est un devoir pour celui qui en a les moyens",
    category: "Piliers de l'Islam",
    explanation: "Le Hajj (pèlerinage à La Mecque) est obligatoire une fois dans la vie pour celui qui en a les moyens physiques et financiers."
  },
  {
    id: "f17",
    question: "Quel pourcentage de leurs biens les riches musulmans donnent-ils en Zakat ?",
    choices: ["1%", "2.5%", "5%", "10%"],
    answer: "2.5%",
    difficulty: "facile",
    indice: "C'est moins de 5%",
    category: "Piliers de l'Islam",
    explanation: "La Zakat représente 2,5% des biens épargnés pendant une année lunaire complète."
  },
  {
    id: "f18",
    question: "Quel est le nom du voyage nocturne du Prophète ?",
    choices: ["Al-Hijra", "Al-Isra", "Al-Miraj", "Al-Isra wal Miraj"],
    answer: "Al-Isra wal Miraj",
    difficulty: "facile",
    indice: "Il s'agit d'un voyage de nuit vers Jérusalem puis vers les cieux",
    category: "Histoire de l'Islam",
    explanation: "Al-Isra wal Miraj désigne le voyage nocturne du Prophète de La Mecque vers Jérusalem puis son ascension vers les cieux."
  },
  {
    id: "f19",
    question: "Comment s'appelle l'appel à la prière ?",
    choices: ["Takbir", "Adhan", "Tashahhud", "Dua"],
    answer: "Adhan",
    difficulty: "facile",
    indice: "Il est fait depuis le minaret",
    category: "Piliers de l'Islam",
    explanation: "L'Adhan est l'appel à la prière fait par le Muezzin pour inviter les musulmans à accomplir la prière."
  },
  {
    id: "f20",
    question: "Dans quelle grotte le Prophète recevait-il la révélation ?",
    choices: ["Hira", "Thawr", "Uhud", "Quba"],
    answer: "Hira",
    difficulty: "facile",
    indice: "C'est là qu'il méditait avant la révélation",
    category: "Histoire de l'Islam",
    explanation: "La grotte de Hira, située sur la montagne Jabal al-Nur, est l'endroit où le Prophète reçut la première révélation."
  },
  {
    id: "f21",
    question: "Quel est le nom du paradis en Islam ?",
    choices: ["Jannah", "Jahannam", "Barzakh", "Sirat"],
    answer: "Jannah",
    difficulty: "facile",
    indice: "C'est l'opposé de l'enfer",
    category: "Aqida",
    explanation: "Jannah est le nom du paradis en Islam, la demeure éternelle des croyants pieux."
  },
  {
    id: "f22",
    question: "Combien de fils le Prophète Muhammad a-t-il eus ?",
    choices: ["0", "1", "2", "3"],
    answer: "3",
    difficulty: "facile",
    indice: "Al-Qasim, Abdullah et Ibrahim",
    category: "Histoire de l'Islam",
    explanation: "Le Prophète Muhammad eut trois fils : Al-Qasim et Abdullah avec Khadija, et Ibrahim avec Maria la Copte."
  },
  {
    id: "f23",
    question: "Quel jour de la semaine est sacré pour les musulmans ?",
    choices: ["Lundi", "Mercredi", "Vendredi", "Dimanche"],
    answer: "Vendredi",
    difficulty: "facile",
    indice: "C'est le jour de la prière collective",
    category: "Piliers de l'Islam",
    explanation: "Le vendredi (Jumu'ah) est le jour sacré des musulmans avec la prière collective obligatoire pour les hommes."
  },

  // === QUESTIONS MOYENNES ===
  {
    id: "m1",
    question: "Quel prophète a construit l'arche ?",
    choices: ["Ibrahim", "Nuh", "Yusuf", "Moussa"],
    answer: "Nuh",
    difficulty: "moyen",
    indice: "Il a sauvé les animaux du déluge",
    category: "Prophètes",
    explanation: "Le prophète Nuh (Noé) a construit l'arche sur ordre d'Allah pour sauver les croyants et les animaux."
  },
  {
    id: "m2",
    question: "Quel est le nom de la règle qui allonge la prononciation d'une lettre ?",
    choices: ["Idgham", "Madd", "Qalqala", "Ikhfa"],
    answer: "Madd",
    difficulty: "moyen",
    indice: "C'est lié à l'allongement des voyelles",
    category: "Tajweed",
    explanation: "Le Madd est la règle de tajweed qui consiste à allonger la prononciation d'une lettre."
  },
  {
    id: "m3",
    question: "Combien de noms d'Allah sont mentionnés comme Asma'ul Husna ?",
    choices: ["99", "100", "50", "101"],
    answer: "99",
    difficulty: "moyen",
    indice: "C'est un nombre impair se terminant par 9",
    category: "Aqida",
    explanation: "Allah a 99 noms (Asma'ul Husna) qui décrivent Ses attributs."
  },
  {
    id: "m4",
    question: "Quelle nuit est meilleure que 1000 mois ?",
    choices: ["Laylat al-Qadr", "Laylat al-Miraj", "Laylat al-Bara'ah", "Laylat al-Raghaib"],
    answer: "Laylat al-Qadr",
    difficulty: "moyen",
    indice: "Elle se trouve dans les 10 derniers jours du Ramadan",
    category: "Ramadan",
    explanation: "Laylat al-Qadr (La Nuit du Destin) est décrite dans le Coran comme meilleure que mille mois."
  },
  {
    id: "m5",
    question: "Quel prophète a parlé dans son berceau ?",
    choices: ["Issa", "Moussa", "Ibrahim", "Yusuf"],
    answer: "Issa",
    difficulty: "moyen",
    indice: "Il a défendu sa mère des accusations",
    category: "Prophètes",
    explanation: "Le prophète Issa (Jésus) a parlé dans son berceau pour défendre sa mère Maryam."
  },
  {
    id: "m6",
    question: "Quelle sourate est appelée 'Le cœur du Coran' ?",
    choices: ["Al-Baqara", "Ya-Sin", "Al-Kahf", "Al-Fatiha"],
    answer: "Ya-Sin",
    difficulty: "moyen",
    indice: "C'est la 36ème sourate",
    category: "Coran",
    explanation: "Ya-Sin est souvent appelée 'le cœur du Coran' en raison de son importance."
  },
  {
    id: "m7",
    question: "Quel est le repas pris avant l'aube pendant le Ramadan ?",
    choices: ["Iftar", "Suhur", "Taraweeh", "Qiyam"],
    answer: "Suhur",
    difficulty: "moyen",
    indice: "C'est le repas de l'aube",
    category: "Ramadan",
    explanation: "Le Suhur est le repas pris avant l'aube pendant le Ramadan."
  },
  {
    id: "m8",
    question: "Dans quelle ville est né le Prophète Muhammad ?",
    choices: ["Médine", "La Mecque", "Damas", "Bagdad"],
    answer: "La Mecque",
    difficulty: "moyen",
    indice: "C'est la ville sainte avec la Kaaba",
    category: "Histoire de l'Islam",
    explanation: "Le Prophète Muhammad (ﷺ) est né à La Mecque vers l'an 570."
  },
  {
    id: "m9",
    question: "Qui était surnommé 'Al-Siddiq' (Le Véridique) ?",
    choices: ["Umar", "Abu Bakr", "Uthman", "Ali"],
    answer: "Abu Bakr",
    difficulty: "moyen",
    indice: "Il fut le premier calife",
    category: "Califes et Sahaba",
    explanation: "Abu Bakr était surnommé 'As-Siddiq' car il crut immédiatement au voyage nocturne du Prophète."
  },
  {
    id: "m10",
    question: "Combien d'épouses le Prophète Muhammad a-t-il eues ?",
    choices: ["9", "11", "13", "15"],
    answer: "11",
    difficulty: "moyen",
    indice: "Plus de 10 mais moins de 15",
    category: "Femmes en Islam",
    explanation: "Le Prophète Muhammad eut 11 épouses au total, appelées les 'Mères des Croyants' (Ummahaat al-Mu'mineen)."
  },
  {
    id: "m11",
    question: "Quelle sourate ne commence pas par 'Bismillah' ?",
    choices: ["At-Tawbah", "Al-Fatiha", "Al-Ikhlas", "An-Nas"],
    answer: "At-Tawbah",
    difficulty: "moyen",
    indice: "C'est la 9ème sourate",
    category: "Coran",
    explanation: "At-Tawbah (Le Repentir) est la seule sourate qui ne commence pas par la Basmala."
  },
  {
    id: "m12",
    question: "Quel est le nom de l'ange de la mort ?",
    choices: ["Jibril", "Mikail", "Azrail", "Israfil"],
    answer: "Azrail",
    difficulty: "moyen",
    indice: "Il est chargé de prendre les âmes",
    category: "Aqida",
    explanation: "Azrail (Malak al-Mawt) est l'ange chargé de prendre les âmes au moment de la mort."
  },
  {
    id: "m13",
    question: "Combien de hadiths contient le Sahih al-Bukhari ?",
    choices: ["5000", "7563", "9000", "12000"],
    answer: "7563",
    difficulty: "moyen",
    indice: "C'est entre 7000 et 8000",
    category: "Hadith et Sunnah",
    explanation: "Le Sahih al-Bukhari contient 7563 hadiths avec les répétitions, considéré comme l'un des recueils les plus authentiques."
  },
  {
    id: "m14",
    question: "Quel prophète a été avalé par une baleine ?",
    choices: ["Yunus", "Yusuf", "Ayyub", "Zakariya"],
    answer: "Yunus",
    difficulty: "moyen",
    indice: "Il est aussi appelé Dhul-Nun",
    category: "Prophètes",
    explanation: "Le prophète Yunus (Jonas) fut avalé par une grande baleine après avoir fui sa mission prophétique."
  },
  {
    id: "m15",
    question: "Quelle bataille est appelée 'Ghazwat Badr' ?",
    choices: ["La première bataille", "La bataille des tranchées", "La bataille d'Uhud", "La conquête de La Mecque"],
    answer: "La première bataille",
    difficulty: "moyen",
    indice: "Elle eut lieu en l'an 2 de l'Hégire",
    category: "Histoire de l'Islam",
    explanation: "La bataille de Badr fut la première grande victoire militaire des musulmans en l'an 2 de l'Hégire."
  },
  {
    id: "m16",
    question: "Combien de piliers a la foi (Iman) ?",
    choices: ["5", "6", "7", "8"],
    answer: "6",
    difficulty: "moyen",
    indice: "Un de plus que les piliers de l'Islam",
    category: "Aqida",
    explanation: "Les 6 piliers de la foi sont : Allah, Ses anges, Ses livres, Ses prophètes, le Jour dernier, le destin."
  },
  {
    id: "m17",
    question: "Quelle invocation récite-t-on avant de manger ?",
    choices: ["Bismillah", "Alhamdulillah", "SubhanAllah", "La hawla wa la quwwata illa billah"],
    answer: "Bismillah",
    difficulty: "moyen",
    indice: "C'est le même début que les sourates",
    category: "Invocations (Duas)",
    explanation: "On récite 'Bismillah' (Au nom d'Allah) avant de commencer à manger, selon la Sunnah du Prophète."
  },
  {
    id: "m18",
    question: "Quel calife a compilé le Coran en un seul livre ?",
    choices: ["Abu Bakr", "Umar", "Uthman", "Ali"],
    answer: "Uthman",
    difficulty: "moyen",
    indice: "Il a unifié les différentes copies",
    category: "Sciences du Coran",
    explanation: "Le calife Uthman ibn Affan a standardisé le Coran en une seule version officielle vers 650 après J.-C."
  },
  {
    id: "m19",
    question: "Combien d'années a duré la révélation du Coran ?",
    choices: ["20 ans", "23 ans", "25 ans", "30 ans"],
    answer: "23 ans",
    difficulty: "moyen",
    indice: "13 ans à La Mecque et 10 à Médine",
    category: "Sciences du Coran",
    explanation: "Le Coran fut révélé sur une période de 23 ans : 13 ans à La Mecque et 10 ans à Médine."
  },
  {
    id: "m20",
    question: "Quel est le nom de la pierre noire dans la Kaaba ?",
    choices: ["Hajar al-Aswad", "Hajar al-Abyad", "Maqam Ibrahim", "Rukn Yamani"],
    answer: "Hajar al-Aswad",
    difficulty: "moyen",
    indice: "Aswad signifie noir en arabe",
    category: "Géographie islamique",
    explanation: "Hajar al-Aswad (la Pierre Noire) est enchâssée dans l'angle est de la Kaaba et est embrassée lors du Tawaf."
  },
  {
    id: "m21",
    question: "Quel compagnon était surnommé 'Sayf Allah al-Maslul' ?",
    choices: ["Khalid ibn al-Walid", "Sa'd ibn Abi Waqqas", "Abu Ubayda", "Amr ibn al-As"],
    answer: "Khalid ibn al-Walid",
    difficulty: "moyen",
    indice: "Cela signifie 'l'épée dégainée d'Allah'",
    category: "Califes et Sahaba",
    explanation: "Khalid ibn al-Walid était surnommé 'Sayf Allah al-Maslul' (l'épée dégainée d'Allah) pour ses prouesses militaires."
  },
  {
    id: "m22",
    question: "Quelle sourate est recommandée à lire le vendredi ?",
    choices: ["Al-Fatiha", "Ya-Sin", "Al-Kahf", "Al-Mulk"],
    answer: "Al-Kahf",
    difficulty: "moyen",
    indice: "Elle parle des gens de la caverne",
    category: "Coran",
    explanation: "Il est recommandé de lire la sourate Al-Kahf (La Caverne) le vendredi selon plusieurs hadiths authentiques."
  },
  {
    id: "m23",
    question: "Quel est le mois sacré qui précède le Ramadan ?",
    choices: ["Rajab", "Sha'ban", "Shawwal", "Dhul Qi'dah"],
    answer: "Sha'ban",
    difficulty: "moyen",
    indice: "C'est le 8ème mois du calendrier islamique",
    category: "Fiqh",
    explanation: "Sha'ban est le mois qui précède le Ramadan, le Prophète y jeûnait beaucoup en préparation."
  },
  {
    id: "m24",
    question: "Combien de fois le mot 'Coran' apparaît-il dans le Coran ?",
    choices: ["50", "70", "100", "114"],
    answer: "70",
    difficulty: "moyen",
    indice: "C'est un nombre rond entre 50 et 100",
    category: "Sciences du Coran",
    explanation: "Le mot 'Qur'an' apparaît exactement 70 fois dans le Coran, témoignant de l'harmonie mathématique du texte."
  },
  {
    id: "m25",
    question: "Quelle était la profession de la première épouse du Prophète ?",
    choices: ["Tisserande", "Commerçante", "Médecin", "Enseignante"],
    answer: "Commerçante",
    difficulty: "moyen",
    indice: "Elle était très riche et dirigeait des caravanes",
    category: "Femmes en Islam",
    explanation: "Khadija bint Khuwaylid était une riche commerçante qui dirigeait des caravanes commerciales."
  },

  // === QUESTIONS DIFFICILES ===
  {
    id: "d1",
    question: "Quelle lettre n'est jamais prononcée dans la basmala ?",
    choices: ["Alif", "Lam", "Nun", "Mim"],
    answer: "Alif",
    difficulty: "difficile",
    indice: "C'est lié à la règle de 'alif wasla'",
    category: "Tajweed",
    explanation: "Dans la Basmala, l'alif après le lam de 'Allah' n'est pas prononcé (alif wasla)."
  },
  {
    id: "d2",
    question: "Combien de types de Qalqala existe-t-il ?",
    choices: ["2", "3", "5", "7"],
    answer: "2",
    difficulty: "difficile",
    indice: "Il y a la mineure et la majeure",
    category: "Tajweed",
    explanation: "Il existe 2 types de Qalqala : Sughra (mineure) et Kubra (majeure)."
  },
  {
    id: "d3",
    question: "Quel est le premier devoir de chaque musulman ?",
    choices: ["Apprendre le Coran", "Comprendre le Tawhid", "Prier 5 fois par jour", "Faire le Hajj"],
    answer: "Comprendre le Tawhid",
    difficulty: "difficile",
    indice: "C'est lié à l'unicité d'Allah",
    category: "Aqida",
    explanation: "Le Tawhid (l'unicité d'Allah) est le concept fondamental de l'Islam."
  },
  {
    id: "d4",
    question: "Quelle année marque le début du calendrier islamique ?",
    choices: ["570", "622", "632", "610"],
    answer: "622",
    difficulty: "difficile",
    indice: "C'est l'année de l'Hégire",
    category: "Histoire de l'Islam",
    explanation: "L'année 622 marque l'Hégire, la migration du Prophète de La Mecque à Médine."
  },
  {
    id: "d5",
    question: "Combien de rakats y a-t-il dans la prière du Maghrib ?",
    choices: ["2", "3", "4", "5"],
    answer: "3",
    difficulty: "difficile",
    indice: "C'est la seule prière avec 3 rakats obligatoires",
    category: "Piliers de l'Islam",
    explanation: "La prière du Maghrib (coucher du soleil) contient 3 rakats obligatoires."
  },
  {
    id: "d6",
    question: "Quel est le nom de la règle de fusion en tajweed ?",
    choices: ["Madd", "Idgham", "Qalqala", "Ikhfa"],
    answer: "Idgham",
    difficulty: "difficile",
    indice: "C'est quand une lettre se fond dans la suivante",
    category: "Tajweed",
    explanation: "L'Idgham est la règle de fusion où une lettre se fond dans la suivante."
  },
  {
    id: "d7",
    question: "Quel prophète a été jeté dans le feu par son peuple ?",
    choices: ["Ibrahim", "Nuh", "Moussa", "Yusuf"],
    answer: "Ibrahim",
    difficulty: "difficile",
    indice: "Allah a rendu le feu froid pour lui",
    category: "Prophètes",
    explanation: "Le prophète Ibrahim a été jeté dans le feu par son peuple, mais Allah l'a rendu froid."
  },
  {
    id: "d8",
    question: "Quelle est la sourate la plus courte du Coran ?",
    choices: ["Al-Fatiha", "Al-Ikhlas", "Al-Kawthar", "An-Nas"],
    answer: "Al-Kawthar",
    difficulty: "difficile",
    indice: "Elle ne contient que 3 versets",
    category: "Coran",
    explanation: "Al-Kawthar est la plus courte sourate du Coran avec seulement 3 versets."
  },
  {
    id: "d9",
    question: "Quel compagnon a été surnommé 'Dhun-Noorayn' (Celui aux deux lumières) ?",
    choices: ["Abu Bakr", "Umar", "Uthman", "Ali"],
    answer: "Uthman",
    difficulty: "difficile",
    indice: "Il épousa deux filles du Prophète",
    category: "Califes et Sahaba",
    explanation: "Uthman ibn Affan était surnommé 'Dhun-Noorayn' car il épousa successivement Ruqayya puis Umm Kulthum, filles du Prophète."
  },
  {
    id: "d10",
    question: "Combien de fois le nom 'Muhammad' apparaît-il dans le Coran ?",
    choices: ["3", "4", "5", "7"],
    answer: "4",
    difficulty: "difficile",
    indice: "Moins de 5 fois",
    category: "Sciences du Coran",
    explanation: "Le nom 'Muhammad' n'apparaît que 4 fois dans le Coran, le nom 'Ahmad' apparaît une fois."
  },
  {
    id: "d11",
    question: "Quel est le nombre total de prostrations (Sajda) dans le Coran ?",
    choices: ["11", "14", "15", "17"],
    answer: "14",
    difficulty: "difficile",
    indice: "Entre 10 et 20",
    category: "Sciences du Coran",
    explanation: "Il y a 14 versets de prostration (Sajda at-Tilawah) répartis dans différentes sourates du Coran."
  },
  {
    id: "d12",
    question: "Quel était le nom du chameau de la chamelle du prophète Salih ?",
    choices: ["Elle n'avait pas de nom", "Naqat Allah", "Al-Buraq", "Qaswa"],
    answer: "Naqat Allah",
    difficulty: "difficile",
    indice: "Cela signifie 'chamelle d'Allah'",
    category: "Prophètes",
    explanation: "La chamelle du prophète Salih était appelée 'Naqat Allah' (la chamelle d'Allah), signe miraculeux pour son peuple."
  },
  {
    id: "d13",
    question: "Dans quel hadith le Prophète a-t-il dit: 'Les actions ne valent que par les intentions' ?",
    choices: ["Premier hadith de Bukhari", "Premier hadith de Muslim", "Premier hadith des 40 Nawawy", "Tous les trois"],
    answer: "Tous les trois",
    difficulty: "difficile",
    indice: "C'est un hadith très célèbre",
    category: "Hadith et Sunnah",
    explanation: "Ce hadith d'Umar ibn al-Khattab est le premier dans Bukhari, Muslim, et les 40 Hadiths d'An-Nawawi."
  },
  {
    id: "d14",
    question: "Combien de Sujud (prosternations) contient la sourate Al-Alaq ?",
    choices: ["0", "1", "2", "3"],
    answer: "1",
    difficulty: "difficile",
    indice: "Elle contient le verset 'Prosternes-toi et rapproche-toi'",
    category: "Sciences du Coran",
    explanation: "La sourate Al-Alaq contient une prosternation au verset 19: 'Prosternes-toi et rapproche-toi [d'Allah]'."
  },
  {
    id: "d15",
    question: "Quel est le nom de l'épée du Prophète Muhammad ?",
    choices: ["Dhul-Fiqar", "Al-Battar", "Al-Mikhdham", "Plusieurs épées"],
    answer: "Plusieurs épées",
    difficulty: "difficile",
    indice: "Il possédait plusieurs armes",
    category: "Histoire de l'Islam",
    explanation: "Le Prophète possédait plusieurs épées, dont Dhul-Fiqar, Al-Battar, et Al-Mikhdham entre autres."
  },
  {
    id: "d16",
    question: "Quel compagnon était surnommé 'Al-Farooq' (Celui qui distingue) ?",
    choices: ["Abu Bakr", "Umar ibn al-Khattab", "Uthman", "Ali"],
    answer: "Umar ibn al-Khattab",
    difficulty: "difficile",
    indice: "Il distinguait le vrai du faux",
    category: "Califes et Sahaba",
    explanation: "Umar ibn al-Khattab était surnommé 'Al-Farooq' car il distinguait clairement entre la vérité et le mensonge."
  },
  {
    id: "d17",
    question: "Combien de lettres solaires (Huruf Shamsiyya) y a-t-il en arabe ?",
    choices: ["12", "14", "16", "18"],
    answer: "14",
    difficulty: "difficile",
    indice: "La moitié de l'alphabet arabe environ",
    category: "Tajweed",
    explanation: "Il y a 14 lettres solaires en arabe qui assimilent le 'L' de l'article défini 'Al'."
  },
  {
    id: "d18",
    question: "Quel est le nom de la bataille où le Prophète n'était pas présent ?",
    choices: ["Mu'tah", "Badr", "Uhud", "Khandaq"],
    answer: "Mu'tah",
    difficulty: "difficile",
    indice: "Elle eut lieu en Jordanie actuelle",
    category: "Histoire de l'Islam",
    explanation: "La bataille de Mu'tah est la seule grande bataille où le Prophète n'était pas présent physiquement."
  },
  {
    id: "d19",
    question: "Combien de versets mecquois contient le Coran ?",
    choices: ["4870", "4613", "4717", "4539"],
    answer: "4613",
    difficulty: "difficile",
    indice: "Plus de 4500 versets",
    category: "Sciences du Coran",
    explanation: "Le Coran contient 4613 versets mecquois sur un total de 6236 versets, soit environ 74%."
  },
  {
    id: "d20",
    question: "Quel est le nom du puits empoisonné où le Prophète but ?",
    choices: ["Bir Ma'una", "Bir Zamzam", "Bir Budah", "Bir al-Ghars"],
    answer: "Bir Budah",
    difficulty: "difficile",
    indice: "Une femme juive empoisonna l'eau",
    category: "Histoire de l'Islam",
    explanation: "Bir Budah est le puits où une femme juive tenta d'empoisonner le Prophète, mais Allah l'en informa."
  },
  {
    id: "d21",
    question: "Quelle sourate contient le verset du Trône (Ayat al-Kursi) ?",
    choices: ["Al-Baqara", "Al-Imran", "An-Nisa", "Al-Ma'ida"],
    answer: "Al-Baqara",
    difficulty: "difficile",
    indice: "C'est dans la plus longue sourate",
    category: "Coran",
    explanation: "Ayat al-Kursi se trouve dans la sourate Al-Baqara, verset 255, et est considéré comme le plus grand verset du Coran."
  },
  {
    id: "d22",
    question: "Combien d'anges participeront au Jour du Jugement selon le Coran ?",
    choices: ["7", "8", "70000", "Innombrable"],
    answer: "8",
    difficulty: "difficile",
    indice: "Le Coran mentionne un nombre précis",
    category: "Aqida",
    explanation: "Selon le Coran (69:17), huit anges porteront le Trône d'Allah le Jour de la Résurrection."
  },
  {
    id: "d23",
    question: "Quel est le nom de l'éléphant d'Abraha qui vint attaquer la Kaaba ?",
    choices: ["Mahmud", "Mashhud", "Il n'avait pas de nom", "Ahmad"],
    answer: "Mahmud",
    difficulty: "difficile",
    indice: "Son nom ressemble à celui du Prophète",
    category: "Histoire de l'Islam",
    explanation: "L'éléphant d'Abraha s'appelait Mahmud. Il refusa d'avancer vers la Kaaba lors de l'attaque."
  },
  {
    id: "d24",
    question: "Combien de fois le mot 'Dunya' (monde d'ici-bas) apparaît-il dans le Coran ?",
    choices: ["115", "120", "145", "200"],
    answer: "115",
    difficulty: "difficile",
    indice: "Même nombre que 'Akhirah' (au-delà)",
    category: "Sciences du Coran",
    explanation: "Les mots 'Dunya' et 'Akhirah' apparaissent chacun exactement 115 fois dans le Coran, montrant l'équilibre."
  },
  {
    id: "d25",
    question: "Quel calife a introduit le calendrier islamique (Hijri) ?",
    choices: ["Abu Bakr", "Umar ibn al-Khattab", "Uthman", "Ali"],
    answer: "Umar ibn al-Khattab",
    difficulty: "difficile",
    indice: "Il a organisé beaucoup d'aspects de l'État islamique",
    category: "Histoire de l'Islam",
    explanation: "Umar ibn al-Khattab a officiellement établi le calendrier islamique en prenant l'Hégire comme point de départ."
  },
  {
    id: "d26",
    question: "Quelle est la règle de Tajweed appelée 'Ghunna' ?",
    choices: ["Nasalisation", "Allongement", "Arrêt", "Vibration"],
    answer: "Nasalisation",
    difficulty: "difficile",
    indice: "C'est lié au nez",
    category: "Tajweed",
    explanation: "La Ghunna est la nasalisation naturelle qui accompagne les lettres Nun et Mim dans certaines positions."
  },
  {
    id: "d27",
    question: "Combien de types de Madd (allongement) existe-t-il en Tajweed ?",
    choices: ["3", "5", "7", "9"],
    answer: "9",
    difficulty: "difficile",
    indice: "Plus de 5 types différents",
    category: "Tajweed",
    explanation: "Il existe 9 types principaux de Madd en Tajweed, chacun avec ses propres règles et durées d'allongement."
  },
  {
    id: "d28",
    question: "Quel était le nom de la nourrice du Prophète Muhammad ?",
    choices: ["Halima As-Sa'diyya", "Thuwaybah", "Les deux", "Aminah"],
    answer: "Les deux",
    difficulty: "difficile",
    indice: "Il en eut deux",
    category: "Histoire de l'Islam",
    explanation: "Le Prophète eut deux nourrices : d'abord Thuwaybah, puis Halima As-Sa'diyya chez qui il grandit dans le désert."
  }
];

// Fonction pour obtenir des questions par difficulté
export function getQuestionsByDifficulty(difficulty: 'facile' | 'moyen' | 'difficile'): QuizQuestion[] {
  return quizQuestions.filter(q => q.difficulty === difficulty);
}

// Fonction pour obtenir des questions aléatoires
export function getRandomQuestions(difficulty: 'facile' | 'moyen' | 'difficile', count: number = 10): QuizQuestion[] {
  const questions = getQuestionsByDifficulty(difficulty);
  const shuffled = questions.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, questions.length));
}
