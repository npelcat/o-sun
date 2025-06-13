import { type NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { contactSchema } from "./contactSchema";
import logger from "@/utils/logger";

export async function POST(request: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    logger.info("POST /email - Received email request");
    const data = await request.json();

    const { name, email, message } = contactSchema.parse(data);
    logger.info("POST /email - Data validated", { name, email });

    const { error } = await resend.emails.send({
      from: `O'Sun ~ Voix Animale <${process.env.RESEND_SENDER_EMAIL}>`,
      to: [process.env.MY_EMAIL!],
      cc: [email],
      subject: `Message de ${name} (${email})`,
      html: `
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
            Message automatique envoyé par le formulaire de contact.
            </br>
            Ne pas répondre.
          </p>
        </div>
      `,
    });

    if (error) {
      logger.error("POST /email - Resend API error", { error });
      console.error("Resend API error details:", error);
      return NextResponse.json(
        { error: "Erreur lors de l'envoi de l'e-mail." },
        { status: 500 }
      );
    }

    logger.info("POST /email - Email sent successfully");
    return NextResponse.json({
      message:
        "Ton e-mail a bien été envoyé, je te répondrai dans les plus brefs délais. En attendant, n'hésite pas à me suivre sur Instagram @o.sun.voixanimale (lien en bas de page) pour rester au courant de mes actualités.",
    });
  } catch (error) {
    logger.error("POST /email - Error sending email", { error });
    if (error instanceof Error && "issues" in error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
