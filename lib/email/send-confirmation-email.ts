import { Resend } from "resend";
import { BookingWithDetails } from "@/app/api/types/booking";
import { formatDate, formatTime } from "@/lib/utils/date";
import { safeJsonParse } from "../utils/json";

export interface ConfirmationEmailContent {
  userSubject: string;
  userHtml: string;
  adminSubject: string;
  adminHtml: string;
}

export async function sendConfirmationEmail(
  booking: BookingWithDetails,
): Promise<{ success: boolean; error?: unknown }> {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { userSubject, userHtml, adminSubject, adminHtml } =
    buildConfirmationEmail(booking);

  const { error: userError } = await resend.emails.send({
    from: `O'Sun ~ Voix Animale <${process.env.RESEND_SENDER_EMAIL}>`,
    to: [booking.clientEmail],
    subject: userSubject,
    html: userHtml,
  });

  if (userError) {
    return { success: false, error: userError };
  }

  await resend.emails.send({
    from: `O'Sun ~ Voix Animale <${process.env.RESEND_SENDER_EMAIL}>`,
    to: [process.env.MY_EMAIL!],
    subject: adminSubject,
    html: adminHtml,
  });

  return { success: true };
}

export function buildConfirmationEmail(
  booking: BookingWithDetails,
): ConfirmationEmailContent {
  const {
    clientName,
    clientEmail,
    clientPhone,
    startTime,
    animalName,
    animalType,
    animalInfo,
    householdInfo,
    service,
    serviceSpecificAnswers,
    answers,
    preferredPronoun,
  } = booking;

  const date = formatDate(startTime);
  const time = formatTime(startTime);

  let specificAnswersHtml = "";
  if (serviceSpecificAnswers) {
    try {
      const parsed = safeJsonParse<Record<string, string>>(
        serviceSpecificAnswers,
        {},
      );
      specificAnswersHtml = Object.entries(parsed)
        .map(
          ([key, value]) =>
            `<p><strong>${key.replace(/_/g, " ")} :</strong> ${value}</p>`,
        )
        .join("");
    } catch {
      specificAnswersHtml = `<p>${serviceSpecificAnswers}</p>`;
    }
  }

  const formContent = `
    <p><strong>Animal :</strong> ${animalName}${animalType ? ` (${animalType})` : ""}</p>
    ${animalInfo ? `<p><strong>Infos animal :</strong> ${animalInfo}</p>` : ""}
    ${householdInfo ? `<p><strong>Infos foyer :</strong> ${householdInfo}</p>` : ""}
    <p><strong>Service :</strong> ${service}</p>
    ${specificAnswersHtml}
    ${answers ? `<p><strong>Informations complémentaires :</strong> ${answers}</p>` : ""}
  `;

  // Email client
  const userSubject = `Confirmation de votre demande de réservation - O'Sun ~ Voix Animale`;
  const userHtml = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2 style="color: #DAA520;">✅ Votre demande de réservation m'a été envoyée !</h2>
      <p>Bonjour <strong>${clientName}</strong>,</p>
      <p>J'ai bien reçu votre réservation pour le <strong>${date} à ${time}</strong>.</p>
      <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #DAA520; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #DAA520;">Détails de votre réservation :</h3>
        ${formContent}
      </div>
      <p style="font-style: italic; color: #2d5016;">
        Je vous répondrai très bientôt. Merci de votre confiance ! 🌿
      </p>
      <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
      <p style="font-size: 12px; color: #666;">O'Sun ~ Voix Animale<br>Communication animale</p>
    </div>
  `;

  // Email admin
  const adminSubject = `🔔 Nouvelle demande de réservation - ${clientName}`;
  const adminHtml = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2 style="color: #DAA520;">📅 Nouvelle réservation reçue</h2>
      <div style="background-color: #f0f8ff; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p><strong>👤 Client :</strong> ${clientName}</p>
        <p><strong>📧 Email :</strong> <a href="mailto:${clientEmail}">${clientEmail}</a></p>
        ${clientPhone ? `<p><strong>📞 Téléphone :</strong> ${clientPhone}</p>` : ""}
        <p><strong>🗣️ Préférence :</strong> ${preferredPronoun}</p>
        <p><strong>📅 Date :</strong> ${date}</p>
        <p><strong>🕐 Heure :</strong> ${time}</p>
      </div>
      <div style="background-color: #fffef0; padding: 15px; border-left: 4px solid #DAA520; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #DAA520;">Détails de la réservation :</h3>
        ${formContent}
      </div>
      <p style="font-style: italic; color: #2d5016;">Pense à confirmer cette réservation avec le client ! ✨</p>
    </div>
  `;

  return { userSubject, userHtml, adminSubject, adminHtml };
}
