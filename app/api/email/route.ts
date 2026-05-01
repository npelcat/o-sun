import { type NextRequest, NextResponse } from "next/server";
import logger from "@/utils/logger";
import { verifyTurnstileToken } from "@/lib/validation/turnstile";
import { contactSchema } from "@/lib/validation/contact";
import { contactRateLimiter } from "@/lib/security/rate-limit-simple";
import { sendContactEmail } from "@/lib/email/send-contact-email";

/**
 * @swagger
 * /api/email:
 *   post:
 *     summary: Envoie un message via le formulaire de contact
 *     description: |
 *       Envoie un email à l'administrateur avec copie au client.
 *       ⚠️ Cette route ne peut pas être testée depuis Swagger car elle requiert
 *       un token Turnstile valide (anti-bot), généré uniquement via le formulaire web.
 *     tags:
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
 *               - turnstileToken
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nom du client
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email du client (recevra une copie)
 *               message:
 *                 type: string
 *                 description: Message du client
 *               turnstileToken:
 *                 type: string
 *                 description: Token de vérification Cloudflare Turnstile (généré par le widget anti-bot)
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
 *                   example: "Ton e-mail a bien été envoyé..."
 *       400:
 *         description: Données invalides ou vérification Turnstile échouée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
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

  try {
    const data = await request.json();
    const { name, email, message, turnstileToken } = contactSchema.parse(data);
    logger.info("POST /email - Data validated", { name, email });

    const turnstileCheck = await verifyTurnstileToken(turnstileToken);
    if (!turnstileCheck.success) {
      logger.warn("POST /email - Turnstile verification failed");
      return NextResponse.json(
        { error: turnstileCheck.error || "Vérification de sécurité échouée" },
        { status: 400 },
      );
    }
    logger.info("POST /email - Turnstile validated ✅");

    const result = await sendContactEmail({ name, email, message });

    if (!result.success) {
      logger.error("POST /email - Resend API error", { error: result.error });
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
    logger.error("POST /email - Error", { error });
    if (error instanceof Error && "issues" in error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
