import { resolve } from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      // “@” pointe vers la racine de ton projet
      "@": resolve(__dirname),
    },
  },
  test: {
    environment: "node",
    globals: true, // write describe/it without import
    //setupFiles: "./vitest.setup.ts", // if need to initialize Drizzle
  },
});
