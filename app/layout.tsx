import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "../contexts/AuthContext";
import { Navbar } from "../components";
import "../styles/globals.css";
// import { Analytics } from "@vercel/analytics/react"; // Décommente si Analytics est installé

const inter = Inter({ subsets: ["latin"] });

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
    <html lang="fr" className={inter.className}>
      <body className="bg-gray-800 text-foreground min-h-screen">
        <AuthProvider>
          <Navbar />
          <main className="pt-16 md:pt-20">{children}</main>
          {/* <Analytics /> */}
        </AuthProvider>
      </body>
    </html>
  );
}
