import { NextRequest } from "next/server";

export function createRequest(
  method: "POST" | "GET" | "PUT" | "DELETE",
  body?: unknown
) {
  return new NextRequest("http://localhost/api/booking/confirm", {
    method,
    body: body === undefined ? undefined : JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

import { vi, Mock } from "vitest";

/**
 * Type représentant une transaction mockée pour les tests.
 * Contient uniquement les méthodes nécessaires pour tester nos services.
 *
 * Cette approche permet de :
 * - Garder les tests lisibles et maintenables
 * - Ne mocker que ce qui est réellement utilisé
 * - Faciliter la compréhension des dépendances de chaque service
 */
export interface MockTransaction {
  select: Mock;
  from: Mock;
  where: Mock;
  limit: Mock;
  insert: Mock;
  values: Mock;
  returning: Mock;
  update: Mock;
  set: Mock;
  execute: Mock;
}

/**
 * Crée une transaction mockée avec des valeurs par défaut.
 * Chaque méthode retourne `this` pour permettre le chaînage,
 * sauf les méthodes terminales (limit, returning, execute).
 *
 * @returns Une transaction mockée prête à être configurée pour les tests
 *
 * @example
 * ```typescript
 * const mockTrx = createMockTransaction();
 * mockTrx.returning.mockResolvedValue([{ id: "123", name: "Test" }]);
 *
 * const result = await createClient(mockTrx, { name: "Test", email: "test@example.com" });
 * ```
 */
export function createMockTransaction(): MockTransaction {
  return {
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    values: vi.fn().mockReturnThis(),
    returning: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    set: vi.fn().mockReturnThis(),
    execute: vi.fn().mockResolvedValue([]),
  };
}

/**
 * Helper pour typer correctement les mocks de transaction
 * dans les appels aux fonctions de service.
 *
 * Utilise un cast via 'any' de manière contrôlée et documentée.
 * Ce cast est nécessaire car nos mocks ne peuvent pas implémenter
 * complètement l'interface complexe de Drizzle (qui contient des
 * dizaines de méthodes et propriétés internes non utilisées).
 *
 * @param mockTrx La transaction mockée
 * @returns La même transaction, typée pour être acceptée par les services
 *
 * @example
 * ```typescript
 * const mockTrx = createMockTransaction();
 * const result = await createClient(asTrx(mockTrx), data);
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function asTrx(mockTrx: MockTransaction): any {
  return mockTrx;
}

/**
 * Vérifie qu'un mock a été appelé avec des valeurs partielles.
 * Utile pour les assertions où on ne veut vérifier que certains champs.
 *
 * @example
 * ```typescript
 * expect(mockTrx.values).toHaveBeenCalledWith(
 *   expectPartial({ name: "John", email: "john@example.com" })
 * );
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function expectPartial(partial: Record<string, any>) {
  return expect.objectContaining(partial);
}

// Helper pour créer des dates relatives (pratique pour les tests de timeout)
export function minutesAgo(minutes: number): Date {
  return new Date(Date.now() - minutes * 60 * 1000);
}

// Helper pour créer un mock de slot
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
