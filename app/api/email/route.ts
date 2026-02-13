import { type NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import logger from "@/utils/logger";
import { verifyTurnstileToken } from "@/lib/validation/turnstile";
import { contactSchema } from "@/lib/validation/contact";
import { contactRateLimiter } from "@/lib/security/rate-limit-simple";

/**
 * @swagger
 * /api/email:
 *   post:
 *     summary: Envoie un message via le formulaire de contact
 *     description: Envoie un email de contact à l'administrateur avec copie au client
 *     tags:
 *       - Email
 *       - Contact
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - message
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nom du client
 *                 minLength: 1
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email du client (recevra une copie)
 *               message:
 *                 type: string
 *                 description: Message du client
 *                 minLength: 1
 *     responses:
 *       200:
 *         description: Email envoyé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Ton e-mail a bien été envoyé, je te répondrai dans les plus brefs délais. En attendant, n'hésite pas à me suivre sur Instagram @o.sun.voixanimale (lien en bas de page) pour rester au courant de mes actualités."
 *       400:
 *         description: Données invalides (validation Zod échouée)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Détails de l'erreur de validation
 *       500:
 *         description: Erreur lors de l'envoi de l'email
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erreur lors de l'envoi de l'e-mail."
 */

export async function POST(request: NextRequest) {
  // Rate limiting
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0] ||
    request.headers.get("x-real-ip") ||
    "unknown";

  const isAllowed = contactRateLimiter.check(ip);

  if (!isAllowed) {
    logger.warn(`Rate limit dépassé pour IP: ${ip} sur /api/contact`);
    return NextResponse.json(
      { error: "Trop de requêtes, réessayez dans quelques instants" },
      { status: 429 },
    );
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    logger.info("POST /email - Received email request");
    const data = await request.json();

    const { name, email, message, turnstileToken } = contactSchema.parse(data);
    logger.info("POST /email - Data validated", { name, email });

    const turnstileCheck = await verifyTurnstileToken(turnstileToken);
    if (!turnstileCheck.success) {
      logger.warn("POST /email - Turnstile verification failed");
      return NextResponse.json(
        {
          error: turnstileCheck.error || "Vérification de sécurité échouée",
        },
        { status: 400 },
      );
    }
    logger.info("POST /email - Turnstile validated ✅");

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
        { status: 500 },
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
