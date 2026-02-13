import { Suspense } from "react";
import ResetPasswordClient from "@/src/pageComponents/ResetPasswordClient";
import { Loader } from "lucide-react";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<Loader />}>
      <ResetPasswordClient />
    </Suspense>
  );
}
