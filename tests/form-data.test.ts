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
      createdAt: new Date(),
    };

    mockTrx.returning.mockResolvedValue([mockForm]);

    const result = await createFormData(asTrx(mockTrx), {
      animalName: "Rex",
      animalType: "Chien",
      service: "Consultation",
      answers: { question1: "réponse1" },
    });

    expect(result).toEqual(mockForm);
    expect(mockTrx.insert).toHaveBeenCalled();
    expect(mockTrx.values).toHaveBeenCalledWith({
      animalName: "Rex",
      animalType: "Chien",
      service: "Consultation",
      answers: JSON.stringify({ question1: "réponse1" }),
    });
  });

  it("should handle null animalType", async () => {
    const mockTrx = createMockTransaction();

    const mockForm = {
      id: "form-456",
      animalName: "Minou",
      animalType: null,
      service: "Vaccination",
      answers: null,
      createdAt: new Date(),
    };

    mockTrx.returning.mockResolvedValue([mockForm]);

    const result = await createFormData(asTrx(mockTrx), {
      animalName: "Minou",
      service: "Vaccination",
    });

    expect(result.animalType).toBeNull();
    expect(mockTrx.values).toHaveBeenCalledWith({
      animalName: "Minou",
      animalType: null,
      service: "Vaccination",
      answers: null,
    });
  });

  it("should handle string answers", async () => {
    const mockTrx = createMockTransaction();

    const mockForm = {
      id: "form-789",
      animalName: "Tweety",
      animalType: "Oiseau",
      service: "Contrôle",
      answers: "Notes libres du client",
      createdAt: new Date(),
    };

    mockTrx.returning.mockResolvedValue([mockForm]);

    await createFormData(asTrx(mockTrx), {
      animalName: "Tweety",
      animalType: "Oiseau",
      service: "Contrôle",
      answers: "Notes libres du client",
    });

    expect(mockTrx.values).toHaveBeenCalledWith({
      animalName: "Tweety",
      animalType: "Oiseau",
      service: "Contrôle",
      answers: "Notes libres du client",
    });
  });

  it("should stringify object answers", async () => {
    const mockTrx = createMockTransaction();

    const mockForm = {
      id: "form-012",
      animalName: "Bella",
      animalType: "Chat",
      service: "Urgence",
      answers: JSON.stringify({ symptômes: "léthargie", durée: "2 jours" }),
      createdAt: new Date(),
    };

    mockTrx.returning.mockResolvedValue([mockForm]);

    await createFormData(asTrx(mockTrx), {
      animalName: "Bella",
      animalType: "Chat",
      service: "Urgence",
      answers: { symptômes: "léthargie", durée: "2 jours" },
    });

    expect(mockTrx.values).toHaveBeenCalledWith({
      animalName: "Bella",
      animalType: "Chat",
      service: "Urgence",
      answers: JSON.stringify({ symptômes: "léthargie", durée: "2 jours" }),
    });
  });

  it("should handle null answers", async () => {
    const mockTrx = createMockTransaction();

    const mockForm = {
      id: "form-345",
      animalName: "Max",
      animalType: "Chien",
      service: "Bilan annuel",
      answers: null,
      createdAt: new Date(),
    };

    mockTrx.returning.mockResolvedValue([mockForm]);

    await createFormData(asTrx(mockTrx), {
      animalName: "Max",
      animalType: "Chien",
      service: "Bilan annuel",
      answers: null,
    });

    expect(mockTrx.values).toHaveBeenCalledWith({
      animalName: "Max",
      animalType: "Chien",
      service: "Bilan annuel",
      answers: null,
    });
  });
});
