import { resolve } from "path";
import { defineConfig } from "vitest/config";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(__dirname),
    },
  },
  test: {
    environment: "node",
    globals: true, // write describe/it without import
    //setupFiles: "./vitest.setup.ts", // if need to initialize Drizzle
  },
});
