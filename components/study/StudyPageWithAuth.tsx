"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AuthModal from '../auth/AuthModal';
import SourateStudyPage from './SourateStudyPage';

interface StudyPageWithAuthProps {
  sourate: {
    number: number;
    name: string;
    englishName: string;
    englishNameTranslation: string;
    ayahs: Array<{
      text: string;
      numberInSurah: number;
      transliteration?: string;
      translation: string;
    }>;
  };
  surahNumber: number;
}

export default function StudyPageWithAuth(props: StudyPageWithAuthProps) {
  const { user, toggleVerseFavorite } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingFavoriteAction, setPendingFavoriteAction] = useState<{
    surahNumber: number;
    verseNumber: number;
  } | null>(null);

  // Écouter les événements d'ouverture du modal d'auth
  useEffect(() => {
    const handleOpenAuthModal = (event: CustomEvent) => {
      const { reason, surahNumber, verseNumber } = event.detail;
      
      if (reason === 'favorite') {
        setPendingFavoriteAction({ surahNumber, verseNumber });
        setShowAuthModal(true);
      }
    };

    window.addEventListener('openAuthModal', handleOpenAuthModal as EventListener);

    return () => {
      window.removeEventListener('openAuthModal', handleOpenAuthModal as EventListener);
    };
  }, []);

  // Gérer l'action après connexion réussie
  useEffect(() => {
    const processPendingFavorite = async () => {
      if (user && pendingFavoriteAction) {
        const { surahNumber, verseNumber } = pendingFavoriteAction;
        
        try {
          await toggleVerseFavorite(surahNumber, verseNumber);
          
          // Optionnel: afficher un message de succès
          console.log(`Verset ${verseNumber} ajouté aux favoris`);
          
        } catch (error) {
          console.error('Erreur lors de l\'ajout aux favoris:', error);
        } finally {
          setPendingFavoriteAction(null);
          
          // Nettoyer le sessionStorage si utilisé
          sessionStorage.removeItem('pendingFavorite');
        }
      }
    };

    processPendingFavorite();
  }, [user, pendingFavoriteAction, toggleVerseFavorite]);

  // Gérer la fermeture du modal d'auth
  const handleCloseAuthModal = () => {
    setShowAuthModal(false);
    
    // Si l'utilisateur ferme sans se connecter, nettoyer l'action en attente
    if (!user) {
      setPendingFavoriteAction(null);
      sessionStorage.removeItem('pendingFavorite');
    }
  };

  return (
    <>
      <SourateStudyPage {...props} />
      
      {/* Modal d'authentification */}
      <AuthModal 
        isOpen={showAuthModal} 
        onCloseAction={handleCloseAuthModal}
      />
    </>
  );
}