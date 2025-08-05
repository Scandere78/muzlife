"use client";
import React from 'react';
import PrayerTimes from '@/components/PrayerTimes';
import PrayerProgressBar from '@/components/PrayerProgressBar';


/**
 * Page des horaires de prière
 * 
 * Cette page permet aux utilisateurs de :
 * - Rechercher les horaires de prière pour une ville spécifique
 * - Voir les horaires de toutes les prières (Fajr, Dhuhr, Asr, Maghrib, Isha)
 * - Identifier la prochaine prière avec le temps restant
 * - Consulter les informations complémentaires (Imsak, minuit, etc.)
 * - Voir la date grégorienne et hijri
 * 
 * Fonctionnalités principales :
 * - Interface moderne et responsive
 * - Calcul automatique de la prochaine prière
 * - Mise à jour en temps réel du temps restant
 * - Support de nombreuses villes dans le monde
 * - Affichage des dates grégorienne et hijri
 */
export default function HorairesPage() {
  // Horloge analogique décorative
  function AnalogClock() {
    const [date, setDate] = React.useState(new Date());
    const [open, setOpen] = React.useState(false);
    
    React.useEffect(() => {
      const timer = setInterval(() => setDate(new Date()), 1000);
      return () => clearInterval(timer);
    }, []);
    
    return (
      <>
        <div className="mx-auto mb-8 flex justify-center">
          <div
            className="relative rounded-full shadow-xl p-1 flex flex-col items-center w-64 h-64 bg-gradient-to-br from-indigo-50 via-white to-purple-50 cursor-pointer hover:scale-105 transition-all duration-500 group"
            style={{
              boxShadow: '0 10px 40px -10px rgba(79, 70, 229, 0.4), inset 0 0 0 1px rgba(79, 70, 229, 0.1)'
            }}
            onClick={() => setOpen(true)}
          >
            {/* Contour décoratif externe */}
            <div className="absolute inset-1 rounded-full border-2 border-indigo-100/50"></div>
            
            {/* Fond calligraphique avec overlay */}
            <div className="absolute inset-3 rounded-full overflow-hidden z-10">
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage: 'url(/caligraphie.png)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  filter: 'contrast(1.2) saturate(1.5)',
                  mixBlendMode: 'overlay'
                }}
              ></div>
            </div>
            
            {/* Cercle extérieur avec marques */}
            <div className="absolute inset-3 rounded-full z-10">
              {/* Marques des heures */}
              {[...Array(12)].map((_, i) => {
                const angle = (i * 30) * (Math.PI / 180);
                const x = 50 + 45 * Math.sin(angle);
                const y = 50 - 45 * Math.cos(angle);
                
                return (
                  <div 
                    key={i}
                    className="absolute w-1.5 h-4 bg-gradient-to-b from-indigo-400 to-purple-400 rounded-full shadow-sm"
                    style={{
                      left: `${x}%`,
                      top: `${y}%`,
                      transform: `translate(-50%, -50%) rotate(${i * 30}deg)`,
                    }}
                  />
                );
              })}
              
              {/* Marques des minutes */}
              {[...Array(60)].map((_, i) => {
                if (i % 5 === 0) return null; // Skip hour marks
                
                const angle = (i * 6) * (Math.PI / 180);
                const x = 50 + 45 * Math.sin(angle);
                const y = 50 - 45 * Math.cos(angle);
                
                return (
                  <div 
                    key={i}
                    className="absolute w-0.5 h-1.5 bg-indigo-200 rounded-full"
                    style={{
                      left: `${x}%`,
                      top: `${y}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  />
                );
              })}
            </div>
            
            {/* Cercle central avec effet de verre */}
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <div className="w-40 h-40 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center border border-indigo-100 shadow-inner">
                {/* Heures, minutes, secondes */}
                <div className="text-center font-mono relative p-6">
                  {/* Effet de halo */}
                  <div className="absolute inset-0 rounded-full bg-indigo-100/50 blur-xl"></div>
                  
                  <div className="relative z-10 flex flex-col gap-1">
                    {/* Heures et minutes */}
                    <div className="text-4xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                      {date.getHours().toString().padStart(2, '0')}
                      <span className="animate-pulse text-indigo-500 mx-1">:</span>
                      {date.getMinutes().toString().padStart(2, '0')}
                    </div>
                    
                    {/* Secondes */}
                    <div className="text-xl font-semibold text-indigo-400">
                      {date.getSeconds().toString().padStart(2, '0')}
                      <span className="text-xs ml-0.5">s</span>
                    </div>
                    
                    {/* Date du jour */}
                    <div className="text-xs text-gray-500 mt-1 font-medium">
                      {new Date().toLocaleDateString('fr-FR', {day: 'numeric', month: 'short'})}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Aiguilles (pour effet décoratif) */}
            <div className="absolute inset-0 flex items-center justify-center z-15 pointer-events-none">
              <div className="relative w-full h-full">
                {/* Aiguille des heures */}
                <div 
                  className="absolute top-1/2 left-1/2 origin-center w-1 h-14 bg-gradient-to-t from-indigo-700 to-indigo-500 rounded-full shadow-md z-10"
                  style={{ 
                    transform: `translate(-50%, 0) rotate(${((date.getHours() % 12) * 30 + date.getMinutes() * 0.5)}deg)`,
                    transformOrigin: 'bottom center' 
                  }}
                >
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-indigo-500 rounded-full shadow-sm"></div>
                </div>
                
                {/* Aiguille des minutes */}
                <div 
                  className="absolute top-1/2 left-1/2 origin-center w-0.5 h-20 bg-gradient-to-t from-purple-700 to-purple-400 rounded-full shadow-md z-20"
                  style={{ 
                    transform: `translate(-50%, 0) rotate(${date.getMinutes() * 6}deg)`,
                    transformOrigin: 'bottom center' 
                  }}
                >
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-purple-500 rounded-full shadow-sm"></div>
                </div>
                
                {/* Centre */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-indigo-800 rounded-full z-30 shadow-md"></div>
              </div>
            </div>
            
            {/* Étiquette en bas */}
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-medium px-4 py-1 rounded-full shadow-lg z-40">
              Heure locale
            </div>
            
            {/* Indicateur pour cliquer avec animation */}
            <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500 z-50">
              <div className="flex flex-col items-center gap-1">
                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce mb-1"></div>
                <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm px-4 py-1.5 rounded-full shadow-lg flex items-center gap-2">
                  <span className="text-lg">📊</span>
                  <span className="font-medium">Voir progression des prières</span>
                </div>
              </div>
            </div>
            
            {/* Effet de halo en survol */}
            <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" style={{
              background: 'radial-gradient(circle at center, rgba(79, 70, 229, 0.2) 0%, transparent 70%)',
              filter: 'blur(20px)',
            }}></div>
          </div>
        </div>
        
        {/* Modale PrayerProgressBar améliorée et responsive */}
        {open && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 md:p-0" 
            onClick={() => setOpen(false)}
          >
            {/* Pattern décoratif en arrière-plan */}
            <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
              <div className="absolute inset-0" 
                style={{
                  backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.2\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'3\'/%3E%3Ccircle cx=\'13\' cy=\'13\' r=\'3\'/%3E%3C/g%3E%3C/svg%3E")',
                }}
              />
            </div>
            
            <div 
              className="bg-white/95 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden relative animate-modalIn" 
              onClick={e => e.stopPropagation()}
              style={{
                boxShadow: '0 25px 50px -12px rgba(79, 70, 229, 0.4)'
              }}
            >
              {/* Effet de brillance au coin supérieur droit */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-300/30 rounded-full blur-3xl pointer-events-none"></div>
              
              {/* En-tête de la modale */}
              <div className="sticky top-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white p-5 sm:p-6 rounded-t-3xl shadow-lg z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-12 h-12 bg-white/30 rounded-xl flex items-center justify-center backdrop-blur-sm shadow-inner overflow-hidden relative group">
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-300/30 to-purple-300/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <span className="text-2xl sm:text-3xl animate-float">🕌</span>
                    </div>
                    <div>
                      <h2 className="text-xl sm:text-3xl font-bold tracking-tight">Progression Spirituelle</h2>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <p className="text-indigo-100 text-xs sm:text-sm font-medium">Suivi en temps réel de votre parcours spirituel</p>
                      </div>
                    </div>
                  </div>
                  <button 
                    className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center text-white backdrop-blur-sm transition-all duration-200 hover:scale-105" 
                    onClick={() => setOpen(false)}
                  >
                    <span className="text-xl">✕</span>
                  </button>
                </div>
                
                {/* Motifs décoratifs en en-tête */}
                <div className="absolute top-0 right-0 h-full w-1/3 opacity-20 pointer-events-none">
                  <div className="absolute inset-0" style={{
                    backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M54.627 0l.83.828-1.415 1.415L51.8 0h2.827zM5.373 0l-.83.828L5.96 2.243 8.2 0H5.374zM48.97 0l3.657 3.657-1.414 1.414L46.143 0h2.828zM11.03 0L7.372 3.657 8.787 5.07 13.857 0H11.03zm32.284 0L49.8 6.485 48.384 7.9l-7.9-7.9h2.83zM16.686 0L10.2 6.485 11.616 7.9l7.9-7.9h-2.83zm20.97 0l9.315 9.314-1.414 1.414L34.828 0h2.83zM22.344 0L13.03 9.314l1.414 1.414L25.172 0h-2.83zM32 0l12.142 12.142-1.414 1.414L30 .828 17.272 13.556l-1.414-1.414L28 0h4zM.284 0l28 28-1.414 1.414L0 2.544v-.86l.284-.284zM0 5.373l25.456 25.455-1.414 1.415L0 8.2V5.374zm0 5.656l22.627 22.627-1.414 1.414L0 13.86v-2.83zm0 5.656l19.8 19.8-1.415 1.413L0 19.514v-2.83zm0 5.657l16.97 16.97-1.414 1.415L0 25.172v-2.83zM0 28l14.142 14.142-1.414 1.414L0 30.828V28zm0 5.657L11.314 44.97 9.9 46.386l-9.9-9.9v-2.828zm0 5.657L8.485 47.8 7.07 49.214 0 42.143v-2.83zm0 5.657l5.657 5.657-1.414 1.415L0 47.8v-2.83zm0 5.657l2.828 2.83-1.414 1.413L0 53.456v-2.83zM54.627 60L30 35.373 5.373 60H8.2L30 38.2 51.8 60h2.827zm-5.656 0L30 41.03 11.03 60h2.828L30 43.858 46.142 60h2.83zm-5.656 0L30 46.686 16.686 60h2.83L30 49.515 40.485 60h2.83zm-5.657 0L30 52.343 22.344 60h2.83L30 55.172 34.828 60h2.83zM32 60l-2-2-2 2h4zM59.716 0l-28 28 1.414 1.414L60 2.544V0h-.284zM60 5.373L34.544 30.828l1.414 1.415L60 8.2V5.374zm0 5.656L37.373 33.656l1.414 1.414L60 13.86v-2.83zm0 5.656l-19.8 19.8 1.415 1.413L60 19.514v-2.83zm0 5.657l-16.97 16.97 1.414 1.415L60 25.172v-2.83zM60 28L45.858 42.142l1.414 1.414L60 30.828V28zm0 5.657L48.686 44.97l1.415 1.415 9.9-9.9v-2.828zm0 5.657L51.515 47.8l1.414 1.414L60 42.143v-2.83zm0 5.657l-5.657 5.657 1.414 1.415L60 47.8v-2.83zm0 5.657l-2.828 2.83 1.414 1.413L60 53.456v-2.83zM39.9 16.385l1.414-1.414L30 3.658 18.686 14.97l1.415 1.415 9.9-9.9 9.9 9.9zm-2.83 2.828l1.415-1.414L30 9.313 21.515 17.8l1.414 1.413L30 12.143l7.07 7.07zm-2.827 2.83l1.414-1.416L30 14.97l-5.657 5.657 1.414 1.415L30 17.8l4.243 4.242zm-2.83 2.827l1.415-1.414L30 20.626l-2.828 2.83 1.414 1.414L30 23.456l1.414 1.414zM56.87 59.414L58.284 58 30 29.716 1.716 58l1.414 1.414L30 32.544l26.87 26.87z\' fill=\'%23ffffff\' fill-opacity=\'0.1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
                  }}></div>
                </div>
              </div>
              
              {/* Contenu de la modale avec fond décoratif */}
              <div className="p-5 sm:p-8 relative bg-gradient-to-b from-white to-indigo-50/70 overflow-y-auto max-h-[calc(90vh-80px)]">
                {/* Motifs décoratifs subtils */}
                <div className="absolute inset-0 opacity-5 pointer-events-none">
                  <div className="absolute inset-0" style={{
                    backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%234f46e5\' fill-opacity=\'0.2\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
                  }}></div>
                </div>

                {/* Effet de brillance en bas à gauche */}
                <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-indigo-300/30 rounded-full blur-3xl pointer-events-none"></div>
                
                {/* Contenu principal */}
                <div className="relative z-10">
                  <PrayerProgressBar />
                </div>
                
                {/* Pied de page informatif */}
                <div className="mt-6 text-center">
                  <div className="inline-block px-4 py-2 bg-indigo-50 rounded-full text-xs text-indigo-700 font-medium shadow-inner border border-indigo-100">
                    Actualisé en temps réel • Basé sur votre position géographique
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Styles CSS pour les animations personnalisées */}
        <style jsx>{`
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
          }
          
          @keyframes modalIn {
            from { opacity: 0; transform: scale(0.95) translateY(10px); }
            to { opacity: 1; transform: scale(1) translateY(0); }
          }
          
          .animate-float {
            animation: float 3s ease-in-out infinite;
          }
          
          .animate-modalIn {
            animation: modalIn 0.4s ease-out forwards;
          }
        `}</style>
      </>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center" style={{ background: 'transparent', color: 'var(--color-foreground)' }}>
      <div className="w-full max-w-3xl mx-auto px-4 py-8">
        <div className="mb-8 animate-in fade-in duration-700">
          <AnalogClock />
          <div className="text-center">
            <h1 className="text-4xl font-extrabold mb-2 drop-shadow-lg tracking-tight">Horaires de Prière</h1>
            <p className="text-lg text-foreground max-w-xl mx-auto mb-2">Consultez les horaires de prière pour votre ville avec précision. Trouvez facilement les temps de Fajr, Dhuhr, Asr, Maghrib et Isha.</p>
          </div>
        </div>
        <div className="w-full animate-in fade-in slide-in-from-bottom-2 duration-700">
          <PrayerTimes />
        </div>
        <div className="mt-10 animate-in fade-in duration-700">
          <div className="bg-gradient-to-br from-indigo-100 via-white to-yellow-100 rounded-2xl shadow-2xl border border-indigo-200 p-8 backdrop-blur-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-indigo-700">À propos des horaires</h3>
                <div className="space-y-3 text-sm text-gray-700">
                  <p>Les horaires sont calculés selon la méthode de l&apos;Université Musulmane d&apos;Umm Al-Qura (Makkah) qui est largement utilisée dans le monde musulman.</p>
                  <p>Les calculs prennent en compte la position géographique, la latitude, la longitude et les ajustements saisonniers.</p>
                  <p>Les horaires sont mis à jour automatiquement et sont précis pour la plupart des villes du monde.</p>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4 text-indigo-700">Les cinq prières</h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex justify-between items-center rounded-xl bg-blue-50 px-3 py-2 shadow-sm border border-blue-200 mb-2">
                    <span className="font-semibold text-blue-700">Fajr</span>
                    <span className="text-blue-500">Avant le lever du soleil</span>
                  </div>
                  <div className="flex justify-between items-center rounded-xl bg-yellow-50 px-3 py-2 shadow-sm border border-yellow-200 mb-2">
                    <span className="font-semibold text-yellow-700">Dhuhr</span>
                    <span className="text-yellow-500">Après le zénith</span>
                  </div>
                  <div className="flex justify-between items-center rounded-xl bg-orange-50 px-3 py-2 shadow-sm border border-orange-200 mb-2">
                    <span className="font-semibold text-orange-700">Asr</span>
                    <span className="text-orange-500">Mi-après-midi</span>
                  </div>
                  <div className="flex justify-between items-center rounded-xl bg-purple-50 px-3 py-2 shadow-sm border border-purple-200 mb-2">
                    <span className="font-semibold text-purple-700">Maghrib</span>
                    <span className="text-purple-500">Après le coucher du soleil</span>
                  </div>
                  <div className="flex justify-between items-center rounded-xl bg-indigo-50 px-3 py-2 shadow-sm border border-indigo-200 mb-2">
                    <span className="font-semibold text-indigo-700">Isha</span>
                    <span className="text-indigo-500">Après la disparition du crépuscule</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
