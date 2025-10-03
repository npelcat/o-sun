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
    //setupFiles: "./vitest.setup.ts", // if need to initialize Drizzle
  },
});
