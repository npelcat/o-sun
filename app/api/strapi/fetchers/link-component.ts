import { StrapiLinkComponent } from "../../types/strapi";
import { fetchFromStrapi } from "../helpers/strapi";
import { formatPicture } from "../helpers/formatPicture";

export const fetchLinkComponentById = async (
  id: string
): Promise<StrapiLinkComponent | null> => {
  try {
    const { data }: { data: StrapiLinkComponent } = await fetchFromStrapi(
      `/api/component-with-links/${id}?populate=picture`
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
      error
    );
    return null;
  }
};

export const fetchMultipleLinkComponents = async (
  slugs: string[]
): Promise<StrapiLinkComponent[]> => {
  const query = slugs.map((slug) => `filters[slug][$in]=${slug}`).join("&");

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/component-with-links?${query}&populate=*`
    );

    if (!response.ok) {
      throw new Error(
        "Erreur lors de la récupération des données depuis Strapi."
      );
    }

    const data = await response.json();

    return data.data.map((linkComponent: any) => ({
      title: linkComponent.title,
      link: linkComponent.link,
      picture: formatPicture(linkComponent.picture),
      description: linkComponent.description || null,
      slug: linkComponent.slug,
    }));
  } catch (error) {
    console.error("Erreur lors de la récupération des composants", error);
    throw error;
  }
};
