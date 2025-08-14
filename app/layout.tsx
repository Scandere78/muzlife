import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Inter, Amiri } from "next/font/google";
import { AuthProvider } from "../contexts/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import '../styles/globals.css';
// import { Analytics } from "@vercel/analytics/react"; // Décommente si Analytics est installé

const inter = Inter({ subsets: ["latin"] });
const amiri = Amiri({ subsets: ["arabic", "latin"], weight: ["400", "700"], variable: "--font-amiri" });

export const metadata: Metadata = {
  title: "MuzLife",
  description: "Application moderne pour la communauté musulmane",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const theme = cookieStore.get("theme")?.value || "light";
  return (
    <html lang="fr" className={`${inter.className} ${amiri.variable} ${theme === 'dark' ? 'dark' : ''}`}>
      <body style={{ backgroundImage: 'url(/caligraphie.png)', color: 'var(--color-accent)' }} className="min-h-screen font-amiri">
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
