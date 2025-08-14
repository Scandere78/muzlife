"use client";

import { duahsData, getDuahBySlug } from '@/lib/adorationData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Copy, Clock, Moon } from 'lucide-react';

interface DuahDetailPageProps {
  params: { slug: string };
}

export default function DuahDetailPage({ params }: DuahDetailPageProps) {
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const duah = getDuahBySlug(params.slug);

  if (!duah) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800 py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Duah non trouvée
          </h1>
          <Link href="/adoration/duahs">
            <Button className="bg-teal-500 hover:bg-teal-600">
              Retour aux duahs
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Navigation */}
        <div className="mb-8">
          <Link href="/adoration/duahs">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Retour aux duahs
            </Button>
          </Link>
        </div>

        {/* Carte principale de la duah */}
        <Card className="shadow-2xl border-l-4 border-l-teal-500">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <span className="text-3xl">🌙</span>
              {duah.titre}
            </CardTitle>
            <div className="flex flex-wrap gap-3 mt-4">
              <span className="text-sm px-3 py-1 bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200 rounded-full">
                {duah.occasion}
              </span>
              <span className="text-sm px-3 py-1 bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 rounded-full">
                {duah.categorie}
              </span>
              {duah.prophete_recitait && (
                <span className="text-sm px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full">
                  ﷺ Sunnah
                </span>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Texte Arabe */}
            <div className="text-center p-8 bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-gray-800 dark:to-gray-700 rounded-xl">
              <p 
                className="text-4xl leading-relaxed font-amiri text-gray-900 dark:text-white cursor-pointer hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                onClick={() => copyToClipboard(duah.texte_arabe, 'arabe')}
                dir="rtl"
                lang="ar"
              >
                {duah.texte_arabe}
              </p>
              {copiedText === 'arabe' && (
                <span className="text-sm text-teal-600 dark:text-teal-400 mt-3 block">
                  ✓ Texte arabe copié !
                </span>
              )}
            </div>

            {/* Phonétique */}
            <div className="bg-blue-50 dark:bg-blue-900/30 p-6 rounded-xl">
              <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-3 text-lg">Phonétique :</h4>
              <p className="text-blue-700 dark:text-blue-300 italic text-lg">
                {duah.phonetique}
              </p>
            </div>

            {/* Traduction */}
            <div className="bg-emerald-50 dark:bg-emerald-900/30 p-6 rounded-xl">
              <h4 className="font-semibold text-emerald-800 dark:text-emerald-300 mb-3 text-lg">Traduction :</h4>
              <p className="text-emerald-700 dark:text-emerald-300 text-lg">
                &ldquo;{duah.traduction}&rdquo;
              </p>
            </div>

            {/* Occasion et fréquence */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-purple-50 dark:bg-purple-900/30 p-6 rounded-xl">
                <h4 className="font-semibold text-purple-800 dark:text-purple-300 mb-3 text-lg flex items-center gap-2">
                  <Moon className="w-5 h-5" />
                  Occasion
                </h4>
                <p className="text-purple-700 dark:text-purple-300">
                  {duah.occasion}
                </p>
              </div>
              
              <div className="bg-indigo-50 dark:bg-indigo-900/30 p-6 rounded-xl">
                <h4 className="font-semibold text-indigo-800 dark:text-indigo-300 mb-3 text-lg flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Fréquence
                </h4>
                <p className="text-indigo-700 dark:text-indigo-300">
                  {duah.frequence_recommandee}
                </p>
              </div>
            </div>

            {/* Bienfaits */}
            <div className="bg-orange-50 dark:bg-orange-900/30 p-6 rounded-xl">
              <h4 className="font-semibold text-orange-800 dark:text-orange-300 mb-3 text-lg">Bienfaits :</h4>
              <p className="text-orange-700 dark:text-orange-300">
                {duah.bienfaits}
              </p>
            </div>

            {/* Mérite spécial */}
            {duah.merite && (
              <div className="bg-yellow-50 dark:bg-yellow-900/30 p-6 rounded-xl border-l-4 border-yellow-400">
                <h4 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-3 text-lg flex items-center gap-2">
                  ✨ Mérite spécial
                </h4>
                <p className="text-yellow-700 dark:text-yellow-300">
                  {duah.merite}
                </p>
              </div>
            )}

            {/* Contexte */}
            <div className="bg-cyan-50 dark:bg-cyan-900/30 p-6 rounded-xl">
              <h4 className="font-semibold text-cyan-800 dark:text-cyan-300 mb-3 text-lg">Contexte :</h4>
              <p className="text-cyan-700 dark:text-cyan-300">
                {duah.contexte}
              </p>
            </div>

            {/* Explication */}
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl">
              <h4 className="font-semibold text-gray-800 dark:text-gray-300 mb-3 text-lg">Explication :</h4>
              <p className="text-gray-700 dark:text-gray-300">
                {duah.explication}
              </p>
            </div>

            {/* Source */}
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl">
              <h4 className="font-semibold text-gray-800 dark:text-gray-300 mb-3">Source :</h4>
              <div className="space-y-2 text-gray-700 dark:text-gray-300">
                <p><strong>Source :</strong> {duah.source}</p>
                <p><strong>Référence :</strong> {duah.reference_complete}</p>
              </div>
            </div>

            {/* Boutons d&apos;action */}
            <div className="flex flex-wrap gap-4 pt-4">
              <Button
                onClick={() => copyToClipboard(`${duah.texte_arabe}\n\nTraduction: ${duah.traduction}\n\nOccasion: ${duah.occasion}\n\nSource: ${duah.reference_complete}`, 'complet')}
                className="bg-teal-500 hover:bg-teal-600 text-white flex items-center gap-2"
              >
                <Copy className="w-4 h-4" />
                {copiedText === 'complet' ? "✓ Copié" : "Copier la duah"}
              </Button>
              
              <Button
                onClick={() => copyToClipboard(duah.phonetique, 'phonetique')}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Copy className="w-4 h-4" />
                {copiedText === 'phonetique' ? "✓ Copié" : "Copier la phonétique"}
              </Button>
              
              <Link href="/adoration/duahs">
                <Button variant="outline">
                  Voir d&apos;autres duahs
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Duahs similaires */}
        <div className="mt-12">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            Autres duahs de la même catégorie
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {duahsData
              .filter(d => d.categorie === duah.categorie && d.id !== duah.id)
              .slice(0, 4)
              .map((relatedDuah) => (
                <Link key={relatedDuah.id} href={`/adoration/duahs/${relatedDuah.slug}`}>
                  <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1">
                        {relatedDuah.titre}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                        {relatedDuah.bienfaits}
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
