"use client";

import React from "react";
import { useAuth } from "../../contexts/AuthContext";
// import AuthModal from "../../components/auth/AuthModal";

// Types
export type Quiz = {
  question: string;
  options: string[];
  answer: string;
  source: string;
  explanation: string;
};

export type Quizzes = Record<string, Quiz[]>;

const quizzes: Quizzes = {
  "Piliers de l'Islam": [
    {
      question: "Quel est le premier pilier de l'Islam ?",
      options: ["La prière", "Le jeûne", "La Shahada"],
      answer: "La Shahada",
      source: "Sahih Muslim 1",
      explanation:
        "La Shahada, la déclaration de foi musulmane (« Il n'y a pas de divinité en dehors de Dieu et Muhammad est son prophète »), est le premier des cinq piliers de l'islam.",
    },
    {
      question: "Combien de rakats y a-t-il dans la prière du Fajr ?",
      options: ["2", "4", "3"],
      answer: "2",
      source: "Sahih Bukhari 1099",
      explanation:
        "La prière du Fajr (l'aube) est composée de 2 rakats obligatoires, contrairement à d'autres prières qui peuvent en avoir 3 ou 4.",
    },
    {
      question: "Combien y a-t-il de piliers de l'Islam ?",
      options: ["3", "5", "7"],
      answer: "5",
      source: "Sahih Bukhari 8",
      explanation:
        "Les cinq piliers de l'Islam sont: la Shahada (profession de foi), la Salat (prière), la Zakat (aumône), le Sawm (jeûne du Ramadan) et le Hajj (pèlerinage à La Mecque).",
    },
    {
      question: "Quel est le troisième pilier de l'Islam ?",
      options: ["Le jeûne", "La zakat", "Le pèlerinage"],
      answer: "La zakat",
      source: "Sahih Bukhari 24",
      explanation:
        "La Zakat (aumône obligatoire) est le troisième pilier de l'Islam, après la Shahada et la Salat (prière).",
    },
  ],
  "Ramadan": [
    {
      question: "Quel mois est sacré pour le jeûne ?",
      options: ["Rajab", "Shawwal", "Ramadan"],
      answer: "Ramadan",
      source: "Coran 2:185",
      explanation:
        "Le Ramadan est le neuvième mois du calendrier musulman durant lequel les musulmans pratiquent le jeûne du lever au coucher du soleil.",
    },
    {
      question: "À quelle heure doit-on rompre le jeûne ?",
      options: ["Aube", "Coucher du soleil", "Minuit"],
      answer: "Coucher du soleil",
      source: "Sahih Bukhari 1954",
      explanation:
        "Le jeûne est rompu au moment du coucher du soleil (maghrib), généralement avec des dattes et de l'eau selon la tradition prophétique.",
    },
    {
      question: "Quel est le repas pris avant l'aube pendant le Ramadan ?",
      options: ["Iftar", "Suhur", "Taraweeh"],
      answer: "Suhur",
      source: "Sahih Muslim 1095",
      explanation:
        "Le Suhur est le repas pris avant l'aube pendant le Ramadan, tandis que l'Iftar est le repas pris au coucher du soleil pour rompre le jeûne.",
    },
    {
      question: "Quelle nuit est meilleure que 1000 mois ?",
      options: ["Laylat al-Qadr", "Laylat al-Miraj", "Laylat al-Bara'ah"],
      answer: "Laylat al-Qadr",
      source: "Coran 97:3",
      explanation:
        "Laylat al-Qadr (La Nuit du Destin) est décrite dans le Coran comme meilleure que mille mois. Elle se situe durant les 10 derniers jours du Ramadan.",
    },
  ],
  "Prophètes": [
    {
      question: "Qui est le dernier prophète de l'Islam ?",
      options: ["Moussa", "Issa", "Muhammad"],
      answer: "Muhammad",
      source: "Sahih Bukhari 33",
      explanation:
        "Le Prophète Muhammad (que la paix soit sur lui) est considéré comme le dernier prophète (Khatam an-Nabiyyin) dans l'Islam.",
    },
    {
      question: "Quel prophète a construit l'arche ?",
      options: ["Ibrahim", "Nuh", "Yusuf"],
      answer: "Nuh",
      source: "Coran 11:37",
      explanation:
        "Le prophète Nuh (Noé) a construit l'arche sur ordre d'Allah pour sauver les croyants et les animaux du déluge.",
    },
    {
      question: "Quel prophète a parlé dans son berceau ?",
      options: ["Issa", "Moussa", "Ibrahim"],
      answer: "Issa",
      source: "Coran 19:29-30",
      explanation:
        "Le prophète Issa (Jésus) a parlé dans son berceau pour défendre sa mère Maryam (Marie) des accusations portées contre elle.",
    },
  ],
  "Tajweed": [
    {
      question: "Quel est le nom de la règle qui allonge la prononciation d'une lettre ?",
      options: ["Idgham", "Madd", "Qalqala"],
      answer: "Madd",
      source: "Règles du Tajweed",
      explanation:
        "Le Madd est la règle de tajweed qui consiste à allonger la prononciation d'une lettre, généralement les lettres de prolongation (alif, waw, ya).",
    },
    {
      question: "Quelle lettre n'est jamais prononcée dans la basmala ?",
      options: ["Alif", "Lam", "Nun"],
      answer: "Alif",
      source: "Règles du Tajweed",
      explanation:
        "Dans la Basmala (Bismillah), l'alif après le lam de 'Allah' n'est pas prononcé, c'est ce qu'on appelle 'alif wasla'.",
    },
    {
      question: "Combien de types de Qalqala existe-t-il ?",
      options: ["2", "3", "5"],
      answer: "2",
      source: "Règles du Tajweed",
      explanation:
        "Il existe 2 types de Qalqala : la Qalqala Sughra (mineure) et la Qalqala Kubra (majeure), selon la position des lettres de Qalqala.",
    },
  ],
  "Aqida": [
    {
      question: "Combien de noms d'Allah sont mentionnés comme Asma'ul Husna ?",
      options: ["99", "100", "50"],
      answer: "99",
      source: "Sahih Bukhari 2736",
      explanation:
        "Selon la tradition, Allah a 99 noms (Asma'ul Husna) qui décrivent Ses attributs, bien qu'Il possède d'autres noms connus uniquement de Lui.",
    },
    {
      question: "Quel est le premier devoir de chaque musulman ?",
      options: ["Apprendre le Coran", "Comprendre le Tawhid", "Prier 5 fois par jour"],
      answer: "Comprendre le Tawhid",
      source: "Coran 47:19",
      explanation:
        "Le Tawhid (l'unicité d'Allah) est le concept fondamental de l'Islam et comprendre cette unicité est considéré comme le premier devoir du musulman.",
    },
  ],
  "Coran": [
    {
      question: "Combien y a-t-il de sourates dans le Coran ?",
      options: ["100", "114", "120"],
      answer: "114",
      source: "Coran",
      explanation:
        "Le Saint Coran contient 114 sourates (chapitres) de longueurs différentes, allant de la plus courte (Al-Kawthar) à la plus longue (Al-Baqara).",
    },
    {
      question: "Quelle est la plus longue sourate du Coran ?",
      options: ["Al-Fatiha", "Al-Baqara", "Al-Ikhlas"],
      answer: "Al-Baqara",
      source: "Coran 2:1",
      explanation:
        "Al-Baqara (La Vache) est la plus longue sourate du Coran avec 286 versets. Elle est également la première sourate révélée à Médine.",
    },
    {
      question: "Quelle sourate est appelée 'Le cœur du Coran' ?",
      options: ["Al-Baqara", "Ya-Sin", "Al-Kahf"],
      answer: "Ya-Sin",
      source: "Sahih Tirmidhi 2887",
      explanation:
        "Ya-Sin est souvent appelée 'le cœur du Coran' en raison de son importance et des bénédictions associées à sa récitation.",
    },
  ],
  "Histoire de l'Islam": [
    {
      question: "Dans quelle ville est né le Prophète Muhammad ?",
      options: ["Médine", "La Mecque", "Damas"],
      answer: "La Mecque",
      source: "Biographie du Prophète",
      explanation:
        "Le Prophète Muhammad (que la paix soit sur lui) est né à La Mecque, en Arabie, vers l'an 570 de l'ère chrétienne.",
    },
    {
      question: "Quelle année marque le début du calendrier islamique ?",
      options: ["570", "622", "632"],
      answer: "622",
      source: "Hégire",
      explanation:
        "L'année 622 marque l'Hégire, la migration du Prophète Muhammad de La Mecque à Médine, qui est devenue le point de départ du calendrier islamique.",
    },
  ],
};


