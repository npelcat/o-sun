export const POPULAR_DOMAINS = [
  "gmail.com",
  "gmail.fr",
  "yahoo.fr",
  "yahoo.com",
  "hotmail.fr",
  "hotmail.com",
  "outlook.fr",
  "outlook.com",
  "orange.fr",
  "wanadoo.fr",
  "free.fr",
  "sfr.fr",
  "laposte.net",
  "bbox.fr",
  "icloud.com",
  "live.fr",
  "live.com",
  "protonmail.com",
  "proton.me",
];

export const DISPOSABLE_DOMAINS = [
  "guerrillamail.com",
  "10minutemail.com",
  "tempmail.com",
  "temp-mail.org",
  "throwaway.email",
  "mailinator.com",
  "yopmail.com",
  "maildrop.cc",
  "getnada.com",
  "trashmail.com",
  "sharklasers.com",
  "guerrillamail.info",
  "guerrillamail.biz",
  "guerrillamail.de",
  "grr.la",
  "guerrillamailblock.com",
];

export function validateEmail(email: string): {
  isValid: boolean;
  shouldBlock: boolean;
  message?: string;
} {
  const domain = email.split("@")[1]?.toLowerCase();

  if (!domain) {
    return {
      isValid: false,
      shouldBlock: true,
      message: "Format d'email invalide",
    };
  }

  // 1. Bloque les emails jetables (strict)
  if (DISPOSABLE_DOMAINS.includes(domain)) {
    return {
      isValid: false,
      shouldBlock: true,
      message:
        "Les adresses email temporaires ne sont pas acceptées. Veuillez utiliser une adresse email valide.",
    };
  }

  // 2. Accepte les domaines populaires (rapide)
  if (POPULAR_DOMAINS.includes(domain)) {
    return { isValid: true, shouldBlock: false };
  }

  // 3. Pour les autres : on accepte mais on log
  return {
    isValid: true,
    shouldBlock: false,
    message: `Domaine inhabituel: ${domain}`,
  };
}
