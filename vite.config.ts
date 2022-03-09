import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.IS_DEV !== "true" ? "./" : "/",
  build: {
    outDir: "./dist",
  },
  plugins: [react(), tsconfigPaths()],
});
