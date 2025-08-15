'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getHisniiCategoryBySlug } from '@/lib/hisniiDataNew';
import Navbar from '../../../components/Navbar';

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const category = getHisniiCategoryBySlug(slug);

  if (!category) {
    return (
      <div className="py-12 min-h-screen navbar-safe" style={{ background: 'transparent', color: 'var(--color-foreground)' }}>
        <Navbar />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center bg-[var(--color-muted)]/60 p-8 rounded-xl border border-[var(--color-border)]">
            <h1 className="text-2xl font-bold text-green-800 dark:text-white mb-4">Catégorie non trouvée</h1>
            <Link 
              href="/adoration" 
              className="text-[var(--color-accent)] hover:text-[var(--color-accent-dark)] underline"
            >
              Retour aux invocations
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 min-h-screen navbar-safe" style={{ background: 'transparent', color: 'var(--color-foreground)' }}>
      <Navbar />
      
      {/* Header */}
      <div className="text-center px-4 max-w-4xl mx-auto mb-12">
        <div className="flex items-center justify-center mb-6">
          <Link 
            href="/adoration"
            className="flex items-center text-[var(--color-accent)] hover:text-[var(--color-accent-dark)] transition-colors mr-4"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Retour aux invocations
          </Link>
        </div>
        
        <div className="text-6xl mb-4">{category.icon}</div>
        <h1 className="text-4xl font-bold drop-shadow-lg mb-4 text-green-800 dark:text-white">
          {category.title}
        </h1>
        <p className="text-lg leading-relaxed text-green-700 dark:text-gray-200">
          {category.description}
        </p>
        <div className={`mt-6 h-1 w-32 mx-auto rounded-full bg-gradient-to-r ${category.colors.secondary}`}></div>
      </div>

      {/* Items List */}
      <div className="max-w-5xl mx-auto px-6">
        <div className="space-y-8">
          {category.items.map((item, index) => (
            <div
              key={item.id}
              className="bg-[var(--color-muted)]/60 rounded-xl shadow-lg border border-[var(--color-border)] overflow-hidden hover:shadow-[var(--color-accent)]/20 transition-all duration-300"
            >
              {/* Item Header avec couleurs spécifiques */}
              <div className={`bg-gradient-to-r ${category.colors.primary} text-white p-6`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="bg-white text-gray-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4">
                      {index + 1}
                    </span>
                    <h3 className="text-xl font-bold">
                      {item.title}
                    </h3>
                  </div>
                  {item.benefits && (
                    <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">
                      ✨ Bienfaits
                    </span>
                  )}
                </div>
              </div>

              {/* Item Content */}
              <div className="p-6">
                {/* Arabic Text */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold mb-3 text-gray-800 dark:text-white">Texte Arabe :</h4>
                  <div className="bg-[var(--color-background)] rounded-xl p-6 text-right border border-[var(--color-border)]">
                    <p className="text-2xl leading-loose font-arabic text-gray-900 dark:text-white">
                      {item.arabicText}
                    </p>
                  </div>
                </div>

                {/* Transliteration */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold mb-3 text-gray-800 dark:text-white">Translittération :</h4>
                  <div className="bg-[var(--color-muted)]/40 rounded-xl p-4 border border-[var(--color-border)]">
                    <p className="italic leading-relaxed text-gray-700 dark:text-gray-300">
                      {item.transliteration}
                    </p>
                  </div>
                </div>

                {/* Translation avec couleur spécifique */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold mb-3 text-gray-800 dark:text-white">Traduction :</h4>
                  <div className={`${category.colors.background} rounded-xl p-4 border border-opacity-20`}>
                    <p className="leading-relaxed text-gray-900 dark:text-white font-medium">
                      {item.translation}
                    </p>
                  </div>
                </div>

                {/* Source */}
                <div className="flex items-center justify-between pt-4 border-t border-[var(--color-border)]">
                  <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <span className="font-medium text-gray-800 dark:text-white">Source :</span>
                    <span className="ml-1 dark:text-amber-300">{item.source}</span>
                  </div>
                </div>

                {/* Benefits avec couleur spécifique */}
                {item.benefits && (
                  <div className={`mt-4 p-4 ${category.colors.background} rounded-xl border-l-4 ${category.colors.secondary.replace('from-', 'border-').replace('-500', '-400')}`}>
                    <div className="flex items-start">
                      <span className="text-lg mr-2 text-yellow-600 dark:text-yellow-400">💡</span>
                      <div>
                        <h5 className="font-semibold mb-1 text-gray-800 dark:text-white">Bienfaits :</h5>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{item.benefits}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Context */}
                {item.context && (
                  <div className={`mt-4 p-4 bg-[var(--color-muted)]/40 rounded-xl border-l-4 ${category.colors.secondary.replace('from-', 'border-').replace('-500', '-400')}`}>
                    <div className="flex items-start">
                      <span className="text-lg mr-2 text-blue-600 dark:text-blue-400">📚</span>
                      <div>
                        <h5 className="font-semibold mb-1 text-gray-800 dark:text-white">Contexte :</h5>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{item.context}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="mt-16 text-center px-4 pb-10">
        <Link 
          href="/adoration"
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-dark)] text-white rounded-xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Retour aux catégories
        </Link>
      </div>
    </div>
  );
}
