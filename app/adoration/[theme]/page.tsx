"use client";

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getInvocationsByTheme } from '@/lib/invocations';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import InvocationCard from '@/components/InvocationCard';

export default function ThemePage() {
  const params = useParams();
  const themeSlug = params.theme as string;
  const themeData = getInvocationsByTheme(themeSlug);
  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set());

  if (!themeData) {
    return (
      <div className="min-h-screen py-8 px-4 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <h1 className="text-2xl font-bold mb-4">Thème introuvable</h1>
            <p className="mb-6">Le thème demandé n&apos;existe pas.</p>
            <Link href="/adoration">
              <Button>Retour aux thèmes</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const toggleExpanded = (id: number) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedCards(newExpanded);
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link href="/adoration" className="text-[var(--color-accent)] hover:underline">
            ← Retour aux thèmes
          </Link>
        </div>

        {/* En-tête du thème */}
        <div className="text-center mb-12">
          <div className={`w-20 h-20 rounded-full bg-gradient-to-r ${themeData.couleur} flex items-center justify-center mx-auto mb-4`}>
            <span className="text-4xl">{themeData.icone}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {themeData.nom}
          </h1>
          <p className="text-lg max-w-2xl mx-auto">
            {themeData.description}
          </p>
        </div>

        {/* Liste des invocations */}
        <div className="space-y-6">
          {themeData.invocations.map((invocation) => (
            <InvocationCard
              key={invocation.id}
              invocation={invocation}
              isExpanded={expandedCards.has(invocation.id)}
              onToggleExpand={() => toggleExpanded(invocation.id)}
            />
          ))}
        </div>

        {/* Bouton retour */}
        <div className="text-center mt-12">
          <Link href="/adoration">
            <Button size="lg" className="bg-[var(--color-accent)] hover:bg-[var(--color-accent-dark)]">
              🔙 Voir tous les thèmes
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
