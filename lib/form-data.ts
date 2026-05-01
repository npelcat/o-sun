import { DbTransaction } from "@/src/db";
import { formData } from "@/src/db/schema";

export interface CreateFormData {
  animalName: string;
  animalType: string;
  service: string;
  answers?: string | Record<string, unknown> | null;
  animalInfo?: string | null;
  householdInfo?: string | null;
  serviceSpecificAnswers?: string | null;
  preferredPronoun: string;
  socialMediaConsent: boolean;
  monthlyPlanningAck: boolean;
  cgvAccepted: boolean;
}

export async function createFormData(trx: DbTransaction, data: CreateFormData) {
  const {
    animalName,
    animalType,
    service,
    answers,
    animalInfo,
    householdInfo,
    serviceSpecificAnswers,
    preferredPronoun,
    socialMediaConsent,
    monthlyPlanningAck,
    cgvAccepted,
  } = data;

  const [insertedForm] = await trx
    .insert(formData)
    .values({
      animalName,
      animalType,
      service,
      answers:
        typeof answers === "string"
          ? answers
          : answers
            ? JSON.stringify(answers)
            : null,
      animalInfo: animalInfo ?? null,
      householdInfo: householdInfo ?? null,
      serviceSpecificAnswers: serviceSpecificAnswers ?? null,
      preferredPronoun,
      socialMediaConsent,
      monthlyPlanningAck,
      cgvAccepted,
    })
    .returning();

  return insertedForm;
}
