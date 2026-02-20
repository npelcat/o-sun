// src/components/HomeQuoteBanner.tsx
"use client";
import Image from "next/image";
import Link from "next/link";
import { Instagram, Sparkles, Calendar } from "lucide-react";
import BlockRendererClient from "@/app/api/strapi/helpers/BlockRendererClient";
import { StrapiBlockContent } from "@/app/api/types/strapi";

interface HomeQuoteBannerProps {
  quoteBlock: StrapiBlockContent | null;
  instagramUrl?: string;
  instagramHandle?: string;
}

export function HomeQuoteBanner({
  quoteBlock,
  instagramUrl = "https://instagram.com/votre_compte",
  instagramHandle = "@votre_compte",
}: HomeQuoteBannerProps) {
  return (
    <section className="mt-16 space-y-8">
      {/* Section Citation */}
      {quoteBlock && (
        <div className="bg-dark-green/50 overflow-hidden">
          <div className="max-w-6xl mx-auto p-8 flex flex-col md:flex-row md:items-center md:gap-8 lg:gap-12">
            <div className="flex-1 text-xl leading-relaxed text-center md:text-left mb-6 md:mb-0">
              <BlockRendererClient content={quoteBlock.content} />
            </div>
            {quoteBlock.picture && (
              <Image
                className="flex-shrink-0 w-full max-w-sm md:w-80 lg:w-96 h-48 md:h-56 lg:h-64 rounded-lg object-cover shadow-lg mx-auto md:mx-0"
                src={quoteBlock.picture.url}
                width={600}
                height={400}
                alt={quoteBlock.picture.alternativeText || "Citation"}
                loading="lazy"
              />
            )}
          </div>
        </div>
      )}

      {/* Card Instagram avec les couleurs du thème */}
      <div className="max-w-4xl mx-auto px-4 -mt-4">
        <div className="bg-white/90 backdrop-blur-sm border-2 border-beige rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
          <div className="p-8 lg:p-10">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Icône Instagram + info */}
              <div className="flex-shrink-0 text-center md:text-left">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-dark-green to-green shadow-lg mb-4 ring-4 ring-green/30">
                  <Instagram className="w-12 h-12 text-white" />
                </div>
                <p className="text-lg font-bold text-black">
                  {instagramHandle}
                </p>
              </div>

              {/* Contenu */}
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl lg:text-3xl font-subtitle font-bold text-black mb-3">
                  Suivez mon parcours de communicante animale
                </h3>
                <p className="text-black/70 mb-6">
                  Découvrez les coulisses, mes réflexions et mes actualités :
                  nouveaux services, événements et moments forts partagés avec
                  vos animaux.
                </p>
                <div className="flex items-center justify-center md:justify-start gap-6 text-sm text-black/60 mb-6">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-dark-green" />
                    <span>Conseils & partages</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-dark-green" />
                    <span>Actualités & événements</span>
                  </div>
                </div>
                <Link
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-dark-green to-green text-white rounded-full font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  <Instagram className="w-5 h-5" />
                  <span>Suivre maintenant</span>
                  <svg
                    className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
