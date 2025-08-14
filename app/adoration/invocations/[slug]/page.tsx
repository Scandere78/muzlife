"use client";

import { invocationsDetaillees, getInvocationDetailsBySlug } from '@/lib/adorationData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Copy, Clock, AlertCircle } from 'lucide-react';

interface InvocationDetailPageProps {
  params: { slug: string };
}

export default function InvocationDetailPage({ params }: InvocationDetailPageProps) {
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const invocation = getInvocationDetailsBySlug(params.slug);

  if (!invocation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Invocation non trouvée
          </h1>
          <Link href="/adoration/invocations">
            <Button className="bg-blue-500 hover:bg-blue-600">
              Retour aux invocations
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

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Navigation */}
        <div className="mb-8">
          <Link href="/adoration/invocations">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Retour aux invocations
            </Button>
          </Link>
        </div>

        {/* Carte principale de l&apos;invocation */}
        <Card className="shadow-2xl border-l-4 border-l-blue-500">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
              {invocation.titre}
            </CardTitle>
            <div className="flex flex-wrap gap-3 mt-4">
              <span className="text-sm px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                {invocation.occasion}
              </span>
              {invocation.duree_recommandee && (
                <span className="text-sm px-3 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 rounded-full flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {invocation.duree_recommandee}
                </span>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Texte Arabe */}
            <div className="text-center p-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-xl">
              <p 
                className="text-3xl leading-relaxed font-amiri text-gray-900 dark:text-white cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                onClick={() => copyToClipboard(invocation.texte_arabe, 'arabe')}
                dir="rtl"
                lang="ar"
              >
                {invocation.texte_arabe}
              </p>
              {copiedText === 'arabe' && (
                <span className="text-sm text-blue-600 dark:text-blue-400 mt-3 block">
                  ✓ Texte arabe copié !
                </span>
              )}
            </div>

            {/* Phonétique */}
            <div className="bg-cyan-50 dark:bg-cyan-900/30 p-6 rounded-xl">
              <h4 className="font-semibold text-cyan-800 dark:text-cyan-300 mb-3 text-lg">Phonétique :</h4>
              <p className="text-cyan-700 dark:text-cyan-300 italic text-lg">
                {invocation.phonetique}
              </p>
            </div>

            {/* Traduction */}
            <div className="bg-emerald-50 dark:bg-emerald-900/30 p-6 rounded-xl">
              <h4 className="font-semibold text-emerald-800 dark:text-emerald-300 mb-3 text-lg">Traduction :</h4>
              <p className="text-emerald-700 dark:text-emerald-300 text-lg">
                &ldquo;{invocation.traduction}&rdquo;
              </p>
            </div>

            {/* Occasion spécifique */}
            <div className="bg-purple-50 dark:bg-purple-900/30 p-6 rounded-xl">
              <h4 className="font-semibold text-purple-800 dark:text-purple-300 mb-3 text-lg">
                Occasion spécifique :
              </h4>
              <p className="text-purple-700 dark:text-purple-300">
                {invocation.occasion}
              </p>
            </div>

            {/* Bienfaits */}
            <div className="bg-orange-50 dark:bg-orange-900/30 p-6 rounded-xl">
              <h4 className="font-semibold text-orange-800 dark:text-orange-300 mb-3 text-lg">Bienfaits :</h4>
              <p className="text-orange-700 dark:text-orange-300">
                {invocation.bienfaits}
              </p>
            </div>

            {/* Contexte */}
            <div className="bg-teal-50 dark:bg-teal-900/30 p-6 rounded-xl">
              <h4 className="font-semibold text-teal-800 dark:text-teal-300 mb-3 text-lg">Contexte :</h4>
              <p className="text-teal-700 dark:text-teal-300">
                {invocation.contexte}
              </p>
            </div>

            {/* Mérite spécial */}
            {invocation.merite && (
              <div className="bg-yellow-50 dark:bg-yellow-900/30 p-6 rounded-xl border-l-4 border-yellow-400">
                <h4 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-3 text-lg flex items-center gap-2">
                  ✨ Mérite spécial
                </h4>
                <p className="text-yellow-700 dark:text-yellow-300">
                  {invocation.merite}
                </p>
              </div>
            )}

            {/* Explication */}
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl">
              <h4 className="font-semibold text-gray-800 dark:text-gray-300 mb-3 text-lg">Explication :</h4>
              <p className="text-gray-700 dark:text-gray-300">
                {invocation.explication}
              </p>
            </div>

            {/* Contexte du hadith (pliable) */}
            {invocation.hadith_contexte && (
              <div className="border rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleSection('hadith')}
                  className="w-full p-6 bg-indigo-50 dark:bg-indigo-900/30 text-left font-semibold text-indigo-800 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    📚 Contexte du hadith
                  </span>
                  <span className="text-lg">
                    {expandedSection === 'hadith' ? '▼' : '▶'}
                  </span>
                </button>
                {expandedSection === 'hadith' && (
                  <div className="p-6 bg-indigo-50 dark:bg-indigo-900/20">
                    <p className="text-indigo-700 dark:text-indigo-300 leading-relaxed">
                      {invocation.hadith_contexte}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Note importante */}
            {invocation.note_importante && (
              <div className="bg-red-50 dark:bg-red-900/30 p-6 rounded-xl border-l-4 border-red-400">
                <h4 className="font-semibold text-red-800 dark:text-red-300 mb-3 text-lg flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Note importante
                </h4>
                <p className="text-red-700 dark:text-red-300">
                  {invocation.note_importante}
                </p>
              </div>
            )}

            {/* Source */}
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl">
              <h4 className="font-semibold text-gray-800 dark:text-gray-300 mb-3">Source :</h4>
              <div className="space-y-2 text-gray-700 dark:text-gray-300">
                <p><strong>Source :</strong> {invocation.source}</p>
                <p><strong>Référence :</strong> {invocation.reference_complete}</p>
              </div>
            </div>

            {/* Boutons d&apos;action */}
            <div className="flex flex-wrap gap-4 pt-4">
              <Button
                onClick={() => copyToClipboard(`${invocation.texte_arabe}\n\nTraduction: ${invocation.traduction}\n\nOccasion: ${invocation.occasion}\n\nSource: ${invocation.reference_complete}`, 'complet')}
                className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2"
              >
                <Copy className="w-4 h-4" />
                {copiedText === 'complet' ? "✓ Copié" : "Copier l&apos;invocation"}
              </Button>
              
              <Button
                onClick={() => copyToClipboard(invocation.phonetique, 'phonetique')}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Copy className="w-4 h-4" />
                {copiedText === 'phonetique' ? "✓ Copié" : "Copier la phonétique"}
              </Button>
              
              <Link href="/adoration/invocations">
                <Button variant="outline">
                  Voir d&apos;autres invocations
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Invocations similaires */}
        <div className="mt-12">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            Autres invocations pour la même occasion
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {invocationsDetaillees
              .filter(inv => inv.occasion === invocation.occasion && inv.id !== invocation.id)
              .slice(0, 4)
              .map((relatedInvocation) => (
                <Link key={relatedInvocation.id} href={`/adoration/invocations/${relatedInvocation.slug}`}>
                  <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1">
                        {relatedInvocation.titre}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                        {relatedInvocation.bienfaits}
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
