import { pageMetadata } from "@/app/lib/metadata";
import { fetchBlockContentById } from "@/app/api/strapi/fetchers/block-content";
import { fetchMultipleAccordions } from "@/app/api/strapi/fetchers/accordion";
import GuardiansClient from "@/src/pageComponents/GuardiansClient";
import { StrapiBlockContent } from "@/app/api/types/strapi";

export const metadata = pageMetadata.guardians;
export const revalidate = 7200;

export default async function GuardiansServer() {
  const blockIds = [
    "e6kkmhe424iko1zevz8wo51z", // gardiens-quels-sont-ils
    "g5lgt0mnb1dxj57jt74pg1fd", // gardiens-a-quoi-ca-sert
    "kc8jct496l1snx0r4vttadjn", // gardiens-infos-pratiques
  ];

  const accordionSlugs = [
    "en-pratique-premier-service",
    "en-pratique-deuxieme-service",
    "gardiens-type-de-seance-et-tarifs",
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
    <GuardiansClient
      blockContents={validBlockContents}
      accordions={validAccordions}
    />
  );
}
