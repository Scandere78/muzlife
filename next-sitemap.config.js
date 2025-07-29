/** @type {import('next-sitemap').IConfig} */

module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_CANONICAL_URL || process.env.NEXT_PUBLIC_BASE_URL || 'https://muzlife.fr',
  generateRobotsTxt: true,
  generateIndexSitemap: true,
  exclude: [
    '/api/*', 
    '/404', 
    '/500',
    '/admin/*', 
    '/admin', 
    '/_next/*',
    '/private/*',
    '/uploads/temp/*',
    '*.json',
    '/dashboard/*',
    '/profile'
  ],
  changefreq: 'weekly',
  priority: 0.7, // Priorité par défaut pour toutes les pages
  transform: async (config, path) => {
    const defaultConfig = {
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    }

    if (path === '/') {
      return {
        ...defaultConfig,
        priority: 1.0,
        changefreq: 'weekly',
      }
    }

    if (path === '/lecture') {
      return {
        ...defaultConfig,
        priority: 0.9,
        changefreq: 'weekly',
      }
    }

    if (path === '/ecoute') {
      return {
        ...defaultConfig,
        priority: 0.9,
        changefreq: 'weekly',
      }
    }

    if (path === '/quizz') {
      return {
        ...defaultConfig,
        priority: 0.8,
        changefreq: 'weekly',
      }
    }

    if (path === '/horaires') {
      return {
        ...defaultConfig,
        priority: 0.8,
        changefreq: 'daily',
      }
    }

    if (path === '/about') {
      return {
        ...defaultConfig,
        priority: 0.7,
        changefreq: 'monthly',
      }
    }

    // Pages de sourates dynamiques
    if (path.startsWith('/lecture/')) {
      return {
        ...defaultConfig,
        priority: 0.6,
        changefreq: 'monthly',
      }
    }

    // Pages de récitateurs
    if (path.startsWith('/ecoute/')) {
      return {
        ...defaultConfig,
        priority: 0.6,
        changefreq: 'monthly',
      }
    }

    return defaultConfig
  },
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api', '/_next', '/dashboard', '/profile'],
      },
    ],
  },
  additionalPaths: async (config) => {
    const paths = [];

    try {
      // Import Prisma client dynamiquement
      const { PrismaClient } = require('@prisma/client');
      const prisma = new PrismaClient();

      // Pages de lecture (sourates) - si elles existent dans la DB
      try {
        const sourates = await prisma.sourate.findMany({
          where: { estActif: true },
          select: { 
            slug: true, 
            dateModification: true,
            nom: true
          }
        });

        const souratePaths = sourates.map(sourate => ({
          loc: `/lecture/${sourate.slug}`,
          changefreq: 'monthly',
          priority: 0.6,
          lastmod: new Date(sourate.dateModification).toISOString(),
        }));
        paths.push(...souratePaths);
      } catch (error) {
        console.log('Pas de table sourate dans la DB, utilisation des slugs statiques');
      }

      // Pages de récitateurs - si elles existent dans la DB
      try {
        const recitateurs = await prisma.recitateur.findMany({
          where: { estActif: true },
          select: { 
            slug: true, 
            dateModification: true,
            nom: true
          }
        });

        const recitateurPaths = recitateurs.map(recitateur => ({
          loc: `/ecoute/${recitateur.slug}`,
          changefreq: 'monthly',
          priority: 0.6,
          lastmod: new Date(recitateur.dateModification).toISOString(),
        }));
        paths.push(...recitateurPaths);
      } catch (error) {
        console.log('Pas de table recitateur dans la DB');
      }

      // Pages de quiz - si elles existent dans la DB
      try {
        const quizCategories = await prisma.quizCategorie.findMany({
          where: { estActif: true },
          select: { 
            slug: true, 
            dateModification: true,
            nom: true
          }
        });

        const quizPaths = quizCategories.map(categorie => ({
          loc: `/quizz/${categorie.slug}`,
          changefreq: 'monthly',
          priority: 0.6,
          lastmod: new Date(categorie.dateModification).toISOString(),
        }));
        paths.push(...quizPaths);
      } catch (error) {
        console.log('Pas de table quizCategorie dans la DB');
      }

      // Pages d'horaires de prière - si elles existent dans la DB
      try {
        const villes = await prisma.ville.findMany({
          where: { estActif: true },
          select: { 
            slug: true, 
            dateModification: true,
            nom: true
          }
        });

        const villePaths = villes.map(ville => ({
          loc: `/horaires/${ville.slug}`,
          changefreq: 'daily',
          priority: 0.7,
          lastmod: new Date(ville.dateModification).toISOString(),
        }));
        paths.push(...villePaths);
      } catch (error) {
        console.log('Pas de table ville dans la DB');
      }

      await prisma.$disconnect();

      console.log(`✅ Next-sitemap MuzLife: ${paths.length} pages additionnelles générées`);

    } catch (error) {
      console.error('❌ Erreur lors de la génération des pages dynamiques pour next-sitemap:', error);
    }

    return paths;
  },
}; 