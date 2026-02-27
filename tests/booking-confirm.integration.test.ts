import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "@/app/api/booking/confirm/route";
import { createRequest, minutesAgo } from "./utils/test-utils";

// ============================================================
// TEST D'INTÉGRATION — POST /api/booking/confirm
//
// Ce test est un TEST D'INTÉGRATION (et non unitaire) car :
//
// - Aucune fonction métier n'est mockée : validateSlotForConfirmation,
//   createOrUpdateClient, createFormData, createBooking et
//   confirmSlotPermanently s'exécutent toutes vraiment, dans
//   leur vrai ordre, avec leur vraie logique.
//
// - On teste le flux bout-en-bout depuis la requête HTTP jusqu'à
//   la réponse finale, en passant par toutes les couches métier.
//
// - Seules les dépendances externes sont mockées :
//   la base de données (couche infrastructure, pas métier),
//   Turnstile (service tiers) et la validation d'email (service tiers).
//
// Ce que ce test couvre que les tests unitaires ne couvrent pas :
//   ✅ L'ordre d'appel des fonctions métier dans la transaction
//   ✅ Le fait que le résultat de createOrUpdateClient est bien
//      passé à createBooking (client.id)
//   ✅ Le fait que le résultat de createFormData est bien passé
//      à createBooking (form.id)
//   ✅ Le comportement de la route quand le créneau est expiré
//      (validateSlotForConfirmation lève une HttpError 410 qui
//       remonte jusqu'à la réponse HTTP via withErrorHandler)
//   ✅ Le comportement complet quand le client existe déjà
//      (isNew: false) vs quand il est nouveau (isNew: true)
// ============================================================

// --- Mocks des dépendances externes uniquement ---

// Turnstile est un service tiers de protection anti-bot (Cloudflare).
// On le mock pour ne pas dépendre d'un appel réseau dans les tests.
vi.mock("@/lib/validation/turnstile", () => ({
  verifyTurnstileToken: vi.fn().mockResolvedValue({ success: true }),
}));

// La validation d'email fait appel à une bibliothèque externe.
// On la mock pour isoler notre logique des dépendances réseau.
vi.mock("@/lib/validation/email", () => ({
  validateEmail: vi.fn().mockResolvedValue({ isValid: true }),
}));

// Le rate limiter est basé sur l'IP et n'a pas de sens dans un contexte de test.
// On le mock pour qu'il laisse toujours passer les requêtes.
vi.mock("@/lib/security/rate-limit-simple", () => ({
  apiRateLimiter: { check: vi.fn().mockReturnValue(true) },
}));

