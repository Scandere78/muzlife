"use client";

import React from "react";
import Quiz from "../../components/Quiz";
import "../../styles/globals.css";

export default function QuizPage() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start bg-transparent" style={{ color: 'var(--color-foreground)' }}>
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header principal avec animation - parfaitement centré */}
        <div className="flex flex-col items-center text-center mb-12 sm:mb-16">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-accent)]/30 to-[var(--color-foreground)]/30 rounded-3xl blur-2xl animate-pulse scale-110"></div>
            <h1 className="relative text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black bg-gradient-to-r from-[var(--color-foreground)] via-[var(--color-accent)] to-[var(--color-foreground)] bg-clip-text text-transparent mb-4 px-8 py-6 drop-shadow-lg">
              Quiz Sur l&apos;Islam
            </h1>
          </div>
          <p className="text-base sm:text-lg lg:text-xl text-[var(--color-foreground)]/80 font-medium max-w-2xl">
            Testez vos connaissances religieuses avec style
          </p>
        </div>

        {/* Composant Quiz intégré - parfaitement centré */}
        <div className="w-full flex justify-center">
          <div className="w-full max-w-5xl">
            <Quiz />
          </div>
        </div>
      </div>
    </div>
  );
}
