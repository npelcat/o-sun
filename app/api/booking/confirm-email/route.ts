import { type NextRequest, NextResponse } from "next/server";
import logger from "@/utils/logger";
import z from "zod";
import { withErrorHandler } from "@/utils/withErrorHandler";
import { getBookingById } from "@/lib/bookings";
import { apiRateLimiter } from "@/lib/security/rate-limit-simple";
import { sendConfirmationEmail } from "@/lib/email/send-confirmation-email";

/**
 * @swagger
 * /api/booking/confirm-email:
 *   post:
 *     summary: Envoie les emails de confirmation de réservation
 *     description: |
 *       Récupère une réservation complète (avec client, créneau et formulaire)
 *       et envoie deux emails :
 *       - Un email de confirmation au client
 *       - Un email de notification à l'administrateur
 *     tags:
 *       - Email
 *       - Booking
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bookingId
 *             properties:
 *               bookingId:
 *                 type: string
 *                 format: uuid
 *                 description: ID de la réservation (avec toutes les infos enrichies)
 *                 example: "550e8400-e29b-41d4-a716-446655440000"
 *     responses:
 *       200:
 *         description: Emails envoyés avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Emails de confirmation envoyés avec succès"
 *       400:
 *         description: ID de réservation invalide (validation Zod échouée)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "ID de réservation invalide"
 *       404:
 *         description: Réservation introuvable
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Réservation non trouvée"
 *       429:
 *         description: Trop de requêtes (rate limiting par IP)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Trop de requêtes, réessayez dans quelques instants"
 *       500:
 *         description: Erreur lors de l'envoi des emails (API Resend)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erreur lors de l'envoi de l'email de confirmation"
 */

const confirmEmailSchema = z.object({
  bookingId: z.string().uuid("ID de réservation invalide"),
});

export async function POST(request: NextRequest) {
  return withErrorHandler(request, async () => {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0] ||
      request.headers.get("x-real-ip") ||
      "unknown";

    const isAllowed = apiRateLimiter.check(ip);
    if (!isAllowed) {
      logger.warn(
        `Rate limit dépassé pour IP: ${ip} sur /api/booking/confirm-email`,
      );
      return NextResponse.json(
        { error: "Trop de requêtes, réessayez dans quelques instants" },
        { status: 429 },
      );
    }

    const body = await request.json();
    const { bookingId } = confirmEmailSchema.parse(body);

    const booking = await getBookingById(bookingId);
    const result = await sendConfirmationEmail(booking);

    if (!result.success) {
      logger.error("Échec envoi email confirmation", {
        error: result.error,
        bookingId,
      });
      return NextResponse.json(
        { error: "Erreur lors de l'envoi de l'email de confirmation" },
        { status: 500 },
      );
    }

    logger.info("Emails envoyés avec succès", { bookingId });
    return NextResponse.json({
      message: "Emails de confirmation envoyés avec succès",
    });
  });
}
