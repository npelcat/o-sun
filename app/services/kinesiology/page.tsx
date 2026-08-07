import { fetchMultipleBlockContents } from "@/app/api/strapi/fetchers/block-content";
import { fetchMultipleAccordions } from "@/app/api/strapi/fetchers/accordion";
import { fetchMultiplePricingCards } from "@/app/api/strapi/fetchers/pricing-card";
import KinesiologyClient from "@/src/pageComponents/KinesiologyClient";

// TODO: ajouter la metadata SEO une fois les infos disponibles
// export const metadata = pageMetadata.animalKinesiology;
export const revalidate = 7200;

export default async function KinesiologyServer() {
  const pricingCardSlugs = ["kinesiologie-formule1"];

  const infoBlockSlugs = [
    "kinesiologie-situations",
    "kinesiologie-cest-quoi",
    "kinesiologie-bienfaits",
  ];

  const accordionSlugs = [
    "kinesiologie-apres-une-seance",
    "kinesiologie-en-pratique",
  ];

  const [pricingCards, blockContents, accordions] = await Promise.all([
    fetchMultiplePricingCards(pricingCardSlugs),
    fetchMultipleBlockContents(infoBlockSlugs),
    fetchMultipleAccordions(accordionSlugs),
  ]);

  const useCasesBlock =
    blockContents.find((b) => b.slug === "kinesiologie-situations") ?? null;

  const infoBlocks = blockContents.filter((b) =>
    ["kinesiologie-cest-quoi", "kinesiologie-bienfaits"].includes(b.slug ?? ""),
  );

  return (
    <KinesiologyClient
      pricingCards={pricingCards}
      useCasesBlock={useCasesBlock}
      infoBlocks={infoBlocks}
      accordions={accordions}
    />
  );
}
