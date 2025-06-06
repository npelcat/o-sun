import "../src/styles/globals.css";
import { Header } from "../src/components/Header";
import { Footer } from "../src/components/Footer";
import ClientLayout from "./ClientLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "O'Sun ~ Voix Animale ~ Communication animale, Soins énergétiques",
  description:
    "Communication animale, soins énergétiques, guidances. Basée dans le sud du 77 (Nangis, Fontainebleau, Melun, Montereau-Fault-Yonne), j'interviens sur la France entière et pays francophones à distance.",
  icons: {
    icon: "/o-sun-logo02.ico",
  },
  keywords: [
    "communication animale",
    "soins énergétiques",
    "guidance animale",
    "tirage de cartes",
    "77 Seine-et-Marne",
    "Nangis",
    "Fontainebleau",
    "Melun",
    "Montereau-Fault-Yonne",
    "France",
  ],
  authors: [{ name: "O'Sun - Voix Animale" }],
  openGraph: {
    title: "O'Sun ~ Voix Animale",
    description:
      "Communication animale et soins énergétiques à distance ou en présentiel dans le sud de la Seine-et-Marne (77).",
    url: "https://www.osun-voixanimale.com/",
    locale: "fr_FR",
    siteName: "O'Sun ~ Voix Animale",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="bg-white text-black font-text">
        <Header />
        <ClientLayout>{children}</ClientLayout>
        <Footer />
      </body>
    </html>
  );
}
