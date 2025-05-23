import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { GET } from "@/app/api/booking/timeslots/route";

// --- Mock logger to silence logs and avoid side effects ---
vi.mock("@/utils/logger", () => ({
  default: {
    info: vi.fn(),
    error: vi.fn(),
  },
}));

// --- Mock withErrorHandler to just invoke the handler directly ---
vi.mock("@/utils/withErrorHandler", () => ({
  withErrorHandler: async (_req: unknown, fn: () => Promise<any>) => {
    return fn();
  },
}));

// --- Mock Drizzle DB chain: select().from().where().execute() ---
const fakeSlots = [
  {
    id: "slot-1",
    start: new Date().toISOString(),
    isActive: true,
    lockedAt: null,
  },
];
vi.mock("@/src/db/index", () => {
  const chain = {
    select: () => chain,
    from: (_: any) => chain,
    where: (_: any) => chain,
    execute: async () => fakeSlots,
  };
  return { default: chain };
});

// Optional: clear mocks before each test
beforeEach(() => {
  vi.clearAllMocks();
});

// --- Actual test suite ---
describe("GET /api/booking/timeslots", () => {
  it("renvoie un JSON contenant les créneaux mockés", async () => {
    const req = {} as NextRequest;
    const res = await GET(req);
    const json = await res.json();

    expect(json).toHaveProperty("slots");
    expect(Array.isArray(json.slots)).toBe(true);
    expect(json.slots).toEqual(fakeSlots);
  });
});
