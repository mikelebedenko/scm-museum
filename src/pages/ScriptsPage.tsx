import { useState } from "react"
import { Button } from "../components/Button"
import { Checkbox } from "../components/Checkbox"
import { IconButton } from "../components/IconButton"
import { Icon, Modal, Empty, toast } from "../ui"
import { useActions, useMe, useStore } from "../store"
import {
  stories,
  story,
  storyMedia,
  frag,
  mat,
  fragStart,
  fragEnd,
} from "../data"
import { fmt, dt, plural } from "../lib"

const PRESETS = [
  "Короткий огляд історій",
  "Документальний нарис",
  "Тези для статті",
]

const TYPE_ICON = { video: "video", audio: "audio", text: "file" } as const

type Props = {
  /** Обрані історії та фрагменти — спільний стан із правою бібліотекою. */
  storySel: string[]
  fragSel: string[]
  /** Усі фрагменти-джерела (з обраних історій і фрагментів) — те, з чого збирається сценарій. */
  scriptIds: string[]
  canScript: boolean
  onToggleStory: (id: string) => void
  onToggleFrag: (id: string) => void
  onClearSources: () => void
}

/** Сторінка «Сценарії»: поле запиту з джерелами та історія згенерованих сценаріїв. */
export function ScriptsPage(p: Props) {
  const { data } = useMe()
  const a = useActions()
  const { state } = useStore()
  const status = state.settings.storyStatus
  const [prompt, setPrompt] = useState("")
  const [busy, setBusy] = useState(false)
  const [picker, setPicker] = useState(false)
  const [q, setQ] = useState("")
  const [openId, setOpenId] = useState<string | null>(null)
  const [editing, setEditing] = useState(false)
  const [val, setVal] = useState("")

  const sourcesCount = p.storySel.length + p.fragSel.length
  const hasSources = p.scriptIds.length > 0

  const generate = () => {
    if (!hasSources || busy) return
    setBusy(true)
    setTimeout(() => {
      const sc = a.genScript(prompt.trim() || PRESETS[0], p.scriptIds)
      setBusy(false)
      setPrompt("")
      setOpenId(sc.id)
    }, 900)
  }

  const open = data.scripts.find((s) => s.id === openId) ?? null

  /* ---------- сценарій відкрито ---------- */
  if (open) {
    const startEdit = () => {
      setVal(open.title)
      setEditing(true)
    }
    const saveEdit = () => {
      const n = val.trim()
      setEditing(false)
      if (n && n !== open.title) {
        a.renameScript(open.id, n)
        toast("Сценарій перейменовано")
      }
    }
    return (
      <div className="chat-scroll">
        <div className="sc-page">
          <div className="sc-detail-head">
            <IconButton aria-label="До списку сценаріїв" onClick={() => { setOpenId(null); setEditing(false) }}>
              <Icon n="back" s={20} />
            </IconButton>
            {editing ? (
              <input
                className="scr-name sc-name"
                value={val}
                autoFocus
                aria-label="Назва сценарію"
                onChange={(e) => setVal(e.target.value)}
                onFocus={(e) => e.currentTarget.select()}
                onBlur={saveEdit}
                onKeyDown={(e) => {
                  if (e.key === "Enter") e.currentTarget.blur()
                  if (e.key === "Escape") setEditing(false)
                }}
              />
            ) : (
              <h1 className="sc-h1">{open.title}</h1>
            )}
            <div className="sc-actions">
              <IconButton
                aria-label="Перейменувати"
                onMouseDown={(e) => e.preventDefault()}
                onClick={startEdit}
              >
                <Icon n="edit" s={18} />
              </IconButton>
              <IconButton
                aria-label="Копіювати"
                onClick={() => {
                  navigator.clipboard?.writeText(open.body)
                  toast("Скопійовано")
                }}
              >
                <Icon n="copy" s={18} />
              </IconButton>
              <IconButton
                aria-label="Видалити"
                onClick={() => {
                  a.deleteScript(open.id)
                  setOpenId(null)
                  toast("Сценарій видалено")
                }}
              >
                <Icon n="trash" s={18} />
              </IconButton>
            </div>
          </div>
          <p className="sc-meta">
            {dt(open.created)} · {open.sources.length}{" "}
            {plural(open.sources.length, "джерело", "джерела", "джерел")} · Запит: {open.prompt}
          </p>
          <pre className="scriptout">{open.body}</pre>
        </div>
      </div>
    )
  }

  /* ---------- вибір джерел ---------- */
  const pickable = stories.filter(
    (s) =>
      status[s.id] === "Відкрита" &&
      (!q.trim() || s.title.toLowerCase().includes(q.trim().toLowerCase())),
  )

  return (
    <div className="chat-scroll">
      <div className="sc-page">
        <h1 className="sc-h1">Сценарії</h1>

        <div className="cmp sc-cmp">
          {sourcesCount > 0 && (
            <div className="sc-sources-row">
              {p.storySel.slice(0, 6).map((id) => (
                <span key={id} className="sc-src">
                  <span>{story(id).title}</span>
                  <button aria-label="Прибрати джерело" onClick={() => p.onToggleStory(id)}>
                    <Icon n="close" s={12} />
                  </button>
                </span>
              ))}
              {p.fragSel.slice(0, Math.max(0, 6 - p.storySel.length)).map((fid) => {
                const f = frag(fid)
                return (
                  <span key={fid} className="sc-src">
                    <span>
                      {mat(f.mid).story} · {fmt(fragStart(f))}–{fmt(fragEnd(f))}
                    </span>
                    <button aria-label="Прибрати фрагмент" onClick={() => p.onToggleFrag(fid)}>
                      <Icon n="close" s={12} />
                    </button>
                  </span>
                )
              })}
              {sourcesCount > 6 && (
                <span className="sc-src is-more">+{sourcesCount - 6} ще</span>
              )}
            </div>
          )}
          <textarea
            rows={3}
            value={prompt}
            placeholder="Опишіть сценарій: тема, акценти й тон"
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) generate()
            }}
          />
          <div className="cmp-bar">
            <Button size="sm" onClick={() => setPicker(true)}>
              <Icon n="plus" s={14} />
              Джерела{sourcesCount > 0 ? ` · ${sourcesCount}` : ""}
            </Button>
            <span className="grow" />
            <Button
              variant="primary"
              disabled={!hasSources || !p.canScript || busy}
              onClick={generate}
            >
              <Icon n="spark" s={14} />
              {busy ? "Генерація…" : "Згенерувати"}
            </Button>
          </div>
        </div>

        <div className="chips sc-presets">
          {PRESETS.map((x) => (
            <button
              key={x}
              type="button"
              className={`chip ${prompt === x ? "on" : ""}`}
              onClick={() => setPrompt(prompt === x ? "" : x)}
            >
              {x}
            </button>
          ))}
        </div>
        {!p.canScript && (
          <p className="locknote">
            <Icon n="lock" s={13} /> Генерація сценаріїв — з Розширеною роллю
          </p>
        )}

        <h2 className="sc-sub">Згенеровані сценарії</h2>
        {data.scripts.length === 0 ? (
          <Empty icon="file" title="Згенерованих сценаріїв ще немає">
            Додайте джерела, опишіть задум і натисніть «Згенерувати».
          </Empty>
        ) : (
          <ul className="sc-list">
            {data.scripts.map((sc) => (
              <li key={sc.id}>
                <button className="sc-row" onClick={() => setOpenId(sc.id)}>
                  <span className="sc-row-title">{sc.title}</span>
                  <span className="sc-row-date">{dt(sc.created)}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {picker && (
        <Modal
          wide
          title="Джерела для сценарію"
          onClose={() => setPicker(false)}
          foot={
            <>
              <Button onClick={p.onClearSources} disabled={sourcesCount === 0}>
                Очистити
              </Button>
              <Button variant="primary" onClick={() => setPicker(false)}>
                Готово{sourcesCount > 0 ? ` · ${sourcesCount}` : ""}
              </Button>
            </>
          }
        >
          <input
            className="sc-search"
            placeholder="Знайти історію…"
            value={q}
            autoFocus
            onChange={(e) => setQ(e.target.value)}
          />
          <ul className="sc-pick">
            {pickable.map((s) => {
              const kinds = Array.from(
                new Set(storyMedia(s.id).map((m) => m.kind)),
              )
              return (
                <li key={s.id}>
                  <Checkbox
                    checked={p.storySel.includes(s.id)}
                    onChange={() => p.onToggleStory(s.id)}
                  >
                    <span className="sc-pick-title">{s.title}</span>
                  </Checkbox>
                  <span className="found-meta">
                    {kinds.map((k) => (
                      <Icon key={k} n={TYPE_ICON[k]} s={14} />
                    ))}
                  </span>
                </li>
              )
            })}
            {pickable.length === 0 && <li className="muted">Нічого не знайдено</li>}
          </ul>
        </Modal>
      )}
    </div>
  )
}