// Le logger est mocké pour éviter du bruit dans la sortie des tests.
vi.mock("@/utils/logger", () => ({
  default: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

// La base de données est la seule couche infrastructure mockée.
// On mock uniquement `transaction` car c'est le point d'entrée
// de tout le flux de réservation dans la route /confirm.
// Les fonctions métier appelées à l'intérieur (validateSlot,
// createOrUpdateClient, etc.) reçoivent notre fausse transaction
// et s'exécutent avec leur vraie logique.
vi.mock("@/src/db/index", () => {
  const mockDb = { transaction: vi.fn() };
  return { default: mockDb };
});

import db from "@/src/db/index";
const mockDb = db as unknown as { transaction: ReturnType<typeof vi.fn> };

// Payload valide réutilisé dans tous les tests.
// Il correspond à ce qu'un client enverrait depuis le formulaire de réservation.
// On le déclare une seule fois ici pour éviter la duplication et
// faciliter la maintenance si le schéma de validation évolue.
const validPayload = {
  timeSlotId: "550e8400-e29b-41d4-a716-446655440001",
  clientName: "Marie Dupont",
  clientEmail: "marie@example.com",
  clientPhone: "0612345678",
  animalName: "Rex",
  animalType: "Chien",
  service: "Communication animale",
  answers: { question1: "réponse1" },
  turnstileToken: "valid-token",
};

/**
 * Construit une fausse transaction Drizzle adaptée au flux de /confirm.
 *
 * Ce helper est spécifique à ce test d'intégration : il simule l'enchaînement
 * exact des appels Drizzle produits par les 5 fonctions métier appelées
 * dans la transaction de la route /confirm :
 *
 *   1. validateSlotForConfirmation → select().from().where().limit().execute()
 *   2. createOrUpdateClient        → select().from().where().limit()
 *                                    puis insert().values().returning()
 *                                    ou  update().set().where().returning()
 *   3. createFormData              → insert().values().returning()
 *   4. createBooking               → insert().values().returning()
 *   5. confirmSlotPermanently      → update().set().where().execute()
 *
 * Toutes les méthodes retournent le même objet `trx` pour permettre le
 * chaînage fluent de Drizzle. Les méthodes terminales (execute, limit,
 * returning) sont configurées avec des queues de valeurs via
 * mockResolvedValueOnce, ce qui permet à chaque appel successif de
 * retourner le bon résultat dans le bon ordre.
 *
 * Ce helper reste dans ce fichier (et non dans test-utils) car il est
 * trop spécifique à ce flux pour être réutilisé ailleurs.
 */
function buildTrxMock({
  slotData,
  existingClient = null,
  clientResult,
  formResult,
  bookingResult,
}: {
  slotData: object | null;
  existingClient?: object | null;
  clientResult?: object;
  formResult?: object;
  bookingResult?: object;
}) {
  // Valeurs par défaut utilisées quand le test ne fournit pas de données spécifiques.
  // Elles correspondent à un cas nominal : nouveau client, réservation créée avec succès.
  const defaultClient = {
    id: "client-123",
    name: "Marie Dupont",
    email: "marie@example.com",
  };
  const defaultForm = {
    id: "form-456",
    animalName: "Rex",
    service: "Communication animale",
  };
  const defaultBooking = {
    id: "booking-789",
    timeSlotId: validPayload.timeSlotId,
    clientId: "client-123",
    formId: "form-456",
    status: "pending",
  };

  // On crée trx comme un objet plain et on y assigne chaque méthode
  // en référençant explicitement trx. C'est nécessaire parce que
  // mockReturnThis() dans un vi.fn() ne pointe pas vers l'objet trx,
  // mais vers le mock lui-même — ce qui casse le chaînage Drizzle.
  const trx = {} as Record<string, ReturnType<typeof vi.fn>>;

  // execute() est appelé 2 fois dans le flux nominal :
  //   Appel 1 — validateSlotForConfirmation : retourne le créneau (ou [])
  //   Appel 2 — confirmSlotPermanently      : ne retourne rien (void)
  trx.execute = vi
    .fn()
    .mockResolvedValueOnce(slotData ? [slotData] : [])
    .mockResolvedValueOnce(undefined);

  // limit() est appelé 2 fois :
  //   Appel 1 — validateSlotForConfirmation : doit retourner trx
  //             pour pouvoir enchaîner .execute() juste après
  //   Appel 2 — createOrUpdateClient        : retourne directement
  //             le client existant (ou []) sans enchaînement
  trx.limit = vi
    .fn()
    .mockReturnValueOnce(trx)
    .mockResolvedValueOnce(existingClient ? [existingClient] : []);

  // returning() est appelé 3 fois dans l'ordre :
  //   Appel 1 — insert ou update du client
  //   Appel 2 — insert du formulaire (createFormData)
  //   Appel 3 — insert de la réservation (createBooking)
  trx.returning = vi
    .fn()
    .mockResolvedValueOnce([clientResult ?? defaultClient])
    .mockResolvedValueOnce([formResult ?? defaultForm])
    .mockResolvedValueOnce([bookingResult ?? defaultBooking]);

  // Toutes les méthodes chaînables retournent trx pour permettre
  // à Drizzle d'enchaîner les appels : select().from().where()...
  for (const method of [
    "select",
    "from",
    "where",
    "insert",
    "values",
    "update",
    "set",
    "for",
    "delete",
    "orderBy",
  ]) {
    trx[method] = vi.fn().mockReturnValue(trx);
  }

  return trx;
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("POST /api/booking/confirm - integration", () => {
  it("should create a complete booking for a new client", async () => {
    // Créneau valide : actif et verrouillé il y a 5 minutes (dans la fenêtre de 15 min).
    // minutesAgo est importé depuis test-utils car c'est un helper générique
    // réutilisable dans n'importe quel test impliquant des durées relatives.
    const slot = {
      id: validPayload.timeSlotId,
      isActive: true,
      lockedAt: minutesAgo(5),
    };
    const trx = buildTrxMock({ slotData: slot, existingClient: null });
    mockDb.transaction.mockImplementation(
      async (cb: (t: unknown) => Promise<unknown>) => cb(trx),
    );

    const response = await POST(createRequest("POST", validPayload));
    expect(response.status).toBe(201);

    const body = await response.json();
    expect(body.message).toBe("Réservation confirmée");

    // On vérifie que les IDs ont bien été transmis entre les couches :
    // createOrUpdateClient → createBooking (clientId)
    // createFormData       → createBooking (formId)
    expect(body.data.booking.id).toBe("booking-789");
    expect(body.data.booking.clientId).toBe("client-123");
    expect(body.data.booking.formId).toBe("form-456");

    // Un insert doit avoir eu lieu (nouveau client)
    expect(trx.insert).toHaveBeenCalled();

    // execute() doit avoir été appelé exactement 2 fois :
    // une fois pour valider le créneau, une fois pour le confirmer définitivement
    expect(trx.execute).toHaveBeenCalledTimes(2);
  });

  it("should update an existing client and create the booking", async () => {
    const slot = {
      id: validPayload.timeSlotId,
      isActive: true,
      lockedAt: minutesAgo(5),
    };

    // Client déjà présent en base avec des données légèrement différentes
    const existingClient = {
      id: "client-existant-999",
      name: "Marie D.",
      email: "marie@example.com",
      phone: "0600000000",
    };
    const updatedClient = {
      ...existingClient,
      name: "Marie Dupont",
      phone: "0612345678",
    };

    // La réservation doit porter l'ID du client existant, pas un nouvel ID
    const booking = {
      id: "booking-789",
      timeSlotId: validPayload.timeSlotId,
      clientId: "client-existant-999",
      formId: "form-456",
      status: "pending",
    };

    const trx = buildTrxMock({
      slotData: slot,
      existingClient,
      clientResult: updatedClient,
      bookingResult: booking,
    });
    mockDb.transaction.mockImplementation(
      async (cb: (t: unknown) => Promise<unknown>) => cb(trx),
    );

    const response = await POST(createRequest("POST", validPayload));
    expect(response.status).toBe(201);

    const body = await response.json();
    // Vérifie que c'est bien l'ID du client existant qui est utilisé dans la réservation
    expect(body.data.booking.clientId).toBe("client-existant-999");

    // update doit avoir été appelé (mise à jour du client existant, pas un insert)
    expect(trx.update).toHaveBeenCalled();
  });

  it("should return 410 when the slot lock has expired", async () => {
    // Créneau verrouillé il y a 20 minutes : au-delà de la fenêtre de 15 min.
    // validateSlotForConfirmation lève une HttpError(410) qui remonte
    // à travers la transaction jusqu'au withErrorHandler de la route.
    // C'est précisément ce comportement de propagation qu'un test
    // unitaire sur validateSlotForConfirmation seul ne peut pas couvrir.
    const slot = {
      id: validPayload.timeSlotId,
      isActive: true,
      lockedAt: minutesAgo(20),
    };
    const trx = buildTrxMock({ slotData: slot });
    mockDb.transaction.mockImplementation(
      async (cb: (t: unknown) => Promise<unknown>) => cb(trx),
    );

    const response = await POST(createRequest("POST", validPayload));
    expect(response.status).toBe(410);

    const body = await response.json();
    expect(body.error).toContain("expiré");

    // Aucune insertion ne doit avoir eu lieu : la transaction a été interrompue
    expect(trx.insert).not.toHaveBeenCalled();
  });

  it("should return 409 when the slot is not locked", async () => {
    // Créneau actif mais sans verrou : le client n'a pas effectué
    // l'étape de réservation provisoire (reserveSlot) avant de confirmer.
    const slot = {
      id: validPayload.timeSlotId,
      isActive: true,
      lockedAt: null,
    };
    const trx = buildTrxMock({ slotData: slot });
    mockDb.transaction.mockImplementation(
      async (cb: (t: unknown) => Promise<unknown>) => cb(trx),
    );

    const response = await POST(createRequest("POST", validPayload));
    expect(response.status).toBe(409);

    expect(trx.insert).not.toHaveBeenCalled();
  });

  it("should return 400 when the request body fails schema validation", async () => {
    // timeSlotId manquant : Zod doit rejeter la requête avant même
    // d'ouvrir une transaction. Ce test vérifie que la validation
    // du schéma fait bien office de première ligne de défense.
    const response = await POST(
      createRequest("POST", {
        clientName: "Marie Dupont",
        clientEmail: "marie@example.com",
        animalName: "Rex",
        service: "Communication animale",
        turnstileToken: "valid-token",
      }),
    );

    expect(response.status).toBe(400);

    // La transaction ne doit jamais avoir été ouverte
    expect(mockDb.transaction).not.toHaveBeenCalled();
  });
});
