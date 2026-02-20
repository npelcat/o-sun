import { pageMetadata } from "@/lib/metadata";
import { fetchMultipleLinkComponents } from "@/app/api/strapi/fetchers/link-component";
import { fetchBlockContentById } from "@/app/api/strapi/fetchers/block-content";
import { fetchMultipleAccordions } from "@/app/api/strapi/fetchers/accordion";
import BookingClient from "@/src/pageComponents/BookingClient";
import { StrapiBlockContent } from "@/app/api/types/strapi";

export const metadata = pageMetadata.booking;
export const revalidate = 3600;

export default async function BookingServer() {
  const blockIds = [
    "kyaki9vam2pzlo3jlnwfvzm5", // accordion-fonctionnement-reservations
    "una3x7w09ezw8j8upm5hsbd0", // accordion-deroulement-seances
    "vx54wa6su7lgfinejsel8f0s", // accordion-cas-particuliers
    "vya1r4eovb3a5b2mndcc98ie", // accordion-paiement
  ];

  const serviceSlugs = [
    "reservation-communication-animale",
    "reservation-soins-energetiques",
    "reservation-appel-decouverte",
    "reservation-urgence",
  ];

  const accordionSlugs = [
    // Fonctionnement
    "reservation-fonctionnement-communication",
    "reservation-fonctionnement-energetique",
    // Déroulement
    "seance-communication",
    "seance-energetique",
    // Cas particuliers
    "reservation-evenement-dates",
    "reservation-urgences",
    "reservation-choix",
    // Paiement
    "reservation-confirmation",
    "paiement-report",
  ];

  const [blockContents, serviceCards, accordions] = await Promise.all([
    Promise.all(blockIds.map((id) => fetchBlockContentById(id))),
    fetchMultipleLinkComponents(serviceSlugs),
    fetchMultipleAccordions(accordionSlugs),
  ]);

  const validBlockContents = blockContents.filter(
    (block): block is StrapiBlockContent => block !== null,
  );

  const accordionBlocks = {
    fonctionnement: {
      blockContent:
        validBlockContents.find(
          (b) => b.slug === "accordion-fonctionnement-reservations",
        ) || null,
      accordions: accordions.filter((a) =>
        [
          "reservation-fonctionnement-communication",
          "reservation-fonctionnement-energetique",
        ].includes(a.slug || ""),
      ),
    },
    deroulement: {
      blockContent:
        validBlockContents.find(
          (b) => b.slug === "accordion-deroulement-seances",
        ) || null,
      accordions: accordions.filter((a) =>
        ["seance-communication", "seance-energetique"].includes(a.slug || ""),
      ),
    },
    casParticuliers: {
      blockContent:
        validBlockContents.find(
          (b) => b.slug === "accordion-cas-particuliers",
        ) || null,
      accordions: accordions.filter((a) =>
        [
          "reservation-evenement-dates",
          "reservation-urgences",
          "reservation-choix",
        ].includes(a.slug || ""),
      ),
    },
    paiement: {
      blockContent:
        validBlockContents.find((b) => b.slug === "accordion-paiement") || null,
      accordions: accordions.filter((a) =>
        ["reservation-confirmation", "paiement-report"].includes(a.slug || ""),
      ),
    },
  };

  return (
    <BookingClient
      serviceCards={serviceCards}
      accordionBlocks={accordionBlocks}
    />
  );
}
