import { faker } from "@faker-js/faker/locale/fr";
import db from "../index";
import { bookings, clients, formData, timeSlots } from "../schema";

if (!process.env.SEED_ALLOWED) {
  console.error("⛔ Le seed est interdit dans cet environnement !");
  process.exit(1);
}

async function cleanTables() {
  console.log("🧹 Nettoyage des tables...");
  await db.delete(bookings);
  await db.delete(formData);
  await db.delete(timeSlots);
  await db.delete(clients);
}

async function seedClients(count = 20) {
  const data = Array.from({ length: count }, () => ({
    name: faker.person.fullName(),
    email: faker.internet.email(),
    phone: faker.phone.number({ style: "international" }),
  }));

  const inserted = await db.insert(clients).values(data).returning();
  console.log(`✅ ${inserted.length} clients insérés.`);
  return inserted;
}

async function seedTimeSlots(count = 50) {
  const data = Array.from({ length: count }, () => {
    const startTime = faker.date.between({
      from: "2026-03-10",
      to: "2026-12-31",
    });
    const durationMs = faker.number.int({ min: 30, max: 180 }) * 60 * 1000;
    const endTime = new Date(startTime.getTime() + durationMs);

    return {
      startTime,
      endTime,
      isActive: faker.datatype.boolean(),
    };
  });

  const inserted = await db.insert(timeSlots).values(data).returning();
  console.log(`✅ ${inserted.length} créneaux insérés.`);
  return inserted;
}

async function seedFormDataAndBookings(
  insertedClients: { id: string }[],
  insertedSlots: { id: string }[],
  count = 30,
) {
  for (let i = 0; i < count; i++) {
    // 1. Créer le formulaire
    const [form] = await db
      .insert(formData)
      .values({
        animalName: faker.person.firstName(),
        animalType: faker.helpers.arrayElement([
          "Chien",
          "Chat",
          "Lapin",
          "Oiseau",
          "Cheval",
        ]),
        service: faker.helpers.arrayElement([
          "Communication animale",
          "Soin énergetique",
          "Urgence",
          "Séance Kinésiologie",
        ]),
        answers: null,
      })
      .returning();

    // 2. Créer la réservation liée
    await db.insert(bookings).values({
      timeSlotId: faker.helpers.arrayElement(insertedSlots).id,
      clientId: faker.helpers.arrayElement(insertedClients).id,
      formId: form.id,
      status: faker.helpers.arrayElement(["pending", "confirmed", "canceled"]),
      adminNotes: faker.helpers.maybe(() => faker.lorem.sentence(), {
        probability: 0.4,
      }),
    });
  }

  console.log(`✅ ${count} formulaires et réservations insérés.`);
}

async function main() {
  console.log(`🌱 Seed démarré`);

  await cleanTables();

  const insertedClients = await seedClients(20);
  const insertedSlots = await seedTimeSlots(50);
  await seedFormDataAndBookings(insertedClients, insertedSlots, 30);

  console.log("🎉 Seed terminé !");
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Erreur seed :", err);
  process.exit(1);
});
