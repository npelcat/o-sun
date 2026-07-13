"use client";

import ServicePageClient from "@/src/pageComponents/ServicePageClient";
import { StrapiBlockContent } from "@/app/api/types/strapi";
import { StrapiPricingCard } from "@/app/api/strapi/fetchers/pricing-card";
import { ServicePageConfig } from "../types/service-page";
import { EnergyBenefits } from "../components/EnergyBenefits";

interface EnergyCareClientProps {
  pricingCards: StrapiPricingCard[];
  useCasesBlock: StrapiBlockContent | null;
  infoBlocks: StrapiBlockContent[];
  accordions: StrapiBlockContent[];
}

const config: ServicePageConfig = {
  hero: {
    label: "Service",
    title: "Les soins énergetiques",
    description:
      "Un accompagnement doux pour réequilibrer les énergies, libérer les blocages et retrouver harmonie et vitalité — pour votre animal, pour vous, ou en duo.",
  },
  highlightSlug: "soins-energetiques-formule-duo",
  pricingSubtitle:
    "Soin animal ou séance duo gardien & animal — choisissez l'accompagnement qui vous correspond.",
  urgency: {
    text: "Un soin énergetique peut-être proposé rapidement en cas de choc émotionnel, accident, stress intense, hospitalisation, opération ou fin de vie. Contactez-moi directement pour en discuter.",
    link: "/contact",
    linkLabel: "Me contacter",
    conditions: [
      "Offre initiale majorée de 10€ pour traitement prioritaire de la demande.",
      "Un soin énergétique ne remplace pas un quelconque avis médical, il agit en complément, dans une démarche globale de bien-être.",
    ],
  },
  cta: {
    title: "Prêt.e a recevoir un soin ?",
    description:
      "Retrouvez harmonie, fluidité et apaisement — pour votre animal, ou en duo.",
    buttonLabel: "Réserver un soin énergetique",
    buttonLink: "/contact/booking",
  },
};

export default function EnergyCareClient({
  pricingCards,
  useCasesBlock,
  infoBlocks,
  accordions,
}: EnergyCareClientProps) {
  return (
    <ServicePageClient
      config={config}
      beforePricing={<EnergyBenefits />}
      pricingCards={pricingCards}
      useCasesBlock={useCasesBlock}
      infoBlocks={infoBlocks}
      accordions={accordions}
    />
  );
}
