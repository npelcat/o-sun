import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/admin";
import AdminDashboardClient from "@/src/pageComponents/AdminDashboardClient";

export default async function AdminPage() {
  const adminUser = await getAdminUser();

  if (!adminUser) {
    redirect("/admin/login");
  }

  return <AdminDashboardClient adminUser={adminUser} />;
}
