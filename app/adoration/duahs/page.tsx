"use client";

import { duahsData } from '@/lib/adorationData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Copy, Heart, Clock, Star, Shield, Sparkles } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';

export default function DuahsPage() {
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const copyToClipboard = (text: string, id: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] dark:bg-gray-900 relative">
      <Navbar />
      <div className="page-container py-16 px-4">
        {/* Navigation */}
        <div className="mb-8 max-w-6xl mx-auto">
          <Link href="/adoration">
            <Button variant="outline" className="flex items-center gap-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-[var(--color-border)] text-[var(--color-foreground)] dark:text-white hover:bg-[var(--color-accent)]/10">
              <ArrowLeft className="w-4 h-4" />
              Retour à l'Adoration
            </Button>
          </Link>
        </div>

        {/* En-tête avec identité Muzlife */}
        <div className="text-center mb-16 max-w-6xl mx-auto">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-dark)] text-white rounded-full mb-8 text-4xl shadow-xl">
            🌙
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-[var(--color-foreground)] dark:text-white mb-6 drop-shadow-lg">
            Duahs Prophétiques
          </h1>
          <p className="text-xl text-[var(--color-foreground)]/80 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Invocations authentiques enseignées par le Prophète ﷺ pour sanctifier chaque moment de notre journée
          </p>
          <div className="mt-8 flex justify-center items-center gap-6 text-sm text-[var(--color-foreground)]/60 dark:text-gray-400">
            <span className="px-4 py-2 bg-[var(--color-accent)]/10 rounded-full border border-[var(--color-border)]">
              {duahsData.length} duahs disponibles
            </span>
            <span className="px-4 py-2 bg-[var(--color-accent)]/10 rounded-full border border-[var(--color-border)]">
              Authentifiés et vérifiés
            </span>
          </div>
        </div>

        {/* Introduction spécifique aux Duahs */}
        <div className="mb-16 bg-[var(--color-muted)]/60 backdrop-blur-sm rounded-2xl p-8 border border-[var(--color-border)] max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-[var(--color-foreground)] dark:text-white mb-6 flex items-center gap-3 drop-shadow">
            <BookOpen className="w-8 h-8 text-[var(--color-accent)]" />
            Les Duahs dans la Tradition Prophétique
          </h2>
          <div className="grid md:grid-cols-2 gap-8 text-sm">
            <div>
              <h3 className="font-semibold text-[var(--color-accent)] mb-3 text-lg">Importance des Duahs :</h3>
              <ul className="space-y-2 text-[var(--color-foreground)]/80 dark:text-gray-300">
                <li>• Protection divine quotidienne</li>
                <li>• Connexion spirituelle permanente</li>
                <li>• Bénédictions prophétiques authentiques</li>
                <li>• Guidance pour chaque situation</li>
                <li>• Tranquillité du cœur et de l'esprit</li>
                <li>• Suivi de la Sunnah noble</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-[var(--color-accent)] mb-3 text-lg">Parole Divine :</h3>
              <div className="bg-[var(--color-accent)]/10 backdrop-blur-sm rounded-xl p-6 italic border border-[var(--color-border)]">
                <p className="text-[var(--color-foreground)]/90 dark:text-gray-300 mb-3 leading-relaxed">
                  "Et invoquez-Moi, Je vous répondrai. Ceux qui, par orgueil, se refusent à M'adorer entreront bientôt dans l'Enfer, humiliés."
                </p>
                <p className="text-[var(--color-accent)] text-sm font-semibold">
                  - Sourate Ghafir (40:60)
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {duahsData.map((duah) => (
            <Card key={duah.id} className="group hover:shadow-2xl transition-all duration-500 border-2 border-[var(--color-border)]/30 hover:border-[var(--color-accent)] backdrop-blur-sm bg-white/95 dark:bg-gray-800/95 hover:scale-[1.02]">
              <CardHeader className="pb-4 bg-gradient-to-r from-[var(--color-accent)]/5 to-[var(--color-accent-dark)]/5 rounded-t-lg">
                <CardTitle className="text-xl font-bold text-[var(--color-foreground)] dark:text-white flex items-start justify-between">
                  <span className="leading-tight">{duah.titre}</span>
                  <div className="flex flex-col items-end space-y-2 ml-4">
                    <span className="text-xs px-3 py-1 bg-[var(--color-accent)]/20 text-[var(--color-foreground)] dark:text-[var(--color-accent)] rounded-full border border-[var(--color-border)] font-medium">
                      {duah.occasion}
                    </span>
                    {duah.prophete_recitait && (
                      <span className="text-xs px-3 py-1 bg-[var(--color-accent)]/30 text-[var(--color-foreground)] dark:text-white rounded-full border border-[var(--color-accent)] font-semibold">
                        ﷺ Sunnah
                      </span>
                    )}
                  </div>
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-6 p-6">
                {/* Texte Arabe */}
                <div className="text-center p-8 bg-gradient-to-r from-[var(--color-muted)]/40 to-[var(--color-accent)]/10 dark:from-gray-800 dark:to-gray-700 rounded-xl border border-[var(--color-border)]">
                  <p 
                    className="text-2xl md:text-3xl leading-relaxed font-amiri text-[var(--color-foreground)] dark:text-white cursor-pointer hover:text-[var(--color-accent)] dark:hover:text-[var(--color-accent)] transition-colors duration-300"
                    onClick={() => copyToClipboard(duah.texte_arabe, duah.id)}
                    dir="rtl"
                    lang="ar"
                  >
                    {duah.texte_arabe}
                  </p>
                  {copiedId === duah.id && (
                    <span className="text-sm text-[var(--color-accent)] dark:text-[var(--color-accent)] mt-3 block font-medium">
                      ✓ Copié !
                    </span>
                  )}
                  <p className="text-xs text-[var(--color-foreground)]/60 dark:text-gray-400 mt-3">
                    Cliquez sur le texte arabe pour le copier
                  </p>
                </div>

                {/* Phonétique */}
                <div className="bg-[var(--color-accent)]/10 dark:bg-blue-900/30 p-5 rounded-xl border border-[var(--color-border)]">
                  <h4 className="font-semibold text-[var(--color-accent)] dark:text-blue-300 mb-3 flex items-center gap-2">
                    <span className="text-lg">🔤</span> Phonétique :
                  </h4>
                  <p className="text-[var(--color-foreground)]/90 dark:text-blue-300 italic text-lg">
                    &quot;{duah.phonetique}&quot;
                  </p>
                </div>

                {/* Traduction */}
                <div className="bg-[var(--color-accent)]/15 dark:bg-emerald-900/30 p-5 rounded-xl border border-[var(--color-accent)]/30">
                  <h4 className="font-semibold text-[var(--color-accent-dark)] dark:text-emerald-300 mb-3 flex items-center gap-2">
                    <span className="text-lg">📖</span> Traduction :
                  </h4>
                  <p className="text-[var(--color-foreground)] dark:text-emerald-300 font-medium text-lg leading-relaxed">
                    &quot;{duah.traduction}&quot;
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {/* Fréquence recommandée */}
                  <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg border border-purple-200 dark:border-purple-700">
                    <h4 className="font-semibold text-purple-800 dark:text-purple-300 mb-2 flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4" />
                      Fréquence :
                    </h4>
                    <p className="text-[var(--color-foreground)]/80 dark:text-purple-300 text-sm">
                      {duah.frequence_recommandee}
                    </p>
                  </div>

                  {/* Bienfaits */}
                  <div className="bg-orange-50 dark:bg-orange-900/30 p-4 rounded-lg border border-orange-200 dark:border-orange-700">
                    <h4 className="font-semibold text-orange-800 dark:text-orange-300 mb-2 flex items-center gap-2 text-sm">
                      <Heart className="w-4 h-4" />
                      Bienfaits :
                    </h4>
                    <p className="text-[var(--color-foreground)]/80 dark:text-orange-300 text-sm">
                      {duah.bienfaits}
                    </p>
                  </div>
                </div>

                {/* Mérite spécial */}
                {duah.merite && (
                  <div className="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/30 dark:to-amber-900/30 p-5 rounded-xl border-2 border-yellow-300 dark:border-yellow-600">
                    <h4 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-3 flex items-center gap-2">
                      <Star className="w-5 h-5" />
                      ✨ Mérite spécial :
                    </h4>
                    <p className="text-[var(--color-foreground)] dark:text-yellow-300 font-medium leading-relaxed">
                      {duah.merite}
                    </p>
                  </div>
                )}

                {/* Explication */}
                <div className="bg-[var(--color-muted)]/40 dark:bg-gray-800 p-5 rounded-xl border border-[var(--color-border)]">
                  <h4 className="font-semibold text-[var(--color-foreground)] dark:text-gray-300 mb-3 flex items-center gap-2">
                    <span className="text-lg">💡</span> Explication :
                  </h4>
                  <p className="text-[var(--color-foreground)]/90 dark:text-gray-300 leading-relaxed">
                    {duah.explication}
                  </p>
                </div>

                {/* Source et Action */}
                <div className="border-t border-[var(--color-border)] pt-4">
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-[var(--color-foreground)]/60 dark:text-gray-400">
                      <div className="flex items-center gap-2 mb-1">
                        <Shield className="w-4 h-4" />
                        <span className="font-medium">Source :</span>
                      </div>
                      <span>{duah.reference_courte}</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(`${duah.texte_arabe}\n\nTraduction: ${duah.traduction}\n\nSource: ${duah.reference_complete}`, duah.id)}
                      className="bg-[var(--color-accent)]/10 text-[var(--color-foreground)] border-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-white dark:text-[var(--color-accent)] dark:border-[var(--color-accent)] dark:hover:bg-[var(--color-accent)] dark:hover:text-white transition-all duration-300"
                    >
                      {copiedId === duah.id ? "✓ Copié" : "📋 Copier tout"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Section éducative avec identité Muzlife */}
        <div className="mt-20 bg-[var(--color-muted)]/60 backdrop-blur-sm rounded-2xl shadow-2xl p-10 max-w-6xl mx-auto border border-[var(--color-border)]">
          <h3 className="text-3xl font-bold text-[var(--color-foreground)] dark:text-white mb-8 text-center flex items-center justify-center gap-3">
            <span className="text-4xl">🌟</span>
            L&apos;importance des Duahs dans la vie du musulman
          </h3>
          <div className="grid md:grid-cols-2 gap-8 text-[var(--color-foreground)]/80 dark:text-gray-300">
            <div className="bg-[var(--color-accent)]/10 p-6 rounded-xl border border-[var(--color-accent)]/30">
              <h4 className="font-semibold text-[var(--color-accent-dark)] dark:text-[var(--color-accent)] mb-3 flex items-center gap-2">
                <span className="text-xl">🔗</span>
                Connexion permanente
              </h4>
              <p className="text-sm leading-relaxed">
                Les duahs nous maintiennent en connexion constante avec Allah, rythmant notre journée de Sa mention bénie.
              </p>
            </div>
            <div className="bg-[var(--color-accent)]/10 p-6 rounded-xl border border-[var(--color-accent)]/30">
              <h4 className="font-semibold text-[var(--color-accent-dark)] dark:text-[var(--color-accent)] mb-3 flex items-center gap-2">
                <span className="text-xl">🛡️</span>
                Protection divine
              </h4>
              <p className="text-sm leading-relaxed">
                Chaque invocation est un bouclier spirituel qui nous protège des maux visibles et invisibles.
              </p>
            </div>
            <div className="bg-[var(--color-accent)]/10 p-6 rounded-xl border border-[var(--color-accent)]/30">
              <h4 className="font-semibold text-[var(--color-accent-dark)] dark:text-[var(--color-accent)] mb-3 flex items-center gap-2">
                <span className="text-xl">☮️</span>
                Sérénité intérieure
              </h4>
              <p className="text-sm leading-relaxed">
                La récitation régulière apporte une paix profonde et une tranquillité d&apos;esprit inégalée.
              </p>
            </div>
            <div className="bg-[var(--color-accent)]/10 p-6 rounded-xl border border-[var(--color-accent)]/30">
              <h4 className="font-semibold text-[var(--color-accent-dark)] dark:text-[var(--color-accent)] mb-3 flex items-center gap-2">
                <span className="text-xl">👣</span>
                Suivre la Sunnah
              </h4>
              <p className="text-sm leading-relaxed">
                En récitant ces duahs, nous marchons sur les traces bénies du Prophète ﷺ.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
