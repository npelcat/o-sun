import { Suspense } from "react";
import ForgotPasswordClient from "@/src/pageComponents/ForgotPasswordClient";
import { Loader } from "lucide-react";

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<Loader />}>
      <ForgotPasswordClient />
    </Suspense>
  );
}
