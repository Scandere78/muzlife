import type { NextConfig } from "next";

// Désactive ESLint lors du build pour éviter les blocages liés à la config ou aux plugins manquants
const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  /* autres options de config ici */
};

export default nextConfig;
