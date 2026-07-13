"use client";

import ServicePageClient from "@/src/pageComponents/ServicePageClient";
import { StrapiBlockContent } from "@/app/api/types/strapi";
import { StrapiPricingCard } from "@/app/api/strapi/fetchers/pricing-card";
import { ServicePageConfig } from "../types/service-page";

interface GuardiansClientProps {
  pricingCards: StrapiPricingCard[];
  useCasesBlock: StrapiBlockContent | null;
  infoBlocks: StrapiBlockContent[];
  accordions: StrapiBlockContent[];
}

const config: ServicePageConfig = {
  hero: {
    label: "Service",
    title: "Services aux gardiens",
    description:
      "Prenez soin de vous avec un accompagnement personnalisé — bien-être personnel, lien avec votre animal, ou tout simplement une pause, un temps pour soi.",
  },
  pricingSubtitle:
    "Des accompagnements pensés pour vous, en lien avec votre animal ou pour votre propre chemin.",
  cta: {
    title: "Un accompagnement respectueux, à l'écoute de vos besoins",
    description: "avec bienveillance et sans jugement.",
    buttonLabel: "Réserver un service gardien",
    buttonLink: "/contact/booking",
  },
};

export default function GuardiansClient({
  pricingCards,
  useCasesBlock,
  infoBlocks,
  accordions,
}: GuardiansClientProps) {
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
