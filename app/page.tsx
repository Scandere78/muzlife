"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { Pagination, Autoplay, EffectFade } from "swiper/modules";
import { Navbar, PrayerTimer, NextPrayer, CitationOfTheDay, QiblaCompass } from "../components";
import "../styles/globals.css";
 

// Composant local supprimé: la modale est désormais gérée dans `components/PrayerTimer`


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

      {/* Horloge locale, prochaine prière et citation du jour */}
      <div className="mt-12 px-6 max-w-4xl mx-auto">
        <div className="mt-12 flex flex-col items-center">
            <h2 className="text-2xl font-bold text-[var(--color-accent)] mb-4">🕌 Temps restant</h2>
            <PrayerTimer />
        </div>
        <NextPrayer />  
        <div className="mt-8">
          <CitationOfTheDay />
        </div>
        <div className="mt-8">
          <QiblaCompass />
        </div>
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
