import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import monacoPlugin from "vite-plugin-monaco-editor";

const monaco = monacoPlugin && monacoPlugin.default ? monacoPlugin.default : monacoPlugin;

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    monaco({}),
  ],
  build: {
    chunkSizeWarningLimit: 5000,
  },
});