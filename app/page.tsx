"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { Pagination, Autoplay, EffectFade } from "swiper/modules";
import { Navbar, LocalClock, PrayerTimer, NextPrayer } from "../components";
import "../styles/globals.css";
import PrayerProgressBar from "@/components/PrayerProgressBar";
import ExampleWithLottie from "@/components/ExampleWithLottie";

// Composant PrayerTimer avec modale améliorée
function PrayerTimerWithModal() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fonction pour fermer la modale proprement
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Gestion du scroll de la modale principale
  React.useEffect(() => {
    if (isModalOpen) {
      // Sauvegarder la position actuelle du scroll
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
    } else {
      // Restaurer la position du scroll
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }
    
    // Cleanup
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
    };
  }, [isModalOpen]);

  return (
    <>
      <div onClick={() => setIsModalOpen(true)} className="cursor-pointer group">
        <div className="relative">
          <PrayerTimer />
          {/* Indicateur visuel que c'est cliquable */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-purple-600 text-white text-xs px-3 py-1 rounded-full shadow-lg">
              📊 Voir la progression
            </div>
          </div>
        </div>
      </div>
      
      {/* Modale PrayerProgressBar améliorée */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" 
          onClick={closeModal}
        >
          <div 
            className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl mx-4 relative animate-in slide-in-from-bottom-4 duration-300 max-h-[90vh] overflow-y-auto" 
            onClick={e => e.stopPropagation()}
          >
            {/* En-tête de la modale */}
            <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 rounded-t-3xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-2xl">🕌</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Progression Spirituelle</h2>
                    <p className="text-purple-100 text-sm">Suivez votre parcours de prière quotidien</p>
                  </div>
                </div>
                <button 
                  className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white text-xl transition-colors duration-200" 
                  onClick={closeModal}
                >
                  ✕
                </button>
              </div>
            </div>
            
            {/* Contenu de la modale */}
            <div className="p-6">
              <PrayerProgressBar />
              
              {/* Conseils spirituels */}
              <div className="mt-8 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">💡</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-amber-800 mb-2">Conseil Spirituel</h3>
                    <p className="text-amber-700 text-sm leading-relaxed">
                      &ldquo;Et accomplis la prière aux deux extrémités du jour et à certaines heures de la nuit. 
                      Les bonnes œuvres chassent les mauvaises. Cela est une exhortation pour ceux qui réfléchissent.&rdquo;
                      <span className="block mt-2 font-medium">- Sourate Hud, verset 114</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Pied de la modale */}
            <div className="bg-gray-50 px-6 py-4 rounded-b-3xl flex justify-center">
              <button 
                onClick={closeModal}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-full transition-colors duration-200 font-medium"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}


interface Recitateur {
  id: number;
  name: string;
  image: string;
}

export default function HomePage() {
  const recitateurs: Recitateur[] = [
    { id: 1, name: "Abdul Basit", image: "/img/abdul-basit.webp" },
    { id: 2, name: "Mishary Rashid", image: "/img/mishary.webp" },
    { id: 3, name: "Saad Al Ghamdi", image: "/img/saad-al-ghamdi.jpg" },
    { id: 4, name: "Yasser Al Dosari", image: "/img/yasser-al-dossari.png" },
  ];

  return (
    <div className="py-12 min-h-screen navbar-safe" style={{ background: 'transparent', color: 'var(--color-foreground)' }}>
      {/* Présentation */}
      <Navbar />
      <div className="text-center px-4 max-w-4xl mx-auto">
        <h1 className="text-4xl text-indigo-600 font-bold">  
          Bienvenue sur MuzLife
        </h1>
      </div>

      {/* Horloge locale et prochaine prière */}
      <div className="mt-12 px-6 max-w-4xl mx-auto">
        <div className="mt-12 flex flex-col items-center">
            <h2 className="text-2xl font-bold text-[var(--color-accent)] mb-4">🕌 Temps restant</h2>
            <PrayerTimerWithModal />
        </div>
        <NextPrayer />  
      </div>

      {/* Cartes de fonctionnalités */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-16 px-6 max-w-7xl mx-auto">
        <div className="transition-all duration-300 transform hover:-translate-y-1">
          <Link href="/lecture" className="block">
            <div className="bg-[var(--color-muted)]/60 p-8 rounded-xl shadow-lg cursor-pointer hover:shadow-[var(--color-accent)]/20 hover:bg-[var(--color-background)] transition-all duration-300 border border-[var(--color-border)] h-full">
              <div className="bg-[var(--color-accent)]/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl">📖</span>
              </div>
              <h2 className="text-2xl font-bold text-[var(--color-accent)] mb-2">
                Lecture du Coran
              </h2>
              <p className="text-[var(--color-foreground)]">
                Lisez le Coran avec traduction et explication des versets.
              </p>
            </div>
          </Link>
        </div>

        <div className="transition-all duration-300 transform hover:-translate-y-1">
          <Link href="/ecoute" className="block">
            <div className="bg-[var(--color-muted)]/60 p-8 rounded-xl shadow-lg cursor-pointer hover:shadow-[var(--color-accent)]/20 hover:bg-[var(--color-background)] transition-all duration-300 border border-[var(--color-border)] h-full">
              <div className="bg-[var(--color-accent)]/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl">🎧</span>
              </div>
              <h2 className="text-2xl font-bold text-[var(--color-accent)] mb-2">
                Écoute du Coran
              </h2>
              <p className="text-[var(--color-foreground)]">
                Écoutez le Coran récité par différents imams renommés.
              </p>
            </div>
          </Link>
        </div>

        <div className="transition-all duration-300 transform hover:-translate-y-1">
          <Link href="/quizz" className="block">
            <div className="bg-[var(--color-muted)]/60 p-8 rounded-xl shadow-lg cursor-pointer hover:shadow-[var(--color-accent)]/20 hover:bg-[var(--color-background)] transition-all duration-300 border border-[var(--color-border)] h-full">
              <div className="bg-[var(--color-accent)]/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl">🎯</span>
              </div>
              <h2 className="text-2xl font-bold text-[var(--color-accent)] mb-2">Quizz</h2>
              <p className="text-[var(--color-foreground)]">
                Testez vos connaissances sur différents thèmes du Coran.
              </p>
            </div>
          </Link>
        </div>
      </div>

    
      {/* Carrousel des récitateurs */}
      <div className="mt-20 px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold bg-clip-text text-transparent text-center mb-10" style={{ backgroundImage: 'linear-gradient(to right, var(--color-accent), var(--color-foreground))' }}>
          Récitateurs Renommés
        </h2>
        <Swiper
          modules={[Pagination, Autoplay, EffectFade]}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2, spaceBetween: 20 },
            1024: { slidesPerView: 4, spaceBetween: 20 },
          }}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          pagination={{ clickable: true, dynamicBullets: true }}
          className="mt-6 pb-12"
        >
          {recitateurs.map((recitateur) => (
            <SwiperSlide key={recitateur.id} className="pb-10">
              <Link
                href={`/ecoute?recitateur=${recitateur.id}`}
                className="block"
              >
                <div className="bg-[var(--color-muted)] p-6 rounded-xl shadow-lg text-center cursor-pointer hover:bg-[var(--color-background)] hover:shadow-[var(--color-accent)]/10 transition-all duration-300 transform hover:-translate-y-1 border border-[var(--color-border)]">
                  <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden mb-4">
                    <Image
                      src={recitateur.image}
                      alt={recitateur.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-[var(--color-accent)]">
                    {recitateur.name}
                  </h3>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Section d'appel à l'action */}
      <div className="mt-16 text-center px-4 pb-10">
        <Link href="/horaires">
          <button className="px-8 py-4 rounded-lg text-white font-bold text-lg border-accent bg-[var(--color-accent)] hover:shadow-lg hover:shadow-[var(--color-accent)]/20 transition-all duration-300 transform hover:-translate-y-1">
            Horaires de prière
          </button>
        </Link>
      </div>
    </div>
  );
}
