'use client';

import React from 'react';
import LottieAnimation from './LottieAnimation';

// Import de l'animation Lottie
import dogWalkingAnimation from '../public/animations/dog_walking.json';

const ExampleWithLottie: React.FC = () => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Exemple d'utilisation Lottie</h2>
      
      <div className="space-y-4">
        {/* Exemple 1: Animation Lottie à la place d'un emoji */}
        <div className="flex items-center space-x-2">
          <span className="text-lg">Bonjour !</span>
          {/* Au lieu d'un emoji 🐕, on utilise l'animation Lottie */}
          <LottieAnimation 
            animationData={dogWalkingAnimation}
            width={32}
            height={32}
            loop={true}
            autoplay={true}
          />
          <span className="text-lg">Comment allez-vous ?</span>
        </div>

        {/* Exemple 2: Animation plus grande */}
        <div className="flex items-center space-x-3">
          <span className="text-lg">Promenade du chien :</span>
          <LottieAnimation 
            animationData={dogWalkingAnimation}
            width={64}
            height={64}
            loop={true}
            autoplay={true}
          />
        </div>

        {/* Exemple 3: Animation avec style personnalisé */}
        <div className="flex items-center space-x-2">
          <span className="text-lg">Status :</span>
          <LottieAnimation 
            animationData={dogWalkingAnimation}
            width={24}
            height={24}
            loop={true}
            autoplay={true}
            className="inline-block"
            style={{
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
            }}
          />
          <span className="text-lg">En promenade</span>
        </div>

        {/* Exemple 4: Animation qui ne joue qu'une fois */}
        <div className="flex items-center space-x-2">
          <span className="text-lg">Notification :</span>
          <LottieAnimation 
            animationData={dogWalkingAnimation}
            width={28}
            height={28}
            loop={false}
            autoplay={true}
          />
          <span className="text-lg">Nouveau message</span>
        </div>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded">
        <h3 className="font-semibold mb-2">Comment utiliser :</h3>
        <ul className="text-sm space-y-1 text-gray-600">
          <li>• <code>animationData</code> : Les données JSON de l'animation Lottie</li>
          <li>• <code>width/height</code> : Taille de l'animation (px ou string)</li>
          <li>• <code>loop</code> : Si l'animation doit se répéter</li>
          <li>• <code>autoplay</code> : Si l'animation doit démarrer automatiquement</li>
          <li>• <code>className</code> : Classes CSS personnalisées</li>
          <li>• <code>style</code> : Styles CSS inline</li>
        </ul>
      </div>
    </div>
  );
};

export default ExampleWithLottie; 