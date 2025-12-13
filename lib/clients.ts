import { clients } from "@/src/db/schema";
import { eq } from "drizzle-orm";

export interface CreateOrUpdateClientData {
  name: string;
  email: string;
  phone?: string | null;
}

export async function createOrUpdateClient(
  trx: any,
  data: CreateOrUpdateClientData
) {
  const { name, email, phone } = data;

  const existingClient = await trx
    .select()
    .from(clients)
    .where(eq(clients.email, email))
    .limit(1);

  if (existingClient.length === 0) {
    const [newClient] = await trx
      .insert(clients)
      .values({
        name,
        email,
        phone: phone || null,
      })
      .returning();

    return { client: newClient, isNew: true };
  } else {
    const [updatedClient] = await trx
      .update(clients)
      .set({
        name,
        phone: phone || existingClient[0].phone,
        updatedAt: new Date(),
      })
      .where(eq(clients.id, existingClient[0].id))
      .returning();

    return { client: updatedClient, isNew: false };
  }
}
