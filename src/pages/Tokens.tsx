import { Button } from "../components/Button"
import { Chip } from "../components/Chip"
import { IconButton } from "../components/IconButton"
import { Icon } from "../ui"
import { Checkbox } from "../components/Checkbox"
import { FilterButton } from "../components/FilterButton"
import { LinkButton } from "../components/LinkButton"
import { Segmented } from "../components/Segmented"
import { Tabs } from "../components/Tabs"
import { useState } from "react"
// Живий довідник токенів: відкривається за адресою #/tokens
const colors = {
  Поверхні: [
    "bg",
    "surface-1",
    "surface-2",
    "surface-3",
    "surface-4",
    "surface-sunken",
  ],
  Текст: ["text", "text-muted", "text-subtle", "text-on-accent"],
  Межі: ["border", "border-strong", "border-stronger"],
  Акцент: [
    "accent",
    "accent-hover",
    "accent-wash",
    "accent-subtle",
    "accent-muted",
    "accent-border",
  ],
  Статуси: [
    "success",
    "success-bg",
    "success-border",
    "success-text",
    "danger",
    "danger-bg",
    "danger-border",
    "danger-text",
    "warning",
    "warning-bg",
    "warning-border",
    "warning-text",
    "info",
    "info-border",
  ],
  Медіа: ["media-video", "media-audio"],
  Накладки: ["scrim", "overlay", "overlay-strong"],
}
const types = [
  ["display", "Display · 36"],
  ["h1", "H1 · 28"],
  ["h2", "H2 · 22"],
  ["h3", "H3 · 18"],
  ["h4", "H4 · 16"],
  ["body-lg", "Body L · 16"],
  ["body", "Body · 14"],
  ["body-sm", "Body S · 13"],
  ["caption", "Caption · 12"],
  ["label", "Label · 13"],
  ["overline", "OVERLINE · 11"],
  ["mono", "Mono · 12"],
]
const spaces = [
  "half",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "8",
  "10",
  "12",
  "14",
  "20",
]
const radii = ["xs", "sm", "md", "lg", "xl", "pill", "full"]

const box = {
  border: "1px solid var(--color-border)",
  borderRadius: "var(--radius-md)",
  padding: "var(--space-4)",
}
const h = { font: "var(--type-h3)", margin: "var(--space-8) 0 var(--space-3)" }

