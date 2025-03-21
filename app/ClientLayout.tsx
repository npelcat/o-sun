"use client";

import { SpeedInsights } from "@vercel/speed-insights/next";
import "../src/styles/globals.css";
import "../src/styles/globals.css";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <SpeedInsights />
    </>
  );
}
