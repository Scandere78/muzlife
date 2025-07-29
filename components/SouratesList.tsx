"use client";

import React, { useState } from "react";
import Link from "next/link";
import { sourates } from "../lib/sourateSlugs";

const SouratesList: React.FC = () => {
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredSourates = sourates.filter(sourate => 
    sourate.nom_phonetique.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full max-w-4xl">
      <div className="flex items-center gap-2 mb-4">
        <input 
          type="text" 
          placeholder="Rechercher une sourate" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 rounded-lg border border-[var(--color-border)]" 
        />
        <button className="px-4 py-2 rounded-lg text-white font-bold text-lg border-accent bg-[var(--color-accent)] hover:shadow-lg hover:shadow-[var(--color-accent)]/20 transition-all duration-300 transform hover:-translate-y-1">Rechercher</button>
      </div>
      <ul className="space-y-4">
        {filteredSourates.map((sourate, index) => (
          <li key={sourate.number} className="mb-4 p-4 bg-[var(--color-muted)] rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border border-[var(--color-border)] w-full mx-auto">
            <div className="flex items-center justify-between">
              <Link href={`/ecoute/${sourate.slug}`} className="flex-1">
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
                {/* Coeur cliquable (favori) */}
                <button
                      aria-label="Ajouter aux favoris"
                      className="p-3 rounded-full hover:bg-[var(--color-muted)]/20 transition-colors group"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="var(--color-muted)" className="w-6 h-6 text-[var(--color-foreground)] group-hover:text-[var(--color-accent)] transition-colors">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.75a5.25 5.25 0 00-4.5 2.472A5.25 5.25 0 007.5 3.75 5.25 5.25 0 003 9c0 7.25 9 11.25 9 11.25s9-4 9-11.25a5.25 5.25 0 00-5.25-5.25z" />
                      </svg>
                    </button>
                <button 
                  aria-label="Partager la sourate" 
                  className="p-2 rounded-full hover:bg-[var(--color-foreground)]/20 transition-colors"
                  onClick={async () => {
                    await navigator.clipboard.writeText(window.location.origin + `/ecoute/${sourate.slug}`);
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
