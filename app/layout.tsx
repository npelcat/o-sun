import "../src/styles/globals.css";
import { Great_Vibes, Arsenal_SC, Montserrat } from "next/font/google";
import { Header } from "../src/components/Header";
import { Footer } from "../src/components/Footer";
import ClientLayout from "./ClientLayout";
import type { Metadata } from "next";
import Providers from "./providers";

const greatVibes = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-title",
  display: "swap",
});

const arsenalSC = Arsenal_SC({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-subtitle",
  display: "swap",
});

const montserrat = Montserrat({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-text",
  display: "swap",
});

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
    <html
      lang="fr"
      className={`${greatVibes.variable} ${arsenalSC.variable} ${montserrat.variable}`}
    >
      <body className="bg-white text-black font-text">
        <Providers>
          <Header />
          <ClientLayout>{children}</ClientLayout>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
