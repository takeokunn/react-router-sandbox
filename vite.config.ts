 /// <reference types="vitest" />
import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [reactRouter()],
  test: {
    globals: true,
    environment: 'jsdom'
  }
});
