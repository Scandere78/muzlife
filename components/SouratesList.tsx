"use client";

import React, { useState } from "react";
import Link from "next/link";
import { sourates } from "../lib/sourateSlugs";

const SouratesList: React.FC = () => {
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  return (
    <div className="w-full max-w-4xl">
      <ul className="space-y-4">
        {sourates.map((sourate, index) => (
          <li key={sourate.number} className="mb-4 p-4 bg-[var(--color-muted)] rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border border-[var(--color-border)] w-full mx-auto">
            <div className="flex items-center justify-between">
              <Link href={`/sourates/${sourate.slug}`} className="flex-1">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-[var(--color-foreground)] text-[var(--color-accent)] rounded-full flex items-center justify-center text-lg font-bold">
                    {sourate.number}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[var(--color-foreground)]">
                      {sourate.nom_phonetique}
                    </h3>
                    <p className="text-sm text-[var(--color-foreground)]">
                      Sourate {sourate.number} • {sourate.slug}
                    </p>
                  </div>
                </div>
              </Link>
              <div className="flex items-center gap-2 ml-4">
                <button 
                  aria-label="Ajouter aux favoris" 
                  className="p-2 rounded-full hover:bg-[var(--color-foreground)]/20 transition-colors"
                >
                  <svg fill="white" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>
                </button>
                <button 
                  aria-label="Partager la sourate" 
                  className="p-2 rounded-full hover:bg-[var(--color-foreground)]/20 transition-colors"
                  onClick={async () => {
                    await navigator.clipboard.writeText(window.location.origin + `/sourates/${sourate.slug}`);
                    setCopiedSlug(sourate.slug);
                    setTimeout(() => setCopiedSlug(null), 1500);
                  }}
                >
                  {copiedSlug === sourate.slug ? (
                    <span className="text-white font-semibold text-sm">Lien copié !</span>
                  ) : (
                    <svg fill="white" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0-3.933-2.185 2.25 2.25 0 0 0 3.933 2.185Z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SouratesList;
