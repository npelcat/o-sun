import { StrapiBlockContent } from "../../types/strapi";
import type { BlocksContent } from "@strapi/blocks-react-renderer";
import { fetchFromStrapi } from "./strapi";

type AccordionBlock = {
  slug: string;
  title: string;
  content: BlocksContent;
};

const formatAccordion = (block: AccordionBlock): StrapiBlockContent => ({
  slug: block.slug,
  title: block.title,
  content: block.content,
});

export const fetchMultipleAccordions = async (
  slugs: string[]
): Promise<StrapiBlockContent[]> => {
  const query = slugs.map((slug) => `filters[slug][$in]=${slug}`).join("&");

  try {
    const data = await fetchFromStrapi(`/api/accordions?${query}&populate=*`);

    return data.data.map(formatAccordion);
  } catch (error) {
    console.error("Erreur lors de la récupération des accordions", error);
    throw error;
  }
};
