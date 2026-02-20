import { StrapiLinkComponent, StrapiPicture } from "../../types/strapi";
import type { BlocksContent } from "@strapi/blocks-react-renderer";
import { fetchFromStrapi } from "./strapi";
import { formatPicture } from "../helpers/formatPicture";

export const fetchLinkComponentById = async (
  id: string,
): Promise<StrapiLinkComponent | null> => {
  try {
    const { data }: { data: StrapiLinkComponent } = await fetchFromStrapi(
      `/api/component-with-links/${id}?populate=picture`,
    );

    return {
      documentId: data.documentId,
      title: data.title,
      link: data.link,
      picture: formatPicture(data.picture),
      description: data.description,
      slug: data.slug,
    };
  } catch (error) {
    console.error(
      `Erreur lors de la récupération du composant ID: ${id}`,
      error,
    );
    return null;
  }
};

export const fetchMultipleLinkComponents = async (
  slugs: string[],
): Promise<StrapiLinkComponent[]> => {
  const query = slugs.map((slug) => `filters[slug][$in]=${slug}`).join("&");

  try {
    const data = await fetchFromStrapi(
      `/api/component-with-links?${query}&populate=*`,
    );

    type LinkComponentItem = {
      title: string;
      link: string;
      picture: StrapiPicture | null | undefined;
      description?: BlocksContent | null;
      slug: string;
    };

    return data.data.map((linkComponent: LinkComponentItem) => ({
      title: linkComponent.title,
      link: linkComponent.link,
      picture: formatPicture(linkComponent.picture),
      description: linkComponent.description ?? ([] as BlocksContent),
      slug: linkComponent.slug,
    }));
  } catch (error) {
    console.error("Erreur lors de la récupération des composants", error);
    throw error;
  }
};
