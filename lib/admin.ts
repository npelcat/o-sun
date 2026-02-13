import { auth } from "@/lib/auth/auth";

export async function getAdminUser() {
  const session = await auth();

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
