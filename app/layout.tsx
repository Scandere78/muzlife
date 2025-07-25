import type { Metadata } from "next";
import { Inter, Amiri } from "next/font/google";
import { AuthProvider } from "../contexts/AuthContext";
import { Navbar } from "../components";
import Footer from "../components/Footer";
import '../styles/globals.css';
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
    <html lang="fr" className={`${inter.className} ${amiri.variable}`}>
      <body style={{ background: 'var(--color-background)', color: 'var(--color-accent)' }} className="min-h-screen font-amiri">
        <AuthProvider>
          <Navbar />
          <main className="pt-16 md:pt-20">{children}</main>
      <Footer />
          {/* <Analytics /> */}
        </AuthProvider>
      </body>
    </html>
  );
}
