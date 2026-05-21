"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/src/components/Button";
import { Accordion } from "@/src/components/Accordion";
import { CardTitlePhoto } from "@/src/components/CardTitlePhoto";
import { PricingCard } from "@/src/components/PricingCard";
import { UrgencyBanner } from "@/src/components/UrgencyBanner";
import BlockRendererClient from "@/app/api/strapi/helpers/BlockRendererClient";
import { StrapiBlockContent } from "@/app/api/types/strapi";
import { StrapiPricingCard } from "@/app/api/strapi/fetchers/pricing-card";
import { TableOfContents } from "../components/TableOfContents";

interface EnergyCareClientProps {
  /** Pricing cards: Animal, Humain, Duo */
  pricingCards: StrapiPricingCard[];
  /** "Dans quelles situations" block */
  useCasesBlock: StrapiBlockContent | null;
  /** 1–2 explanatory blocks */
  infoBlocks: StrapiBlockContent[];
  /** Practical info accordions */
  accordions: StrapiBlockContent[];
}

export default function EnergyCareClient({
  pricingCards,
  useCasesBlock,
  infoBlocks,
  accordions,
}: EnergyCareClientProps) {
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("animate-in");
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
    );

    document
      .querySelectorAll(".scroll-animate")
      .forEach((el) => observerRef.current?.observe(el));

    return () => observerRef.current?.disconnect();
  }, [pricingCards, useCasesBlock, infoBlocks]);

  const practicalAccordions = accordions.filter((a) =>
    [
      "a-qui-s-adresse-mes-soins-energetiques",
      "soins-energetiques-une-seance-en-pratique",
      "soins-energetiques-type-de-seance-et-tarifs",
    ].includes(a.slug ?? ""),
  );

  return (
    <main className="min-h-screen">
      {/* ── Hero ── */}
      <section className="relative py-20 px-4 bg-gradient-to-b from-beige/40 to-transparent">
        <div className="max-w-3xl mx-auto text-center scroll-animate opacity-0 translate-y-8 transition-all duration-700 ease-out">
          <p className="text-sm uppercase tracking-widest text-dark-green/60 mb-3 font-semibold">
            Service
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-subtitle font-bold text-dark-green mb-6">
            Les soins énergétiques
          </h1>
          <p className="text-lg text-black/70 leading-relaxed max-w-xl mx-auto mb-8">
            Un accompagnement doux pour rééquilibrer les énergies, libérer les
            blocages et retrouver harmonie et vitalité — pour votre animal, pour
            vous, ou en duo.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button titleButton="Voir les formules" link="#formules" />
            <Button titleButton="En savoir plus" link="#a-propos" />
            <Button titleButton="Infos pratiques" link="#infos-pratiques" />
          </div>
        </div>
      </section>

      {/* ── Dans quelles situations ── */}
      {useCasesBlock && (
        <section className="py-16 px-4 scroll-animate opacity-0 translate-y-8 transition-all duration-700 ease-out">
          <div className="max-w-3xl mx-auto">
            <div className="bg-beige border border-dark-green/20 rounded-2xl p-8 shadow-sm">
              <div className="flex justify-center mb-4">
                <span className="text-3xl">🌿</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-subtitle font-bold text-dark-green mb-6 text-center">
                {useCasesBlock.title}
              </h2>
              <div className="h-px bg-dark-green/20 mb-6" />
              <div className="prose prose-sm md:prose-base max-w-none text-black/80 prose-li:marker:text-dark-green">
                <BlockRendererClient content={useCasesBlock.content} />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Formules ── */}
      <section
        id="formules"
        className="py-20 px-4 bg-gradient-to-b from-transparent via-green/20 to-transparent scroll-mt-24"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 scroll-animate opacity-0 translate-y-8 transition-all duration-700 ease-out">
            <h2 className="text-3xl md:text-4xl font-subtitle font-bold text-dark-green mb-3">
              Les formules
            </h2>
            <p className="text-black/60 max-w-xl mx-auto">
              Soin animal, soin humain, ou séance duo gardien & animal —
              choisissez l&apos;accompagnement qui vous correspond.
            </p>
          </div>

          {pricingCards.length > 0 && (
            <div
              className={`grid gap-6 ${
                pricingCards.length >= 3
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                  : "grid-cols-1 sm:grid-cols-2"
              }`}
            >
              {pricingCards.map((card, index) => (
                <div
                  key={card.slug}
                  className="scroll-animate opacity-0 translate-y-8 transition-all duration-700 ease-out"
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <PricingCard
                    title={card.title}
                    subtitle={card.subtitle}
                    price={card.price}
                    badge={card.badge}
                    description={card.description}
                    link={card.link}
                    highlight={card.slug === "soins-energetiques-formule-duo"}
                    titleButton="Réserver"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Urgency banner */}
          <div className="mt-12 max-w-2xl mx-auto scroll-animate opacity-0 translate-y-8 transition-all duration-700 ease-out">
            <UrgencyBanner
              urgencyText="Un soin énergétique peut être proposé rapidement en cas de choc émotionnel, accident, stress intense, hospitalisation, opération ou fin de vie. Contactez-moi directement pour en discuter."
              urgencyLink="mailto:o.sun.voixanimale@gmail.com"
              urgencyLinkLabel="Me contacter"
            />
          </div>
        </div>
      </section>

      {/* ── Blocs explicatifs ── */}
      {infoBlocks.length > 0 && (
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="mb-10 scroll-animate opacity-0 translate-y-8 transition-all duration-700 ease-out">
              <h2
                id="a-propos"
                className="text-2xl md:text-3xl font-subtitle font-bold text-dark-green mb-8 text-center scroll-mt-24"
              >
                En savoir plus
              </h2>
              <TableOfContents
                items={infoBlocks.map((block, i) => ({
                  id: `info-block-${i}`,
                  title: block.title,
                }))}
              />
            </div>

            <div
              className={`grid gap-8 ${
                infoBlocks.length >= 3
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                  : infoBlocks.length === 2
                    ? "grid-cols-1 sm:grid-cols-2"
                    : "grid-cols-1 max-w-3xl mx-auto"
              }`}
            >
              {infoBlocks.map((block, index) => (
                <div
                  id={`info-block-${index}`}
                  key={block.slug}
                  className="scroll-animate opacity-0 translate-y-8 transition-all duration-700 ease-out bg-beige/50 rounded-2xl p-8 shadow-sm scroll-mt-24 flex flex-col"
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <CardTitlePhoto
                    title={block.title}
                    image={block.picture?.url || ""}
                    alt={block.picture?.alternativeText || ""}
                  />
                  <div className="mt-4 prose prose-sm md:prose-base max-w-none text-black/80 flex-1">
                    <BlockRendererClient content={block.content} />
                  </div>
                  {index === 0 && (
                    <div className="mt-6">
                      <Button
                        titleButton="Ma façon de travailler et mon éthique"
                        link="/about/ethics"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Infos pratiques ── */}
      {practicalAccordions.length > 0 && (
        <section className="py-16 px-4 bg-gradient-to-b from-transparent to-green">
          <div className="max-w-3xl mx-auto scroll-animate opacity-0 translate-y-8 transition-all duration-700 ease-out">
            <h2
              id="infos-pratiques"
              className="text-2xl md:text-3xl font-subtitle font-bold text-dark-green mb-8 text-center"
            >
              Informations pratiques
            </h2>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-sm space-y-2">
              {practicalAccordions.map((accordion) => (
                <Accordion key={accordion.slug} title={accordion.title}>
                  <BlockRendererClient content={accordion.content} />
                </Accordion>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA final ── */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto text-center scroll-animate opacity-0 translate-y-8 transition-all duration-700 ease-out">
          <div className="bg-dark-green rounded-2xl p-8 shadow-lg text-white">
            <h3 className="text-2xl md:text-3xl font-subtitle font-bold mb-3">
              Prêt·e à recevoir un soin ?
            </h3>
            <p className="text-white/80 mb-6 leading-relaxed">
              Retrouvez harmonie, fluidité et apaisement — pour vous, votre
              animal, ou en duo.
            </p>
            <Button
              titleButton="Réserver un soin énergétique"
              link="/reservation"
              className="bg-white text-dark-green hover:bg-white/90"
            />
          </div>
        </div>
      </section>

      <style jsx global>{`
        .scroll-animate {
          transition-property: opacity, transform;
        }
        .scroll-animate.animate-in {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
      `}</style>
    </main>
  );
}
