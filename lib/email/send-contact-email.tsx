import { Resend } from "resend";
import { render } from "@react-email/render";
import { ContactNotificationEmail } from "@/emails/ContactNotificationEmail";
import { ContactAcknowledgmentEmail } from "@/emails/ContactAcknowledgmentEmail";

interface ContactEmailData {
  name: string;
  email: string;
  message: string;
}

export async function sendContactEmail(
  data: ContactEmailData,
): Promise<{ success: boolean; error?: unknown }> {
  const { name, email, message } = data;
  const resend = new Resend(process.env.RESEND_API_KEY);

  // Render des deux templates en parallèle
  const [notificationHtml, acknowledgmentHtml] = await Promise.all([
    render(
      <ContactNotificationEmail name={name} email={email} message={message} />,
    ),
    render(<ContactAcknowledgmentEmail name={name} message={message} />),
  ]);

  // Notification à l'admin
  const { error: notifError } = await resend.emails.send({
    from: `O'Sun ~ Voix Animale <${process.env.RESEND_SENDER_EMAIL}>`,
    to: [process.env.MY_EMAIL!],
    subject: `💌 Message de ${name}`,
    html: notificationHtml,
  });

  if (notifError) return { success: false, error: notifError };

  // Accusé de réception à l'utilisateur
  const { error: ackError } = await resend.emails.send({
    from: `O'Sun ~ Voix Animale <${process.env.RESEND_SENDER_EMAIL}>`,
    to: [email],
    subject: `Merci pour votre message — O'Sun ~ Voix Animale`,
    html: acknowledgmentHtml,
  });

  if (ackError) return { success: false, error: ackError };

  return { success: true };
}
