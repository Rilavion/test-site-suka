import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/**
 * BASE_PATH позволяет собрать портал для подкаталога.
 * Локально и на обычном хостинге он не нужен, на GitHub Pages
 * рабочий процесс подставляет «/<имя-репозитория>/».
 */
const base = process.env.BASE_PATH || "/";

export default defineConfig({
  base,
  plugins: [react(), spaFallback()],
  server: {
    host: "0.0.0.0",
    port: 5173,
    allowedHosts: true,
    cors: true,
  },
  preview: {
    host: "0.0.0.0",
    port: 4173,
    allowedHosts: true,
  },
});

/**
 * Статические хостинги (в том числе GitHub Pages) не знают о клиентской
 * маршрутизации и на «/ministry» отдают страницу ошибки. Копия index.html
 * под именем 404.html возвращает управление приложению, а .nojekyll
 * запрещает Jekyll трогать содержимое сборки.
 */
function spaFallback() {
  let outDir = "dist";
  return {
    name: "spa-fallback",
    apply: "build",
    configResolved(config) {
      outDir = config.build.outDir;
    },
    async closeBundle() {
      const { copyFile, writeFile } = await import("node:fs/promises");
      const { resolve } = await import("node:path");
      await copyFile(
        resolve(outDir, "index.html"),
        resolve(outDir, "404.html"),
      );
      await writeFile(resolve(outDir, ".nojekyll"), "");
    },
  };
}
