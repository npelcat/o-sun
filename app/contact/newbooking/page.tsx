"use client";

import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";

const NewBooking = dynamic(() => import("@/src/components/Booking"), {
  ssr: false,
});
const FormBooking = dynamic(() => import("@/src/components/FormBooking"), {
  ssr: false,
});

export default function Page() {
  const searchParams = useSearchParams();
  const timeSlotId = searchParams.get("timeSlotId");
  const label = searchParams.get("label");

  return timeSlotId && label ? <FormBooking /> : <NewBooking />;
}
