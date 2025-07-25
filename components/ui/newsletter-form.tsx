'use client';

import React, { useState } from 'react';
import { Button } from './button';
import { Input } from './input';
import { cn } from '../../lib/utils';

interface NewsletterFormProps {
  variant?: 'footer' | 'inline' | 'modal';
  className?: string;
}

export default function NewsletterForm({ variant = 'inline', className }: NewsletterFormProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus('loading');
    setMessage('');

    try {
      // Simulation d'un appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Ici vous pouvez ajouter votre logique d'inscription à la newsletter
      console.log('Inscription newsletter:', email);
      
      setStatus('success');
      setMessage('Merci ! Vous êtes maintenant inscrit à notre newsletter.');
      setEmail('');
    } catch (error) {
      setStatus('error');
      setMessage('Erreur lors de l\'inscription. Veuillez réessayer.');
    }
  };

  const baseStyles = variant === 'footer' 
    ? "flex flex-col sm:flex-row gap-2" 
    : "flex gap-2";

  return (
    <div className={cn("w-full", className)}>
      <form onSubmit={handleSubmit} className={baseStyles}>
        <div className="flex-1">
          <Input
            type="email"
            placeholder="Votre adresse email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === 'loading'}
            className={cn(
              "bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400",
              variant === 'footer' && "bg-white/10 border-white/20 text-white placeholder:text-gray-300"
            )}
            required
          />
        </div>
        <Button
          type="submit"
          disabled={status === 'loading' || !email.trim()}
          className={cn(
            "bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600",
            "text-white font-medium transition-all duration-300",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            variant === 'footer' && "whitespace-nowrap"
          )}
        >
          {status === 'loading' ? (
            <div className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Inscription...
            </div>
          ) : (
            "S'inscrire"
          )}
        </Button>
      </form>
      
      {message && (
        <p className={cn(
          "text-sm mt-2 transition-all duration-300",
          status === 'success' ? "text-green-400" : "text-red-400"
        )}>
          {message}
        </p>
      )}
    </div>
  );
} 