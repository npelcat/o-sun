import { pageMetadata } from "@/app/lib/metadata";
import { fetchFromStrapi } from "@/app/api/strapi/fetchers/strapi";
import TestimonialsClient from "@/src/pageComponents/TestimonialsClient";
import ErrorDisplay from "@/src/components/ErrorDisplay";
import { StrapiTestimonials } from "@/app/api/types/strapi";

export const metadata = pageMetadata.testimonials;
export const revalidate = 7200;

export default async function TestimonialsServer() {
  try {
    const data = await fetchFromStrapi(`/api/testimonials/?populate=picture`);

    if (!data || !data.data || data.data.length === 0) {
      throw new Error("Aucun témoignage trouvé dans la réponse de l'API.");
    }

    const testimonials: StrapiTestimonials[] = data.data;

    return <TestimonialsClient testimonials={testimonials} />;
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Une erreur inconnue est survenue lors du chargement de la page.";

    return (
      <div className="flex items-center justify-center min-h-screen">
        <ErrorDisplay
          message={errorMessage}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }
}
