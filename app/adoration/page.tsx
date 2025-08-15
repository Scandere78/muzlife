'use client';

import Link from 'next/link';
import { hisniiCategories } from '@/lib/hisniiDataNew';
import Navbar from '../../components/Navbar';

export default function AdorationPage() {
  return (
    <div className="py-12 min-h-screen navbar-safe" style={{ background: 'transparent', color: 'var(--color-foreground)' }}>
      <Navbar />
      
      {/* Header */}
      <div className="text-center px-4 max-w-4xl mx-auto mb-16">
        <h1 className="text-4xl text-green-800 dark:text-white font-bold drop-shadow-lg mb-4">
          🕌 Invocations & Duahs
        </h1>
        <p className="text-lg text-green-700 dark:text-gray-200 leading-relaxed">
          Découvrez les invocations et duahs authentiques de l&apos;Islam, 
          basées sur le Coran et la Sunnah du Prophète ﷺ
        </p>
        <div className="mt-6 h-1 w-32 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-dark)] mx-auto rounded-full"></div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-6 max-w-7xl mx-auto">
        {hisniiCategories.map((category) => (
          <div key={category.id} className="transition-all duration-300 transform hover:-translate-y-2">
            <Link href={`/adoration/${category.slug}`} className="block group">
              <div className="bg-[var(--color-muted)]/60 p-8 rounded-xl shadow-lg cursor-pointer hover:shadow-[var(--color-accent)]/20 hover:bg-[var(--color-background)] transition-all duration-300 border border-[var(--color-border)] h-full relative overflow-hidden">
                {/* Gradient d'arrière-plan au survol */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-green-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                
                {/* Icône */}
                <div className="bg-[var(--color-accent)]/10 w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl">{category.icon}</span>
                </div>
                
                {/* Contenu */}
                <h2 className="text-2xl font-bold text-green-800 dark:text-white mb-3 drop-shadow group-hover:text-[var(--color-accent)] transition-colors duration-300">
                  {category.title}
                </h2>
                <p className="text-green-700 dark:text-gray-300 leading-relaxed text-sm mb-4">
                  {category.description}
                </p>
                
                {/* Items Count et bouton */}
                <div className="flex items-center justify-between pt-4 border-t border-[var(--color-border)]">
                  <span className="text-sm text-[var(--color-accent)] font-medium">
                    {category.items.length} invocation{category.items.length > 1 ? 's' : ''}
                  </span>
                  <div className="flex items-center text-green-600 dark:text-green-400 group-hover:text-[var(--color-accent)] transition-colors">
                    <span className="text-sm font-medium mr-1">Découvrir</span>
                    <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Statistics Section */}
      <div className="mt-20 px-6 max-w-4xl mx-auto">
        <div className="bg-[var(--color-muted)]/60 rounded-xl p-8 border border-[var(--color-border)]">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-green-800 dark:text-white mb-4">Basé sur les sources authentiques</h2>
            <p className="text-green-700 dark:text-gray-200">
              Toutes nos invocations sont tirées du Coran et des hadiths authentiques
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-[var(--color-accent)]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📖</span>
              </div>
              <h3 className="text-xl font-bold text-green-800 dark:text-white mb-2">Sources Authentiques</h3>
              <p className="text-green-700 dark:text-gray-300">Coran et Sunnah uniquement</p>
            </div>
            
            <div className="text-center">
              <div className="bg-[var(--color-accent)]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🕌</span>
              </div>
              <h3 className="text-xl font-bold text-green-800 dark:text-white mb-2">Texte Arabe</h3>
              <p className="text-green-700 dark:text-gray-300">Avec translittération et traduction</p>
            </div>
            
            <div className="text-center">
              <div className="bg-[var(--color-accent)]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💚</span>
              </div>
              <h3 className="text-xl font-bold text-green-800 dark:text-white mb-2">Bienfaits</h3>
              <p className="text-green-700 dark:text-gray-300">Contexte et bénéfices expliqués</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quote Section */}
      <div className="mt-16 text-center px-4 pb-10">
        <div className="bg-[var(--color-accent)]/10 rounded-2xl p-8 max-w-4xl mx-auto border border-[var(--color-accent)]/20">
          <div className="text-6xl mb-6">🤲</div>
          <blockquote className="text-xl text-green-800 dark:text-white font-medium mb-4">
            « L&apos;invocation est l&apos;essence même de l&apos;adoration »
          </blockquote>
          <cite className="text-[var(--color-accent)] font-medium">
            - Hadith rapporté par At-Tirmidhi
          </cite>
        </div>
      </div>
    </div>
  );
}
