import type { NextConfig } from "next";

// Désactive ESLint lors du build pour éviter les blocages liés à la config ou aux plugins manquants
const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Configuration CORS pour permettre l'accès depuis l'app mobile
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*", // En développement, permet tous les domaines
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
