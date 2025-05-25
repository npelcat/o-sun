import { StrapiBlockContent } from "../../types/strapi";
import { fetchFromStrapi } from "../helpers/strapi";

const formatAccordion = (block: any): StrapiBlockContent => ({
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
