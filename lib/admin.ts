import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function getAdminUser() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return null;
  }

  return {
    id: session.user.id,
    username: session.user.name!,
    email: session.user.email!,
    role: "admin",
  };
}
