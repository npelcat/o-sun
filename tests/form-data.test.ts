import { describe, it, expect } from "vitest";
import { createFormData } from "@/lib/form-data";
import { createMockTransaction, asTrx } from "./utils/test-utils";

describe("createFormData", () => {
  it("should create form data with all fields", async () => {
    const mockTrx = createMockTransaction();
    const mockForm = {
      id: "form-123",
      animalName: "Rex",
      animalType: "Chien",
      service: "Consultation",
      answers: JSON.stringify({ question1: "réponse1" }),
      animalInfo: null,
      householdInfo: null,
      serviceSpecificAnswers: null,
      preferredPronoun: "tutoiement",
      socialMediaConsent: false,
      monthlyPlanningAck: true,
      cgvAccepted: true,
      createdAt: new Date(),
    };
    mockTrx.returning.mockResolvedValue([mockForm]);

    const result = await createFormData(asTrx(mockTrx), {
      animalName: "Rex",
      animalType: "Chien",
      service: "Consultation",
      answers: { question1: "réponse1" },
      preferredPronoun: "tutoiement",
      socialMediaConsent: false,
      monthlyPlanningAck: true,
      cgvAccepted: true,
    });

    expect(result).toEqual(mockForm);
    expect(mockTrx.insert).toHaveBeenCalled();
    expect(mockTrx.values).toHaveBeenCalledWith({
      animalName: "Rex",
      animalType: "Chien",
      service: "Consultation",
      answers: JSON.stringify({ question1: "réponse1" }),
      animalInfo: null,
      householdInfo: null,
      serviceSpecificAnswers: null,
      preferredPronoun: "tutoiement",
      socialMediaConsent: false,
      monthlyPlanningAck: true,
      cgvAccepted: true,
    });
  });

  it("should handle string answers", async () => {
    const mockTrx = createMockTransaction();
    mockTrx.returning.mockResolvedValue([{ id: "form-789" }]);

    await createFormData(asTrx(mockTrx), {
      animalName: "Tweety",
      animalType: "Oiseau",
      service: "Contrôle",
      answers: "Notes libres du client",
      preferredPronoun: "vouvoiement",
      socialMediaConsent: true,
      monthlyPlanningAck: true,
      cgvAccepted: true,
    });

    expect(mockTrx.values).toHaveBeenCalledWith(
      expect.objectContaining({
        answers: "Notes libres du client",
      }),
    );
  });

  it("should stringify object answers", async () => {
    const mockTrx = createMockTransaction();
    mockTrx.returning.mockResolvedValue([{ id: "form-012" }]);

    await createFormData(asTrx(mockTrx), {
      animalName: "Bella",
      animalType: "Chat",
      service: "Urgence - formule Clarté",
      answers: { symptômes: "léthargie", durée: "2 jours" },
      preferredPronoun: "tutoiement",
      socialMediaConsent: false,
      monthlyPlanningAck: true,
      cgvAccepted: true,
    });

    expect(mockTrx.values).toHaveBeenCalledWith(
      expect.objectContaining({
        answers: JSON.stringify({ symptômes: "léthargie", durée: "2 jours" }),
      }),
    );
  });

  it("should handle null answers", async () => {
    const mockTrx = createMockTransaction();
    mockTrx.returning.mockResolvedValue([{ id: "form-345" }]);

    await createFormData(asTrx(mockTrx), {
      animalName: "Max",
      animalType: "Chien",
      service: "Bilan annuel",
      answers: null,
      preferredPronoun: "vouvoiement",
      socialMediaConsent: false,
      monthlyPlanningAck: true,
      cgvAccepted: true,
    });

    expect(mockTrx.values).toHaveBeenCalledWith(
      expect.objectContaining({ answers: null }),
    );
  });
});
