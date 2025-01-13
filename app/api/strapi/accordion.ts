import { StrapiBlockContent } from "../types/strapi";

export const fetchMultipleAccordions = async (
  slugs: string[]
): Promise<StrapiBlockContent[]> => {
  const query = slugs.map((slug) => `filters[slug][$in]=${slug}`).join("&");
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/accordions?${query}&populate=*`
  );

  if (!response.ok) {
    throw new Error(
      "Erreur lors de la récupération des données depuis Strapi."
    );
  }

  const data = await response.json();

  return data.data.map((block: any) => ({
    slug: block.slug,
    title: block.title,
    content: block.content,
  }));
};
