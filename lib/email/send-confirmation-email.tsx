// lib/email/sendConfirmationEmail.ts
import { Resend } from "resend";
import { render } from "@react-email/render";
import { BookingWithDetails } from "@/app/api/types/booking";
import { formatDate, formatTime } from "@/lib/utils/date";
import { safeJsonParse } from "@/lib/utils/json";
import { ConfirmationUserEmail } from "@/emails/ConfirmationUserEmail";
import { ConfirmationAdminEmail } from "@/emails/ConfirmationAdminEmail";

export async function sendConfirmationEmail(
  booking: BookingWithDetails,
): Promise<{ success: boolean; error?: unknown }> {
  const resend = new Resend(process.env.RESEND_API_KEY);

  const date = formatDate(booking.startTime);
  const time = formatTime(booking.startTime);
  const serviceSpecificAnswers = safeJsonParse<Record<string, string>>(
    booking.serviceSpecificAnswers,
    {},
  );

  // Rendu HTML des composants React
  const userHtml = await render(
    <ConfirmationUserEmail
      clientName={booking.clientName}
      date={date}
      time={time}
      animalName={booking.animalName}
      animalType={booking.animalType}
      animalInfo={booking.animalInfo}
      householdInfo={booking.householdInfo}
      service={booking.service}
      serviceSpecificAnswers={serviceSpecificAnswers}
      answers={booking.answers}
    />,
  );

  const adminHtml = await render(
    <ConfirmationAdminEmail
      clientName={booking.clientName}
      clientEmail={booking.clientEmail}
      clientPhone={booking.clientPhone}
      preferredPronoun={booking.preferredPronoun}
      date={date}
      time={time}
      animalName={booking.animalName}
      animalType={booking.animalType}
      animalInfo={booking.animalInfo}
      householdInfo={booking.householdInfo}
      service={booking.service}
      serviceSpecificAnswers={serviceSpecificAnswers}
      answers={booking.answers}
    />,
  );

  const { error: userError } = await resend.emails.send({
    from: `O'Sun ~ Voix Animale <${process.env.RESEND_SENDER_EMAIL}>`,
    to: [booking.clientEmail],
    subject: `Confirmation de votre demande de réservation - O'Sun ~ Voix Animale`,
    html: userHtml,
  });

  if (userError) return { success: false, error: userError };

  await resend.emails.send({
    from: `O'Sun ~ Voix Animale <${process.env.RESEND_SENDER_EMAIL}>`,
    to: [process.env.MY_EMAIL!],
    subject: `🔔 Nouvelle demande de réservation - ${booking.clientName}`,
    html: adminHtml,
  });

  return { success: true };
}
