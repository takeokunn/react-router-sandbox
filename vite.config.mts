import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";

export default defineConfig(({ mode }) => ({
  plugins: [
    mode !== "test" && reactRouter()
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ["./setupTests.ts"],
    coverage: {
      provider: 'v8',
      exclude: [
        "react-router.config.ts",
        "vite.config.mts",
        ".react-router/types",
        "app/data.ts",
        "app/root.tsx",
        "app/routes.ts",
        "app/**/index.ts"
      ]
    }
  }
}));
