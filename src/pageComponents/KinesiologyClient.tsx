"use client";

import ServicePageClient from "@/src/pageComponents/ServicePageClient";
import { StrapiBlockContent } from "@/app/api/types/strapi";
import { StrapiPricingCard } from "@/app/api/strapi/fetchers/pricing-card";
import { ServicePageConfig } from "../types/service-page";

interface KinesiologyClientProps {
  pricingCards: StrapiPricingCard[];
  useCasesBlock: StrapiBlockContent | null;
  infoBlocks: StrapiBlockContent[];
  accordions: StrapiBlockContent[];
}

const config: ServicePageConfig = {
  hero: {
    label: "Service",
    title: "La kinésiologie animale",
    description:
      "Une approche douce et non invasive pour identifier les tensions physiques, émotionnelles ou comportementales de votre animal, et l'accompagner vers un mieux-être global.",
  },
  pricingSubtitle:
    "Une séance pensée pour révéler et libérer les blocages de votre animal, à son rythme.",
  cta: {
    title: "Prêt.e à accompagner votre animal vers l'équilibre ?",
    description:
      "Chaque séance respecte le rythme et la sensibilité de votre animal.",
    buttonLabel: "Réserver une séance de kinésiologie",
    buttonLink: "/contact/booking",
  },
};

export default function KinesiologyClient({
  pricingCards,
  useCasesBlock,
  infoBlocks,
  accordions,
}: KinesiologyClientProps) {
  return (
    <ServicePageClient
      config={config}
      pricingCards={pricingCards}
      useCasesBlock={useCasesBlock}
      infoBlocks={infoBlocks}
      accordions={accordions}
    />
  );
}
