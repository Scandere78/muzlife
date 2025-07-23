"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React from "react";

type Recitateur = {
  id: string;
  name: string;
  image: string;
};

const recitateurs: Recitateur[] = [
  { id: "abdul-basit", name: "Abdul Basit", image: "/img/abdul-basit.webp" },
  { id: "hussary", name: "Mahmoud Al Hussary", image: "/img/mahmoud.jpg" },
  { id: "saad", name: "Saad Al Ghamidi", image: "/img/saad-al-ghamdi.jpg" },
  { id: "yasser", name: "Yasser Al Dossari", image: "/img/yasser-al-dossari.png" },
  { id: "afs", name: "Mishary Al Afasi", image: "/img/mishary.webp" },
  { id: "balilah", name: "Bandar Balila", image: "/img/bandar-balila.jpg" },
  { id: "sds", name: "Abdul Rahman Al-Sudais", image: "/img/sudais.jpg" },
  { id: "h_dukhain", name: "Haitham Aldukhain", image: "/img/haitham.webp" },
  { id: "maher", name: "Maher Al Meaqli - Rewayat Hafs A'n Assem", image: "/img/Maher.png" },
  { id: "soufi-1", name: "Abderrashed Sofy", image: "/img/abdul-rashid-ali-sufi.png" },
  { id: "jhn", name: "Abdellah Al-Johany", image: "/img/al.jpg" },
  { id: "aabd-lrhmn-lshh-t", name: "Abdulrahman Al Shahat", image: "/img/abderrahman-shahat.jpg" },
  { id: "islam", name: "Islam Subhi", image: "/img/islam.png" },
];

export default function Recitateurs() {
  const router = useRouter();

  const goToReciter = (id: string) => {
    router.push(`/sourates/${id}`);
  };

  return (
    <div className="page-container navbar-safe px-4 py-8 flex flex-col items-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-emerald-900">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-green-400 mb-4 drop-shadow-lg">
          Choisissez un réciteur
        </h1>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          Découvrez les plus belles récitations du Coran par des récitateurs renommés du monde entier
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl w-full">
        {recitateurs.map((reciter, index) => (
          <Card
            key={reciter.id}
            className="group cursor-pointer transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 bg-gray-800/90 backdrop-blur-sm border border-gray-700 shadow-lg overflow-hidden hover:border-green-500/50"
            onClick={() => goToReciter(reciter.id)}
            style={{
              animationDelay: `${index * 0.1}s`,
              animation: "fadeInUp 0.6s ease-out forwards",
            }}
          >
            <CardContent className="p-6 flex flex-col items-center space-y-4">
              <div className="relative">
                {/* Cercle de fond avec gradient animé */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-400 via-emerald-500 to-teal-500 rounded-full opacity-75 group-hover:opacity-90 transition-opacity duration-300"></div>
                {/* Ring animé autour de l'avatar */}
                <div className="absolute inset-0 rounded-full border-4 border-transparent bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 group-hover:animate-spin transition-all duration-300"></div>
                {/* Avatar principal */}
                <Avatar className="relative w-24 h-24 md:w-28 md:h-28 border-4 border-white shadow-xl group-hover:scale-105 transition-transform duration-300">
                  <AvatarImage src={reciter.image} alt={reciter.name} className="object-cover" />
                  <AvatarFallback className="bg-gradient-to-br from-green-500 to-emerald-600 text-white text-xl font-bold">
                    {reciter.name.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                {/* Effet de brillance */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/20 to-transparent group-hover:animate-pulse"></div>
              </div>
              {/* Nom du récitateur */}
              <div className="text-center">
                <h3 className="font-semibold text-white text-sm md:text-base leading-tight group-hover:text-green-400 transition-colors duration-300">
                  {reciter.name}
                </h3>
                <div className="w-12 h-0.5 bg-gradient-to-r from-green-500 to-emerald-500 mx-auto mt-2 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              </div>
              {/* Icône de lecture */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-green-500 text-white p-2 rounded-full shadow-lg">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
