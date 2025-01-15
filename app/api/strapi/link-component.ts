import { StrapiLinkComponent } from "../types/strapi";
import { fetchFromStrapi } from "./strapi";

export const fetchLinkComponentById = async (
  id: string
): Promise<StrapiLinkComponent | null> => {
  try {
    const data: { data: StrapiLinkComponent } = await fetchFromStrapi(
      `/api/component-with-links/${id}?populate=picture`
    );

    const ComponentData = data.data;
    if (!ComponentData) {
      throw new Error("Les données du bloc sont manquantes.");
    }

    const picture = ComponentData.picture
      ? {
          url: `${process.env.NEXT_PUBLIC_STRAPI_URL}${ComponentData.picture.url}`,
          alternativeText: ComponentData.picture.alternativeText,
        }
      : undefined;

    return {
      documentId: ComponentData.documentId,
      title: ComponentData.title,
      link: ComponentData.link,
      picture,
      description: ComponentData.description,
      slug: ComponentData.slug,
    };
  } catch (error) {
    console.error(
      `Erreur lors de la récupération de l'entrée avec l'ID: ${id}`,
      error
    );
    return null;
  }
};

export const fetchMultipleLinkComponents = async (
  slugs: string[]
): Promise<StrapiLinkComponent[]> => {
  const query = slugs.map((slug) => `filters[slug][$in]=${slug}`).join("&");
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/component-with-links?${query}&populate=*`
  );

  if (!response.ok) {
    throw new Error(
      "Erreur lors de la récupération des données depuis Strapi."
    );
  }

  const data = await response.json();

  return data.data.map((linkComponent: any) => {
    const picture = linkComponent.picture
      ? {
          url: `${process.env.NEXT_PUBLIC_STRAPI_URL}${linkComponent.picture.url}`,
          alternativeText: linkComponent.picture.alternativeText || null,
        }
      : null;

    return {
      title: linkComponent.title,
      link: linkComponent.link,
      picture,
      description: linkComponent.description || null,
      slug: linkComponent.slug,
    };
  });
};
