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
