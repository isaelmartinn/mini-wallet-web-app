import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["**/*.spec.ts", "**/*.spec.tsx"],
    exclude: ["node_modules", "e2e/**", ".next/**"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "**/*.spec.ts",
        "**/*.spec.tsx",
        "**/*.config.ts",
        "**/*.config.js",
        ".next/",
      ],
    },
    server: {
      deps: {
        inline: ["@exodus/bytes", "html-encoding-sniffer"],
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
      "#auth": path.resolve(__dirname, "src/contexts/auth"),
      "#wallet": path.resolve(__dirname, "src/contexts/wallet"),
      "#transactions": path.resolve(__dirname, "src/contexts/transactions"),
      "#payments": path.resolve(__dirname, "src/contexts/payments"),
      "#shared": path.resolve(__dirname, "src/shared"),
    },
  },
});
