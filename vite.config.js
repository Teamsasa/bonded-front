import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
      external: ["index.css"],
    },
  },
  envDir: ".",
  server: {
    historyApiFallback: true,
  },
});
