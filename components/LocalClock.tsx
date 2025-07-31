'use client';

import React from "react";

export default function LocalClock() {
  const [date, setDate] = React.useState(new Date());
  
  React.useEffect(() => {
    const timer = setInterval(() => setDate(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="mx-auto mb-6 flex justify-center">
      <div
        className="relative rounded-full shadow-xl p-6 flex flex-col items-center w-56 h-56 bg-white/80"
        style={{
          backgroundImage: 'url(/caligraphie.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <span
            className="font-extrabold text-3xl drop-shadow-lg text-center px-4 py-2 rounded-full bg-white/90 border border-indigo-200 shadow"
          >
            <span style={{ color: 'var(--color-foreground)' }}>{date.getHours().toString().padStart(2, '0')}</span>
            <span className="mx-1" style={{ color: 'var(--color-foreground)' }}>:</span>
            <span style={{ color: 'var(--color-foreground)' }}>{date.getMinutes().toString().padStart(2, '0')}</span>
            <span className="mx-1" style={{ color: 'var(--color-foreground)' }}>:</span>
            <span style={{ color: 'var(--color-foreground)' }}>{date.getSeconds().toString().padStart(2, '0')}</span>
          </span>
        </div>
        <div className="absolute bottom-4 left-1/2 z-30" style={{ transform: 'translateX(-50%)' }}>
          <span className="text-sm text-white font-semibold tracking-wide px-2 rounded shadow">Heure locale</span>
        </div>
      </div>
    </div>
  );
} 