export default function Tokens() {
  const [seg, setSeg] = useState("all")
  const [tab, setTab] = useState("a")
  const [chk, setChk] = useState(true)
  const [flt, setFlt] = useState(false)
  return (
    <div
      style={{
        padding: "var(--space-8)",
        maxWidth: "var(--container-md)",
        margin: "0 auto",
        overflow: "auto",
        height: "100%",
      }}
    >
      <h1 style={{ font: "var(--type-h1)" }}>Design tokens</h1>
      <p style={{ color: "var(--color-text-muted)" }}>
        Джерело: src/styles/tokens.css
      </p>

      <h2 style={h}>Кольори</h2>
      {Object.entries(colors).map(([group, names]) => (
        <div key={group} style={{ marginBottom: "var(--space-4)" }}>
          <div
            style={{
              font: "var(--type-overline)",
              color: "var(--color-text-subtle)",
              marginBottom: "var(--space-2)",
            }}
          >
            {group}
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill,minmax(150px,1fr))",
              gap: "var(--space-2)",
            }}
          >
            {names.map((n) => (
              <div
                key={n}
                style={{
                  ...box,
                  padding: "var(--space-2)",
                  display: "flex",
                  gap: "var(--space-2)",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "var(--radius-sm)",
                    background: `var(--color-${n})`,
                    border: "1px solid var(--color-border-strong)",
                    flex: "none",
                  }}
                />
                <code style={{ font: "var(--type-caption)" }}>--color-{n}</code>
              </div>
            ))}
          </div>
        </div>
      ))}

      <h2 style={h}>Типографіка</h2>
      <div style={{ display: "grid", gap: "var(--space-3)" }}>
        {types.map(([t, label]) => (
          <div
            key={t}
            style={{
              display: "grid",
              gridTemplateColumns: "180px 1fr",
              gap: "var(--space-4)",
              alignItems: "baseline",
            }}
          >
            <code
              style={{
                font: "var(--type-caption)",
                color: "var(--color-text-subtle)",
              }}
            >
              --type-{t}
            </code>
            <span
              style={{
                font: `var(--type-${t})`,
                textTransform: t === "overline" ? "uppercase" : undefined,
                letterSpacing: t === "overline" ? "var(--ls-wider)" : undefined,
              }}
            >
              {label} — Кабінет дослідника
            </span>
          </div>
        ))}
      </div>

      <h2 style={h}>Відступи</h2>
      <div style={{ display: "grid", gap: "var(--space-2)" }}>
        {spaces.map((s) => (
          <div
            key={s}
            style={{
              display: "grid",
              gridTemplateColumns: "180px 1fr",
              gap: "var(--space-4)",
              alignItems: "center",
            }}
          >
            <code style={{ font: "var(--type-caption)" }}>--space-{s}</code>
            <span
              style={{
                height: 12,
                width: `var(--space-${s})`,
                background: "var(--color-accent)",
                borderRadius: 2,
              }}
            />
          </div>
        ))}
      </div>

      <h2 style={h}>Радіуси</h2>
      <div style={{ display: "flex", gap: "var(--space-4)", flexWrap: "wrap" }}>
        {radii.map((r) => (
          <div key={r} style={{ textAlign: "center" }}>
            <div
              style={{
                width: 64,
                height: 64,
                background: "var(--color-surface-3)",
                border: "1px solid var(--color-border-strong)",
                borderRadius: `var(--radius-${r})`,
              }}
            />
            <code style={{ font: "var(--type-caption)" }}>{r}</code>
          </div>
        ))}
      </div>

      <h2 style={h}>Тіні та кільця</h2>
      <div style={{ display: "flex", gap: "var(--space-6)", flexWrap: "wrap" }}>
        {["shadow-md", "shadow-accent", "ring-accent", "ring-focus"].map(
          (n) => (
            <div
              key={n}
              style={{
                width: 120,
                height: 64,
                borderRadius: "var(--radius-md)",
                background: "var(--color-surface-2)",
                boxShadow: `var(--${n})`,
                display: "grid",
                placeItems: "center",
              }}
            >
              <code style={{ font: "var(--type-caption)" }}>{n}</code>
            </div>
          ),
        )}
      </div>

      <h2 style={h}>Компоненти</h2>
      <div style={{ display: "grid", gap: "var(--space-4)" }}>
        <div style={{ ...box, display: "flex", gap: "var(--space-3)", alignItems: "center", flexWrap: "wrap" }}>
          <code style={{ font: "var(--type-caption)", width: 120 }}>Button</code>
          <Button variant="primary">Primary</Button>
          <Button>Default</Button>
          <Button variant="danger">Danger</Button>
          <Button size="sm" variant="primary">Primary sm</Button>
          <Button size="sm">Default sm</Button>
          <Button disabled>Disabled</Button>
        </div>
        <div style={{ ...box, display: "flex", gap: "var(--space-3)", alignItems: "center", flexWrap: "wrap" }}>
          <code style={{ font: "var(--type-caption)", width: 120 }}>IconButton</code>
          <IconButton aria-label="Пошук"><Icon n="search" /></IconButton>
          <IconButton aria-label="Вибрані історії" active><Icon n="star" fill /></IconButton>
          <IconButton size="sm" aria-label="Закрити"><Icon n="close" s={14} /></IconButton>
        </div>
        <div style={{ ...box, display: "flex", gap: "var(--space-3)", alignItems: "center", flexWrap: "wrap" }}>
          <code style={{ font: "var(--type-caption)", width: 120 }}>Chip</code>
          <Chip>default</Chip>
          <Chip tone="mine">mine</Chip>
          <Chip tone="selected">selected</Chip>
          <Chip tone="add"><Icon n="plus" s={11} />add</Chip>
          <span className="st active">active</span>
          <span className="st pending">pending</span>
          <span className="st blocked">blocked</span>
        </div>
        <div style={{ ...box, display: "flex", gap: "var(--space-3)", alignItems: "center", flexWrap: "wrap" }}>
          <code style={{ font: "var(--type-caption)", width: 120 }}>FilterButton</code>
          <FilterButton active={flt} onClick={() => setFlt(!flt)}>Теги</FilterButton>
          <FilterButton active>Активний</FilterButton>
          <code style={{ font: "var(--type-caption)", width: 120 }}>LinkButton</code>
          <LinkButton>Скинути фільтри</LinkButton>
          <code style={{ font: "var(--type-caption)", width: 120 }}>Checkbox</code>
          <Checkbox checked={chk} onChange={() => setChk(!chk)} />
        </div>
        <div style={{ ...box, display: "flex", gap: "var(--space-6)", alignItems: "center", flexWrap: "wrap" }}>
          <code style={{ font: "var(--type-caption)", width: 120 }}>Segmented</code>
          <Segmented value={seg} onChange={setSeg} options={[{ value: "all", label: "Усі" }, { value: "video", label: "Відео" }, { value: "audio", label: "Аудіо" }]} />
          <code style={{ font: "var(--type-caption)", width: 120 }}>Tabs</code>
          <Tabs value={tab} onChange={setTab} options={[{ value: "a", label: "Транскрипція" }, { value: "b", label: "Метадані" }]} />
        </div>
      </div>
    </div>
  )
}
