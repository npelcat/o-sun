import { pageMetadata } from "@/lib/utils/metadata";
import { fetchMultipleBlockContents } from "@/app/api/strapi/fetchers/block-content";
import { fetchMultipleAccordions } from "@/app/api/strapi/fetchers/accordion";
import { fetchMultiplePricingCards } from "@/app/api/strapi/fetchers/pricing-card";
import AnimalCommunicationClient from "@/src/pageComponents/AnimalCommunicationClient";

export const metadata = pageMetadata.animalCommunication;
export const revalidate = 7200;

export default async function AnimalCommunicationServer() {
  const pricingCardSlugs = [
    "com-animale-formule-clarte",
    "com-animale-formule-equilibre",
    "com-animale-formule-harmonie",
    "com-animale-formule-reconnexion",
  ];

  const infoBlockSlugs = [
    "com-animale-situations",
    "com-animale-qu-est-ce-que-c-est",
    "com-animale-les-bienfaits",
  ];

  const accordionSlugs = [
    "com-animale-limites",
    "com-animale-en-pratique-modalites",
  ];

  const [pricingCards, blockContents, accordions] = await Promise.all([
    fetchMultiplePricingCards(pricingCardSlugs),
    fetchMultipleBlockContents(infoBlockSlugs),
    fetchMultipleAccordions(accordionSlugs),
  ]);

  const useCasesBlock =
    blockContents.find((b) => b.slug === "com-animale-situations") ?? null;

  const infoBlocks = blockContents.filter((b) =>
    ["com-animale-qu-est-ce-que-c-est", "com-animale-les-bienfaits"].includes(
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
