import { Suspense } from "react";
import AdminLogin from "@/src/pageComponents/AdminLoginClient";

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <AdminLogin />
    </Suspense>
  );
}
