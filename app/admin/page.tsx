import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/admin";
import { getAllBookings } from "@/lib/bookings";
import AdminDashboardClient from "@/src/pageComponents/AdminDashboardClient";

export default async function AdminPage() {
  const adminUser = await getAdminUser();

  if (!adminUser) {
    redirect("/admin/login");
  }

  const bookings = await getAllBookings();

  return <AdminDashboardClient adminUser={adminUser} bookings={bookings} />;
}
