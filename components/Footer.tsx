'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import NewsletterForm from './NewsletterForm';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();
  const isAdmin = pathname?.includes('/admin');
  const isDashboardPage = pathname?.includes('/dashboard');

  // Ne pas afficher le footer sur les pages d'administration et dashboard
  if (isAdmin || isDashboardPage) {
    return null;
  }
  
  return (
    <footer className="relative w-screen overflow-x-hidden">


      {/* Footer principal */}
        <div className="bg-[var(--color-foreground)] text-white relative">
        {/* Effet de backdrop similaire au Navbar */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--color-foreground)] backdrop-blur-sm"></div>

        <div className="relative z-10 w-full pl-4 sm:px-8 sm:max-w-7xl sm:mx-auto px-0 py-8 sm:py-10 md:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12">
            
            {/* Informations - avec logo comme le Navbar */}
            <div>
              <div className="flex items-center mb-4 sm:mb-6">
                <Image 
                  src="/muzlife_v2.png" 
                  alt="MuzLife" 
                  width={40} 
                  height={40} 
                  className="h-10 w-10 mr-3 rounded-lg"
                />
                <div>
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold">
                    <span className="text-[var(--color-accent)]">Muz</span>
                    <span className="text-white ml-1">Life</span>
                  </h3>
                </div>
              </div>
              <address className="not-italic text-gray-300 space-y-1 sm:space-y-2">
                <p className="text-sm sm:text-sm text-[var(--color-muted)]">Votre compagnon spirituel numérique</p>
                
                <a 
                  href="mailto:contact@muzlife.fr" 
                  className="text-sm sm:text-sm text-gray-300 hover:text-[var(--color-muted)] transition-colors underline"
                  aria-label="Envoyer un mail à contact@muzlife.fr"
                >
                  📧 contact@muzlife.fr
                </a>
                <br />
                
                <a 
                  href="https://wa.me/33767605371" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm sm:text-sm text-gray-300 hover:text-[var(--color-muted)] transition-colors underline"
                  aria-label="Contacter sur WhatsApp au +33 7 67 60 53 71"
                >
                  💬 Samy
                </a>
                <br />
                <a 
                  href="https://wa.me/33650875135" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm sm:text-sm text-gray-300 hover:text-[var(--color-muted)] transition-colors underline"
                  aria-label="Contacter sur WhatsApp au +33 6 50 87 51 35"
                >
                  💬 Scandere
                </a>
              </address>

            {/* Nos devs */}
           
              <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-[var(--color-background)]">Nos devs</h3>
              <p className="text-gray-300 text-sm sm:text-sm mb-2 sm:mb-4">
                Nos devs sont disponibles sur les réseaux sociaux
              </p>
              {/* 
                On affiche les devs dans des box cliquables, avec une animation douce au survol.
                On utilise les composants Link de Next.js et on stylise avec Tailwind pour la lisibilité.
                Les box sont accessibles et responsives.
              */}
              <div className="flex flex-col gap-3">
                <Link
                  href="https://www.scandere-tej.fr/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block rounded-lg bg-[var(--color-muted)]/20 border border-[var(--color-muted)] px-5 py-3 transition-all duration-200 hover:bg-[var(--color-muted)]/40 hover:scale-[1.03] shadow-sm hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                  aria-label="Portfolio de Scandere Tej"
                >
                  <span className="flex items-center gap-2">
                    <svg className="w-6 h-6 text-[var(--color-accent)] group-hover:animate-pulse" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    <span className="text-base sm:text-lg font-semibold text-gray-200 group-hover:text-[var(--color-accent)] transition-colors">
                      Scandere Tej
                    </span>
                  </span>
                  <span className="block text-xs text-gray-400 mt-1">Développeur web</span>
                </Link>
                <Link
                  href="https://www.samy-dev.fr/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block rounded-xl bg-[var(--color-muted)]/20 border border-[var(--color-muted)] px-5 py-3 transition-all duration-200 hover:bg-[var(--color-muted)]/40 hover:scale-[1.03] shadow-sm hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                  aria-label="Portfolio de Samy Ajouid"
                >
                  <span className="flex items-center gap-2">
                    <svg className="w-6 h-6 text-[var(--color-accent)] group-hover:animate-pulse" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    <span className="text-base sm:text-lg font-semibold text-gray-200 group-hover:text-[var(--color-accent)] transition-colors">
                      Samy Ajouid
                    </span>
                  </span>
                  <span className="block text-xs text-gray-400 mt-1">Développeur web</span>
                </Link>
              </div>
              {/* 
                Explication :
                - Chaque dev est dans une box stylisée, cliquable, avec effet de survol (scale et couleur).
                - L'icône "+" est animée subtilement au hover.
                - Les couleurs sont cohérentes avec le thème du site.
                - Les liens sont accessibles (focus, aria-label).
              */}
            </div>
            
            {/* Navigation - style cohérent avec Navbar */}
            <div>
              <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-[var(--color-background)]">Navigation</h3>
              <ul className="space-y-2 sm:space-y-3">
                <li>
                  <Link 
                    href="/" 
                    className="text-gray-300 hover:text-[var(--color-muted)] transition-colors text-lg font-medium flex items-center group"
                  >
                    <span className="mr-2 group-hover:translate-x-1 transition-transform">🏠</span>
                    Accueil
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/lecture" 
                    className="text-gray-300 hover:text-green-400 transition-colors text-lg font-medium flex items-center group"
                  >
                    <span className="mr-2 group-hover:translate-x-1 transition-transform">📖</span>
                    Lecture
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/ecoute" 
                    className="text-gray-300 hover:text-green-400 transition-colors text-lg font-medium flex items-center group"
                  >
                    <span className="mr-2 group-hover:translate-x-1 transition-transform">🎧</span>
                    Écoute
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/quizz" 
                    className="text-gray-300 hover:text-green-400 transition-colors text-lg font-medium flex items-center group"
                  >
                    <span className="mr-2 group-hover:translate-x-1 transition-transform">🧠</span>
                    Quizz
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/about" 
                    className="text-gray-300 hover:text-green-400 transition-colors text-lg font-medium flex items-center group"
                  >
                    <span className="mr-2 group-hover:translate-x-1 transition-transform">ℹ️</span>
                    À propos
                  </Link>
                </li>
              </ul>
            </div>
            
            {/* Communauté & Réseaux sociaux */}
            <div>
              <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-green-400">Communauté</h3>
              <p className="text-gray-300 text-sm sm:text-sm mb-2 sm:mb-4">
                Rejoignez notre communauté sur les réseaux sociaux
              </p>

              <div className="flex flex-wrap gap-2 sm:gap-4">
                <a 
                  href="https://www.facebook.com/muzlife.off/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook" 
                  className="group p-3 bg-gray-800/50 rounded-full hover:bg-blue-600/20 border border-gray-700 hover:border-blue-500/50 transition-all duration-300"
                >
                  <svg className="h-5 w-5 text-gray-400 group-hover:text-blue-400 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a 
                  href="https://www.instagram.com/muzlife.off/" 
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram" 
                  className="group p-3 bg-gray-800/50 rounded-full hover:bg-pink-600/20 border border-gray-700 hover:border-pink-500/50 transition-all duration-300"
                >
                  <svg className="h-5 w-5 text-gray-400 group-hover:text-pink-400 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
                <a 
                  href="https://x.com/muzlife_off" 
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter/X" 
                  className="group p-3 bg-gray-800/50 rounded-full hover:bg-gray-600/20 border border-gray-700 hover:border-gray-500/50 transition-all duration-300"
                >
                  <svg className="h-5 w-5 text-gray-400 group-hover:text-gray-300 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M13.6823 10.6218L20.2391 3H18.6854L12.9921 9.61788L8.44486 3H3.2002L10.0765 13.0074L3.2002 21H4.75404L10.7663 14.0113L15.5685 21H20.8131L13.6819 10.6218H13.6823ZM11.5541 13.0956L10.8574 12.0991L5.31391 4.16971H7.70053L12.1742 10.5689L12.8709 11.5655L18.6861 19.8835H16.2995L11.5541 13.096V13.0956Z" />
                  </svg>
                </a>
                <a 
                  href="#" 
                  aria-label="TikTok" 
                  className="group p-3 bg-gray-800/50 rounded-full hover:bg-red-600/20 border border-gray-700 hover:border-red-500/50 transition-all duration-300"
                >
                  <svg className="h-5 w-5 text-gray-400 group-hover:text-red-400 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Newsletter - style harmonisé */}
            <div>
              <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-green-400">Newsletter</h3>
              <p className="text-gray-300 text-sm sm:text-sm mb-2 sm:mb-4 leading-relaxed">
                Restez informé de nos dernières actualités, nouveautés et conseils spirituels.
              </p>
              <NewsletterForm variant="footer" />
            </div>
          </div>
          
          {/* Footer bottom - style similaire au Navbar, responsive */}
          <div className="border-t border-gray-700/50 mt-8 sm:mt-12 pt-6 sm:pt-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
              <div className="flex items-center space-x-2">
                <p className="text-gray-400 text-xs sm:text-sm">
                  © {currentYear} <span className="text-[var(--color-accent)] font-medium">MuzLife</span>. 
                  Tous droits réservés.
                </p>
              </div>

              <div className="flex flex-wrap gap-3 sm:gap-6 text-xs sm:text-sm">
                <Link 
                  href="/mentions-legales" 
                  className="text-gray-400 hover:text-green-400 transition-colors"
                >
                  Mentions légales
                </Link>
                <Link 
                  href="/politique-confidentialite" 
                  className="text-gray-400 hover:text-green-400 transition-colors"
                >
                  Confidentialité
                </Link>
                <Link 
                  href="/politique-cookies" 
                  className="text-gray-400 hover:text-green-400 transition-colors"
                >
                  Cookies
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 
