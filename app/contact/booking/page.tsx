import { pageMetadata } from "@/app/lib/metadata";
import BookingClient from "@/src/pageComponents/BookingClient";

export const metadata = pageMetadata.booking;

export default function BookingServer() {
  return <BookingClient />;
}
