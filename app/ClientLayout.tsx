"use client";

import "../src/styles/globals.css"; // Importe les styles globaux

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
