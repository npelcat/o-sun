import { faker } from "@faker-js/faker/locale/fr";
import db from "../index";
import { bookings, clients, formData, timeSlots } from "../schema";

if (!process.env.SEED_ALLOWED) {
  console.error("⛔ Le seed est interdit dans cet environnement !");
  process.exit(1);
}

const SERVICES = [
  "Appel découverte 15 minutes",
  "Communication animale - Clarté",
  "Communication animale - Équilibre",
  "Communication animale - Harmonie",
  "Communication animale - Reconnexion",
  "Soin énergétique animal",
  "Soin énergétique humain",
  "Soin énergétique DUO",
  "Urgence - formule Clarté",
  "Urgence - formule Harmonie",
  "Urgence - Pack Traversée",
];

const ANIMAL_TYPES = ["Chien", "Chat", "Lapin", "Oiseau", "Cheval", "Reptile"];

function generateServiceAnswers(service: string): string {
  if (service.startsWith("Communication animale")) {
    const subjects = [];
    if (service.includes("Clarté")) subjects.push(faker.lorem.sentence());
    if (service.includes("Équilibre")) {
      subjects.push(faker.lorem.sentence(), faker.lorem.sentence());
    }
    if (service.includes("Harmonie") || service.includes("Reconnexion")) {
      subjects.push(...Array.from({ length: 4 }, () => faker.lorem.sentence()));
    }
    return JSON.stringify({
      subjects,
      deadline: faker.helpers.maybe(() => faker.lorem.sentence(), {
        probability: 0.3,
      }),
      heartMessage: faker.lorem.paragraph(),
    });
  }

  if (service.startsWith("Soin énergétique")) {
    return JSON.stringify({
      humanInfo:
        service.includes("humain") || service.includes("DUO")
          ? faker.lorem.paragraph()
          : null,
      animalInfo:
        service.includes("animal") || service.includes("DUO")
          ? faker.lorem.paragraph()
          : null,
    });
  }

  if (service.startsWith("Urgence")) {
    const maxSubjects = service.includes("Clarté") ? 1 : 3;
    return JSON.stringify({
      urgencyDescription: faker.lorem.paragraph(),
      subjects: Array.from({ length: maxSubjects }, () =>
        faker.lorem.sentence(),
      ),
      heartMessage: faker.lorem.paragraph(),
    });
  }

  return JSON.stringify({});
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
    return {
      startTime,
      endTime: new Date(startTime.getTime() + durationMs),
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
    const service = faker.helpers.arrayElement(SERVICES);

    const [form] = await db
      .insert(formData)
      .values({
        animalName: faker.person.firstName(),
        animalType: faker.helpers.arrayElement(ANIMAL_TYPES),
        service,
        answers: faker.helpers.maybe(() => faker.lorem.sentence(), {
          probability: 0.3,
        }),

        animalInfo: faker.helpers.maybe(
          () =>
            `Né(e) le ${faker.date.past({ years: 10 }).toLocaleDateString("fr-FR")}, ${faker.helpers.arrayElement(["mâle", "femelle"])}, ${faker.helpers.arrayElement(["stérilisé(e)", "non stérilisé(e)"])}`,
          { probability: 0.8 },
        ),
        householdInfo: faker.helpers.maybe(() => faker.lorem.sentence(), {
          probability: 0.7,
        }),

        serviceSpecificAnswers: generateServiceAnswers(service),

        preferredPronoun: faker.helpers.arrayElement([
          "tutoiement",
          "vouvoiement",
        ]),
        socialMediaConsent: faker.datatype.boolean(),
        monthlyPlanningAck: true,
        cgvAccepted: true,
      })
      .returning();

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
  console.log("🌱 Seed démarré");
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
