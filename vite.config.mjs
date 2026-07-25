import { cpSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig } from "vite";

const projectRoot = import.meta.dirname;
const siteScriptSource = resolve(projectRoot, "site/main.js");
const siteScriptTarget = resolve(projectRoot, "dist/main.js");
const framesSource = resolve(projectRoot, "site/frames");
const framesTarget = resolve(projectRoot, "dist/frames");

function copyStaticRuntimeFiles() {
  return {
    name: "copy-static-runtime-files",
    closeBundle() {
      if (!existsSync(siteScriptSource)) {
        throw new Error("Missing site/main.js required by the static shawarma site.");
      }

      if (!existsSync(framesSource)) {
        throw new Error("Missing site/frames directory required by the shawarma film sequence.");
      }

      cpSync(siteScriptSource, siteScriptTarget);
      cpSync(framesSource, framesTarget, { recursive: true });
    },
  };
}

export default defineConfig({
  root: "site",
  // Relative asset URLs. GitHub Pages serves this from the subpath
  // /shawarma-shenanigans/, where Vite's default absolute "/assets/..."
  // resolves against the domain root and 404s. Relative works on both
  // that subpath and at the root of a lovable.app domain.
  base: "./",
  publicDir: false,
  appType: "mpa",
  build: {
    outDir: "../dist",
    emptyOutDir: true,
  },
  plugins: [copyStaticRuntimeFiles()],
});