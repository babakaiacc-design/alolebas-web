import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Transformers.js is heavy and only dynamically imported (visualSearch.ts),
  // so keep it out of dev pre-bundling and let it code-split into its own chunk.
  optimizeDeps: { exclude: ["@huggingface/transformers"] },
});
