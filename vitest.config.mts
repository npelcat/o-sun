import { resolve } from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(__dirname),
    },
  },
  test: {
    environment: "node",
    globals: true, // write describe/it without import
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["lib/**/*.ts"],
      exclude: [
        "lib/auth/auth.ts", // configuration Next Auth
        "lib/email/send-email.ts", // simple wrapper fetch sans logique
        "lib/email/send-reset-email.ts", // wrapper Resend sans logique custom
        "lib/actions/password-reset.ts", // server action, nécessiterait des tests e2e
        "lib/admin/stats.ts", // simple agrégation, pas de logique complexe
        "lib/date.ts", // utilitaires de formatage Luxon
        "lib/metadata.ts", // configuration SEO statique
        "lib/validation/email.ts", // schémas de validation mockés
        "lib/validation/turnstile.ts", // schémas de validation mockés
        "lib/validation/admin.ts", // schémas de validation mockés
      ],
    },
  },
});
