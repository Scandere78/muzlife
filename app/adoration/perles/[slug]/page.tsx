"use client";

import { perlesSpirite, getPerleBySlug } from '@/lib/adorationData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Copy, Star, Gift } from 'lucide-react';

interface PerleDetailPageProps {
  params: { slug: string };
}

export default function PerleDetailPage({ params }: PerleDetailPageProps) {
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [counter, setCounter] = useState(0);

  const perle = getPerleBySlug(params.slug);

  if (!perle) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Perle non trouvée
          </h1>
          <Link href="/adoration/perles">
            <Button className="bg-purple-500 hover:bg-purple-600">
              Retour aux perles
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Navigation */}
        <div className="mb-8">
          <Link href="/adoration/perles">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Retour aux perles
            </Button>
          </Link>
        </div>

        {/* Carte principale de la perle */}
        <Card className="shadow-2xl border-l-4 border-l-purple-500">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <span className="text-3xl">💎</span>
              {perle.titre}
            </CardTitle>
            <div className="flex flex-wrap gap-3 mt-4">
              <span className="text-sm px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full">
                {perle.recompense_type}
              </span>
              <span className="text-sm px-3 py-1 bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-200 rounded-full flex items-center gap-1">
                <Star className="w-3 h-3" />
                Récompense immense
              </span>
            </div>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Texte Arabe avec compteur */}
            <div className="text-center p-8 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-700 rounded-xl">
              <p 
                className="text-4xl leading-relaxed font-amiri text-gray-900 dark:text-white cursor-pointer hover:text-purple-600 dark:hover:text-purple-400 transition-colors select-none"
                onClick={incrementCounter}
                dir="rtl"
                lang="ar"
              >
                {perle.texte_arabe}
              </p>
              
              {/* Compteur */}
              <div className="mt-6 flex items-center justify-center gap-4">
                <div className="bg-white dark:bg-gray-800 px-6 py-3 rounded-full shadow-lg">
                  <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
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
                  <span className="text-lg">🔄</span>
                  Reset
                </Button>
              </div>
              
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
                Cliquez sur le texte pour compter vos répétitions
              </p>
            </div>

            {/* Phonétique */}
            <div className="bg-blue-50 dark:bg-blue-900/30 p-6 rounded-xl">
              <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-3 text-lg">Phonétique :</h4>
              <p className="text-blue-700 dark:text-blue-300 italic text-lg">
                {perle.phonetique}
              </p>
            </div>

            {/* Traduction */}
            <div className="bg-emerald-50 dark:bg-emerald-900/30 p-6 rounded-xl">
              <h4 className="font-semibold text-emerald-800 dark:text-emerald-300 mb-3 text-lg">Traduction :</h4>
              <p className="text-emerald-700 dark:text-emerald-300 text-lg">
                &ldquo;{perle.traduction}&rdquo;
              </p>
            </div>

            {/* Récompense promise */}
            <div className="bg-yellow-50 dark:bg-yellow-900/30 p-6 rounded-xl border-l-4 border-yellow-400">
              <h4 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-3 text-lg flex items-center gap-2">
                <Gift className="w-5 h-5" />
                Récompense promise
              </h4>
              <p className="text-yellow-700 dark:text-yellow-300 text-lg font-medium">
                {perle.recompense_promettre}
              </p>
            </div>

            {/* Facilité et impact */}
            <div className="bg-green-50 dark:bg-green-900/30 p-6 rounded-xl">
              <h4 className="font-semibold text-green-800 dark:text-green-300 mb-3 text-lg">Facilité et impact :</h4>
              <p className="text-green-700 dark:text-green-300">
                {perle.facilite_impact}
              </p>
            </div>

            {/* Explication de la perle */}
            <div className="bg-indigo-50 dark:bg-indigo-900/30 p-6 rounded-xl">
              <h4 className="font-semibold text-indigo-800 dark:text-indigo-300 mb-3 text-lg">Explication :</h4>
              <p className="text-indigo-700 dark:text-indigo-300">
                {perle.explication_perle}
              </p>
            </div>

            {/* Recommandation du Prophète */}
            {perle.recommendation_prophete && (
              <div className="bg-teal-50 dark:bg-teal-900/30 p-6 rounded-xl border-l-4 border-teal-400">
                <h4 className="font-semibold text-teal-800 dark:text-teal-300 mb-3 text-lg flex items-center gap-2">
                  ﷺ Recommandation prophétique
                </h4>
                <p className="text-teal-700 dark:text-teal-300">
                  {perle.recommendation_prophete}
                </p>
              </div>
            )}

            {/* Source */}
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl">
              <h4 className="font-semibold text-gray-800 dark:text-gray-300 mb-3">Source :</h4>
              <div className="space-y-2 text-gray-700 dark:text-gray-300">
                <p><strong>Source :</strong> {perle.source}</p>
                <p><strong>Référence :</strong> {perle.reference_complete}</p>
              </div>
            </div>

            {/* Boutons d&apos;action */}
            <div className="flex flex-wrap gap-4 pt-4">
              <Button
                onClick={() => copyToClipboard(perle.texte_arabe, 'arabe')}
                className="bg-purple-500 hover:bg-purple-600 text-white flex items-center gap-2"
              >
                <Copy className="w-4 h-4" />
                {copiedText === 'arabe' ? "✓ Copié" : "Copier l&apos;arabe"}
              </Button>
              
              <Button
                onClick={() => copyToClipboard(`${perle.texte_arabe}\n\nTraduction: ${perle.traduction}\n\nRécompense: ${perle.recompense_promettre}\n\nSource: ${perle.reference_complete}`, 'complet')}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Copy className="w-4 h-4" />
                {copiedText === 'complet' ? "✓ Copié" : "Copier la perle"}
              </Button>
              
              <Link href="/adoration/perles">
                <Button variant="outline">
                  Voir d&apos;autres perles
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Perles similaires */}
        <div className="mt-12">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            Autres perles du même type
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {perlesSpirite
              .filter(p => p.recompense_type === perle.recompense_type && p.id !== perle.id)
              .slice(0, 4)
              .map((relatedPerle) => (
                <Link key={relatedPerle.id} href={`/adoration/perles/${relatedPerle.slug}`}>
                  <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1">
                        {relatedPerle.titre}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                        {relatedPerle.recompense_promettre}
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
