import { fetchMultipleAccordions } from "../strapi/fetchers/accordion";
import { fetchBlockContentById } from "../strapi/fetchers/block-content";
import { StrapiBlockContent } from "@/app/api/types/strapi";

export const fetchPageData = async (
  blockIds: string[],
  accordionSlugs: string[]
) => {
  try {
    const [accordions, blockContents] = await Promise.all([
      fetchMultipleAccordions(accordionSlugs),
      Promise.all(blockIds.map(fetchBlockContentById)),
    ]);

    const validBlockContents = blockContents.filter(
      (block): block is StrapiBlockContent =>
        block !== null && block !== undefined
    );

    return {
      blockContents: validBlockContents,
      accordions: accordions,
    };
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des données de la page :",
      error
    );
    throw error;
  }
};
