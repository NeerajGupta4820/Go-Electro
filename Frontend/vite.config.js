import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { fileURLToPath } from "url";

// Recreate __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    chunkSizeWarningLimit: 1600, // Warning hatane ke liye
    rollupOptions: {
      // external: ['prop-types'], // <--- IS LINE KO HATA DIYA HAI (Ye zaruri tha)
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return "vendor"; // Dependencies ko alag file mein bundle karega
          }
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    extensions: [".js", ".jsx"],
  },
  server: {
    host: true,
  },
});
