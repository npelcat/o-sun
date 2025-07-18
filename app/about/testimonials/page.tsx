import { pageMetadata } from "@/lib/metadata";
import { fetchFromStrapi } from "@/app/api/strapi/fetchers/strapi";
import TestimonialsClient from "@/src/pageComponents/TestimonialsClient";
import { StrapiTestimonials } from "@/app/api/types/strapi";

export const metadata = pageMetadata.testimonials;
export const revalidate = 7200;

export default async function TestimonialsServer() {
  const data = await fetchFromStrapi(`/api/testimonials/?populate=picture`);

  if (!data || !data.data || data.data.length === 0) {
    throw new Error("Aucun témoignage trouvé dans la réponse de l'API.");
  }

  const testimonials: StrapiTestimonials[] = data.data;

  return <TestimonialsClient testimonials={testimonials} />;
}
