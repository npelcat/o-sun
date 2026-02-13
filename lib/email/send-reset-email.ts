import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPasswordResetEmail(
  email: string,
  resetToken: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    // Construis l'URL de reset
    const resetUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/reset-password?token=${resetToken}`;

    const { error } = await resend.emails.send({
      from: `O'Sun ~ Voix Animale <${process.env.RESEND_SENDER_EMAIL}>`,
      to: [email],
      subject: "Réinitialisation de votre mot de passe",
      html: `
        <div style="font-family: Maitree, sans-serif; line-height: 1.5;">
          <h2>Réinitialisation de mot de passe</h2>
          
          <p>Vous avez demandé à réinitialiser votre mot de passe.</p>
          
          <p>Cliquez sur le lien ci-dessous pour créer un nouveau mot de passe :</p>
          
          <a 
            href="${resetUrl}" 
            style="
              display: inline-block;
              padding: 12px 24px;
              background-color: #2E7D32;
              color: white;
              text-decoration: none;
              border-radius: 4px;
              margin: 16px 0;
            "
          >
            Réinitialiser mon mot de passe
          </a>
          
          <p style="color: #666; font-size: 14px;">
            Ce lien est valide pendant <strong>30 minutes</strong>.
          </p>
          
          <p style="color: #666; font-size: 14px;">
            Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.
          </p>
          
          <hr style="margin: 24px 0; border: none; border-top: 1px solid #eee;">
          
          <p style="font-style: italic; color: silver; font-size: 12px;">
            Message automatique - Ne pas répondre
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("Erreur envoi email reset:", error);
      return { success: false, error: "Erreur lors de l'envoi de l'email" };
    }

    return { success: true };
  } catch (error) {
    console.error("Erreur sendPasswordResetEmail:", error);
    return { success: false, error: "Erreur interne" };
  }
}
