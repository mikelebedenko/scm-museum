import {
  fragments,
  frag,
  mat,
  fragStart,
  fragEnd,
  fragQuote,
  story,
  type Fragment,
} from "./data"
import type { Hit } from "./types"

export const uid = () => Math.random().toString(36).slice(2, 10)
export const now = () => new Date().toISOString()
export const pad = (n: number) => String(n).padStart(2, "0")
export const fmt = (s: number) => {
  s = Math.max(0, Math.floor(s))
  const h = Math.floor(s / 3600),
    m = Math.floor((s % 3600) / 60),
    x = s % 60
  return h ? `${h}:${pad(m)}:${pad(x)}` : `${m}:${pad(x)}`
}
export const range = (a: number, b: number) => `${fmt(a)} – ${fmt(b)}`
export const dt = (iso: string | null) =>
  iso
    ? new Date(iso).toLocaleString("uk-UA", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—"
export const dShort = (iso: string) =>
  new Date(iso).toLocaleDateString("uk-UA", { day: "numeric", month: "short" })

const STOP = new Set([
  "знайди",
  "покажи",
  "мені",
  "про",
  "які",
  "яка",
  "який",
  "свідчення",
  "щодо",
  "під",
  "час",
  "людей",
  "людини",
  "були",
  "було",
  "що",
  "як",
  "для",
  "при",
  "коли",
  "розкажи",
])
const SYN: Record<string, string[]> = {
  евакуа: ["виїзд", "коридор", "колон", "кордон", "маршрут", "вивез"],
  укрит: ["підвал", "бомбосх"],
  підва: ["укрит"],
  медич: ["лікар", "лікарн", "поранен", "ліки"],
  лікар: ["медич", "лікарн"],
  світл: ["ліхтар"],
  діти: ["дитин", "мам"],
  дітей: ["дитин", "мам"],
  волон: ["допомог"],
  допом: ["взаємодопомог", "волон"],
  сусід: ["взаємодопомог"],
  взаєм: ["сусід", "незнайом", "допомог"],
  повер: ["відбудов"],
}
const docOf = (f: Fragment) => {
  const m = mat(f.mid)
  const s = story(m.storyId)
  return `${s.title} ${s.summary} ${s.tags.join(" ")} ${f.desc} ${fragQuote(f)} ${f.tags.join(" ")} ${m.title}`.toLowerCase()
}

export function search(query: string, status: Record<string, string>): Hit[] {
  const words = query
    .toLowerCase()
    .replace(/[^\p{L}\s]/gu, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 3 && !STOP.has(w))
  if (!words.length) return []
  const raw = fragments
    .filter((f) => status[mat(f.mid).storyId] === "Відкрита")
    .map((f) => {
      const doc = docOf(f)
      let sc = 0
      for (const w of words) {
        const st = w.slice(0, 5)
        if (doc.includes(st)) sc += 2
        for (const k of Object.keys(SYN))
          if (st.startsWith(k.slice(0, 4)) || k.startsWith(st.slice(0, 4)))
            for (const y of SYN[k]) if (doc.includes(y)) sc += 1
      }
      return { fid: f.id, sc }
    })
    .filter((x) => x.sc > 0)
    .sort((a, b) => b.sc - a.sc)
  const max = raw[0]?.sc ?? 1
  return raw.map((x) => ({
    fid: x.fid,
    score: Math.min(99, 52 + Math.round((x.sc / max) * 44)),
  }))
}

export function makeAnswer(query: string, hits: Hit[], prev?: string) {
  const top = hits.slice(0, 3).map((h) => frag(h.fid))
  const foundStories = Array.from(
    new Set(top.map((f) => story(mat(f.mid).storyId).title)),
  )
  const lead = prev
    ? `З урахуванням попереднього запиту «${prev.slice(0, 60)}»: `
    : ""
  return `${lead}за запитом «${query.slice(0, 80)}» у ${hits.length} знайдених фрагментах свідки описують: ${top.map((f) => f.desc.toLowerCase()).join("; ")}. Найбільш змістовні історії — ${foundStories.join("; ")}. Цитати й часові межі наведено у фрагментах праворуч.`
}

export function makeScript(prompt: string, ids: string[]) {
  const fr = ids.map(frag)
  const total = fr.reduce((s, f) => s + fragEnd(f) - fragStart(f), 0)
  const head = `ЧЕРНЕТКА СЦЕНАРІЮ\nНапрям: ${prompt}\nХронометраж джерел: ${fmt(total)} · фрагментів: ${fr.length}\n`
  const intro = `\n[ВСТУП]\nГолос за кадром. ${prompt.replace(/\.$/, "")}. Історії, зібрані в архіві, показують це зсередини — словами людей, які це пережили.\n`
  const body = fr
    .map(
      (f, i) =>
        `\n[СЦЕНА ${i + 1}] ${f.desc}\nНа екрані: ${
          mat(f.mid).kind === "video"
            ? "відеофрагмент"
            : "аудіофрагмент із титрами"
        } — «${mat(f.mid).title}», ${range(fragStart(f), fragEnd(f))}.\n${
          fragQuote(f) ? `${mat(f.mid).speaker}: «${fragQuote(f)}»` : ""
        }\nЗв’язка: ${
          i < fr.length - 1
            ? "Ця думка знаходить продовження в наступному свідченні."
            : "Підсумковий акцент сценарію."
        }\n`,
    )
    .join("")
  const outro = `\n[ФІНАЛ]\nГолос за кадром. Разом ці свідчення складають картину, яку неможливо звести до цифр. Джерела: ${Array.from(new Set(fr.map((f) => mat(f.mid).title))).join("; ")}.\n`
  return head + intro + body + outro
}

export function download(name: string, mime: string, content: string) {
  const url = URL.createObjectURL(new Blob([content], { type: mime }))
  const a = document.createElement("a")
  a.href = url
  a.download = name
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
type Cell = string | number
export const toCsv = (rows: Cell[][]) =>
  "\ufeff" +
  rows
    .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
    .join("\r\n")
export const toExcel = (title: string, rows: Cell[][]) =>
  `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel"><head><meta charset="utf-8"><title>${title}</title></head><body><table border="1">${rows.map((r, i) => `<tr>${r.map((c) => (i ? `<td>${c}</td>` : `<th>${c}</th>`)).join("")}</tr>`).join("")}</table></body></html>`

export function rng(seed: number) {
  let s = seed >>> 0 || 1
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}
