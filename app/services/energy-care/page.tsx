import { pageMetadata } from "@/lib/utils/metadata";
import { fetchMultipleBlockContents } from "@/app/api/strapi/fetchers/block-content";
import { fetchMultipleAccordions } from "@/app/api/strapi/fetchers/accordion";
import { fetchMultiplePricingCards } from "@/app/api/strapi/fetchers/pricing-card";
import EnergyCareClient from "@/src/pageComponents/EnergyCareClient";

export const metadata = pageMetadata.energyCare;
export const revalidate = 7200;

export default async function EnergyCareServer() {
  const pricingCardSlugs = [
    "soins-energetiques-formule-animal",
    "soins-energetiques-formule-humain",
    "soins-energetiques-formule-duo",
  ];

  const infoBlockSlugs = [
    "soins-energetiques-situations", // use-case block
    "soins-energetiques-qu-est-ce-que-c-est",
    "quels-sont-les-effets-d-une-seance-energetique",
  ];

  const accordionSlugs = [
    "a-qui-s-adresse-mes-soins-energetiques",
    "soins-energetiques-une-seance-en-pratique",
    "soins-energetiques-type-de-seance-et-tarifs",
  ];

  const [pricingCards, blockContents, accordions] = await Promise.all([
    fetchMultiplePricingCards(pricingCardSlugs),
    fetchMultipleBlockContents(infoBlockSlugs),
    fetchMultipleAccordions(accordionSlugs),
  ]);

  const useCasesBlock =
    blockContents.find((b) => b.slug === "soins-energetiques-situations") ??
    null;

  const infoBlocks = blockContents.filter((b) =>
    [
      "soins-energetiques-qu-est-ce-que-c-est",
      "quels-sont-les-effets-d-une-seance-energetique",
    ].includes(b.slug ?? ""),
  );

  return (
    <EnergyCareClient
      pricingCards={pricingCards}
      useCasesBlock={useCasesBlock}
      infoBlocks={infoBlocks}
      accordions={accordions}
    />
  );
}
