import { fetchFromStrapi } from "./strapi";
import { StrapiBlockContent } from "../types/strapi";

export const fetchBlockContentById = async (
  id: string
): Promise<StrapiBlockContent | null> => {
  try {
    const data: { data: StrapiBlockContent } = await fetchFromStrapi(
      `/api/block-contents/${id}?populate=picture`
    );

    const blockData = data.data;
    if (!blockData) {
      throw new Error("Les données du bloc sont manquantes.");
    }
    const picture = blockData.picture
      ? {
          url: `${process.env.NEXT_PUBLIC_STRAPI_URL}${blockData.picture.url}`,
          alternativeText: blockData.picture.alternativeText,
        }
      : undefined;

    return {
      documentId: blockData.documentId,
      title: blockData.title,
      picture,
      content: blockData.content,
      slug: blockData.slug,
    };
  } catch (error) {
    console.error(
      `Erreur lors de la récupération de l'entrée avec l'ID: ${id}`,
      error
    );
    return null;
  }
};

export const fetchMultipleBlockContents = async (
  slugs: string[]
): Promise<StrapiBlockContent[]> => {
  const query = slugs.map((slug) => `filters[slug][$in]=${slug}`).join("&");
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/block-contents?${query}&populate=*`
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
    picture: block.picture
      ? {
          url: `${process.env.NEXT_PUBLIC_STRAPI_URL}${block.picture.url}`,
          alternativeText:
            block.picture.alternativeText || "Image sans description",
        }
      : null,
    content: block.content,
  }));
};
