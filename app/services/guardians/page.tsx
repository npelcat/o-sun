import { pageMetadata } from "@/lib/utils/metadata";
import { fetchMultipleBlockContents } from "@/app/api/strapi/fetchers/block-content";
import { fetchMultipleAccordions } from "@/app/api/strapi/fetchers/accordion";
import { fetchMultiplePricingCards } from "@/app/api/strapi/fetchers/pricing-card";
import GuardiansClient from "@/src/pageComponents/GuardiansClient";

export const metadata = pageMetadata.guardians;
export const revalidate = 7200;

export default async function GuardiansServer() {
  const pricingCardSlugs: string[] = [
    "soins-energetiques-formule-humain",
    "gardien-formule-accompagnement",
  ];

  const infoBlockSlugs = [
    "gardiens-situations", // use-case block
    "gardiens-quels-sont-ils",
    "gardiens-a-quoi-ca-sert",
  ];

  const accordionSlugs = [
    "en-pratique-premier-service",
    "en-pratique-deuxieme-service",
    "gardiens-en-pratique-modalites",
  ];

  const [pricingCards, blockContents, accordions] = await Promise.all([
    pricingCardSlugs.length > 0
      ? fetchMultiplePricingCards(pricingCardSlugs)
      : Promise.resolve([]),
    fetchMultipleBlockContents(infoBlockSlugs),
    fetchMultipleAccordions(accordionSlugs),
  ]);

  const useCasesBlock =
    blockContents.find((b) => b.slug === "gardiens-situations") ?? null;

  const infoBlocks = blockContents.filter((b) =>
    ["gardiens-quels-sont-ils", "gardiens-a-quoi-ca-sert"].includes(
      b.slug ?? "",
    ),
  );

  return (
    <GuardiansClient
      pricingCards={pricingCards}
      useCasesBlock={useCasesBlock}
      infoBlocks={infoBlocks}
      accordions={accordions}
    />
  );
}
