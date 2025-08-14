"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { perlesSpirite, getCategorieBySlug } from "@/lib/adorationData";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Gem, Clock, Repeat, Copy, Star, Award } from "lucide-react";

export default function PerlesPage() {
  const categorie = getCategorieBySlug("perles");

  if (!categorie) {
    return <div>Catégorie non trouvée</div>;
  }

  // Mapping des types vers des couleurs et icônes
  const typeConfig = {
    istighfar: { color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300", icon: "🤲", label: "Istighfar" },
    tasbih: { color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300", icon: "🌿", label: "Tasbih" },
    tahmid: { color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300", icon: "🙏", label: "Tahmid" },
    takbir: { color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300", icon: "📣", label: "Takbir" },
    tahlil: { color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300", icon: "☝️", label: "Tahlil" },
    salawat: { color: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300", icon: "💝", label: "Salawat" },
    other: { color: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300", icon: "💎", label: "Autre" }
  };

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
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
          {categorie.nom}
        </h1>
        <p className="text-lg text-[var(--color-foreground)]/80 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed mb-6">
          {categorie.description}
        </p>
        <div className="text-sm text-[var(--color-foreground)]/60 dark:text-gray-400">
          {categorie.sous_titre}
        </div>
      </div>

      {/* Introduction spécifique aux Perles */}
      <div className="mb-12 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-purple-800 dark:text-purple-300 mb-4 flex items-center gap-2">
          <Gem className="w-6 h-6" />
          Les Perles du Dhikr : Trésors Spirituels
        </h2>
        <div className="grid md:grid-cols-2 gap-6 text-sm">
          <div>
            <h3 className="font-semibold text-purple-700 dark:text-purple-400 mb-2">Caractéristiques des Perles :</h3>
            <ul className="space-y-1 text-[var(--color-foreground)]/80 dark:text-gray-300">
              <li>• Formules courtes mais puissantes</li>
              <li>• Récompenses extraordinaires</li>
              <li>• Facilité de mémorisation</li>
              <li>• Multiplication divine des bienfaits</li>
              <li>• Pratique à tout moment</li>
              <li>• Purification profonde du cœur</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-purple-700 dark:text-purple-400 mb-2">Sagesse Prophétique :</h3>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 italic">
              <p className="text-[var(--color-foreground)]/80 dark:text-gray-300 mb-2">
                &quot;Deux paroles légères sur la langue, lourdes dans la balance, 
                aimées du Miséricordieux : SubhanAllah wa bihamdihi, SubhanAllah al-Adhim.&quot;
              </p>
              <p className="text-purple-600 dark:text-purple-400 text-xs font-medium">
                - Sahîh Al-Bukhari n° 6682
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des Perles */}
      <div className="grid gap-6">
        {perlesSpirite.map((perle) => {
          const typeInfo = typeConfig[perle.type] || typeConfig.other;
          
          return (
            <Card key={perle.id} className="border-2 border-purple-100 dark:border-purple-800 hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl font-bold text-purple-800 dark:text-purple-300 mb-2">
                      {perle.titre}
                    </CardTitle>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className={`${typeInfo.color} px-3 py-1 rounded-full text-xs font-medium`}>
                        {typeInfo.icon} {typeInfo.label}
                      </span>
                      {perle.facilite && (
                        <span className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 px-2 py-1 rounded-full text-xs font-medium">
                          ✅ Très facile
                        </span>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigator.clipboard.writeText(perle.texte_arabe)}
                    className="text-purple-600 hover:text-purple-800"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Texte Arabe */}
                <div className="text-center">
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 rounded-lg p-6 mb-4">
                    <p className="text-xl md:text-2xl font-arabic text-purple-800 dark:text-purple-300 leading-relaxed">
                      {perle.texte_arabe}
                    </p>
                  </div>
                  
                  {/* Phonétique */}
                  <p className="text-lg italic text-[var(--color-foreground)]/60 dark:text-gray-400 mb-3">
                    &quot;{perle.phonetique}&quot;
                  </p>
                  
                  {/* Traduction */}
                  <p className="text-lg font-medium text-[var(--color-foreground)] dark:text-gray-200">
                    {perle.traduction}
                  </p>
                </div>

                {/* Informations pratiques */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Repeat className="w-4 h-4 text-blue-600" />
                      <span className="font-semibold text-blue-800 dark:text-blue-300">Répétitions</span>
                    </div>
                    <p className="text-sm text-[var(--color-foreground)]/80 dark:text-gray-300">{perle.repetitions}</p>
                  </div>

                  <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-yellow-600" />
                      <span className="font-semibold text-yellow-800 dark:text-yellow-300">Moment Idéal</span>
                    </div>
                    <p className="text-sm text-[var(--color-foreground)]/80 dark:text-gray-300">{perle.moment_ideal}</p>
                  </div>

                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="w-4 h-4 text-green-600" />
                      <span className="font-semibold text-green-800 dark:text-green-300">Source</span>
                    </div>
                    <p className="text-xs text-[var(--color-foreground)]/60 dark:text-gray-400">{perle.reference_courte}</p>
                  </div>
                </div>

                {/* Récompense - Mise en avant spéciale */}
                <div className="bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 rounded-lg p-6 border-2 border-yellow-200 dark:border-yellow-700">
                  <div className="flex items-center gap-2 mb-3">
                    <Award className="w-6 h-6 text-yellow-600" />
                    <h4 className="text-lg font-bold text-yellow-800 dark:text-yellow-300">💰 Récompense Divine</h4>
                  </div>
                  <p className="text-[var(--color-foreground)] dark:text-gray-200 font-medium leading-relaxed">
                    {perle.recompense}
                  </p>
                </div>

                {/* Bienfaits */}
                <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4">
                  <h4 className="font-semibold text-indigo-800 dark:text-indigo-300 mb-2">💎 Bienfaits :</h4>
                  <p className="text-sm text-[var(--color-foreground)]/80 dark:text-gray-300">{perle.bienfaits}</p>
                </div>

                {/* Variantes (si disponibles) */}
                {perle.variantes && perle.variantes.length > 0 && (
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 dark:text-gray-300 mb-2">🔄 Variantes :</h4>
                    <ul className="text-sm text-[var(--color-foreground)]/80 dark:text-gray-300 space-y-1">
                      {perle.variantes.map((variante, index) => (
                        <li key={index}>• {variante}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Source complète */}
                <div className="border-t pt-4">
                  <p className="text-xs text-[var(--color-foreground)]/60 dark:text-gray-400">
                    <span className="font-medium">Source complète :</span> {perle.reference_complete}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Footer inspirant */}
      <div className="mt-12 text-center bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-6">
        <p className="text-sm text-[var(--color-foreground)]/80 dark:text-gray-400 italic max-w-3xl mx-auto">
          &quot;Il y a dans le dhikr d&apos;Allah une douceur que ne goûtent que ceux qui L&apos;évoquent. 
          Si les rois savaient quelle vie délicieuse nous menons, ils nous combattraient avec l&apos;épée.&quot;
          <span className="font-medium"> - Ibn Taymiyyah</span>
        </p>
      </div>
    </div>
  );
}
