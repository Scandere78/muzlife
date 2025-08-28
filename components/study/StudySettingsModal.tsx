"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Volume2, 
  Type, 
  Target, 
  Bell, 
  Palette,
  Save,
  RotateCcw 
} from 'lucide-react';

interface StudySettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: {
    arabicFontSize: number;
    phoneticFontSize: number;
    translationFontSize: number;
    preferredLanguage: string;
    preferredReciter: string;
    defaultPlaybackSpeed: number;
    autoPlayNext: boolean;
    repeatCount: number;
    defaultStudyMode: string;
    showPhonetics: boolean;
    showTranslation: boolean;
    enableNotifications: boolean;
    dailyReadingGoal: number;
    dailyMemorizationGoal: number;
    weeklyStudyTimeGoal: number;
    reminderTime?: string;
    studyDaysOfWeek: number[];
  };
  onUpdatePreferences: (updates: Record<string, string | number | boolean | number[]>) => Promise<void>;
  onResetPreferences: () => Promise<void>;
}

const reciters = [
  { id: 'mishary', name: 'Mishary Al-Afasy', language: 'العربية' },
  { id: 'sudais', name: 'Abdul Rahman Al-Sudais', language: 'العربية' },
  { id: 'ghamdi', name: 'Saad Al-Ghamdi', language: 'العربية' },
  { id: 'basit', name: 'Abdul Basit', language: 'العربية' },
  { id: 'muaiqly', name: 'Maher Al-Muaiqly', language: 'العربية' },
];

const studyModes = [
  { value: 'READING', label: 'Lecture' },
  { value: 'MEMORIZATION', label: 'Mémorisation' },
];

const languages = [
  { value: 'fr', label: 'Français' },
  { value: 'en', label: 'English' },
  { value: 'ar', label: 'العربية' },
];

const playbackSpeeds = [0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0];

const daysOfWeek = [
  { value: 0, label: 'Dim' },
  { value: 1, label: 'Lun' },
  { value: 2, label: 'Mar' },
  { value: 3, label: 'Mer' },
  { value: 4, label: 'Jeu' },
  { value: 5, label: 'Ven' },
  { value: 6, label: 'Sam' },
];

