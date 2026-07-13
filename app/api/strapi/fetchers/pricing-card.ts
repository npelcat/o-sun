import { fetchFromStrapi } from "./strapi";
import { formatPicture } from "../helpers/formatPicture";
import { StrapiPicture } from "../../types/strapi";
import type { BlocksContent } from "@strapi/blocks-react-renderer";

export interface StrapiPricingCard {
  documentId: string;
  title: string;
  subtitle?: string;
  price: string;
  badge?: string;
  description: BlocksContent;
  link: string;
  slug: string;
  picture?: StrapiPicture | null;
}

type PricingCardItem = {
  documentId: string;
  title: string;
  subtitle?: string;
  price: string;
  badge?: string;
  description: BlocksContent;
  link: string;
  slug: string;
  picture?: StrapiPicture | null;
};

const formatPricingCard = (item: PricingCardItem): StrapiPricingCard => ({
  documentId: item.documentId,
  title: item.title,
  subtitle: item.subtitle,
  price: item.price,
  badge: item.badge,
  description: item.description,
  link: item.link,
  slug: item.slug,
  picture: formatPicture(item.picture),
});

export const fetchMultiplePricingCards = async (
  slugs: string[],
): Promise<StrapiPricingCard[]> => {
  const query = slugs.map((slug) => `filters[slug][$in]=${slug}`).join("&");
  try {
    const data = await fetchFromStrapi(
      `/api/pricing-cards?${query}&populate=picture`,
    );
    const mapped: StrapiPricingCard[] = data.data.map(formatPricingCard);
    return mapped.sort((a, b) => slugs.indexOf(a.slug) - slugs.indexOf(b.slug));
  } catch (error) {
    console.error("Erreur lors de la recuperation des pricing cards", error);
    throw error;
  }
};

export const fetchPricingCardBySlug = async (
  slug: string,
): Promise<StrapiPricingCard | null> => {
  try {
    const data = await fetchFromStrapi(
      `/api/pricing-cards?filters[slug][$eq]=${slug}&populate=picture`,
    );
    if (!data.data || data.data.length === 0) {
      console.warn(`No pricing card found with slug: ${slug}`);
      return null;
    }
    return formatPricingCard(data.data[0]);
  } catch (error) {
    console.error(
      `Erreur lors de la recuperation de la pricing card slug: ${slug}`,
      error,
    );
    return null;
  }
};
