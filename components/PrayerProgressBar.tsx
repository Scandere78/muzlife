'use client';

import React, { useEffect, useState } from 'react';

// Interface pour les horaires de prière
interface PrayerTimes {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

const PRAYER_ORDER = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
const PRAYER_LABELS: Record<string, string> = {
  Fajr: 'Fajr',
  Sunrise: 'Lever',
  Dhuhr: 'Dhuhr',
  Asr: 'Asr',
  Maghrib: 'Maghrib',
  Isha: 'Isha',
};
const PRAYER_ICONS: Record<string, string> = {
  Fajr: '🌅',
  Sunrise: '☀️',
  Dhuhr: '🏙️',
  Asr: '🌇',
  Maghrib: '🌆',
  Isha: '🌙',
};

// Utilitaire pour convertir HH:MM en secondes depuis minuit
function timeToSeconds(time: string) {
  const [h, m] = time.split(':').map(Number);
  return h * 3600 + m * 60;
}

// Récupère les horaires de prière pour Paris (comme PrayerTimer)
async function fetchPrayerTimes(): Promise<PrayerTimes | null> {
  try {
    const url = `https://api.aladhan.com/v1/timingsByCity?city=Paris&country=France&method=2`;
    const response = await fetch(url);
    if (!response.ok) return null;
    const data = await response.json();
    return {
      Fajr: data.data.timings.Fajr,
      Sunrise: data.data.timings.Sunrise,
      Dhuhr: data.data.timings.Dhuhr,
      Asr: data.data.timings.Asr,
      Maghrib: data.data.timings.Maghrib,
      Isha: data.data.timings.Isha,
    };
  } catch {
    return null;
  }
}

export default function PrayerProgressBar() {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [now, setNow] = useState(new Date());
  const [selectedPrayer, setSelectedPrayer] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  // Récupérer les horaires au chargement
  useEffect(() => {
    fetchPrayerTimes().then(setPrayerTimes);
  }, []);

  // Mettre à jour l'heure locale chaque seconde
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Bloquer le scroll quand une modale est ouverte - VERSION ULTRA-ROBUSTE
  useEffect(() => {
    if (showDetails || selectedPrayer) {
      // Sauvegarder la position de scroll actuelle
      const scrollY = window.scrollY;
      
      // Bloquer le scroll de façon ultra-robuste
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.width = '100%';
      document.body.style.overflowY = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      
      // Forcer un nouveau contexte de stacking pour les modales
      document.body.style.isolation = 'isolate';
      
      // Cleanup - restaurer le scroll
      return () => {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.right = '';
        document.body.style.width = '';
        document.body.style.overflowY = '';
        document.documentElement.style.overflow = '';
        document.body.style.isolation = '';
        
        // Restaurer la position exacte du scroll
        window.scrollTo(0, scrollY);
      };
    }
  }, [showDetails, selectedPrayer]);

  if (!prayerTimes) {
    return (
      <div className="w-full flex justify-center py-8">
        <div className="text-[var(--color-accent)]">Chargement...</div>
      </div>
    );
  }

  // Calculer la position du bonhomme
  // 1. Convertir chaque horaire de prière en secondes depuis minuit
  const checkpoints = PRAYER_ORDER.map((prayer) => ({
    name: prayer,
    seconds: timeToSeconds(prayerTimes[prayer as keyof PrayerTimes]),
  }));

  // 2. Heure actuelle en secondes depuis minuit
  const nowSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();

  // 3. Trouver le segment courant (entre quelles prières on est)
  let segmentStart = checkpoints[0].seconds;
  let segmentEnd = checkpoints[checkpoints.length - 1].seconds;
  let segmentIdx = 0;
  
  // Vérifier si on est après la dernière prière (Isha) - réinitialiser pour le lendemain
  const isAfterLastPrayer = nowSeconds >= checkpoints[checkpoints.length - 1].seconds;
  
  if (isAfterLastPrayer) {
    // Réinitialiser pour le lendemain - commencer depuis le début
    segmentStart = 0;
    segmentEnd = checkpoints[0].seconds;
    segmentIdx = -1; // Indique qu'on est avant la première prière
  } else {
    // Chercher le segment courant normalement
    for (let i = 0; i < checkpoints.length - 1; i++) {
      if (nowSeconds >= checkpoints[i].seconds && nowSeconds < checkpoints[i + 1].seconds) {
        segmentStart = checkpoints[i].seconds;
        segmentEnd = checkpoints[i + 1].seconds;
        segmentIdx = i;
        break;
      }
    }
  }

  // 4. Calculer la position du bonhomme (progression continue) et l'emplacement du croissant (snappé avant/après la prière)
  let progress = 0;
  if (isAfterLastPrayer) {
    // Après la dernière prière, à la fin de la barre
    progress = 100;
  } else if (nowSeconds <= checkpoints[0].seconds) {
    // Avant la première prière
    progress = 0;
  } else {
    const segmentProgress = (nowSeconds - segmentStart) / (segmentEnd - segmentStart);
    progress = ((segmentIdx + segmentProgress) / (checkpoints.length - 1)) * 100;
  }

  // Emplacement du croissant: juste AVANT la prochaine prière, sinon juste APRÈS la dernière prière
  const totalCheckpoints = checkpoints.length - 1;
  const positionFromIndex = (idx: number) => (totalCheckpoints > 0 ? (idx / totalCheckpoints) * 80 + 10 : 50);
  const nextIndexRaw = checkpoints.findIndex((cp) => nowSeconds < cp.seconds);
  const hasNextToday = nextIndexRaw !== -1;
  const nextIndex = hasNextToday ? nextIndexRaw : 0;
  const lastIndex = checkpoints.length - 1;
  const INDICATOR_OFFSET = 2; // en pourcentage de largeur

  let indicatorLeftPercent = 10; // défaut: début
  if (hasNextToday) {
    // Avant la prochaine prière
    indicatorLeftPercent = Math.max(10, positionFromIndex(nextIndex) - INDICATOR_OFFSET);
  } else {
    // Après la dernière prière
    indicatorLeftPercent = Math.min(90, positionFromIndex(lastIndex) + INDICATOR_OFFSET);
  }

  // Calculer la prochaine prière et le temps restant
  const currentTime = new Date();
  const currentTimeString = `${currentTime.getHours().toString().padStart(2, '0')}:${currentTime.getMinutes().toString().padStart(2, '0')}`;
  
  let nextPrayer = '';
  let timeRemaining = '';
  
  for (const prayer of PRAYER_ORDER) {
    const prayerTime = prayerTimes[prayer as keyof PrayerTimes];
    const prayerSeconds = timeToSeconds(prayerTime);
    
    if (nowSeconds < prayerSeconds) {
      nextPrayer = PRAYER_LABELS[prayer];
      const remainingSeconds = prayerSeconds - nowSeconds;
      const hours = Math.floor(remainingSeconds / 3600);
      const minutes = Math.floor((remainingSeconds % 3600) / 60);
      timeRemaining = `${hours}h ${minutes}m`;
      break;
    }
  }
  
  if (!nextPrayer) {
    // Si on est après la dernière prière, la prochaine est Fajr du lendemain
    nextPrayer = PRAYER_LABELS.Fajr;
    const tomorrowFajr = timeToSeconds(prayerTimes.Fajr) + 24 * 3600;
    const remainingSeconds = tomorrowFajr - nowSeconds;
    const hours = Math.floor(remainingSeconds / 3600);
    const minutes = Math.floor((remainingSeconds % 3600) / 60);
    timeRemaining = `${hours}h ${minutes}m`;
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-2 sm:px-6 py-4 sm:py-6">
      {/* En-tête avec style mawaquit - responsive */}
      <div className="text-center mb-4 sm:mb-6">
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white rounded-2xl p-3 sm:p-4 md:p-6 shadow-xl border border-emerald-500/20">
          {/* Motif décoratif islamique en arrière-plan */}
          <div className="absolute inset-0 rounded-2xl opacity-10 pointer-events-none overflow-hidden">
            <div className="absolute inset-0" style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'60\' height=\'60\' viewBox=\'0 0 60 60\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M30 30m-15 0a15 15 0 1 1 30 0a15 15 0 1 1 -30 0M30 15l5 10h-10z\'/%3E%3C/g%3E%3C/svg%3E")',
            }}></div>
          </div>
          
