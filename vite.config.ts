import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
const workspace = new URL("./", import.meta.url).pathname;
const appRoot = new URL("./app/", import.meta.url).pathname;
const outputDirectory = new URL("./dist/", import.meta.url).pathname;

export default defineConfig({
  root: appRoot,
  plugins: [react()],
  base: "/",
  publicDir: false,
  build: {
    outDir: outputDirectory,
    emptyOutDir: true,
    rollupOptions: {
      input: new URL("./app/index.html", import.meta.url).pathname,
    },
  },
  server: {
    fs: {
      allow: [workspace],
    },
  },
});
