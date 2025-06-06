import { pageMetadata } from "@/app/lib/metadata";
import { fetchBlockContentById } from "@/app/api/strapi/fetchers/block-content";
import BookingClient from "@/src/pageComponents/BookingClient";
import ErrorDisplay from "@/src/components/ErrorDisplay";

export const metadata = pageMetadata.booking;
export const revalidate = 7200;

export default async function BookingServer() {
  try {
    const blockId = "dwml9tiykiv5r7yjtglsef1x";

    const blockContent = await fetchBlockContentById(blockId);

    if (!blockContent) {
      throw new Error("Impossible de charger les informations de réservation.");
    }

    return <BookingClient blockContent={blockContent} />;
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
