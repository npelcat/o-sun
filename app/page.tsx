import { pageMetadata } from "@/app/lib/metadata";
import {
  fetchLinkComponentById,
  fetchMultipleLinkComponents,
} from "@/app/api/strapi/fetchers/link-component";
import { fetchBlockContentById } from "@/app/api/strapi/fetchers/block-content";
import HomeClient from "@/src/pageComponents/HomeClient";

export const metadata = pageMetadata.home;

export const revalidate = 7200;

export default async function HomeServer() {
  const quoteBlockId = "jurx7g9k98qkycxylf0ovvvo";
  const homeCTASlugs = ["qui-suis-je", "mon-ethique", "reservation"];
  const featureCardSlugs = [
    "la-communication-animale",
    "les-soins-energetiques",
    "pour-les-gardiens",
  ];
  const testimonialComponentId = "jjjr5w6ef328auwy65kxwsta";

  const [quote, homeCTAs, featureCards, testimonial] = await Promise.all([
    fetchBlockContentById(quoteBlockId),
    fetchMultipleLinkComponents(homeCTASlugs),
    fetchMultipleLinkComponents(featureCardSlugs),
    fetchLinkComponentById(testimonialComponentId),
  ]);

  return (
    <HomeClient
      quoteBlock={quote}
      homeCTAComponents={homeCTAs}
      featureCardComponents={featureCards}
      testimonialComponent={testimonial}
    />
  );
}
