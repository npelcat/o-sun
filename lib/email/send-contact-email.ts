import { Resend } from "resend";

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

  const { error } = await resend.emails.send({
    from: `O'Sun ~ Voix Animale <${process.env.RESEND_SENDER_EMAIL}>`,
    to: [process.env.MY_EMAIL!],
    cc: [email],
    subject: `Message de ${name} (${email})`,
    html: buildContactEmailHtml(name, email, message),
  });

  if (error) {
    return { success: false, error };
  }

  return { success: true };
}

function buildContactEmailHtml(
  name: string,
  email: string,
  message: string,
): string {
  return `
    <div style="font-family: Maitree, sans-serif; line-height: 1.5;">
      <p style="font-style: italic; color: green;">
        Merci pour votre message. Je vous répondrai très bientôt.
      </p>
      <h3 style="color: DarkKhaki">O'Sun ~ Voix Animale</h3>
      <p>~</p>
      <h2>Message de ${name} (${email})</h2>
      <p>${message.replace(/\n/g, "<br>")}</p>
      <br>
      <p style="font-style: italic; color: silver;">
        Message automatique envoyé par le formulaire de contact.<br>
        Ne pas répondre.
      </p>
    </div>
  `;
}
