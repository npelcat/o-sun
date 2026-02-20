import { fetchFromStrapi } from "./strapi";
import { formatPicture } from "../helpers/formatPicture";
import { StrapiBlockContent, StrapiPicture } from "../../types/strapi";
import type { BlocksContent } from "@strapi/blocks-react-renderer";

export const fetchBlockContentById = async (
  id: string,
): Promise<StrapiBlockContent | null> => {
  try {
    const { data }: { data: StrapiBlockContent } = await fetchFromStrapi(
      `/api/block-contents/${id}?populate=picture`,
    );

    return {
      documentId: data.documentId,
      title: data.title,
      picture: formatPicture(data.picture),
      content: data.content,
      slug: data.slug,
    };
  } catch (error) {
    console.error(`Erreur lors de la récupération du bloc ID: ${id}`, error);
    return null;
  }
};

export const fetchMultipleBlockContents = async (
  slugs: string[],
): Promise<StrapiBlockContent[]> => {
  const query = slugs.map((slug) => `filters[slug][$in]=${slug}`).join("&");

  try {
    const data = await fetchFromStrapi(
      `/api/block-contents?${query}&populate=*`,
    );

    type BlockItem = {
      slug: string;
      title: string;
      picture: StrapiPicture | null | undefined;
      content: BlocksContent;
    };

    return data.data.map((block: BlockItem) => ({
      slug: block.slug,
      title: block.title,
      picture: formatPicture(block.picture),
      content: block.content,
    }));
  } catch (error) {
    console.error("Erreur lors de la récupération des blocs", error);
    throw error;
  }
};

export const fetchBlockContentBySlug = async (
  slug: string,
): Promise<StrapiBlockContent | null> => {
  try {
    const data = await fetchFromStrapi(
      `/api/block-contents?filters[slug][$eq]=${slug}&populate=*`,
    );

    if (!data.data || data.data.length === 0) {
      console.warn(`No block content found with slug: ${slug}`);
      return null;
    }

    const block = data.data[0];
    return {
      documentId: block.documentId,
      title: block.title,
      picture: formatPicture(block.picture),
      content: block.content,
      slug: block.slug,
    };
  } catch (error) {
    console.error(
      `Erreur lors de la récupération du bloc slug: ${slug}`,
      error,
    );
    return null;
  }
};
