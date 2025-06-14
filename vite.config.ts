import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";

export default defineConfig(({ mode }) => ({
  plugins: [
    mode !== "test" && reactRouter()
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ["./setupTests.ts"]
  }
}));
