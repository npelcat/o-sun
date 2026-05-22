"use client";

import ServicePageClient from "@/src/pageComponents/ServicePageClient";
import { StrapiBlockContent } from "@/app/api/types/strapi";
import { StrapiPricingCard } from "@/app/api/strapi/fetchers/pricing-card";
import { ServicePageConfig } from "../types/service-page";

interface AnimalCommunicationClientProps {
  pricingCards: StrapiPricingCard[];
  useCasesBlock: StrapiBlockContent | null;
  infoBlocks: StrapiBlockContent[];
  accordions: StrapiBlockContent[];
}

const config: ServicePageConfig = {
  hero: {
    label: "Service",
    title: "La communication animale",
    description:
      "Entrez en lien profond avec votre animal — comprenez ses ressentis, ses besoins, ses messages du coeur.",
  },
  highlightSlug: "com-animale-formule-harmonie",
  pricingSubtitle:
    "Choisissez la formule qui correspond à vos besoins et à ceux de votre animal.",
  urgency: {
    text: "Besoin d'une communication rapidement ? Les demandes urgentes (choc émotionnel, fin de vie, évènement imminent...) sont traitées en priorité. Contactez-moi directement ou via le formulaire dedié.",
    link: "https://form.jotform.com/232924829211052",
    linkLabel: "Formulaire urgence",
    followUpText:
      "Suivi en communication animale disponible à tarif préferentiel sur 6 mois suite à une première communication.",
    followUpLink: "/reservation",
    followUpLinkLabel: "En savoir plus",
  },
  cta: {
    title: "Prêt.e à vous connecter ?",
    description:
      "Chaque communication est unique et respecte le rythme et les besoins de votre animal.",
    buttonLabel: "Réserver une communication animale",
    buttonLink: "/reservation",
  },
};

export default function AnimalCommunicationClient({
  pricingCards,
  useCasesBlock,
  infoBlocks,
  accordions,
}: AnimalCommunicationClientProps) {
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
