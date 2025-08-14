"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { invocationsDetaillees, getCategorieBySlug } from "@/lib/adorationData";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, Clock, Heart, Copy, Shield } from "lucide-react";

export default function InvocationsPage() {
  const categorie = getCategorieBySlug("invocations");

  if (!categorie) {
    return <div>Catégorie non trouvée</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Navigation */}
      <div className="mb-6">
        <Link href="/adoration">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Retour à l&apos;Adoration
          </Button>
        </Link>
      </div>

      {/* En-tête de la section */}
      <div className="text-center mb-12">
        <div className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-r ${categorie.couleur} flex items-center justify-center text-white mb-6 shadow-lg`}>
          <span className="text-3xl">{categorie.icone}</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
          {categorie.nom}
        </h1>
        <p className="text-lg text-[var(--color-foreground)]/80 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed mb-6">
          {categorie.description}
        </p>
        <div className="text-sm text-[var(--color-foreground)]/60 dark:text-gray-400">
          {categorie.sous_titre}
        </div>
      </div>

      {/* Introduction spécifique aux Invocations */}
      <div className="mb-12 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-300 mb-4 flex items-center gap-2">
          <BookOpen className="w-6 h-6" />
          Les Invocations dans la Tradition Islamique
        </h2>
        <div className="grid md:grid-cols-2 gap-6 text-sm">
          <div>
            <h3 className="font-semibold text-blue-700 dark:text-blue-400 mb-2">Occasions Spécifiques :</h3>
            <ul className="space-y-1 text-[var(--color-foreground)]/80 dark:text-gray-300">
              <li>• Voyages et déplacements</li>
              <li>• Moments de détresse et d&apos;angoisse</li>
              <li>• Maladies et épreuves</li>
              <li>• Demandes de guidance (Istikhara)</li>
              <li>• Protection et sauvegarde</li>
              <li>• Bénédictions et remerciements</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-blue-700 dark:text-blue-400 mb-2">Enseignement Prophétique :</h3>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 italic">
              <p className="text-[var(--color-foreground)]/80 dark:text-gray-300 mb-2">
                &quot;L&apos;invocation est l&apos;essence même de l&apos;adoration.&quot;
              </p>
              <p className="text-blue-600 dark:text-blue-400 text-xs font-medium">
                - Sunan At-Tirmidhi n° 3371
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des Invocations */}
      <div className="grid gap-8">
        {invocationsDetaillees.map((invocation) => (
          <Card key={invocation.id} className="border-2 border-blue-100 dark:border-blue-800 hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-xl font-bold text-blue-800 dark:text-blue-300 mb-2">
                    {invocation.titre}
                  </CardTitle>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 px-3 py-1 rounded-full text-xs font-medium">
                      🎯 {invocation.occasion}
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigator.clipboard.writeText(invocation.texte_arabe)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Texte Arabe */}
              <div className="text-center">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-lg p-6 mb-4">
                  <p className="text-xl md:text-2xl font-arabic text-blue-800 dark:text-blue-300 leading-relaxed">
                    {invocation.texte_arabe}
                  </p>
                </div>
                
                {/* Phonétique */}
                <p className="text-lg italic text-[var(--color-foreground)]/60 dark:text-gray-400 mb-3">
                  &quot;{invocation.phonetique}&quot;
                </p>
                
                {/* Traduction */}
                <p className="text-lg font-medium text-[var(--color-foreground)] dark:text-gray-200">
                  {invocation.traduction}
                </p>
              </div>

              {/* Informations principales */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Heart className="w-4 h-4 text-green-600" />
                    <span className="font-semibold text-green-800 dark:text-green-300">Bienfaits</span>
                  </div>
                  <p className="text-sm text-[var(--color-foreground)]/80 dark:text-gray-300">{invocation.bienfaits}</p>
                </div>

                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-purple-600" />
                    <span className="font-semibold text-purple-800 dark:text-purple-300">Source</span>
                  </div>
                  <p className="text-sm text-[var(--color-foreground)]/80 dark:text-gray-300">{invocation.reference_courte}</p>
                </div>
              </div>

              {/* Contexte */}
              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-2">📍 Contexte :</h4>
                <p className="text-sm text-[var(--color-foreground)]/80 dark:text-gray-300">{invocation.contexte}</p>
              </div>

              {/* Explication */}
              <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4">
                <h4 className="font-semibold text-indigo-800 dark:text-indigo-300 mb-2">💡 Explication :</h4>
                <p className="text-sm text-[var(--color-foreground)]/80 dark:text-gray-300">{invocation.explication}</p>
              </div>

              {/* Mérite (si disponible) */}
              {invocation.merite && (
                <div className="bg-rose-50 dark:bg-rose-900/20 rounded-lg p-4">
                  <h4 className="font-semibold text-rose-800 dark:text-rose-300 mb-2">⭐ Mérite :</h4>
                  <p className="text-sm text-[var(--color-foreground)]/80 dark:text-gray-300 italic">&quot;{invocation.merite}&quot;</p>
                </div>
              )}

              {/* Contexte du Hadith (si disponible) */}
              {invocation.hadith_contexte && (
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 dark:text-gray-300 mb-2">📚 Contexte du Hadith :</h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{invocation.hadith_contexte}</p>
                </div>
              )}

              {/* Note importante (si disponible) */}
              {invocation.note_importante && (
                <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border-l-4 border-red-500">
                  <h4 className="font-semibold text-red-800 dark:text-red-300 mb-2">⚠️ Note Importante :</h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{invocation.note_importante}</p>
                </div>
              )}

              {/* Durée recommandée (si disponible) */}
              {invocation.duree_recommandee && (
                <div className="bg-cyan-50 dark:bg-cyan-900/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-cyan-600" />
                    <span className="font-semibold text-cyan-800 dark:text-cyan-300">Durée Recommandée</span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{invocation.duree_recommandee}</p>
                </div>
              )}

              {/* Source complète */}
              <div className="border-t pt-4">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  <span className="font-medium">Source complète :</span> {invocation.reference_complete}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Footer inspirant */}
      <div className="mt-12 text-center bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6">
        <p className="text-sm text-gray-600 dark:text-gray-400 italic max-w-2xl mx-auto">
          &quot;Et votre Seigneur a dit : &apos;Invoquez-Moi, Je vous répondrai. Ceux qui, par orgueil, 
          se refusent à M&apos;adorer entreront bientôt dans l&apos;Enfer, humiliés.&apos;&quot;
          <span className="font-medium"> - Sourate Ghafir (40:60)</span>
        </p>
      </div>
    </div>
  );
}
