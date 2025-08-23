"use client";

import React, { useState } from "react";
import { ChevronDownIcon } from "lucide-react";

interface Country {
  name: string;
  code: string;
  flag: string;
}

interface CountrySelectorProps {
  countries: Country[];
  selectedCountry: Country;
  onCountrySelect: (country: Country) => void;
  className?: string;
}

export default function CountrySelector({
  countries,
  selectedCountry,
  onCountrySelect,
  className = ""
}: CountrySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCountrySelect = (country: Country) => {
    onCountrySelect(country);
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <div className={`relative ${className}`}>
      {/* Bouton principal */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-gray-800 dark:to-gray-700 border-2 border-amber-200 dark:border-amber-600 rounded-xl text-left focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-400 hover:border-amber-300 hover:shadow-lg transition-all duration-200"
      >
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{selectedCountry.flag}</span>
          <span className="font-medium text-gray-900 dark:text-white">
            {selectedCountry.name}
          </span>
        </div>
        <ChevronDownIcon 
          className={`h-5 w-5 text-amber-600 dark:text-amber-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Menu déroulant */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gradient-to-br from-white via-gray-50/95 to-blue-50/90 dark:from-gray-800 dark:via-gray-800/95 dark:to-gray-900/90 backdrop-blur-xl border border-gradient-to-r from-blue-200 via-purple-200 to-pink-200 dark:from-blue-600/50 dark:via-purple-600/50 dark:to-pink-600/50 rounded-2xl shadow-2xl shadow-blue-500/10 dark:shadow-blue-900/20 z-50 max-h-80 overflow-hidden ring-1 ring-white/20 dark:ring-gray-700/50">
          {/* Barre de recherche */}
          <div className="p-4 border-b border-gradient-to-r from-blue-100 via-purple-100 to-pink-100 dark:from-blue-900/30 dark:via-purple-900/30 dark:to-pink-900/30 bg-gradient-to-r from-blue-50/50 via-purple-50/30 to-pink-50/50 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-pink-900/20">
            <div className="relative group">
              <input
                type="text"
                placeholder="🔍 Rechercher un pays..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 border-2 border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-green-400 bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 dark:from-gray-700 dark:via-gray-700 dark:to-gray-600 text-gray-900 dark:text-white placeholder-green-500/70 dark:placeholder-green-400/70 font-medium shadow-inner group-hover:shadow-lg transition-all duration-300 hover:from-green-100 hover:via-emerald-100 hover:to-teal-100"
                autoFocus
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-400/20 via-emerald-400/20 to-teal-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          </div>

          {/* Liste des pays */}
          <div className="max-h-60 overflow-y-auto bg-gradient-to-b from-transparent via-white/50 to-gray-50/80 dark:from-transparent dark:via-gray-800/50 dark:to-gray-900/80">
            {filteredCountries.length > 0 ? (
              filteredCountries.map((country) => (
                <button
                  key={country.code}
                  type="button"
                  onClick={() => handleCountrySelect(country)}
                  className={`w-full flex items-center space-x-4 px-6 py-4 text-left group transition-all duration-300 ease-in-out relative overflow-hidden ${
                    selectedCountry.code === country.code
                      ? "!bg-gradient-to-r !from-slate-100 !via-gray-100 !to-zinc-100 dark:!from-slate-800/60 dark:!via-gray-800/60 dark:!to-zinc-800/60 !text-slate-900 dark:!text-slate-100 font-semibold border-l-4 !border-slate-600 dark:!border-slate-400 shadow-lg !shadow-slate-200/30 dark:!shadow-slate-900/20 transform scale-[1.02]"
                      : "!text-gray-700 dark:!text-gray-200 hover:!bg-gradient-to-r hover:!from-slate-50/80 hover:!via-gray-50/60 hover:!to-zinc-50/40 dark:hover:!from-slate-900/30 dark:hover:!via-gray-900/20 dark:hover:!to-zinc-900/10 hover:!text-slate-800 dark:hover:!text-slate-200 hover:shadow-md hover:!shadow-slate-100/20 dark:hover:!shadow-slate-900/10 focus:!bg-gradient-to-r focus:!from-slate-50 focus:!to-gray-50 hover:scale-[1.01] hover:pl-7"
                  }`}
                >
                  <span className="text-2xl">{country.flag}</span>
                  <span className="font-medium">{country.name}</span>
                  {selectedCountry.code === country.code && (
                    <div className="ml-auto flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-slate-500 via-gray-600 to-zinc-700 flex items-center justify-center shadow-lg shadow-slate-500/30 ring-2 ring-white dark:ring-slate-800">
                        <span className="text-white text-sm font-bold">✓</span>
                      </div>
                    </div>
                  )}
                </button>
              ))
            ) : (
              <div className="px-4 py-8 text-center bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 dark:from-gray-800 dark:via-blue-900/20 dark:to-purple-900/10">
                <div className="text-4xl mb-3 animate-bounce">🌍</div>
                <p className="font-medium text-gray-600 dark:text-gray-300 mb-1">Aucun pays trouvé</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Essayez un autre terme de recherche</p>
              </div>
            )}
          </div>

          {/* Footer avec nombre de pays */}
          <div className="px-4 py-3 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/30 dark:via-indigo-900/30 dark:to-purple-900/30 border-t border-gradient-to-r from-blue-200/50 via-purple-200/50 to-pink-200/50 dark:from-blue-700/50 dark:via-purple-700/50 dark:to-pink-700/50 backdrop-blur-sm">
            <p className="text-xs font-medium text-center bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
              {filteredCountries.length} pays disponible{filteredCountries.length > 1 ? 's' : ''}
            </p>
          </div>
        </div>
      )}

      {/* Overlay pour fermer le menu */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setIsOpen(false);
            setSearchTerm("");
          }}
        />
      )}
    </div>
  );
}
