import { pageMetadata } from "@/app/lib/metadata";
import { fetchBlockContentById } from "@/app/api/strapi/fetchers/block-content";
import BookingClient from "@/src/pageComponents/BookingClient";

export const metadata = pageMetadata.booking;
export const revalidate = 7200;

export default async function BookingServer() {
  const blockId = "dwml9tiykiv5r7yjtglsef1x";

  const blockContent = await fetchBlockContentById(blockId);

  if (!blockContent) {
    throw new Error("Impossible de charger les informations de réservation.");
  }

  return <BookingClient blockContent={blockContent} />;
}
