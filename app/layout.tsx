"use client";

import React from "react";
import "../src/styles/globals.css"; // Importez vos styles globaux ici
import { Header } from "../src/components/Header";
import { Footer } from "../src/components/Footer";
import ClientLayout from "./ClientLayout";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="fr">
      <head>
        <link rel="icon" href="/o-sun-logo02.ico" />
        <title>
          0&apos;Sun ~ Voix Animale ~ Communication animale, Soins énergétiques,
          services aux gardiens.
        </title>
        <meta
          name="description"
          content="Communication animale, soins énergétiques, services aux gardiens : guidances, tirage de cartes. Basée dans le sud du 77 (Nangis, Fontainebleau, Melun, Montereau-Fault-Yonne), j'interviens sur la France entière et pays francophones à distance."
        />
      </head>
      <body className="bg-white text-black font-text">
        <Header />
        <ClientLayout>{children}</ClientLayout>
        <Footer />
      </body>
    </html>
  );
};

export default RootLayout;
