import { pageMetadata } from "@/app/lib/metadata";
import { fetchBlockContentById } from "@/app/api/strapi/fetchers/block-content";
import { fetchMultipleAccordions } from "@/app/api/strapi/fetchers/accordion";
import EthicsClient from "@/src/pageComponents/EthicsClient";
import ErrorDisplay from "@/src/components/ErrorDisplay";
import { StrapiBlockContent } from "@/app/api/types/strapi";

export const metadata = pageMetadata.ethics;
export const revalidate = 7200;

export default async function EthicsServer() {
  try {
    const blockIds = ["p4rfvz92wvfp1avhdpmnmmgp"]; // ma-facon-de-travailler
    const accordionSlugs = [
      "mon-ethique-en-communication-animale",
      "mon-ethique-en-soins-energetiques",
      "mon-ethique-pour-les-services-aux-gardiens",
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
      <EthicsClient
        blockContents={validBlockContents}
        accordions={validAccordions}
      />
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Une erreur est survenue lors du chargement de la page.";
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
