'use client';

import { useState } from 'react';

interface NewsletterFormProps {
  /** Style du formulaire */
  variant?: 'default' | 'footer';
  /** Texte au-dessus du formulaire (optionnel) */
  title?: string;
  /** Description sous le titre (optionnel) */
  description?: string;
  /** Placeholder de l'input email */
  placeholder?: string;
  /** Texte du bouton */
  buttonText?: string;
  /** Afficher les réseaux sociaux */
  showSocialMedia?: boolean;
  /** Texte au-dessus des réseaux sociaux */
  socialMediaText?: string;
}

export default function NewsletterForm({ 
  variant = 'default',
  title,
  description,
  placeholder = "Votre email",
  buttonText = "S'inscrire",
  showSocialMedia = false,
  socialMediaText = "Suivez-nous sur les réseaux sociaux"
}: NewsletterFormProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) return;
    
    try {
      setStatus('loading');
      
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Une erreur est survenue');
      }
      
      setStatus('success');
      setMessage('Merci pour votre inscription !');
      setEmail('');
      
      // Tracking de l'inscription à la newsletter
      //analytics.trackFormSubmission('newsletter');
      //analytics.trackConversion('Newsletter Subscription');
      
      // Réinitialiser le message après 5 secondes
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 5000);
      
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Une erreur est survenue');
      
      // Réinitialiser le message d'erreur après 5 secondes
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 5000);
    }
  };

  const isFooterVariant = variant === 'footer';

  return (
    <div className={isFooterVariant ? 'w-full' : 'max-w-md mx-auto'}>
      {/* Titre personnalisable */}
      {title && (
        <h2 
          className="font-bold mb-4 font-display text-2xl"
          style={{
            color: isFooterVariant ? 'white' : 'var(--indigo)'
          }}
        >
          {title}
        </h2>
      )}

      {/* Description personnalisable */}
      {description && (
        <p className={`mb-6 ${
          isFooterVariant 
            ? 'text-gray-300' 
            : 'text-gray-600'
        }`}>
          {description}
        </p>
      )}

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <div className="flex">
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={placeholder}
            className="flex-grow px-3 py-2 border rounded-l-md focus:outline-none focus:ring-2 transition-all duration-300 text-sm"
            style={{
              backgroundColor: isFooterVariant ? '#374151' : 'white',
              color: isFooterVariant ? 'white' : '#111827',
              borderColor: isFooterVariant ? '#4b5563' : '#d1d5db',
              '--tw-ring-color': 'var(--gold)',
            } as React.CSSProperties}
            aria-label="Adresse email pour la newsletter"
            disabled={status === 'loading'}
            required
          />
          <button 
            type="submit" 
            className="font-medium py-2 px-3 rounded-r-md transition-all duration-300 text-sm hover:scale-105 hover:shadow-lg"
            style={{
              backgroundColor: status === 'loading' ? '#9ca3af' : 'var(--gold)',
              color: 'white',
              cursor: status === 'loading' ? 'not-allowed' : 'pointer'
            }}
            disabled={status === 'loading'}
          >
            {status === 'loading' ? 'Envoi...' : buttonText}
          </button>
        </div>
        
        {message && (
          <div 
            className="mt-2 text-xs text-center p-2 rounded transition-all duration-300"
            style={{
              backgroundColor: status === 'success' 
                ? (isFooterVariant ? 'rgba(34, 197, 94, 0.2)' : 'rgba(34, 197, 94, 0.1)')
                : (isFooterVariant ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239, 68, 68, 0.1)'),
              color: status === 'success' 
                ? (isFooterVariant ? '#86efac' : '#15803d')
                : (isFooterVariant ? '#fca5a5' : '#dc2626'),
              border: isFooterVariant 
                ? (status === 'success' ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)')
                : 'none'
            }}
          >
            {message}
          </div>
        )}
      </form>

      {/* Réseaux sociaux - modulable */}
      {showSocialMedia && (
        <div className="mt-6 text-center">
          <p className={`mb-4 ${
            isFooterVariant ? 'text-gray-300' : 'text-gray-700'
          }`}>
            {socialMediaText}
          </p>
          <div className="flex justify-center gap-4">
            <a 
              href={process.env.NEXT_PUBLIC_FACEBOOK_URL} 
              aria-label="Facebook" 
              className="transition-all duration-300 hover:scale-110"
              style={{
                color: isFooterVariant ? '#d1d5db' : 'var(--indigo)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#3b82f6';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = isFooterVariant ? '#d1d5db' : 'var(--indigo)';
              }}
            >
              <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
              </svg>
            </a>
            <a 
              href={process.env.NEXT_PUBLIC_INSTAGRAM_URL} 
              aria-label="Instagram" 
              className="transition-all duration-300 hover:scale-110"
              style={{
                color: isFooterVariant ? '#d1d5db' : 'var(--indigo)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#ec4899';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = isFooterVariant ? '#d1d5db' : 'var(--indigo)';
              }}
            >
              <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
              </svg>
            </a>
            <a 
              href={process.env.NEXT_PUBLIC_X_URL} 
              aria-label="X" 
              className="transition-all duration-300 hover:scale-110"
              style={{
                color: isFooterVariant ? '#d1d5db' : 'var(--indigo)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = isFooterVariant ? '#f3f4f6' : '#000000';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = isFooterVariant ? '#d1d5db' : 'var(--indigo)';
              }}
            >
              <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M13.6823 10.6218L20.2391 3H18.6854L12.9921 9.61788L8.44486 3H3.2002L10.0765 13.0074L3.2002 21H4.75404L10.7663 14.0113L15.5685 21H20.8131L13.6819 10.6218H13.6823ZM11.5541 13.0956L10.8574 12.0991L5.31391 4.16971H7.70053L12.1742 10.5689L12.8709 11.5655L18.6861 19.8835H16.2995L11.5541 13.096V13.0956Z" />
              </svg>
            </a>
          </div>
        </div>
      )}
    </div>
  );
} 