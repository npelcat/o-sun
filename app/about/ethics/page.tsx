import { pageMetadata } from "@/lib/metadata";
import { fetchBlockContentById } from "@/app/api/strapi/fetchers/block-content";
import { fetchMultipleAccordions } from "@/app/api/strapi/fetchers/accordion";
import EthicsClient from "@/src/pageComponents/EthicsClient";
import { StrapiBlockContent } from "@/app/api/types/strapi";

export const metadata = pageMetadata.ethics;
export const revalidate = 7200;

export default async function EthicsServer() {
  const blockIds = ["p4rfvz92wvfp1avhdpmnmmgp"]; // ma-facon-de-travailler
  const accordionSlugs = [
    "mon-ethique-en-communication-animale",
    "mon-ethique-en-soins-energetiques",
    "mon-ethique-pour-les-services-aux-gardiens",
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
    <EthicsClient
      blockContents={validBlockContents}
      accordions={validAccordions}
    />
  );
}
