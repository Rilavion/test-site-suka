/**
 * Сборка портала для GitHub Pages.
 *
 * Pages отдаёт сайт по адресу https://<пользователь>.github.io/<репозиторий>/,
 * то есть из подкаталога. Поэтому сборка идёт с base = «/<репозиторий>/»,
 * а результат кладётся в папку docs/ — её GitHub Pages умеет публиковать
 * прямо из ветки, без рабочих процессов и дополнительных настроек.
 *
 *   npm run build:pages
 *
 * Имя репозитория можно переопределить:
 *   REPO_NAME=другое-имя npm run build:pages
 */
import { build } from "vite";

const repo = process.env.REPO_NAME || "test-site-suka";
const base = `/${repo}/`;

process.env.BASE_PATH = base;

await build({
  base,
  build: {
    outDir: "docs",
    emptyOutDir: true,
  },
});

console.log(`\nГотово: docs/ собран для ${base}`);
