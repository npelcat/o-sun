import { DbTransaction } from "@/src/db";
import { formData } from "@/src/db/schema";

export interface CreateFormData {
  animalName: string;
  animalType?: string | null;
  service: string;
  answers?: string | Record<string, unknown> | null;
}

export async function createFormData(trx: DbTransaction, data: CreateFormData) {
  const { animalName, animalType, service, answers } = data;

  const [insertedForm] = await trx
    .insert(formData)
    .values({
      animalName,
      animalType: animalType || null,
      service,
      answers:
        typeof answers === "string"
          ? answers
          : answers
            ? JSON.stringify(answers)
            : null,
    })
    .returning();

  return insertedForm;
}
