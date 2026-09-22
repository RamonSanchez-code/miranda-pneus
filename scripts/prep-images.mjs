// Gera as imagens otimizadas do catálogo a partir das fotos originais (Downloads).
// Uso: node scripts/prep-images.mjs
import sharp from "sharp";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const dl = path.join(os.homedir(), "Downloads");
const out = "public/images/rodas";
fs.mkdirSync(out, { recursive: true });

const grid = path.join(dl, "rodas.jpg"); // colagem 2x2 (1024x1024)
const names = ["roda-vw", "roda-mercedes", "roda-bmw", "roda-audi"];
const S = 486; // lado útil de cada quadro (sem a moldura branca)
const xs = [16, 520];
for (let i = 0; i < 4; i++) {
  await sharp(grid)
    .extract({ left: xs[i % 2], top: xs[Math.floor(i / 2)], width: S, height: S })
    .resize(640, 640, { kernel: "lanczos3" })
    .webp({ quality: 88 })
    .toFile(`${out}/${names[i]}.webp`);
}
await sharp(path.join(dl, "rodas 2.jpg")).webp({ quality: 86 }).toFile(`${out}/vitrine.webp`);
await sharp(path.join(dl, "mercedez.png")).resize(1536).webp({ quality: 88 }).toFile("public/images/gla-referencia.webp");
console.log("ok");
