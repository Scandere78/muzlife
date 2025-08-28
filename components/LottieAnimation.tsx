'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { LottieAnimationProps } from '../types/lottie';

// Import dynamique de lottie-react pour éviter les erreurs SSR
const Lottie = dynamic(() => import('lottie-react'), {
  ssr: false,
  loading: () => <div className="w-6 h-6 bg-gray-200 rounded animate-pulse" />
});

const LottieAnimation: React.FC<LottieAnimationProps> = ({
  animationData,
  width = 24,
  height = 24,
  loop = true,
  autoplay = true,
  className = '',
  style = {}
}) => {
  return (
    <div 
      className={className}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        display: 'inline-block',
        ...style
      }}
    >
      <Lottie
        animationData={animationData}
        loop={loop}
        autoplay={autoplay}
        style={{
          width: '100%',
          height: '100%'
        }}
      />
    </div>
  );
};

export default LottieAnimation; 