          <div className="relative z-10">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3 flex items-center justify-center gap-2">
              <span className="text-yellow-300">�</span>
              <span>مواقيت الصلاة</span>
              <span className="text-yellow-300">🕌</span>
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100 mb-3 sm:mb-4">Horaires de prière • Prayer Times</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 text-sm sm:text-base">
              <div className="flex items-center justify-center gap-2 bg-white/10 rounded-xl px-3 py-2 backdrop-blur-sm">
                <span className="text-yellow-300">�</span>
                <span className="font-medium">{currentTimeString}</span>
              </div>
              
              <div className="flex items-center justify-center gap-2 bg-white/10 rounded-xl px-3 py-2 backdrop-blur-sm">
                <span className="text-green-300">🕌</span>
                <span className="font-medium truncate">Prochaine: {nextPrayer}</span>
              </div>
              
              <div className="flex items-center justify-center gap-2 bg-white/10 rounded-xl px-3 py-2 backdrop-blur-sm">
                <span className="text-blue-300">⏰</span>
                <span className="font-medium">{timeRemaining}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Conteneur principal avec style mawaquit */}
      <div className="relative h-36 sm:h-32 md:h-28 flex items-center bg-gradient-to-r from-emerald-50 via-white to-teal-50 rounded-2xl p-4 sm:p-6 shadow-lg border-2 border-emerald-100 mb-4">
        {/* Motif islamique décoratif */}
        <div className="absolute inset-0 rounded-2xl opacity-5 pointer-events-none overflow-hidden">
          <div className="absolute inset-0" style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'40\' height=\'40\' viewBox=\'0 0 40 40\'%3E%3Cg fill=\'%23059669\' fill-opacity=\'1\'%3E%3Cpath d=\'M20 20c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm-30 0c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10-10-4.477-10-10z\'/%3E%3C/g%3E%3C/svg%3E")',
          }}></div>
        </div>
        
        {/* Barre de fond avec style mawaquit */}
        <div className="absolute left-4 right-4 sm:left-6 sm:right-6 top-1/2 -translate-y-1/2 h-3 sm:h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-full shadow-inner border border-gray-300/30" />
        
        {/* Barre de progression avec style islamique */}
        <div 
          className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 h-3 sm:h-4 rounded-full transition-all duration-1000 ease-out overflow-hidden"
          style={{ 
            width: `calc(${Math.max(progress, 0)}% * (100% - 3rem) / 100)`,
            maxWidth: 'calc(100% - 3rem)',
            background: 'linear-gradient(90deg, #059669, #10b981, #34d399)',
            boxShadow: '0 0 15px rgba(5, 150, 105, 0.4), inset 0 0 10px rgba(255, 255, 255, 0.3)',
          }}
        >
          {/* Effet de brillance islamique */}
          <div 
            className="absolute inset-0 rounded-full animate-shimmer"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)'
            }}
          />
          
          {/* Motif géométrique subtil */}
          <div className="absolute inset-0 rounded-full opacity-30" style={{
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255,255,255,0.2) 2px, rgba(255,255,255,0.2) 4px)',
          }}></div>
        </div>

        {/* Checkpoints avec style mawaquit - responsives et interactifs */}
        {checkpoints.map((cp, idx) => {
          const prayerSeconds = timeToSeconds(prayerTimes[cp.name as keyof PrayerTimes]);
          let isPassed = nowSeconds >= prayerSeconds;
          
          if (isAfterLastPrayer) {
            isPassed = false;
          }
          
          const prayerTime = prayerTimes[cp.name as keyof PrayerTimes];
          
          // Calcul de position responsive avec marges pour éviter les débordements
          const totalCheckpoints = checkpoints.length - 1;
          const position = totalCheckpoints > 0 ? (idx / totalCheckpoints) * 80 + 10 : 50; // 10% à 90% de la largeur
          
          // Déterminer si c'est la prochaine prière
          const isNextPrayer = !isPassed && checkpoints.findIndex(checkpoint => 
            timeToSeconds(prayerTimes[checkpoint.name as keyof PrayerTimes]) > nowSeconds
          ) === idx;
          
          const isSelected = selectedPrayer === cp.name;
          
          return (
            <div
              key={cp.name}
              className="absolute top-1/2 -translate-y-1/2 z-10 group cursor-pointer"
              style={{ 
                left: `${position}%`,
                transform: `translateX(-50%) translateY(-50%)`
              }}
              onClick={() => {
                setSelectedPrayer(isSelected ? null : cp.name);
                setShowDetails(!showDetails || !isSelected);
              }}
            >
              <div className="flex flex-col items-center">
                {/* Conteneur de l'icône avec style islamique - SANS HALOS */}
                <div className="relative">
                  {/* Icône principale */}
                  <div 
                    className={`relative w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-500 border-2 hover:scale-125 active:scale-95 ${
                      isPassed 
                        ? 'bg-gray-100 border-gray-300 scale-90' 
                        : isNextPrayer
                          ? 'bg-gradient-to-br from-emerald-400 to-teal-500 border-emerald-300 scale-110 shadow-emerald-200'
                          : isSelected
                            ? 'bg-gradient-to-br from-indigo-400 to-purple-500 border-indigo-300 scale-110 shadow-indigo-200'
                            : 'bg-gradient-to-br from-white to-emerald-50 border-emerald-200 scale-100 hover:border-emerald-300'
                    }`}
                  >
                    <span 
                      className={`text-xs sm:text-sm md:text-base transition-all duration-500 ${
                        isPassed 
                          ? 'opacity-40 grayscale' 
                          : isNextPrayer
                            ? 'opacity-100 drop-shadow-sm'
                            : isSelected
                              ? 'opacity-100 drop-shadow-md'
                              : 'opacity-80'
                      }`}
                    >
                      {PRAYER_ICONS[cp.name]}
                    </span>
                    
                    {/* Point central pour les prières actives */}
                    {(!isPassed || isSelected) && (
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-transparent via-white/20 to-transparent opacity-50" />
                    )}
                    
                    {/* Indicateur de clic */}
                    <div className="absolute inset-0 rounded-full border-2 border-transparent group-active:border-white/50 transition-all duration-200" />
                  </div>
                </div>
                
                {/* Nom et heure - responsive */}
                <div className={`mt-1 text-center min-w-0 max-w-[60px] sm:max-w-[80px] transition-all duration-300 ${isSelected ? 'scale-110' : 'scale-100'}`}>
                  <div 
                    className={`text-[8px] sm:text-[10px] md:text-xs font-bold transition-all duration-500 truncate ${
                      isPassed 
                        ? 'text-gray-400' 
                        : isNextPrayer
                          ? 'text-emerald-700'
                          : isSelected
                            ? 'text-indigo-700 font-extrabold'
                            : 'text-gray-600'
                    }`}
                  >
                    {PRAYER_LABELS[cp.name]}
                  </div>
                  <div 
                    className={`text-[7px] sm:text-[9px] md:text-[10px] transition-all duration-500 font-medium truncate ${
                      isPassed 
                        ? 'text-gray-400' 
                        : isNextPrayer
                          ? 'text-emerald-600 font-semibold'
                          : isSelected
                            ? 'text-indigo-600 font-bold'
                            : 'text-gray-500'
                    }`}
                  >
                    {prayerTime}
                  </div>
                </div>
                
                {/* Bulle d'information interactive - TOUJOURS EN BAS */}
                {isSelected && (
                  <div className="absolute top-full mt-4 left-1/2 transform -translate-x-1/2 z-50 animate-bounce-in">
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs rounded-xl px-3 py-2 text-center shadow-2xl whitespace-nowrap border border-white/20">
                      <div className="font-bold text-[11px] mb-1">{PRAYER_LABELS[cp.name]}</div>
                      <div className="font-medium text-[10px] text-indigo-100">{prayerTime}</div>
                      {isNextPrayer && (
                        <div className="text-[9px] text-yellow-200 mt-1 font-semibold">🔔 Prochaine prière</div>
                      )}
                      {/* Flèche pointant vers le haut */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-indigo-600"></div>
                    </div>
                  </div>
                )}
                
                {/* Effet de ripple au clic */}
                <div className="absolute inset-0 rounded-full group-active:animate-ping group-active:bg-emerald-300/30 pointer-events-none"></div>
              </div>
            </div>
          );
        })}

        {/* Indicateur de progression avec style mawaquit */}
        <div
          className="absolute top-1/2 -translate-y-1/2 z-20 transition-all duration-500 ease-out cursor-pointer group"
          style={{ 
            left: `${indicatorLeftPercent}%`,
            transform: 'translateX(-50%) translateY(-50%)'
          }}
          onClick={() => setShowDetails(!showDetails)}
        >
          <div className="relative">
            {/* Cercle principal avec style islamique - SANS HALO */}
            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-full shadow-lg flex items-center justify-center border-2 border-white relative overflow-hidden hover:scale-110 active:scale-95 transition-transform duration-200">
              {/* Croissant islamique */}
              <div className="text-white text-[10px] sm:text-xs font-bold">☪</div>
              
              {/* Effet de brillance tournant */}
              <div 
                className="absolute inset-0 rounded-full opacity-30 animate-spin"
                style={{
                  background: 'conic-gradient(from 0deg, transparent 0deg, rgba(255,255,255,0.6) 90deg, transparent 180deg)',
                  animationDuration: '3s'
                }}
              />
              
              {/* Effet de clic */}
              <div className="absolute inset-0 rounded-full group-active:animate-ping group-active:bg-emerald-300/50 pointer-events-none"></div>
            </div>
            
            {/* Ombre sous l'indicateur */}
            <div 
              className="absolute top-full left-1/2 -translate-x-1/2 w-3 sm:w-4 h-0.5 bg-gray-400/30 rounded-full blur-sm mt-0.5"
            />
            
            {/* Tooltip pour l'indicateur - TOUJOURS EN BAS */}
            <div className="absolute top-full mt-4 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50">
              <div className="bg-emerald-800 text-white text-xs rounded-lg px-2 py-1 text-center shadow-xl whitespace-nowrap">
                <div className="font-bold text-[10px]">Progression: {Math.round(progress)}%</div>
                {/* Flèche pointant vers le haut */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-3 border-r-3 border-b-3 border-transparent border-b-emerald-800"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Panneau de vue d'ensemble - STATIQUE LORS DU SCROLL */}
      {showDetails && !selectedPrayer && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 modal-force-top" 
          style={{ zIndex: 2147483647 }}
          onClick={() => setShowDetails(false)}
        >
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl p-4 shadow-2xl border border-emerald-300/30 max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-slide-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl backdrop-blur-sm">
                  📊
                </div>
                <div>
                  <h4 className="text-lg font-bold">Vue d&apos;ensemble de la journée</h4>
                  <p className="text-emerald-200 text-sm">Progression: {Math.round(progress)}%</p>
                </div>
              </div>
              <button 
                onClick={() => setShowDetails(false)}
                className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
              >
                ✕
              </button>
            </div>
            
            {/* Grille des prières */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {PRAYER_ORDER.map((prayer) => {
                const prayerSeconds = timeToSeconds(prayerTimes[prayer as keyof PrayerTimes]);
                const isPrayerPassed = nowSeconds >= prayerSeconds;
                const timeDiff = prayerSeconds - nowSeconds;
                const absoluteDiff = Math.abs(timeDiff);
                const hours = Math.floor(absoluteDiff / 3600);
                const minutes = Math.floor((absoluteDiff % 3600) / 60);
                
                return (
                  <div 
                    key={prayer}
                    className={`bg-white/10 rounded-xl p-3 backdrop-blur-sm transition-all duration-300 cursor-pointer hover:bg-white/20 active:scale-95 ${
                      selectedPrayer === prayer ? 'ring-2 ring-white/50' : ''
                    }`}
                    onClick={() => setSelectedPrayer(selectedPrayer === prayer ? null : prayer)}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">{PRAYER_ICONS[prayer]}</span>
                      <span className="font-semibold text-sm">{PRAYER_LABELS[prayer]}</span>
                    </div>
                    <div className="text-xs text-emerald-100">
                      <div className="font-medium mb-1">{prayerTimes[prayer as keyof PrayerTimes]}</div>
                      <div className={isPrayerPassed ? 'text-green-300' : 'text-yellow-300'}>
                        {isPrayerPassed ? '✓ Accomplie' : `Dans ${hours > 0 ? `${hours}h ` : ''}${minutes}m`}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Statistiques de la journée */}
            <div className="mt-4 bg-white/10 rounded-xl p-3 backdrop-blur-sm">
              <h5 className="font-semibold text-sm mb-2 flex items-center gap-2">
                <span>📈</span>
                Statistiques de la journée
              </h5>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <div className="text-emerald-200">Prières accomplies</div>
                  <div className="text-lg font-bold">
                    {checkpoints.filter((_, idx) => {
                      const prayerSeconds = timeToSeconds(prayerTimes[checkpoints[idx].name as keyof PrayerTimes]);
                      return nowSeconds >= prayerSeconds;
                    }).length} / {checkpoints.length}
                  </div>
                </div>
                <div>
                  <div className="text-emerald-200">Progression</div>
                  <div className="text-lg font-bold">{Math.round(progress)}%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Panneau de détails interactif - STATIQUE LORS DU SCROLL */}
      {selectedPrayer && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 modal-force-top" 
          style={{ zIndex: 2147483647 }}
          onClick={() => setSelectedPrayer(null)}
        >
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl p-4 shadow-2xl border border-indigo-300/30 max-w-md w-full animate-slide-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl backdrop-blur-sm">
                  {PRAYER_ICONS[selectedPrayer]}
                </div>
                <div>
                  <h4 className="text-lg font-bold">{PRAYER_LABELS[selectedPrayer]}</h4>
                  <p className="text-indigo-200 text-sm">
                    {prayerTimes[selectedPrayer as keyof PrayerTimes]}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedPrayer(null)}
                className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
              >
                ✕
              </button>
            </div>
            
            {/* Calcul du temps restant ou écoulé */}
            <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
              {(() => {
                const prayerSeconds = timeToSeconds(prayerTimes[selectedPrayer as keyof PrayerTimes]);
                const timeDiff = prayerSeconds - nowSeconds;
                const isPrayerPassed = timeDiff < 0;
                const absoluteDiff = Math.abs(timeDiff);
                const hours = Math.floor(absoluteDiff / 3600);
                const minutes = Math.floor((absoluteDiff % 3600) / 60);
                
                return (
                  <div className="text-center">
                    <p className="text-sm text-indigo-200 mb-1">
                      {isPrayerPassed ? 'Temps écoulé depuis' : 'Temps restant avant'} {PRAYER_LABELS[selectedPrayer]}
                    </p>
                    <p className="text-2xl font-bold text-white">
                      {hours > 0 ? `${hours}h ` : ''}{minutes}m
                    </p>
                    {!isPrayerPassed && (
                      <div className="mt-2 w-full bg-white/20 rounded-full h-2 overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-yellow-300 to-orange-400 rounded-full transition-all duration-1000"
                          style={{
                            width: `${Math.max(0, Math.min(100, ((24 * 3600 - absoluteDiff) / (24 * 3600)) * 100))}%`
                          }}
                        />
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
      
      {/* Légende responsive avec style mawaquit */}
      <div className="mt-4 sm:mt-6">
        {/* Instructions interactives */}
        <div className="text-center mb-3">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium shadow-sm">
            <span className="animate-pulse">👆</span>
            <span>Cliquez sur une prière pour voir les détails</span>
          </div>
        </div>
        
        {/* Légende complète pour mobile */}
        <div className="sm:hidden bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-3 border border-emerald-100">
          <div className="text-center mb-2">
            <h4 className="text-xs font-bold text-emerald-800 mb-1">مواقيت الصلاة اليوم</h4>
            <p className="text-[10px] text-emerald-600">Cliquez sur les icônes pour plus de détails</p>
          </div>
          <div className="grid grid-cols-3 gap-1 text-xs">
            {PRAYER_ORDER.map((prayer) => (
              <div 
                key={prayer} 
                className={`flex flex-col items-center bg-white rounded-lg p-1.5 shadow-sm border transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95 ${
                  selectedPrayer === prayer 
                    ? 'border-indigo-300 bg-indigo-50' 
                    : 'border-emerald-100 hover:border-emerald-200'
                }`}
                onClick={() => setSelectedPrayer(selectedPrayer === prayer ? null : prayer)}
              >
                <span className="text-sm mb-0.5">{PRAYER_ICONS[prayer]}</span>
                <span className={`font-semibold text-[9px] truncate max-w-full ${
                  selectedPrayer === prayer ? 'text-indigo-700' : 'text-emerald-700'
                }`}>
                  {PRAYER_LABELS[prayer]}
                </span>
                <span className={`text-[8px] font-medium ${
                  selectedPrayer === prayer ? 'text-indigo-600' : 'text-emerald-600'
                }`}>
                  {prayerTimes[prayer as keyof PrayerTimes]}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Légende condensée pour desktop */}
        <div className="hidden sm:block">
          <div className="flex justify-center items-center gap-4 text-xs text-emerald-700 bg-emerald-50/80 rounded-xl px-4 py-2 border border-emerald-200">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span>Prières accomplies</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-emerald-300 rounded-full animate-pulse"></div>
              <span>Prochaine prière</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
              <span>Prières à venir</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
              <span>Sélectionnée</span>
            </div>
          </div>
        </div>
      </div>

      {/* Styles CSS pour les animations personnalisées avec style mawaquit */}
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg); 
            opacity: 0.6;
          }
          33% { 
            transform: translateY(-8px) rotate(120deg); 
            opacity: 1;
          }
          66% { 
            transform: translateY(-4px) rotate(240deg); 
            opacity: 0.8;
          }
        }
        
        @keyframes gentleGlow {
          0%, 100% { 
            box-shadow: 0 0 10px rgba(5, 150, 105, 0.3);
          }
          50% { 
            box-shadow: 0 0 20px rgba(5, 150, 105, 0.6);
          }
        }
        
        @keyframes bounce-in {
          0% { 
            transform: translateX(-50%) scale(0) translateY(-10px); 
            opacity: 0;
          }
          50% { 
            transform: translateX(-50%) scale(1.1) translateY(-5px); 
            opacity: 0.8;
          }
          100% { 
            transform: translateX(-50%) scale(1) translateY(0); 
            opacity: 1;
          }
        }
        
        @keyframes slide-in {
          0% { 
            transform: translateY(20px); 
            opacity: 0;
          }
          100% { 
            transform: translateY(0); 
            opacity: 1;
          }
        }
        
        @keyframes ripple {
          0% { 
            transform: scale(0); 
            opacity: 1;
          }
          100% { 
            transform: scale(4); 
            opacity: 0;
          }
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        
        .animate-float {
          animation: float 2s infinite ease-in-out;
        }
        
        .animate-gentle-glow {
          animation: gentleGlow 3s infinite ease-in-out;
        }
        
        .animate-bounce-in {
          animation: bounce-in 0.4s ease-out forwards;
        }
        
        .animate-slide-in {
          animation: slide-in 0.3s ease-out forwards;
        }
        
        .animate-ripple {
          animation: ripple 0.6s ease-out forwards;
        }
        
        /* Responsive breakpoint personnalisé pour très petits écrans */
        @media (max-width: 380px) {
          .text-xs { font-size: 0.65rem; }
          .text-sm { font-size: 0.75rem; }
        }
        
        /* Améliorations des interactions tactiles */
        @media (hover: none) and (pointer: coarse) {
          .group:active .group-active\\:animate-ping {
            animation: ripple 0.6s ease-out;
          }
          
          .cursor-pointer:active {
            transform: scale(0.95);
            transition: transform 0.1s ease-out;
          }
        }
        
        /* Feedback visuel pour les interactions */
        .interactive-element {
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .interactive-element:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        
        .interactive-element:active {
          transform: translateY(0);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        /* Force les modales à rester au-dessus de TOUT */
        .modal-force-top {
          position: fixed !important;
          z-index: 2147483647 !important; /* Valeur z-index maximale */
          isolation: isolate !important;
        }
      `}</style>
    </div>
  );
}