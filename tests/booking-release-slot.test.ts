import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "@/app/api/booking/release-slot/route";
import { NextRequest } from "next/server";

// --- Mock Drizzle DB update chain ---
vi.mock("@/src/db/index", () => {
  const chain = {
    update: () => chain,
    set: () => chain,
    where: () => chain,
    execute: async () => {},
  };
  return { default: chain };
});

beforeEach(() => {
  vi.clearAllMocks();
});

// --- helper to create false request ---
const createRequest = (body: Record<string, unknown>) =>
  ({
    json: async () => body,
  }) as unknown as NextRequest;

describe("POST /api/booking/release-slot", () => {
  it("libère un créneau avec succès", async () => {
    const req = createRequest({ timeSlotId: "slot-123" });
    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toEqual({ message: "Créneau libéré avec succès" });
  });

  it("retourne une erreur 400 si timeSlotId est manquant", async () => {
    const req = createRequest({});
    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json).toEqual({ error: "ID du créneau manquant" });
  });

  it("retourne une erreur 500 si une exception est levée", async () => {
    const db = await import("@/src/db/index");
    vi.spyOn(db.default, "update").mockImplementation(() => {
      throw new Error("DB exploded");
    });

    const req = createRequest({ timeSlotId: "slot-123" });
    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json).toEqual({ error: "Erreur interne" });
  });
});
