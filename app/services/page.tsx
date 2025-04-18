import { pageMetadata } from "@/app/lib/metadata";
import { fetchBlockContentById } from "@/app/api/strapi/fetchers/block-content";
import { fetchMultipleAccordions } from "@/app/api/strapi/fetchers/accordion";
import AnimalCommunicationClient from "@/src/pageComponents/AnimalCommunicationClient";
import ErrorDisplay from "@/src/components/ErrorDisplay";
import { StrapiBlockContent } from "../api/types/strapi";

export const metadata = pageMetadata.animalCommunication;
export const revalidate = 7200;

export default async function AnimalCommunicationServer() {
  try {
    const blockIds = [
      "gq45qnh9mzp7frix51cm1iad", // com-animale-qu-est-ce-que-c-est
      "rbmsw4youqj5y8dis9eaordk", // com-animale-a-quoi-ca-sert
      "pa21ykdbfd3gxjdtz2ehphx1", // com-animale-a-quoi-ressemble-une-seance
      "n418rbmlpib4cb94h0kqv00j", // com-animale-infos-pratiques
    ];

    const accordionSlugs = [
      "com-animale-limites",
      "com-animale-type-de-seance-et-tarifs",
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
      <AnimalCommunicationClient
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