export default function StudySettingsModal({
  isOpen,
  onClose,
  preferences,
  onUpdatePreferences,
  onResetPreferences,
}: StudySettingsModalProps) {
  const [localPreferences, setLocalPreferences] = useState(preferences);
  const [activeTab, setActiveTab] = useState<'display' | 'audio' | 'study' | 'goals' | 'notifications'>('display');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onUpdatePreferences(localPreferences);
      onClose();
    } catch (error) {
      console.error('Erreur sauvegarde préférences:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser tous les paramètres ?')) {
      setIsSaving(true);
      try {
        await onResetPreferences();
        onClose();
      } catch (error) {
        console.error('Erreur réinitialisation:', error);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const updateLocalPreference = (key: string, value: string | number | boolean | number[]) => {
    setLocalPreferences(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const toggleStudyDay = (dayValue: number) => {
    const currentDays = localPreferences.studyDaysOfWeek || [];
    const newDays = currentDays.includes(dayValue)
      ? currentDays.filter(d => d !== dayValue)
      : [...currentDays, dayValue].sort();
    
    updateLocalPreference('studyDaysOfWeek', newDays);
  };

  const tabs = [
    { id: 'display', label: 'Affichage', icon: Type },
    { id: 'audio', label: 'Audio', icon: Volume2 },
    { id: 'study', label: 'Étude', icon: Palette },
    { id: 'goals', label: 'Objectifs', icon: Target },
    { id: 'notifications', label: 'Rappels', icon: Bell },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-2 sm:p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 1 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0.5 }}
            onClick={(e) => e.stopPropagation()}
            className="rounded-lg sm:rounded-2xl border border-white/20 max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden"
            style={{
              backgroundColor: '#3a3a3ab7', // gray-900 direct
            }}
          >
            {/* En-tête */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/20">
              <h2 className="text-lg sm:text-2xl font-semibold !text-white">Paramètres d&apos;étude</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors !text-white"
              >
                <X size={20} className="!text-white" />
              </button>
            </div>

            <div className="flex flex-col md:flex-row">
              {/* Navigation des onglets - Horizontale sur mobile, verticale sur desktop */}
              <div className="md:w-1/4 border-b md:border-b-0 md:border-r border-white/10 p-2 sm:p-4">
                <nav className="flex md:flex-col space-x-1 md:space-x-0 md:space-y-2 overflow-x-auto md:overflow-x-visible">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as typeof activeTab)}
                        className={`flex-shrink-0 md:w-full flex items-center space-x-2 md:space-x-3 px-3 md:px-4 py-2 md:py-3 rounded-lg transition-all whitespace-nowrap text-sm md:text-base ${
                          activeTab === tab.id
                            ? 'bg-[var(--color-accent)] text-white'
                            : 'text-gray-300 hover:bg-white/10'
                        }`}
                      >
                        <Icon size={16} className="md:w-[18px] md:h-[18px]" />
                        <span className="hidden sm:inline">{tab.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Contenu des onglets */}
              <div className="flex-1 p-4 sm:p-6 max-h-[calc(95vh-180px)] sm:max-h-[calc(90vh-140px)] overflow-y-auto">
                {/* Onglet Affichage */}
                {activeTab === 'display' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-base sm:text-lg font-medium !text-white mb-4">Paramètres d&apos;affichage</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Taille police arabe: {localPreferences.arabicFontSize}px
                          </label>
                          <input
                            type="range"
                            min="16"
                            max="48"
                            value={localPreferences.arabicFontSize}
                            onChange={(e) => updateLocalPreference('arabicFontSize', parseInt(e.target.value))}
                            className="w-full h-2 rounded-lg bg-gray-700 appearance-none cursor-pointer"
                            style={{
                              background: `linear-gradient(to right, var(--color-accent) 0%, var(--color-accent) ${((localPreferences.arabicFontSize - 16) / (48 - 16)) * 100}%, #374151 ${((localPreferences.arabicFontSize - 16) / (48 - 16)) * 100}%, #374151 100%)`
                            }}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Taille police phonétique: {localPreferences.phoneticFontSize}px
                          </label>
                          <input
                            type="range"
                            min="12"
                            max="24"
                            value={localPreferences.phoneticFontSize}
                            onChange={(e) => updateLocalPreference('phoneticFontSize', parseInt(e.target.value))}
                            className="w-full h-2 rounded-lg bg-gray-700 appearance-none cursor-pointer"
                            style={{
                              background: `linear-gradient(to right, var(--color-accent) 0%, var(--color-accent) ${((localPreferences.phoneticFontSize - 12) / (24 - 12)) * 100}%, #374151 ${((localPreferences.phoneticFontSize - 12) / (24 - 12)) * 100}%, #374151 100%)`
                            }}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Taille police traduction: {localPreferences.translationFontSize}px
                          </label>
                          <input
                            type="range"
                            min="10"
                            max="20"
                            value={localPreferences.translationFontSize}
                            onChange={(e) => updateLocalPreference('translationFontSize', parseInt(e.target.value))}
                            className="w-full h-2 rounded-lg bg-gray-700 appearance-none cursor-pointer"
                            style={{
                              background: `linear-gradient(to right, var(--color-accent) 0%, var(--color-accent) ${((localPreferences.translationFontSize - 10) / (20 - 10)) * 100}%, #374151 ${((localPreferences.translationFontSize - 10) / (20 - 10)) * 100}%, #374151 100%)`
                            }}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Langue de traduction
                          </label>
                          <select
                            value={localPreferences.preferredLanguage}
                            onChange={(e) => updateLocalPreference('preferredLanguage', e.target.value)}
                            className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white"
                          >
                            {languages.map((lang) => (
                              <option key={lang.value} value={lang.value} className="bg-gray-800">
                                {lang.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Onglet Audio */}
                {activeTab === 'audio' && (
                  <div className="space-y-6">
                    <h3 className="text-base sm:text-lg font-medium !text-white mb-4">Paramètres audio</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Récitateur préféré
                        </label>
                        <select
                          value={localPreferences.preferredReciter}
                          onChange={(e) => updateLocalPreference('preferredReciter', e.target.value)}
                          className="w-full p-3 rounded-lg bg-white/10 border text-white-300 border-white/20"
                        >
                          {reciters.map((reciter) => (
                            <option key={reciter.id} value={reciter.id} className="bg-green-800">
                              {reciter.name} ({reciter.language})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Vitesse de lecture: {localPreferences.defaultPlaybackSpeed}x
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {playbackSpeeds.map((speed) => (
                            <button
                              key={speed}
                              onClick={() => updateLocalPreference('defaultPlaybackSpeed', speed)}
                              className={`py-2 px-3 rounded-lg border transition-colors ${
                                localPreferences.defaultPlaybackSpeed === speed
                                  ? 'bg-[var(--color-accent)] border-[var(--color-accent)] text-white'
                                  : 'bg-white/10 border-white/20 text-gray-300 hover:bg-white/20'
                              }`}
                            >
                              {speed}x
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Répétitions par verset: {localPreferences.repeatCount}
                        </label>
                        <input
                          type="range"
                          min="1"
                          max="10"
                          value={localPreferences.repeatCount}
                          onChange={(e) => updateLocalPreference('repeatCount', parseInt(e.target.value))}
                          className="w-full h-2 rounded-lg bg-gray-700 appearance-none cursor-pointer"
                          style={{
                            background: `linear-gradient(to right, var(--color-accent) 0%, var(--color-accent) ${((localPreferences.repeatCount - 1) / (10 - 1)) * 100}%, #374151 ${((localPreferences.repeatCount - 1) / (10 - 1)) * 100}%, #374151 100%)`
                          }}
                        />
                      </div>

                      <div>
                        <label className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={localPreferences.autoPlayNext}
                            onChange={(e) => updateLocalPreference('autoPlayNext', e.target.checked)}
                            className="rounded bg-gray-700 border-gray-600 text-[var(--color-accent)] focus:ring-[var(--color-accent)] focus:ring-2"
                          />
                          <span className="text-gray-300">Lecture automatique du verset suivant</span>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Onglet Étude */}
                {activeTab === 'study' && (
                  <div className="space-y-6">
                    <h3 className="text-base sm:text-lg font-medium !text-white mb-4">Préférences d&apos;étude</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Mode d&apos;étude par défaut
                        </label>
                        <select
                          value={localPreferences.defaultStudyMode}
                          onChange={(e) => updateLocalPreference('defaultStudyMode', e.target.value)}
                          className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white"
                        >
                          {studyModes.map((mode) => (
                            <option key={mode.value} value={mode.value} className="bg-green-800">
                              {mode.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-3">
                        <label className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={localPreferences.showPhonetics}
                            onChange={(e) => updateLocalPreference('showPhonetics', e.target.checked)}
                            className="rounded bg-gray-700 border-gray-600 text-[var(--color-accent)] focus:ring-[var(--color-accent)] focus:ring-2"
                          />
                          <span className="text-gray-300">Afficher la phonétique par défaut</span>
                        </label>

                        <label className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={localPreferences.showTranslation}
                            onChange={(e) => updateLocalPreference('showTranslation', e.target.checked)}
                            className="rounded bg-gray-700 border-gray-600 text-[var(--color-accent)] focus:ring-[var(--color-accent)] focus:ring-2"
                          />
                          <span className="text-gray-300">Afficher la traduction par défaut</span>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Onglet Objectifs */}
                {activeTab === 'goals' && (
                  <div className="space-y-6">
                    <h3 className="text-base sm:text-lg font-medium !text-white mb-4">Objectifs personnalisés</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Versets à lire par jour: {localPreferences.dailyReadingGoal}
                        </label>
                        <input
                          type="range"
                          min="1"
                          max="100"
                          value={localPreferences.dailyReadingGoal}
                          onChange={(e) => updateLocalPreference('dailyReadingGoal', parseInt(e.target.value))}
                          className="w-full h-2 rounded-lg bg-gray-700 appearance-none cursor-pointer"
                          style={{
                            background: `linear-gradient(to right, var(--color-accent) 0%, var(--color-accent) ${((localPreferences.dailyReadingGoal - 1) / (100 - 1)) * 100}%, #374151 ${((localPreferences.dailyReadingGoal - 1) / (100 - 1)) * 100}%, #374151 100%)`
                          }}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Versets à mémoriser par jour: {localPreferences.dailyMemorizationGoal}
                        </label>
                        <input
                          type="range"
                          min="1"
                          max="20"
                          value={localPreferences.dailyMemorizationGoal}
                          onChange={(e) => updateLocalPreference('dailyMemorizationGoal', parseInt(e.target.value))}
                          className="w-full h-2 rounded-lg bg-gray-700 appearance-none cursor-pointer"
                          style={{
                            background: `linear-gradient(to right, var(--color-accent) 0%, var(--color-accent) ${((localPreferences.dailyMemorizationGoal - 1) / (20 - 1)) * 100}%, #374151 ${((localPreferences.dailyMemorizationGoal - 1) / (20 - 1)) * 100}%, #374151 100%)`
                          }}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Temps d&apos;étude hebdomadaire (minutes): {localPreferences.weeklyStudyTimeGoal}
                        </label>
                        <input
                          type="range"
                          min="30"
                          max="2000"
                          step="30"
                          value={localPreferences.weeklyStudyTimeGoal}
                          onChange={(e) => updateLocalPreference('weeklyStudyTimeGoal', parseInt(e.target.value))}
                          className="w-full h-2 rounded-lg bg-gray-700 appearance-none cursor-pointer"
                          style={{
                            background: `linear-gradient(to right, var(--color-accent) 0%, var(--color-accent) ${((localPreferences.weeklyStudyTimeGoal - 30) / (2000 - 30)) * 100}%, #374151 ${((localPreferences.weeklyStudyTimeGoal - 30) / (2000 - 30)) * 100}%, #374151 100%)`
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Onglet Notifications */}
                {activeTab === 'notifications' && (
                  <div className="space-y-6">
                    <h3 className="text-base sm:text-lg font-medium !text-white mb-4">Rappels d&apos;étude</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="flex items-center space-x-3 mb-4">
                          <input
                            type="checkbox"
                            checked={localPreferences.enableNotifications}
                            onChange={(e) => updateLocalPreference('enableNotifications', e.target.checked)}
                            className="rounded bg-gray-700 border-gray-600 text-[var(--color-accent)] focus:ring-[var(--color-accent)] focus:ring-2"
                          />
                          <span className="text-gray-300">Activer les notifications</span>
                        </label>
                      </div>

                      {localPreferences.enableNotifications && (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Heure de rappel quotidien
                            </label>
                            <input
                              type="time"
                              value={localPreferences.reminderTime || '20:00'}
                              onChange={(e) => updateLocalPreference('reminderTime', e.target.value)}
                              className="p-3 rounded-lg bg-white/10 border border-white/20 text-white"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-3">
                              Jours d&apos;étude
                            </label>
                            <div className="grid grid-cols-3 sm:flex sm:space-x-2 gap-2 sm:gap-0">
                              {daysOfWeek.map((day) => (
                                <button
                                  key={day.value}
                                  onClick={() => toggleStudyDay(day.value)}
                                  className={`py-2 px-3 rounded-lg border transition-colors ${
                                    localPreferences.studyDaysOfWeek?.includes(day.value)
                                      ? 'bg-[var(--color-accent)] border-[var(--color-accent)] text-white'
                                      : 'bg-white/10 border-white/20 text-gray-300 hover:bg-white/20'
                                  }`}
                                >
                                  {day.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between p-4 sm:p-6 border-t border-white/10 space-y-3 sm:space-y-0">
              <button
                onClick={handleReset}
                disabled={isSaving}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-red-500/20 border border-red-500/50 text-red-300 hover:bg-red-500/30 transition-colors disabled:opacity-50"
              >
                <RotateCcw size={16} />
                <span>Réinitialiser</span>
              </button>

              <div className="flex items-center space-x-2 sm:space-x-3">
                <button
                  onClick={onClose}
                  disabled={isSaving}
                  className="px-3 sm:px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors disabled:opacity-50 text-sm sm:text-base"
                >
                  Annuler
                </button>
                
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center space-x-2 px-4 sm:px-6 py-2 rounded-lg bg-[var(--color-accent)] hover:bg-[var(--color-accent)]/80 transition-colors disabled:opacity-50 text-sm sm:text-base"
                >
                  <Save size={16} />
                  <span>{isSaving ? 'Sauvegarde...' : 'Sauvegarder'}</span>
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}