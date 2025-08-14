"use client";

import React, { useState } from 'react';
import { Invocation } from '@/lib/invocations';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface InvocationCardProps {
  invocation: Invocation;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

export default function InvocationCard({ 
  invocation, 
  isExpanded = false, 
  onToggleExpand 
}: InvocationCardProps) {
  const [localExpanded, setLocalExpanded] = useState(false);
  
  // Utilise soit l'état externe soit l'état local
  const expanded = onToggleExpand ? isExpanded : localExpanded;
  const toggleExpand = onToggleExpand || (() => setLocalExpanded(!localExpanded));

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-6">
        {/* En-tête de l'invocation */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h2 className="text-xl font-bold mb-2">{invocation.titre}</h2>
            {invocation.moment && (
              <span className="inline-block bg-[var(--color-accent)]/20 text-[var(--color-accent)] px-3 py-1 rounded-full text-sm font-medium">
                {invocation.moment}
              </span>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleExpand}
            className="ml-4 shrink-0"
          >
            {expanded ? 'Réduire' : 'Développer'}
          </Button>
        </div>

        {/* Texte arabe - toujours visible */}
        <div className="mb-6 p-4 bg-[var(--color-muted)]/30 rounded-lg">
          <p className="text-right text-xl md:text-2xl leading-relaxed font-arabic" dir="rtl">
            {invocation.texte_arabe}
          </p>
        </div>

        {/* Contenu extensible */}
        {expanded && (
          <div className="space-y-6 border-t pt-6 animate-in slide-in-from-top duration-300">
            {/* Phonétique */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-lg">
              <h3 className="font-semibold text-[var(--color-accent)] mb-3 flex items-center">
                <span className="mr-2">📝</span>
                Phonétique
              </h3>
              <p className="italic leading-relaxed text-sm md:text-base">
                {invocation.phonetique}
              </p>
            </div>

            {/* Traduction */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 p-4 rounded-lg">
              <h3 className="font-semibold text-[var(--color-accent)] mb-3 flex items-center">
                <span className="mr-2">🔤</span>
                Traduction
              </h3>
              <blockquote className="leading-relaxed text-sm md:text-base border-l-4 border-[var(--color-accent)] pl-4">
                &quot;{invocation.traduction}&quot;
              </blockquote>
            </div>

            {/* Répétitions */}
            {invocation.repetitions && (
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-lg">
                <h3 className="font-semibold text-[var(--color-accent)] mb-2 flex items-center">
                  <span className="mr-2">🔄</span>
                  Répétitions
                </h3>
                <p className="text-sm font-medium">{invocation.repetitions}</p>
              </div>
            )}

            {/* Source et référence */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 p-4 rounded-lg">
                <h3 className="font-semibold text-[var(--color-accent)] mb-2 flex items-center">
                  <span className="mr-2">📚</span>
                  Source
                </h3>
                <p className="text-sm font-medium">{invocation.source}</p>
              </div>
              <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 p-4 rounded-lg">
                <h3 className="font-semibold text-[var(--color-accent)] mb-2 flex items-center">
                  <span className="mr-2">📖</span>
                  Référence
                </h3>
                <p className="text-xs leading-relaxed">{invocation.reference_complete}</p>
              </div>
            </div>

            {/* Contexte et explication */}
            {(invocation.contexte || invocation.explication) && (
              <div className="bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-800/50 dark:to-slate-800/50 p-4 rounded-lg">
                {invocation.contexte && (
                  <>
                    <h3 className="font-semibold text-[var(--color-accent)] mb-2 flex items-center">
                      <span className="mr-2">📋</span>
                      Contexte
                    </h3>
                    <p className="text-sm leading-relaxed mb-4">{invocation.contexte}</p>
                  </>
                )}
                {invocation.explication && (
                  <>
                    <h3 className="font-semibold text-[var(--color-accent)] mb-2 flex items-center">
                      <span className="mr-2">�</span>
                      Explication
                    </h3>
                    <p className="text-sm leading-relaxed">{invocation.explication}</p>
                  </>
                )}
              </div>
            )}

            {/* Bienfaits et mérite */}
            {(invocation.bienfaits || invocation.merite) && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-lg">
                {invocation.bienfaits && (
                  <>
                    <h3 className="font-semibold text-[var(--color-accent)] mb-2 flex items-center">
                      <span className="mr-2">✨</span>
                      Bienfaits
                    </h3>
                    <p className="text-sm leading-relaxed mb-3">{invocation.bienfaits}</p>
                  </>
                )}
                {invocation.merite && (
                  <>
                    <h3 className="font-semibold text-[var(--color-accent)] mb-2 flex items-center">
                      <span className="mr-2">🏆</span>
                      Mérite
                    </h3>
                    <p className="text-sm leading-relaxed">{invocation.merite}</p>
                  </>
                )}
              </div>
            )}

            {/* Hadith et contexte prophétique */}
            {invocation.hadith_contexte && (
              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 p-4 rounded-lg border-l-4 border-[var(--color-accent)]">
                <h3 className="font-semibold text-[var(--color-accent)] mb-2 flex items-center">
                  <span className="mr-2">🕌</span>
                  Hadith / Contexte prophétique
                </h3>
                <p className="text-sm leading-relaxed italic">{invocation.hadith_contexte}</p>
              </div>
            )}

            {/* Note importante */}
            {invocation.note_importante && (
              <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                <h3 className="font-semibold text-red-600 dark:text-red-400 mb-2 flex items-center">
                  <span className="mr-2">⚠️</span>
                  Note importante
                </h3>
                <p className="text-sm leading-relaxed text-red-700 dark:text-red-300">{invocation.note_importante}</p>
              </div>
            )}

            {/* Actions supplémentaires */}
            <div className="flex flex-wrap gap-2 pt-4 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(invocation.texte_arabe);
                }}
                className="text-xs copy-button"
              >
                📋 Copier l&apos;arabe
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(invocation.phonetique);
                }}
                className="text-xs copy-button"
              >
                � Copier la phonétique
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const fullText = `${invocation.titre}\n\n${invocation.texte_arabe}\n\n${invocation.phonetique}\n\n"${invocation.traduction}"\n\nSource: ${invocation.source}\nRéférence: ${invocation.reference_complete}`;
                  navigator.clipboard.writeText(fullText);
                }}
                className="text-xs copy-button"
              >
                � Copier tout
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