// import { useAuth } from "../../contexts/AuthContext";
// import AuthModal from "../../components/auth/AuthModal";
import { cn } from "../../lib/utils";

export default function QuizPage() {
  const { user, saveQuizResult } = useAuth();
  // const [showAuthModal, setShowAuthModal] = React.useState(false);
  const [selectedTheme, setSelectedTheme] = React.useState<string>(Object.keys(quizzes)[0]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);
  const [selectedAnswer, setSelectedAnswer] = React.useState<string | null>(null);
  const [isCorrect, setIsCorrect] = React.useState<boolean | null>(null);
  const [showExplanation, setShowExplanation] = React.useState(false);
  const [score, setScore] = React.useState(0);
  const [showResults, setShowResults] = React.useState(false);
  const [timeLeft, setTimeLeft] = React.useState(30);
  const [quizStarted, setQuizStarted] = React.useState(false);
  const [usedHint, setUsedHint] = React.useState(false);
  const [difficulty, setDifficulty] = React.useState("normal");
  const [showCorrectAnswer, setShowCorrectAnswer] = React.useState(false);
  const [totalCorrectAnswers, setTotalCorrectAnswers] = React.useState(0);

  // Timer & effets
  React.useEffect(() => {
    if (!quizStarted || showExplanation || showResults) return;
    if (timeLeft === 0) {
      setShowCorrectAnswer(true);
      setShowExplanation(true);
      setIsCorrect(false);
      return;
    }
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, quizStarted, showExplanation, showResults]);

  React.useEffect(() => {
    if (difficulty === "easy") setTimeLeft(45);
    else if (difficulty === "hard") setTimeLeft(15);
    else setTimeLeft(30);
  }, [difficulty, quizStarted]);

  React.useEffect(() => {
    if (showExplanation && quizStarted && !showResults) {
      const timeout = setTimeout(() => {
        if (currentQuestionIndex + 1 < quizzes[selectedTheme].length) {
          setCurrentQuestionIndex((i) => i + 1);
          setSelectedAnswer(null);
          setIsCorrect(null);
          setShowExplanation(false);
          setShowCorrectAnswer(false);
          setUsedHint(false);
          setTimeLeft(difficulty === "easy" ? 45 : difficulty === "hard" ? 15 : 30);
        } else {
          setShowResults(true);
        }
      }, 2500);
      return () => clearTimeout(timeout);
    }
  }, [showExplanation, currentQuestionIndex, selectedTheme, difficulty, quizStarted, showResults]);

  // Fonctions principales
  const startQuiz = () => {
    setQuizStarted(true);
    setShowResults(false);
    setScore(0);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setShowExplanation(false);
    setShowCorrectAnswer(false);
    setUsedHint(false);
    setTotalCorrectAnswers(0);
    setTimeLeft(difficulty === "easy" ? 45 : difficulty === "hard" ? 15 : 30);
  };

  const handleAnswer = (option: string) => {
    if (selectedAnswer) return;
    setSelectedAnswer(option);
    const correct = quizzes[selectedTheme][currentQuestionIndex].answer === option;
    setIsCorrect(correct);
    setShowExplanation(true);
    setShowCorrectAnswer(true);
    if (correct) {
      setScore((s) => s + 1);
      setTotalCorrectAnswers((c) => c + 1);
      // streak supprimé (non utilisé)
    } else {
      // streak supprimé (non utilisé)
    }
    // Save result if user is logged in
    if (user && saveQuizResult) {
      saveQuizResult({
        correctAnswers: correct ? 1 : 0,
        score: score + (correct ? 1 : 0),
        category: selectedTheme,
        difficulty,
        totalQuestions: quizzes[selectedTheme].length,
        percentage: ((score + (correct ? 1 : 0)) / quizzes[selectedTheme].length) * 100,
      });
    }
  };

  const useHint = () => {
    setUsedHint(true);
  };

  const resetQuiz = () => {
    setQuizStarted(false);
    setShowResults(false);
    setScore(0);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setShowExplanation(false);
    setShowCorrectAnswer(false);
    setUsedHint(false);
    setTotalCorrectAnswers(0);
    setTimeLeft(difficulty === "easy" ? 45 : difficulty === "hard" ? 15 : 30);
  };

  // UI
  const themeNames = Object.keys(quizzes);
  const currentQuiz = quizzes[selectedTheme];
  const currentQ = currentQuiz[currentQuestionIndex];

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      {/* <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} /> */}
      <h1 className="text-3xl font-bold text-green-500 text-center mb-6">Quiz Islamique</h1>
      <div className="flex flex-wrap gap-2 justify-center mb-6">
        {themeNames.map((theme) => (
          <button
            key={theme}
            className={cn(
              "px-4 py-2 rounded-full font-medium border transition-all",
              selectedTheme === theme
                ? "bg-green-600 text-white border-green-700 shadow"
                : "bg-gray-800 text-green-300 border-gray-700 hover:bg-green-900 hover:text-white"
            )}
            onClick={() => {
              setSelectedTheme(theme);
              setCurrentQuestionIndex(0);
              setQuizStarted(false);
              setShowResults(false);
              setScore(0);
              setTotalCorrectAnswers(0);
            }}
            disabled={quizStarted}
          >
            {theme}
          </button>
        ))}
      </div>
      <div className="flex justify-center gap-4 mb-6">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="difficulty"
            value="easy"
            checked={difficulty === "easy"}
            onChange={() => setDifficulty("easy")}
            disabled={quizStarted}
          />
          Facile
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="difficulty"
            value="normal"
            checked={difficulty === "normal"}
            onChange={() => setDifficulty("normal")}
            disabled={quizStarted}
          />
          Normal
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="difficulty"
            value="hard"
            checked={difficulty === "hard"}
            onChange={() => setDifficulty("hard")}
            disabled={quizStarted}
          />
          Difficile
        </label>
      </div>
      {!quizStarted && !showResults && (
        <div className="flex flex-col items-center gap-4">
          <button
            className="px-8 py-3 rounded-full bg-green-600 text-white font-bold text-lg shadow hover:bg-green-700 transition-all"
            onClick={startQuiz}
          >
            Commencer le quiz
          </button>
        </div>
      )}
      {quizStarted && !showResults && (
        <div className="bg-gray-900/80 rounded-xl shadow-lg p-6 mt-4">
          <div className="flex justify-between items-center mb-4">
            <span className="text-green-400 font-semibold">Question {currentQuestionIndex + 1} / {currentQuiz.length}</span>
            <span className="text-green-300 font-mono">⏰ {timeLeft}s</span>
          </div>
          <h2 className="text-xl font-bold mb-4 text-white">{currentQ.question}</h2>
          <div className="flex flex-col gap-3 mb-4">
            {currentQ.options.map((option) => (
              <button
                key={option}
                className={cn(
                  "px-4 py-2 rounded-lg border text-lg transition-all text-left",
                  selectedAnswer === option
                    ? isCorrect && option === currentQ.answer
                      ? "bg-green-600 text-white border-green-700"
                      : !isCorrect && option === selectedAnswer
                        ? "bg-red-600 text-white border-red-700"
                        : "bg-gray-800 text-white border-gray-700"
                    : showCorrectAnswer && option === currentQ.answer
                      ? "bg-green-700 text-white border-green-800"
                      : "bg-gray-800 text-white border-gray-700 hover:bg-green-900 hover:text-white"
                )}
                onClick={() => handleAnswer(option)}
                disabled={!!selectedAnswer || showExplanation}
              >
                {option}
              </button>
            ))}
          </div>
          <div className="flex justify-between items-center">
            <button
              className="text-green-400 underline text-sm"
              onClick={useHint}
              disabled={usedHint || !!selectedAnswer}
            >
              {usedHint ? "Indice utilisé" : "Utiliser un indice"}
            </button>
            <span className="text-gray-400 text-sm">Source : {currentQ.source}</span>
          </div>
          {showExplanation && (
            <div className={cn("mt-4 p-4 rounded-lg", isCorrect ? "bg-green-900/60 text-green-200" : "bg-red-900/60 text-red-200")}>{currentQ.explanation}</div>
          )}
        </div>
      )}
      {showResults && (
        <div className="bg-black/40 rounded-xl shadow-lg p-8 mt-8 text-center">
          <h2 className="text-2xl font-bold text-green-400 mb-4">Résultats du quiz</h2>
          <p className="text-lg text-white mb-2">Score : <span className="font-bold text-green-300">{score} / {currentQuiz.length}</span></p>
          <p className="text-green-200 mb-4">Bonnes réponses : {totalCorrectAnswers}</p>
          <button
            className="px-6 py-2 rounded-full bg-green-600 text-white font-bold mt-4 hover:bg-green-700 transition-all"
            onClick={resetQuiz}
          >
            Rejouer
          </button>
        </div>
      )}
    </div>
  );
}
