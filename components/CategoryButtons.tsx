'use client';

import { Bug, Handshake, HelpCircle, MessageSquare, Mail } from 'lucide-react';

interface Category {
  value: string;
  label: string;
  icon: any;
  description: string;
}

export default function CategoryButtons() {
  const categories: Category[] = [
    { value: 'bug', label: 'Signaler un bug', icon: Bug, description: 'Rapportez un problème technique' },
    { value: 'feature', label: 'Demande de fonctionnalité', icon: HelpCircle, description: 'Suggérez une amélioration' },
    { value: 'partnership', label: 'Partenariat', icon: Handshake, description: 'Collaborons ensemble' },
    { value: 'support', label: 'Support technique', icon: MessageSquare, description: 'Besoin d\'aide technique' },
    { value: 'other', label: 'Autre demande', icon: Mail, description: 'Toute autre question' }
  ];

  const colors = [
    'from-red-50 to-pink-50 border-red-100 dark:from-red-900/30 dark:to-pink-900/30 dark:border-red-700',
    'from-blue-50 to-indigo-50 border-blue-100 dark:from-blue-900/30 dark:to-indigo-900/30 dark:border-blue-700', 
    'from-green-50 to-emerald-50 border-green-100 dark:from-green-900/30 dark:to-emerald-900/30 dark:border-green-700',
    'from-yellow-50 to-orange-50 border-yellow-100 dark:from-yellow-900/30 dark:to-orange-900/30 dark:border-yellow-700',
    'from-purple-50 to-pink-50 border-purple-100 dark:from-purple-900/30 dark:to-pink-900/30 dark:border-purple-700'
  ];
  const iconColors = ['text-red-600', 'text-blue-600', 'text-green-600', 'text-yellow-600', 'text-purple-600'];

  return (
    <div className="space-y-3">
      {categories.map((category, index) => {
        const Icon = category.icon;
        
        return (
          <button
            key={category.value}
            onClick={() => {
              const url = new URL(window.location.href);
              url.searchParams.set('category', category.value);
              if (category.value === 'bug') {
                url.searchParams.set('subject', 'Signalement de bug');
                url.searchParams.set('message', 'Bonjour,\n\nJe souhaite signaler le bug suivant :\n\nDescription du problème :\n\nÉtapes pour reproduire :\n1. \n2. \n3. \n\nComportement attendu :\n\nComportement observé :\n\nInformations techniques :\n- Navigateur : \n- Système d\'exploitation : \n- Appareil : \n\nMerci pour votre attention.');
              } else if (category.value === 'feature') {
                url.searchParams.set('subject', 'Demande de nouvelle fonctionnalité');
                url.searchParams.set('message', 'Bonjour,\n\nJe souhaiterais proposer une nouvelle fonctionnalité :\n\nDescription de la fonctionnalité :\n\nPourquoi cette fonctionnalité serait utile :\n\nComment imaginez-vous cette fonctionnalité :\n\nMerci pour votre considération.');
              } else if (category.value === 'partnership') {
                url.searchParams.set('subject', 'Proposition de partenariat');
                url.searchParams.set('message', 'Bonjour,\n\nJe vous contacte pour explorer une opportunité de partenariat :\n\nPrésentation de mon organisation/entreprise :\n\nType de partenariat envisagé :\n\nObjectifs et bénéfices mutuels :\n\nProchaines étapes proposées :\n\nCordialement.');
              } else if (category.value === 'support') {
                url.searchParams.set('subject', 'Demande de support technique');
                url.searchParams.set('message', 'Bonjour,\n\nJ\'ai besoin d\'aide concernant :\n\nDescription du problème :\n\nCe que j\'ai déjà essayé :\n\nInformations sur mon compte/utilisation :\n\nMerci pour votre aide.');
              }
              window.location.href = url.toString();
            }}
            className={`w-full flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r ${colors[index]} border transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer text-left`}
          >
            <div className="flex-shrink-0">
              <Icon className={`h-6 w-6 ${iconColors[index]}`} />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900 dark:text-white text-sm">{category.label}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{category.description}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}