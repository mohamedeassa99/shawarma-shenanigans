import { cpSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig } from "vite";

const projectRoot = import.meta.dirname;
const framesSource = resolve(projectRoot, "site/frames");
const framesTarget = resolve(projectRoot, "dist/frames");

function copyFrameManifest() {
  return {
    name: "copy-frame-manifest",
    closeBundle() {
      if (!existsSync(framesSource)) {
        throw new Error("Missing site/frames directory required by the shawarma film sequence.");
      }

      cpSync(framesSource, framesTarget, { recursive: true });
    },
  };
}

export default defineConfig({
  root: "site",
  publicDir: false,
  appType: "mpa",
  build: {
    outDir: "../dist",
    emptyOutDir: true,
  },
  plugins: [copyFrameManifest()],
});