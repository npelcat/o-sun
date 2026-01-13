export async function verifyTurnstileToken(token: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          secret: process.env.TURNSTILE_SECRET_KEY,
          response: token,
        }),
      }
    );

    const data = await response.json();

    if (data.success) {
      return { success: true };
    }

    return {
      success: false,
      error: "Vérification de sécurité échouée",
    };
  } catch (error) {
    console.error("Erreur Turnstile:", error);
    return {
      success: false,
      error: "Erreur lors de la vérification de sécurité",
    };
  }
}
