// Prepara o recorte do Mercedes-AMG GLA (PNG com transparência) para o hero: limpa o halo do alfa e amplia com nitidez.
// Uso: node scripts/prep-car.mjs
import sharp from "sharp";

const src = "scripts/src/gla-cutout.png";
const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
for (let i = 3; i < data.length; i += 4) {
  const a = data[i];
  data[i] = a < 28 ? 0 : a > 235 ? 255 : Math.min(255, Math.round(((a - 28) / 207) * 255));
}
const clean = () => sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } });
await clean().resize(3072, 2048, { kernel: "lanczos3" }).sharpen({ sigma: 0.8 }).webp({ quality: 88, alphaQuality: 100 }).toFile("public/images/gla.webp");
await clean().resize(1792, 1195, { kernel: "lanczos3" }).sharpen({ sigma: 0.6 }).webp({ quality: 86, alphaQuality: 100 }).toFile("public/images/gla-m.webp");
console.log("ok");
