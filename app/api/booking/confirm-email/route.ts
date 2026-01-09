import { type NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import logger from "@/utils/logger";
import { formatDate, formatTime } from "@/lib/date";
import z from "zod";
import { withErrorHandler } from "@/utils/withErrorHandler";
import { getBookingById } from "@/lib/bookings";

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
    logger.info("POST /booking/confirm-email - Email confirmation request");

    const body = await request.json();
    const { bookingId } = confirmEmailSchema.parse(body);

    const booking = await getBookingById(bookingId);

    const {
      clientName,
      clientEmail,
      startTime,
      animalName,
      animalType,
      service,
      answers,
    } = booking;

    const date = formatDate(startTime);
    const time = formatTime(startTime);

    let formContent = `
      <p><strong>Animal :</strong> ${animalName}${animalType ? ` (${animalType})` : ""}</p>
      <p><strong>Service :</strong> ${service}</p>
    `;

    if (answers) {
      try {
        const parsedAnswers =
          typeof answers === "string" ? JSON.parse(answers) : answers;
        formContent += `<p><strong>Informations supplémentaires :</strong></p><pre>${JSON.stringify(parsedAnswers, null, 2)}</pre>`;
      } catch {
        formContent += `<p><strong>Informations supplémentaires :</strong> ${answers}</p>`;
      }
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const userEmailSubject = `Confirmation de votre demande de réservation - O'Sun ~ Voix Animale`;
    const userEmailBody = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #DAA520;">✅ Votre demande de réservation m'a été envoyée !</h2>
        <p>Bonjour <strong>${clientName}</strong>,</p>
        <p>J'ai bien reçu votre réservation pour le <strong>${date} à ${time}</strong>.</p>
        
        <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #DAA520; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #DAA520;">Détails de votre réservation :</h3>
          ${formContent}
        </div>
        
        <p style="font-style: italic; color: #2d5016;">Je vous répondrai très bientôt. Merci de votre confiance ! 🌿</p>
        
        <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
        <p style="font-size: 12px; color: #666;">
          O'Sun ~ Voix Animale<br>
          Communication animale
        </p>
      </div>
    `;

    const oceaneEmailSubject = `🔔 Nouvelle demande de réservation - ${clientName}`;
    const oceaneEmailBody = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #DAA520;">📅 Nouvelle réservation reçue</h2>
        
        <div style="background-color: #f0f8ff; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>👤 Client :</strong> ${clientName}</p>
          <p><strong>📧 Email :</strong> <a href="mailto:${clientEmail}">${clientEmail}</a></p>
          <p><strong>📅 Date :</strong> ${date}</p>
          <p><strong>🕐 Heure :</strong> ${time}</p>
        </div>
        
        <div style="background-color: #fffef0; padding: 15px; border-left: 4px solid #DAA520; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #DAA520;">Détails de la réservation :</h3>
          ${formContent}
        </div>
        
        <p style="font-style: italic; color: #2d5016;">
          Pense à confirmer cette réservation avec le client en le contactant directement via ses coordonnées ! ✨
        </p>
      </div>
    `;

    const { error: userError } = await resend.emails.send({
      from: `O'Sun ~ Voix Animale <${process.env.RESEND_SENDER_EMAIL}>`,
      to: [clientEmail],
      subject: userEmailSubject,
      html: userEmailBody,
    });

    if (userError) {
      logger.error("POST /booking/confirm-email - Error sending user email", {
        userError,
        bookingId,
      });
      return NextResponse.json(
        { error: "Erreur lors de l'envoi de l'email de confirmation" },
        { status: 500 }
      );
    }

    const { error: adminError } = await resend.emails.send({
      from: `O'Sun ~ Voix Animale <${process.env.RESEND_SENDER_EMAIL}>`,
      to: [process.env.MY_EMAIL!],
      subject: oceaneEmailSubject,
      html: oceaneEmailBody,
    });

    if (adminError) {
      logger.error("POST /booking/confirm-email - Error sending admin email", {
        adminError,
        bookingId,
      });
    }

    logger.info("POST /booking/confirm-email - Emails sent successfully", {
      bookingId,
      clientEmail,
    });

    return NextResponse.json({
      message: "Emails de confirmation envoyés avec succès",
    });
  });
}
