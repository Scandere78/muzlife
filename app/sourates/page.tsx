import React from "react";
import SouratesList from "../../components/SouratesList";
import "../../styles/globals.css";

export default function SouratesPage() {
  return (
    <div className="page-container navbar-safe px-4 py-6 sm:py-8 flex flex-col items-center min-h-screen w-full overflow-x-visible" style={{ background: 'var(--color-background)', color: 'var(--color-foreground)' }}>
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--color-accent)] mb-3 sm:mb-4 drop-shadow-lg animate-fade-in">
          Les Sourates du Coran
        </h1>
        <p className="text-base sm:text-lg text-[var(--color-muted)] max-w-2xl mx-auto animate-fade-in">
          Découvrez et écoutez les 114 sourates du Saint Coran
        </p>
      </div>

      <SouratesList />

      {/* Animations utilitaires */}
      <style>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: none; } }
        .animate-fade-in { animation: fade-in 0.7s cubic-bezier(.4,0,.2,1) both; }
      `}</style>
    </div>
  );
}
