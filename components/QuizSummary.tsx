import React from 'react';
import { QuizSession } from '../contexts/QuizContext';

interface QuizSummaryProps {
  session: QuizSession;
  onClose?: () => void;
  onRetakeQuiz?: () => void;
}

const QuizSummary: React.FC<QuizSummaryProps> = ({ session, onClose, onRetakeQuiz }) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'facile':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'moyen':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'difficile':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getPerformanceMessage = (percentage: number) => {
    if (percentage >= 90) return { message: "Performance exceptionnelle ! 🌟", color: "text-green-700" };
    if (percentage >= 80) return { message: "Très bien joué ! 🎉", color: "text-green-600" };
    if (percentage >= 70) return { message: "Bonne performance ! 👏", color: "text-blue-600" };
    if (percentage >= 60) return { message: "Pas mal ! 👍", color: "text-yellow-600" };
    if (percentage >= 50) return { message: "Continue tes efforts ! 💪", color: "text-orange-600" };
    return { message: "Il y a de la place pour progresser ! 📚", color: "text-red-600" };
  };

  const performance = getPerformanceMessage(session.percentage);
  const errorCount = session.answers.filter(answer => !answer.isCorrect).length;
  const avgTimePerQuestion = session.totalTime / session.totalQuestions;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-3xl shadow-2xl border border-[var(--color-accent)]/20">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-foreground)] mb-2">
            📋 Récapitulatif du Quiz
          </h1>
          <div className="flex items-center gap-4 flex-wrap">
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getDifficultyColor(session.difficulty)}`}>
              {session.difficulty.toUpperCase()}
            </span>
            <span className="text-[var(--color-foreground)]/70 text-sm">
              📅 {session.startTime.toLocaleDateString('fr-FR', { 
                day: 'numeric', 
                month: 'long', 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </span>
            <span className="text-[var(--color-foreground)]/70 text-sm">
              ⏱️ {formatTime(session.totalTime)} au total
            </span>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors duration-200"
          >
            ✕
          </button>
        )}
      </div>

      {/* Statistiques résumées */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4 border border-blue-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-white text-xl">
              📊
            </div>
            <div>
              <div className="text-blue-900 font-bold text-lg">{session.score}/{session.totalQuestions}</div>
              <div className="text-blue-700 text-sm">Score final</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-4 border border-green-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center text-white text-xl">
              ✅
            </div>
            <div>
              <div className="text-green-900 font-bold text-lg">{Math.round(session.percentage)}%</div>
              <div className="text-green-700 text-sm">Réussite</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-4 border border-orange-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center text-white text-xl">
              🔥
            </div>
            <div>
              <div className="text-orange-900 font-bold text-lg">{session.maxStreak}</div>
              <div className="text-orange-700 text-sm">Meilleur streak</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-4 border border-purple-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center text-white text-xl">
              ⚡
            </div>
            <div>
              <div className="text-purple-900 font-bold text-lg">{formatTime(Math.round(avgTimePerQuestion))}</div>
              <div className="text-purple-700 text-sm">Temps moyen</div>
            </div>
          </div>
        </div>
      </div>

      {/* Message de performance */}
      <div className="text-center mb-8 p-4 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-200">
        <p className={`text-lg font-semibold ${performance.color}`}>
          {performance.message}
        </p>
        {errorCount > 0 && (
          <p className="text-sm text-gray-600 mt-2">
            Vous avez {errorCount} erreur{errorCount > 1 ? 's' : ''} à réviser pour progresser.
          </p>
        )}
      </div>

      {/* Détail des questions */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-[var(--color-foreground)] mb-6 flex items-center gap-2">
          🔍 Détail des questions
        </h2>
        
        <div className="space-y-4">
          {session.answers.map((answer, index) => (
            <div
              key={index}
              className={`p-6 rounded-2xl border-2 transition-all duration-200 ${
                answer.isCorrect
                  ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 hover:border-green-300'
                  : 'bg-gradient-to-r from-red-50 to-pink-50 border-red-200 hover:border-red-300'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl font-bold ${
                  answer.isCorrect ? 'bg-green-500' : 'bg-red-500'
                }`}>
                  {answer.isCorrect ? '✅' : '❌'}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="font-bold text-lg text-[var(--color-foreground)]">
                      Question {index + 1}
                    </span>
                    <span className="text-sm text-[var(--color-foreground)]/70 bg-white/50 px-2 py-1 rounded-lg">
                      {answer.question.category}
                    </span>
                    {answer.usedHint && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                        💡 Indice utilisé
                      </span>
                    )}
                    <span className="text-xs text-[var(--color-foreground)]/60">
                      ⏱️ {formatTime(answer.timeSpent)}
                    </span>
                  </div>

                  <h3 className="font-semibold text-[var(--color-foreground)] mb-3 leading-relaxed">
                    {answer.question.question}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                    <div className={`p-3 rounded-lg border ${
                      answer.userAnswer === answer.correctAnswer
                        ? 'bg-green-100 border-green-300'
                        : answer.userAnswer
                        ? 'bg-red-100 border-red-300'
                        : 'bg-gray-100 border-gray-300'
                    }`}>
                      <div className="text-sm font-medium mb-1">
                        {answer.userAnswer ? 'Votre réponse :' : 'Pas de réponse'}
                      </div>
                      <div className="font-semibold">
                        {answer.userAnswer || 'Temps écoulé'}
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                      <div className="text-sm font-medium text-green-700 mb-1">
                        Bonne réponse :
                      </div>
                      <div className="font-semibold text-green-800">
                        {answer.correctAnswer}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-white/70 rounded-lg border border-gray-200">
                    <div className="text-sm font-medium text-[var(--color-foreground)] mb-2">
                      📝 Explication :
                    </div>
                    <p className="text-[var(--color-foreground)]/80 leading-relaxed">
                      {answer.explanation}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        {onRetakeQuiz && (
          <button
            onClick={onRetakeQuiz}
            className="px-8 py-4 bg-gradient-to-r from-[var(--color-foreground)] to-[var(--color-accent)] text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            <span className="flex items-center gap-3">
              <span>🔄</span>
              Refaire le quiz
              <span>🎯</span>
            </span>
          </button>
        )}
        
        {onClose && (
          <button
            onClick={onClose}
            className="px-8 py-4 bg-white text-[var(--color-foreground)] font-bold text-lg rounded-xl shadow-lg border-2 border-[var(--color-accent)] hover:bg-[var(--color-accent)]/10 transform hover:scale-105 transition-all duration-300"
          >
            Fermer le récapitulatif
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizSummary;