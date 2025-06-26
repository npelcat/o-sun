import bcrypt from "bcryptjs";
import db from "@/src/db/index";
import { users } from "@/src/db/schema";

async function createAdmin() {
  try {
    const passwordHash = await bcrypt.hash("mot-de-passe-temporaire", 12);

    await db.insert(users).values({
      username: "nad_cat",
      email: "pelcat.nd@gmail.com",
      passwordHash: passwordHash,
      role: "admin",
    });

    const clientPasswordHash = await bcrypt.hash(
      "mot-de-passe-temporaire-cliente",
      12
    );

    await db.insert(users).values({
      username: "Océane",
      email: "o.sun.voixanimale@gmail.com",
      passwordHash: clientPasswordHash,
      role: "admin",
    });

    console.log("✅ Admins créés avec succès !");
  } catch (error) {
    console.error("❌ Erreur lors de la création des admins:", error);
  }
}

createAdmin();
