import { pageMetadata } from "@/app/lib/metadata";
import { fetchBlockContentById } from "@/app/api/strapi/fetchers/block-content";
import { fetchMultipleAccordions } from "@/app/api/strapi/fetchers/accordion";
import GuardiansClient from "@/src/pageComponents/GuardiansClient";
import ErrorDisplay from "@/src/components/ErrorDisplay";
import { StrapiBlockContent } from "@/app/api/types/strapi";

export const metadata = pageMetadata.guardians;
export const revalidate = 7200;

export default async function GuardiansServer() {
  try {
    const blockIds = [
      "e6kkmhe424iko1zevz8wo51z", // gardiens-quels-sont-ils
      "g5lgt0mnb1dxj57jt74pg1fd", // gardiens-a-quoi-ca-sert
      "kc8jct496l1snx0r4vttadjn", // gardiens-infos-pratiques
    ];

    const accordionSlugs = [
      "en-pratique-premier-service",
      "en-pratique-deuxieme-service",
      "gardiens-type-de-seance-et-tarifs",
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
      <GuardiansClient
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
