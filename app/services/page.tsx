import { pageMetadata } from "@/lib/utils/metadata";
import { fetchMultipleBlockContents } from "@/app/api/strapi/fetchers/block-content";
import { fetchMultipleAccordions } from "@/app/api/strapi/fetchers/accordion";
import { fetchMultiplePricingCards } from "@/app/api/strapi/fetchers/pricing-card";
import AnimalCommunicationClient from "@/src/pageComponents/AnimalCommunicationClient";

export const metadata = pageMetadata.animalCommunication;
export const revalidate = 7200;

export default async function AnimalCommunicationServer() {
  // Pricing formulas — create these 4 entries in Strapi "Pricing Card" collection
  const pricingCardSlugs = [
    "com-animale-formule-clarte",
    "com-animale-formule-equilibre",
    "com-animale-formule-harmonie",
    "com-animale-formule-reconnexion",
  ];

  // "Dans quelles situations" + 1–2 explanatory blocks
  // Re-uses existing block-content collection — no new CT needed
  const infoBlockSlugs = [
    "com-animale-situations", // NEW — use-case block (title + bullets)
    "com-animale-qu-est-ce-que-c-est", // existing — kept for context
    "com-animale-a-quoi-ca-sert", // existing — kept as 2nd info block
  ];

  const accordionSlugs = [
    "com-animale-limites",
    "com-animale-type-de-seance-et-tarifs",
  ];

  const [pricingCards, blockContents, accordions] = await Promise.all([
    fetchMultiplePricingCards(pricingCardSlugs),
    fetchMultipleBlockContents(infoBlockSlugs),
    fetchMultipleAccordions(accordionSlugs),
  ]);

  const useCasesBlock =
    blockContents.find((b) => b.slug === "com-animale-situations") ?? null;

  const infoBlocks = blockContents.filter((b) =>
    ["com-animale-qu-est-ce-que-c-est", "com-animale-a-quoi-ca-sert"].includes(
      b.slug ?? "",
    ),
  );

  return (
    <AnimalCommunicationClient
      pricingCards={pricingCards}
      useCasesBlock={useCasesBlock}
      infoBlocks={infoBlocks}
      accordions={accordions}
    />
  );
}
