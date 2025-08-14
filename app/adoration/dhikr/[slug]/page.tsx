"use client";

import { dhikrData, getDhikrBySlug } from '@/lib/adorationData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Copy, RefreshCw, Clock } from 'lucide-react';

interface DhikrDetailPageProps {
  params: { slug: string };
}

export default function DhikrDetailPage({ params }: DhikrDetailPageProps) {
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [counter, setCounter] = useState(0);

  const dhikr = getDhikrBySlug(params.slug);

  if (!dhikr) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800 py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-[var(--color-foreground)] dark:text-white mb-4">
            Dhikr non trouvé
          </h1>
          <Link href="/adoration/dhikr">
            <Button className="bg-emerald-500 hover:bg-emerald-600">
              Retour aux dhikr
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const incrementCounter = () => {
    setCounter(counter + 1);
  };

  const resetCounter = () => {
    setCounter(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Navigation */}
        <div className="mb-8">
          <Link href="/adoration/dhikr">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Retour aux dhikr
            </Button>
          </Link>
        </div>

        {/* Carte principale du dhikr */}
        <Card className="shadow-2xl border-l-4 border-l-emerald-500">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl font-bold text-[var(--color-foreground)] dark:text-white">
              {dhikr.titre}
            </CardTitle>
            <div className="flex flex-wrap gap-3 mt-4">
              {dhikr.moment && (
                <span className="text-sm px-3 py-1 bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 rounded-full">
                  {dhikr.moment}
                </span>
              )}
              <span className="text-sm px-3 py-1 bg-cyan-100 dark:bg-cyan-900 text-cyan-800 dark:text-cyan-200 rounded-full">
                {dhikr.repetitions}
              </span>
              {dhikr.recommande_prophete && (
                <span className="text-sm px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full">
                  ﷺ Recommandé par le Prophète
                </span>
              )}
              {dhikr.facilite && (
                <span className="text-sm px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                  ⭐ Facile à retenir
                </span>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Texte Arabe avec compteur */}
            <div className="text-center p-8 bg-gradient-to-r from-emerald-50 to-cyan-50 dark:from-gray-800 dark:to-gray-700 rounded-xl">
              <p 
                className="text-4xl leading-relaxed font-amiri text-[var(--color-foreground)] dark:text-white cursor-pointer hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors select-none"
                onClick={incrementCounter}
                dir="rtl"
                lang="ar"
              >
                {dhikr.texte_arabe}
              </p>
              
              {/* Compteur */}
              <div className="mt-6 flex items-center justify-center gap-4">
                <div className="bg-white dark:bg-gray-800 px-6 py-3 rounded-full shadow-lg">
                  <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    {counter}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-300 ml-2">
                    répétitions
                  </span>
                </div>
                <Button 
                  onClick={resetCounter} 
                  variant="outline" 
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Reset
                </Button>
              </div>
              
              <p className="text-sm text-[var(--color-foreground)]/60 dark:text-gray-400 mt-4">
                Cliquez sur le texte arabe pour compter vos répétitions
              </p>
            </div>

            {/* Phonétique */}
            <div className="bg-blue-50 dark:bg-blue-900/30 p-6 rounded-xl">
              <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-3 text-lg">Phonétique :</h4>
              <p className="text-blue-700 dark:text-blue-300 italic text-lg">
                {dhikr.phonetique}
              </p>
            </div>

            {/* Traduction */}
            <div className="bg-emerald-50 dark:bg-emerald-900/30 p-6 rounded-xl">
              <h4 className="font-semibold text-emerald-800 dark:text-emerald-300 mb-3 text-lg">Traduction :</h4>
              <p className="text-emerald-700 dark:text-emerald-300 text-lg">
                &ldquo;{dhikr.traduction}&rdquo;
              </p>
            </div>

            {/* Répétitions recommandées */}
            <div className="bg-purple-50 dark:bg-purple-900/30 p-6 rounded-xl">
              <h4 className="font-semibold text-purple-800 dark:text-purple-300 mb-3 text-lg flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Répétitions recommandées
              </h4>
              <p className="text-purple-700 dark:text-purple-300">
                {dhikr.repetitions}
              </p>
            </div>

            {/* Bienfaits */}
            <div className="bg-orange-50 dark:bg-orange-900/30 p-6 rounded-xl">
              <h4 className="font-semibold text-orange-800 dark:text-orange-300 mb-3 text-lg">Bienfaits :</h4>
              <p className="text-orange-700 dark:text-orange-300">
                {dhikr.bienfaits}
              </p>
            </div>

            {/* Mérite spécial */}
            {dhikr.merite && (
              <div className="bg-yellow-50 dark:bg-yellow-900/30 p-6 rounded-xl border-l-4 border-yellow-400">
                <h4 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-3 text-lg flex items-center gap-2">
                  ✨ Mérite spécial
                </h4>
                <p className="text-yellow-700 dark:text-yellow-300">
                  {dhikr.merite}
                </p>
              </div>
            )}

            {/* Explication */}
            {dhikr.explication && (
              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl">
                <h4 className="font-semibold text-gray-800 dark:text-gray-300 mb-3 text-lg">Explication :</h4>
                <p className="text-gray-700 dark:text-gray-300">
                  {dhikr.explication}
                </p>
              </div>
            )}

            {/* Contexte */}
            {dhikr.contexte && (
              <div className="bg-indigo-50 dark:bg-indigo-900/30 p-6 rounded-xl">
                <h4 className="font-semibold text-indigo-800 dark:text-indigo-300 mb-3 text-lg">Contexte :</h4>
                <p className="text-indigo-700 dark:text-indigo-300">
                  {dhikr.contexte}
                </p>
              </div>
            )}

            {/* Source */}
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl">
              <h4 className="font-semibold text-gray-800 dark:text-gray-300 mb-3">Source :</h4>
              <div className="space-y-2 text-gray-700 dark:text-gray-300">
                <p><strong>Source :</strong> {dhikr.source}</p>
                <p><strong>Référence :</strong> {dhikr.reference_complete}</p>
              </div>
            </div>

            {/* Boutons d&apos;action */}
            <div className="flex flex-wrap gap-4 pt-4">
              <Button
                onClick={() => copyToClipboard(dhikr.texte_arabe, 'arabe')}
                className="bg-emerald-500 hover:bg-emerald-600 text-white flex items-center gap-2"
              >
                <Copy className="w-4 h-4" />
                {copiedText === 'arabe' ? "✓ Copié" : "Copier l&apos;arabe"}
              </Button>
              
              <Button
                onClick={() => copyToClipboard(dhikr.phonetique, 'phonetique')}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Copy className="w-4 h-4" />
                {copiedText === 'phonetique' ? "✓ Copié" : "Copier la phonétique"}
              </Button>
              
              <Link href="/adoration/dhikr">
                <Button variant="outline">
                  Voir d&apos;autres dhikr
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Dhikr similaires */}
        <div className="mt-12">
          <h3 className="text-xl font-bold text-[var(--color-foreground)] dark:text-white mb-6">
            Autres dhikr du même moment
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {dhikrData
              .filter(d => d.moment === dhikr.moment && d.id !== dhikr.id)
              .slice(0, 4)
              .map((relatedDhikr) => (
                <Link key={relatedDhikr.id} href={`/adoration/dhikr/${relatedDhikr.slug}`}>
                  <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-[var(--color-foreground)] dark:text-white mb-2 line-clamp-1">
                        {relatedDhikr.titre}
                      </h4>
                      <p className="text-sm text-[var(--color-foreground)]/80 dark:text-gray-300 line-clamp-2">
                        {relatedDhikr.bienfaits}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
