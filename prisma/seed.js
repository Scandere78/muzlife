import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const categories = [
  { name: "Piliers de l'Islam", description: "Les cinq piliers fondamentaux de l'Islam", icon: "🕌", color: "#10B981" },
  { name: "Ramadan", description: "Le mois sacré du jeûne", icon: "🌙", color: "#6366F1" },
  { name: "Prophètes", description: "Les messagers d'Allah", icon: "📿", color: "#F59E0B" },
  { name: "Tajweed", description: "Les règles de récitation du Coran", icon: "📖", color: "#EF4444" },
  { name: "Aqida", description: "La croyance islamique", icon: "🤲", color: "#8B5CF6" },
  { name: "Coran", description: "Le livre saint de l'Islam", icon: "📚", color: "#06B6D4" },
  { name: "Histoire de l'Islam", description: "L'histoire de la communauté musulmane", icon: "🏛️", color: "#84CC16" }
];

const questions = [
  // Piliers de l'Islam
  { 
    category: "Piliers de l'Islam",
    question: "Quel est le premier pilier de l'Islam ?", 
    options: ["La prière", "Le jeûne", "La Shahada"], 
    answer: "La Shahada", 
    explanation: "La Shahada, la déclaration de foi musulmane (« Il n'y a pas de divinité en dehors de Dieu et Muhammad est son prophète »), est le premier des cinq piliers de l'islam.",
    source: "Sahih Muslim 1",
    difficulty: "easy"
  },
  { 
    category: "Piliers de l'Islam",
    question: "Combien de rakats y a-t-il dans la prière du Fajr ?", 
    options: ["2", "4", "3"], 
    answer: "2", 
    explanation: "La prière du Fajr (l'aube) est composée de 2 rakats obligatoires, contrairement à d'autres prières qui peuvent en avoir 3 ou 4.",
    source: "Sahih Bukhari 1099",
    difficulty: "normal"
  },
  { 
    category: "Piliers de l'Islam",
    question: "Combien y a-t-il de piliers de l'Islam ?", 
    options: ["3", "5", "7"], 
    answer: "5", 
    explanation: "Les cinq piliers de l'Islam sont: la Shahada (profession de foi), la Salat (prière), la Zakat (aumône), le Sawm (jeûne du Ramadan) et le Hajj (pèlerinage à La Mecque).",
    source: "Sahih Bukhari 8",
    difficulty: "easy"
  },
  { 
    category: "Piliers de l'Islam",
    question: "Quel est le troisième pilier de l'Islam ?", 
    options: ["Le jeûne", "La zakat", "Le pèlerinage"], 
    answer: "La zakat", 
    explanation: "La Zakat (aumône obligatoire) est le troisième pilier de l'Islam, après la Shahada et la Salat (prière).",
    source: "Sahih Bukhari 24",
    difficulty: "normal"
  },

  // Ramadan
  { 
    category: "Ramadan",
    question: "Quel mois est sacré pour le jeûne ?", 
    options: ["Rajab", "Shawwal", "Ramadan"], 
    answer: "Ramadan", 
    explanation: "Le Ramadan est le neuvième mois du calendrier musulman durant lequel les musulmans pratiquent le jeûne du lever au coucher du soleil.",
    source: "Coran 2:185",
    difficulty: "easy"
  },
  { 
    category: "Ramadan",
    question: "À quelle heure doit-on rompre le jeûne ?", 
    options: ["Aube", "Coucher du soleil", "Minuit"], 
    answer: "Coucher du soleil", 
    explanation: "Le jeûne est rompu au moment du coucher du soleil (maghrib), généralement avec des dattes et de l'eau selon la tradition prophétique.",
    source: "Sahih Bukhari 1954",
    difficulty: "normal"
  },
  { 
    category: "Ramadan",
    question: "Quel est le repas pris avant l'aube pendant le Ramadan ?", 
    options: ["Iftar", "Suhur", "Taraweeh"], 
    answer: "Suhur", 
    explanation: "Le Suhur est le repas pris avant l'aube pendant le Ramadan, tandis que l'Iftar est le repas pris au coucher du soleil pour rompre le jeûne.",
    source: "Sahih Muslim 1095",
    difficulty: "normal"
  },
  { 
    category: "Ramadan",
    question: "Quelle nuit est meilleure que 1000 mois ?", 
    options: ["Laylat al-Qadr", "Laylat al-Miraj", "Laylat al-Bara'ah"], 
    answer: "Laylat al-Qadr", 
    explanation: "Laylat al-Qadr (La Nuit du Destin) est décrite dans le Coran comme meilleure que mille mois. Elle se situe durant les 10 derniers jours du Ramadan.",
    source: "Coran 97:3",
    difficulty: "hard"
  },

  // Prophètes
  { 
    category: "Prophètes",
    question: "Qui est le dernier prophète de l'Islam ?", 
    options: ["Moussa", "Issa", "Muhammad"], 
    answer: "Muhammad", 
    explanation: "Le Prophète Muhammad (que la paix soit sur lui) est considéré comme le dernier prophète (Khatam an-Nabiyyin) dans l'Islam.",
    source: "Sahih Bukhari 33",
    difficulty: "easy"
  },
  { 
    category: "Prophètes",
    question: "Quel prophète a construit l'arche ?", 
    options: ["Ibrahim", "Nuh", "Yusuf"], 
    answer: "Nuh", 
    explanation: "Le prophète Nuh (Noé) a construit l'arche sur ordre d'Allah pour sauver les croyants et les animaux du déluge.",
    source: "Coran 11:37",
    difficulty: "normal"
  },
  { 
    category: "Prophètes",
    question: "Quel prophète a parlé dans son berceau ?", 
    options: ["Issa", "Moussa", "Ibrahim"], 
    answer: "Issa", 
    explanation: "Le prophète Issa (Jésus) a parlé dans son berceau pour défendre sa mère Maryam (Marie) des accusations portées contre elle.",
    source: "Coran 19:29-30",
    difficulty: "hard"
  },

  // Tajweed
  { 
    category: "Tajweed",
    question: "Quel est le nom de la règle qui allonge la prononciation d'une lettre ?", 
    options: ["Idgham", "Madd", "Qalqala"], 
    answer: "Madd", 
    explanation: "Le Madd est la règle de tajweed qui consiste à allonger la prononciation d'une lettre, généralement les lettres de prolongation (alif, waw, ya).",
    source: "Règles du Tajweed",
    difficulty: "normal"
  },
  { 
    category: "Tajweed",
    question: "Quelle lettre n'est jamais prononcée dans la basmala ?", 
    options: ["Alif", "Lam", "Nun"], 
    answer: "Alif", 
    explanation: "Dans la Basmala (Bismillah), l'alif après le lam de 'Allah' n'est pas prononcé, c'est ce qu'on appelle 'alif wasla'.",
    source: "Règles du Tajweed",
    difficulty: "hard"
  },
  { 
    category: "Tajweed",
    question: "Combien de types de Qalqala existe-t-il ?", 
    options: ["2", "3", "5"], 
    answer: "2", 
    explanation: "Il existe 2 types de Qalqala : la Qalqala Sughra (mineure) et la Qalqala Kubra (majeure), selon la position des lettres de Qalqala.",
    source: "Règles du Tajweed",
    difficulty: "hard"
  },

  // Aqida
  { 
    category: "Aqida",
    question: "Combien de noms d'Allah sont mentionnés comme Asma'ul Husna ?", 
    options: ["99", "100", "50"], 
    answer: "99", 
    explanation: "Selon la tradition, Allah a 99 noms (Asma'ul Husna) qui décrivent Ses attributs, bien qu'Il possède d'autres noms connus uniquement de Lui.",
    source: "Sahih Bukhari 2736",
    difficulty: "normal"
  },
  { 
    category: "Aqida",
    question: "Quel est le premier devoir de chaque musulman ?", 
    options: ["Apprendre le Coran", "Comprendre le Tawhid", "Prier 5 fois par jour"], 
    answer: "Comprendre le Tawhid", 
    explanation: "Le Tawhid (l'unicité d'Allah) est le concept fondamental de l'Islam et comprendre cette unicité est considéré comme le premier devoir du musulman.",
    source: "Coran 47:19",
    difficulty: "hard"
  },

  // Coran
  { 
    category: "Coran",
    question: "Combien y a-t-il de sourates dans le Coran ?", 
    options: ["100", "114", "120"], 
    answer: "114", 
    explanation: "Le Saint Coran contient 114 sourates (chapitres) de longueurs différentes, allant de la plus courte (Al-Kawthar) à la plus longue (Al-Baqara).",
    source: "Coran",
    difficulty: "easy"
  },
  { 
    category: "Coran",
    question: "Quelle est la plus longue sourate du Coran ?", 
    options: ["Al-Fatiha", "Al-Baqara", "Al-Ikhlas"], 
    answer: "Al-Baqara", 
    explanation: "Al-Baqara (La Vache) est la plus longue sourate du Coran avec 286 versets. Elle est également la première sourate révélée à Médine.",
    source: "Coran 2:1",
    difficulty: "normal"
  },
  { 
    category: "Coran",
    question: "Quelle sourate est appelée 'Le cœur du Coran' ?", 
    options: ["Al-Baqara", "Ya-Sin", "Al-Kahf"], 
    answer: "Ya-Sin", 
    explanation: "Ya-Sin est souvent appelée 'le cœur du Coran' en raison de son importance et des bénédictions associées à sa récitation.",
    source: "Sahih Tirmidhi 2887",
    difficulty: "hard"
  },

  // Histoire de l'Islam
  { 
    category: "Histoire de l'Islam",
    question: "Dans quelle ville est né le Prophète Muhammad ?", 
    options: ["Médine", "La Mecque", "Damas"], 
    answer: "La Mecque", 
    explanation: "Le Prophète Muhammad (que la paix soit sur lui) est né à La Mecque, en Arabie, vers l'an 570 de l'ère chrétienne.",
    source: "Biographie du Prophète",
    difficulty: "easy"
  },
  { 
    category: "Histoire de l'Islam",
    question: "Quelle année marque le début du calendrier islamique ?", 
    options: ["570", "622", "632"], 
    answer: "622", 
    explanation: "L'année 622 marque l'Hégire, la migration du Prophète Muhammad de La Mecque à Médine, qui est devenue le point de départ du calendrier islamique.",
    source: "Hégire",
    difficulty: "normal"
  }
];

async function main() {
  console.log('🌱 Début du seed...');

  // Créer les catégories
  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: category
    });
  }

  // Créer les questions
  for (const question of questions) {
    await prisma.question.upsert({
      where: { 
        category_question: {
          category: question.category,
          question: question.question
        }
      },
      update: {},
      create: question
    });
  }

  console.log('✅ Seed terminé avec succès !');
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
