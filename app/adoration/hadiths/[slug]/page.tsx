"use client";

import React from 'react';
import { hadithsEdifiants, getHadithBySlug } from '@/lib/adorationData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Copy, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { Navbar } from "../../../../components";

interface HadithDetailPageProps {
  params: { slug: string };
}

export default function HadithDetailPage({ params }: HadithDetailPageProps) {
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const hadith = getHadithBySlug(params.slug);

  if (!hadith) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-900 dark:to-gray-800 py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Hadith non trouvé
          </h1>
          <Link href="/adoration/hadiths">
            <Button className="bg-amber-500 hover:bg-amber-600">
              Retour aux hadiths
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const copyToClipboard = (text: string, id: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  // Configuration pour les degrés d'authenticité
  const authenticitConfig = {
    sahih: { 
      color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300", 
      icon: <CheckCircle className="w-4 h-4" />, 
      label: "Sahîh (Authentique)" 
    },
    hassan: { 
      color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300", 
      icon: <AlertCircle className="w-4 h-4" />, 
      label: "Hassan (Bon)" 
    },
    daif: { 
      color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300", 
      icon: <Info className="w-4 h-4" />, 
      label: "Da&apos;îf (Faible)" 
    }
  };

  const authConfig = authenticitConfig[hadith.degre_authenticite] || authenticitConfig.sahih;

  return (
    <div className="min-h-screen page-container py-12 navbar-safe" style={{ background: 'transparent', color: 'var(--color-foreground)' }}>
      <Navbar />
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Navigation */}
        <div className="mb-8">
          <Link href="/adoration/hadiths">
            <Button variant="outline" className="flex items-center gap-2 bg-[var(--color-muted)]/60 border-[var(--color-border)] text-green-800 dark:text-white hover:bg-[var(--color-accent)]/20">
              <ArrowLeft className="w-4 h-4" />
              Retour aux hadiths
            </Button>
          </Link>
        </div>

        {/* Carte principale du hadith */}
        <Card className="shadow-2xl border-l-4 border-l-[var(--color-accent)] bg-[var(--color-muted)]/60 backdrop-blur-sm border border-[var(--color-border)]">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl font-bold text-[var(--color-foreground)] dark:text-white drop-shadow">
              {hadith.titre}
            </CardTitle>
            <div className="flex flex-wrap gap-3 mt-4">
              <span className="text-sm px-3 py-1 bg-[var(--color-accent)]/20 text-[var(--color-accent)] rounded-full border border-[var(--color-border)]">
                {hadith.theme}
              </span>
              <span className={`text-sm px-3 py-1 rounded-full flex items-center gap-1 ${authConfig.color}`}>
                {authConfig.icon}
                {authConfig.label}
              </span>
            </div>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Texte Arabe */}
            <div className="text-center p-8 bg-[var(--color-muted)]/40 backdrop-blur-sm rounded-xl border border-[var(--color-border)]">
              <p 
                className="text-3xl leading-relaxed font-amiri text-[var(--color-foreground)] dark:text-white cursor-pointer hover:text-[var(--color-accent)] transition-colors drop-shadow"
                onClick={() => copyToClipboard(hadith.texte_arabe, hadith.id)}
                dir="rtl"
                lang="ar"
              >
                {hadith.texte_arabe}
              </p>
              {copiedId === hadith.id && (
                <span className="text-sm text-[var(--color-accent)] mt-3 block font-semibold">
                  ✓ Texte arabe copié !
                </span>
              )}
            </div>

            {/* Phonétique */}
            <div className="bg-[var(--color-muted)]/40 backdrop-blur-sm p-6 rounded-xl border border-[var(--color-border)]">
              <h4 className="font-semibold text-[var(--color-foreground)] dark:text-white mb-3 text-lg drop-shadow">Phonétique :</h4>
              <p className="text-[var(--color-foreground)] dark:text-gray-300 italic text-lg">
                {hadith.phonetique}
              </p>
            </div>

            {/* Traduction */}
            <div className="bg-[var(--color-muted)]/40 backdrop-blur-sm p-6 rounded-xl border border-[var(--color-border)]">
              <h4 className="font-semibold text-[var(--color-foreground)] dark:text-white mb-3 text-lg drop-shadow">Traduction :</h4>
              <p className="text-[var(--color-foreground)] dark:text-gray-300 text-lg">
                &ldquo;{hadith.traduction}&rdquo;
              </p>
            </div>

            {/* Leçon principale */}
            <div className="bg-[var(--color-accent)]/10 backdrop-blur-sm p-6 rounded-xl border border-[var(--color-border)]">
              <h4 className="font-semibold text-[var(--color-accent)] mb-3 text-lg flex items-center gap-2 drop-shadow">
                💡 Leçon principale
              </h4>
              <p className="text-[var(--color-foreground)] dark:text-gray-300 text-lg">
                {hadith.lecon}
              </p>
            </div>

            {/* Contexte */}
            <div className="bg-[var(--color-muted)]/40 backdrop-blur-sm p-6 rounded-xl border border-[var(--color-border)]">
              <h4 className="font-semibold text-[var(--color-foreground)] dark:text-white mb-3 text-lg drop-shadow">Contexte historique :</h4>
              <p className="text-[var(--color-foreground)] dark:text-gray-300">
                {hadith.contexte}
              </p>
            </div>

            {/* Application pratique */}
            {hadith.application_pratique && (
              <div className="bg-[var(--color-accent)]/10 backdrop-blur-sm p-6 rounded-xl border border-[var(--color-border)]">
                <h4 className="font-semibold text-[var(--color-accent)] mb-3 text-lg flex items-center gap-2 drop-shadow">
                  🎯 Application pratique
                </h4>
                <p className="text-[var(--color-foreground)] dark:text-gray-300">
                  {hadith.application_pratique}
                </p>
              </div>
            )}

            {/* Explication détaillée (pliable) */}
            {hadith.explication_savants && (
              <div className="border border-[var(--color-border)] rounded-xl overflow-hidden bg-[var(--color-muted)]/40 backdrop-blur-sm">
                <button
                  onClick={() => toggleSection('explication')}
                  className="w-full p-6 bg-[var(--color-muted)]/60 text-left font-semibold text-[var(--color-foreground)] dark:text-white hover:bg-[var(--color-accent)]/10 transition-colors flex items-center justify-between drop-shadow"
                >
                  <span className="flex items-center gap-2">
                    📖 Explication des savants
                  </span>
                  <span className="text-lg text-[var(--color-accent)]">
                    {expandedSection === 'explication' ? '▼' : '▶'}
                  </span>
                </button>
                {expandedSection === 'explication' && (
                  <div className="p-6 bg-[var(--color-muted)]/20">
                    <p className="text-[var(--color-foreground)] dark:text-gray-300 leading-relaxed">
                      {hadith.explication_savants}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Source et narrateur */}
            <div className="bg-[var(--color-muted)]/40 backdrop-blur-sm p-6 rounded-xl border border-[var(--color-border)]">
              <h4 className="font-semibold text-[var(--color-foreground)] dark:text-white mb-3 drop-shadow">Source et transmission :</h4>
              <div className="space-y-2 text-[var(--color-foreground)] dark:text-gray-300">
                <p><strong>Rapporté par :</strong> {hadith.narrateur}</p>
                <p><strong>Référence :</strong> {hadith.reference_complete}</p>
                <p><strong>Degré d&apos;authenticité :</strong> {authConfig.label}</p>
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="flex flex-wrap gap-4 pt-4">
              <Button
                onClick={() => copyToClipboard(`${hadith.texte_arabe}\n\nTraduction: ${hadith.traduction}\n\nLeçon: ${hadith.lecon}\n\nSource: ${hadith.reference_complete}`, hadith.id)}
                className="bg-[var(--color-accent)] hover:bg-[var(--color-accent-dark)] text-white flex items-center gap-2 shadow-lg"
              >
                <Copy className="w-4 h-4" />
                {copiedId === hadith.id ? "✓ Copié" : "Copier le hadith"}
              </Button>
              
              <Link href="/adoration/hadiths">
                <Button variant="outline" className="border-[var(--color-border)] text-[var(--color-foreground)] dark:text-white hover:bg-[var(--color-accent)]/20">
                  Voir d&apos;autres hadiths
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Hadiths similaires */}
        <div className="mt-12">
          <h3 className="text-xl font-bold text-[var(--color-foreground)] dark:text-white mb-6 drop-shadow">
            Autres hadiths du même thème
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {hadithsEdifiants
              .filter(h => h.theme === hadith.theme && h.id !== hadith.id)
              .slice(0, 4)
              .map((relatedHadith) => (
                <Link key={relatedHadith.id} href={`/adoration/hadiths/${relatedHadith.slug}`}>
                  <Card className="hover:shadow-lg hover:shadow-[var(--color-accent)]/20 transition-all duration-300 cursor-pointer bg-[var(--color-muted)]/60 backdrop-blur-sm border border-[var(--color-border)] hover:border-[var(--color-accent)]/50 transform hover:-translate-y-1">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-[var(--color-foreground)] dark:text-white mb-2 line-clamp-1 drop-shadow">
                        {relatedHadith.titre}
                      </h4>
                      <p className="text-sm text-[var(--color-foreground)] dark:text-gray-300 line-clamp-2">
                        {relatedHadith.lecon}
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
