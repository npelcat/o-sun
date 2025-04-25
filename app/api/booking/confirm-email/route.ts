import { type NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import logger from "@/utils/logger";
import { getSlotById } from "@/lib/booking";
import { formatDate, formatTime } from "@/lib/date";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    logger.info("POST /reservation - Received reservation request");

    const data = await request.json();

    const { email, name, timeSlotId, content } = data;
    logger.info("POST /reservation - Data validated", { name, email });
    const slot = await getSlotById(timeSlotId);
    const date = formatDate(slot.startTime);
    const time = formatTime(slot.startTime);

    const userEmailSubject = `Confirmation de votre réservation - O'Sun ~ Voix Animale`;
    const userEmailBody = `
      <div style="font-family: Arial, sans-serif; line-height: 1.5;">
        <h3 style="color: DarkKhaki;">Votre réservation a bien été confirmée !</h3>
        <p>Bonjour ${name},</p>
        <p>J'ai bien reçu votre réservation pour le ${date} à ${time}.</p>
        <p>Voici les détails de votre message :</p>
        <p>${content}</p>
        <p style="font-style: italic; color: green;">Je vous répondrai très bientôt. Merci de votre confiance.</p>
      </div>
    `;

    const oceaneEmailSubject = `Nouvelle réservation reçue - O'Sun ~ Voix Animale`;
    const oceaneEmailBody = `
      <div style="font-family: Arial, sans-serif; line-height: 1.5;">
        <h3 style="color: DarkKhaki;">Nouvelle réservation reçue !</h3>
        <p>Nom du client : ${name}</p>
        <p>Email du client : ${email}</p>
        <p>Date de la réservation : ${date} à ${time}</p>
        <p>Détails supplémentaires :</p>
        <p>${content}</p>
        <p style="font-style: italic; color: green;">Merci de prendre cette réservation en compte.</p>
      </div>
    `;

    const { error: userError } = await resend.emails.send({
      from: `O'Sun ~ Voix Animale <${process.env.RESEND_SENDER_EMAIL}>`,
      to: [email],
      subject: userEmailSubject,
      html: userEmailBody,
    });
    if (userError) {
      logger.error("POST /reservation - Error sending user confirmation", {
        userError,
      });
      return NextResponse.json(
        { error: "Erreur interne, réservation non confirmée." },
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
      logger.error("POST /reservation - Error sending admin notification", {
        adminError,
      });
      return NextResponse.json(
        { error: "Erreur interne, réservation non confirmée." },
        { status: 500 }
      );
    }

    logger.info("POST /reservation - Emails sent successfully");
    return NextResponse.json({
      message:
        "Ta réservation a bien été confirmée. Un email de confirmation t'a été envoyé.",
    });
  } catch (error) {
    logger.error("POST /reservation - Error sending reservation email", {
      error,
    });
    return NextResponse.json(
      { error: "Erreur interne, réservation non confirmée." },
      { status: 500 }
    );
  }
}
