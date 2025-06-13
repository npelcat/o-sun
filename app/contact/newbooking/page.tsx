"use client";

import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const NewBooking = dynamic(() => import("@/src/components/Booking"), {
  ssr: false,
});
const FormBooking = dynamic(() => import("@/src/components/FormBooking"), {
  ssr: false,
});

function PageContent() {
  const searchParams = useSearchParams();
  const timeSlotId = searchParams.get("timeSlotId");
  const label = searchParams.get("label");

  return timeSlotId && label ? <FormBooking /> : <NewBooking />;
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PageContent />
    </Suspense>
  );
}
