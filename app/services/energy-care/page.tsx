import { pageMetadata } from "@/app/lib/metadata";
import { fetchBlockContentById } from "@/app/api/strapi/fetchers/block-content";
import { fetchMultipleAccordions } from "@/app/api/strapi/fetchers/accordion";
import EnergyCareClient from "@/src/pageComponents/EnergyCareClient";
import { StrapiBlockContent } from "@/app/api/types/strapi";

export const metadata = pageMetadata.energyCare;
export const revalidate = 7200;

export default async function EnergyCareServer() {
  const blockIds = [
    "etf6ka1c7dqjxms8h2httkls",
    "krjgfou8hwz6gr9673mgs56i",
    "h5gdzy76slippixboqv6t540",
    "bulx7c6i548oqn4t2ervuu04",
  ];

  const accordionSlugs = [
    "a-qui-s-adresse-mes-soins-energetiques",
    "soins-energetiques-une-seance-en-pratique",
    "soins-energetiques-type-de-seance-et-tarifs",
  ];

  const [blockContents, accordions] = await Promise.all([
    Promise.all(blockIds.map((id) => fetchBlockContentById(id))),
    fetchMultipleAccordions(accordionSlugs),
  ]);

  const validBlockContents = blockContents.filter(
    (block): block is StrapiBlockContent => block !== null
  );
  const validAccordions = accordions;

  return (
    <EnergyCareClient
      blockContents={validBlockContents}
      accordions={validAccordions}
    />
  );
}
