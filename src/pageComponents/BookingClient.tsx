"use client";

import { useEffect, useRef } from "react";
import { ServiceCard } from "@/src/components/ServiceCard";
import { Accordion } from "@/src/components/Accordion";
import { Button } from "@/src/components/Button";
import { CardTitlePhoto } from "@/src/components/CardTitlePhoto";
import BlockRendererClient from "@/app/api/strapi/helpers/BlockRendererClient";
import {
  StrapiLinkComponent,
  StrapiBlockContent,
} from "@/app/api/types/strapi";

interface BookingClientProps {
  serviceCards: StrapiLinkComponent[];
  accordionBlocks: {
    fonctionnement: {
      blockContent: StrapiBlockContent | null;
      accordions: StrapiBlockContent[];
    };
    deroulement: {
      blockContent: StrapiBlockContent | null;
      accordions: StrapiBlockContent[];
    };
    casParticuliers: {
      blockContent: StrapiBlockContent | null;
      accordions: StrapiBlockContent[];
    };
    paiement: {
      blockContent: StrapiBlockContent | null;
      accordions: StrapiBlockContent[];
    };
  };
}

export default function BookingClient({
  serviceCards,
  accordionBlocks,
}: BookingClientProps) {
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      },
    );

    const elements = document.querySelectorAll(".scroll-animate");
    elements.forEach((el) => observerRef.current?.observe(el));

    return () => {
      observerRef.current?.disconnect();
    };
  }, [serviceCards]);

  // Map des icônes pour chaque service
  const serviceIcons: { [key: string]: string } = {
    "reservation-communication-animale": "💌",
    "reservation-soins-energetiques": "✨",
    "reservation-appel-decouverte": "📞",
    "reservation-urgence": "🚨",
  };

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-b from-beige/30 to-transparent">
        <div className="max-w-4xl mx-auto text-center scroll-animate opacity-0 translate-y-8 transition-all duration-700 ease-out">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-subtitle font-bold text-dark-green mb-6">
            Réservez votre séance
          </h1>
          <p className="text-lg md:text-xl text-black leading-relaxed max-w-2xl mx-auto">
            Choisissez l&apos;accompagnement qui résonne avec vos besoins.
            Chaque rencontre est unique et respecte le rythme sacré du vivant.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {serviceCards.map((service, index) => (
              <div
                key={service.slug}
                className="scroll-animate opacity-0 translate-y-8 transition-all duration-700 ease-out"
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <ServiceCard
                  title={service.title}
                  description={
                    <BlockRendererClient content={service.description} />
                  }
                  image={service.picture?.url || ""}
                  alt={service.picture?.alternativeText || service.title}
                  link={service.link}
                  titleButton="Réserver"
                  icon={serviceIcons[service.slug || ""] || ""}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-transparent via-green/30 to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 scroll-animate opacity-0 translate-y-8 transition-all duration-700 ease-out">
            <h2 className="text-3xl md:text-4xl font-subtitle font-bold text-dark-green mb-4">
              Informations pratiques
            </h2>
            <p className="text-lg text-dark-green">
              Tout ce que vous devez savoir avant de réserver
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Section Fonctionnement */}
            {accordionBlocks.fonctionnement.blockContent && (
              <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-lg scroll-animate opacity-0 translate-y-8 transition-all duration-700 ease-out">
                <CardTitlePhoto
                  title={accordionBlocks.fonctionnement.blockContent.title}
                  image={
                    accordionBlocks.fonctionnement.blockContent.picture?.url ||
                    ""
                  }
                  alt={
                    accordionBlocks.fonctionnement.blockContent.picture
                      ?.alternativeText || ""
                  }
                />
                <div className="mt-4">
                  {accordionBlocks.fonctionnement.accordions.map(
                    (accordion) => (
                      <Accordion key={accordion.slug} title={accordion.title}>
                        <BlockRendererClient content={accordion.content} />
                      </Accordion>
                    ),
                  )}
                </div>
              </div>
            )}

            {/* Section Déroulement */}
            {accordionBlocks.deroulement.blockContent && (
              <div
                className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-lg scroll-animate opacity-0 translate-y-8 transition-all duration-700 ease-out"
                style={{ transitionDelay: "100ms" }}
              >
                <CardTitlePhoto
                  title={accordionBlocks.deroulement.blockContent.title}
                  image={
                    accordionBlocks.deroulement.blockContent.picture?.url || ""
                  }
                  alt={
                    accordionBlocks.deroulement.blockContent.picture
                      ?.alternativeText || ""
                  }
                />
                <div className="mt-4">
                  {accordionBlocks.deroulement.accordions.map((accordion) => (
                    <Accordion key={accordion.slug} title={accordion.title}>
                      <BlockRendererClient content={accordion.content} />
                    </Accordion>
                  ))}
                </div>
              </div>
            )}

            {/* Section Cas Particuliers */}
            {accordionBlocks.casParticuliers.blockContent && (
              <div
                className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-lg scroll-animate opacity-0 translate-y-8 transition-all duration-700 ease-out"
                style={{ transitionDelay: "200ms" }}
              >
                <CardTitlePhoto
                  title={accordionBlocks.casParticuliers.blockContent.title}
                  image={
                    accordionBlocks.casParticuliers.blockContent.picture?.url ||
                    ""
                  }
                  alt={
                    accordionBlocks.casParticuliers.blockContent.picture
                      ?.alternativeText || ""
                  }
                />
                <div className="mt-4">
                  {accordionBlocks.casParticuliers.accordions.map(
                    (accordion) => (
                      <Accordion key={accordion.slug} title={accordion.title}>
                        <BlockRendererClient content={accordion.content} />
                      </Accordion>
                    ),
                  )}
                </div>
              </div>
            )}

            {/* Section Paiement */}
            {accordionBlocks.paiement.blockContent && (
              <div
                className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-lg scroll-animate opacity-0 translate-y-8 transition-all duration-700 ease-out"
                style={{ transitionDelay: "300ms" }}
              >
                <CardTitlePhoto
                  title={accordionBlocks.paiement.blockContent.title}
                  image={
                    accordionBlocks.paiement.blockContent.picture?.url || ""
                  }
                  alt={
                    accordionBlocks.paiement.blockContent.picture
                      ?.alternativeText || ""
                  }
                />
                <div className="mt-4">
                  {accordionBlocks.paiement.accordions.map((accordion) => (
                    <Accordion key={accordion.slug} title={accordion.title}>
                      <BlockRendererClient content={accordion.content} />
                    </Accordion>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto text-center scroll-animate opacity-0 translate-y-8 transition-all duration-700 ease-out">
          <div className="bg-beige/50 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl md:text-3xl font-subtitle font-bold text-dark-green mb-4">
              Une question ?
            </h3>
            <p className="text-black mb-6">
              N&apos;hésitez pas à me contacter pour toute demande
              d&apos;information
            </p>
            <Button
              titleButton="Me contacter"
              link="/contact"
              className="inline-block"
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
