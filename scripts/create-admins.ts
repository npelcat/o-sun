import { config } from "dotenv";

// Environment in which to run the script :
config({ path: ".env.local" });
// config({ path: ".env.test" });
// config({ path: ".env.production" });

import bcrypt from "bcryptjs";
import db from "@/src/db/index";
import { admins } from "@/src/db/schema";

async function createAdmins() {
  try {
    const passwordHash = await bcrypt.hash("mot-de-passe-temporaire", 12);

    await db.insert(admins).values({
      username: "nad_cat",
      email: "pelcat.nd@gmail.com",
      passwordHash: passwordHash,
    });

    const clientPasswordHash = await bcrypt.hash(
      "mot-de-passe-temporaire-cliente",
      12
    );

    await db.insert(admins).values({
      username: "Océane",
      email: "o.sun.voixanimale@gmail.com",
      passwordHash: clientPasswordHash,
    });

    console.log("✅ Admins créés avec succès !");
    process.exit(0);
  } catch (error) {
    console.error("❌ Erreur lors de la création des admins:", error);
    process.exit(1);
  }
}

createAdmins();
