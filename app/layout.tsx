import type { Metadata } from "next";
import { Inter, Amiri } from "next/font/google";
import { AuthProvider } from "../contexts/AuthContext";
import '../styles/globals.css';
import { LocationProvider } from "@/contexts/LocationContext";
import { ThemeProvider } from "@/components/theme-provider";
import { GoogleAnalytics } from '@next/third-parties/google';
import { ConditionalLayout } from "../components/ConditionalLayout";
import { Toaster } from "@/components/ui/sonner";
// import { Analytics } from "@vercel/analytics/react"; // Décommente si Analytics est installé

const inter = Inter({ subsets: ["latin"] });
const amiri = Amiri({ subsets: ["arabic", "latin"], weight: ["400", "700"], variable: "--font-amiri" });

export const metadata: Metadata = {
  title: "MuzLife",
  description: "Application moderne pour la communauté musulmane",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.className} ${amiri.variable}`} suppressHydrationWarning>
      <body style={{ backgroundImage: 'url(/caligraphie.png)', color: 'var(--color-accent)' }} className="min-h-screen font-amiri">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <LocationProvider>
              <ConditionalLayout>{children}</ConditionalLayout>
            </LocationProvider>
            {/* <Analytics /> */}
          </AuthProvider>
          <Toaster richColors position="top-right" />
        </ThemeProvider>
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID!} />
      </body>
    </html>
  );
}


