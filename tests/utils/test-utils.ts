import { NextRequest } from "next/server";

export function createRequest(
  method: "POST" | "GET" | "PUT" | "DELETE",
  body?: unknown,
  path: string = "/api/booking/confirm",
) {
  return new NextRequest(`http://localhost${path}`, {
    method,
    body: body === undefined ? undefined : JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}

import { vi, Mock } from "vitest";

/**
 * Mocked transaction shape for tests — only the methods our services
 * actually use.
 */
export interface MockTransaction {
  select: Mock;
  from: Mock;
  where: Mock;
  limit: Mock;
  for: Mock;
  insert: Mock;
  values: Mock;
  returning: Mock;
  update: Mock;
  set: Mock;
  execute: Mock;
  delete: Mock;
}

/**
 * Creates a mocked transaction with sensible defaults. Every method
 * returns `this` for chaining, except the terminal ones (limit,
 * returning, execute).
 */
export function createMockTransaction(): MockTransaction {
  return {
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    for: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    values: vi.fn().mockReturnThis(),
    returning: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    set: vi.fn().mockReturnThis(),
    execute: vi.fn().mockResolvedValue([]),
    delete: vi.fn().mockReturnThis(),
  };
}

/**
 * Casts a mocked transaction to `any` so it satisfies Drizzle's real
 * (much larger) transaction type, which our mocks don't fully implement.
 *
 * @example
 * const result = await createClient(asTrx(mockTrx), data);
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function asTrx(mockTrx: MockTransaction): any {
  return mockTrx;
}

/**
 * Asserts a mock was called with a partial match on specific fields.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function expectPartial(partial: Record<string, any>) {
  return expect.objectContaining(partial);
}

// Helper for relative dates (handy for timeout tests)
export function minutesAgo(minutes: number): Date {
  return new Date(Date.now() - minutes * 60 * 1000);
}

// Helper to create a mock slot
export function createMockSlot(overrides = {}) {
  return {
    id: "slot-123",
    startTime: new Date("2025-01-15T10:00:00Z"),
    endTime: new Date("2025-01-15T11:00:00Z"),
    isActive: true,
    lockedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}
