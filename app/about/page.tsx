import { pageMetadata } from "@/app/lib/metadata";
import { fetchBlockContentById } from "@/app/api/strapi/fetchers/block-content";
import { fetchMultipleAccordions } from "@/app/api/strapi/fetchers/accordion";
import AboutClient from "@/src/pageComponents/AboutClient";
import ErrorDisplay from "@/src/components/ErrorDisplay";
import { StrapiBlockContent } from "../api/types/strapi";

export const metadata = pageMetadata.about;
export const revalidate = 7200;

export default async function AboutServer() {
  try {
    const blockIds = [
      "qcw4qczfv0cdjav8lldwgafd", // oceane
      "pjl27su4oxru475tjkhaaywd", // mes-diplomes-et-formations
    ];

    const accordionSlugs = [
      "ma-formation-en-communication-animale",
      "ma-formation-en-soins-energetiques",
      "ma-formation-pour-les-services-aux-gardiens",
      "mon-ancienne-vie",
    ];

    const [blockContents, accordions] = await Promise.all([
      Promise.all(blockIds.map((id) => fetchBlockContentById(id))),
      fetchMultipleAccordions(accordionSlugs),
    ]);

    const validBlockContents = blockContents.filter(
      (block): block is StrapiBlockContent => block !== null
    );
    const validAccordions = accordions;

    return (
      <AboutClient
        blockContents={validBlockContents}
        accordions={validAccordions}
      />
    );
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
