// Перевіряє, що стилі використовують токени, а не «сирі» значення.
// Запуск: pnpm lint:tokens   (код виходу 1, якщо є порушення)
import fs from "node:fs"
import path from "node:path"

const ROOT = path.resolve(import.meta.dirname, "../src")
const files = [
  path.join(ROOT, "index.css"),
  path.join(ROOT, "styles/base.css"),
  ...fs.readdirSync(path.join(ROOT, "styles/components")).map((f) => path.join(ROOT, "styles/components", f)),
]
// Властивості, де px має бути токеном (--space-*, --fs-*, --radius-*, --z-*)
const PX_PROPS = /^(padding|margin|gap|row-gap|column-gap|font-size|border-radius|z-index)(-(top|right|bottom|left|inline|block))?$/

const rules = [
  { name: "hex-колір", re: /#[0-9a-fA-F]{3,8}\b/g, hint: "використайте var(--color-*)" },
  { name: "rgb/hsl-колір", re: /\b(?:rgba?|hsla?)\(/g, hint: "використайте var(--color-*) або color-mix від токена" },
]

let bad = 0
for (const file of files) {
  const lines = fs.readFileSync(file, "utf8").split("\n")
  lines.forEach((line, i) => {
    const code = line.replace(/\/\*.*?\*\//g, "")
    for (const r of rules) {
      for (const m of code.matchAll(r.re)) {
        console.log(`${path.relative(ROOT, file)}:${i + 1}  ${r.name} «${m[0]}» — ${r.hint}`)
        bad++
      }
    }
    for (const d of code.matchAll(/([a-z-]+)\s*:\s*([^;{}]+)/g)) {
      if (!PX_PROPS.test(d[1])) continue
      for (const px of d[2].matchAll(/(?<![\w.-])(\d*\.?\d+)px\b/g)) {
        if (px[1] === "0") continue
        console.log(`${path.relative(ROOT, file)}:${i + 1}  px у ${d[1]} «${px[0]}» — використайте токен (--space-*, --fs-*, --radius-*)`)
        bad++
      }
    }
  })
}
if (bad) {
  console.log(`\n✖ Знайдено порушень: ${bad}`)
  process.exit(1)
}
console.log("✔ Сирих значень не знайдено")
