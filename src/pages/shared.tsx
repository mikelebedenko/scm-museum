import { useState } from "react"
import { useActions, useMe } from "../store"
import { Icon, Popover } from "../ui"
import { SYSTEM_TAGS, LANG } from "../data"

/** FR-30/33/34: створення, призначення та зняття власних тегів. */
export function TagPicker({
  storyId,
  label = true,
}: {
  storyId: string
  label?: boolean
}) {
  const { data } = useMe()
  const a = useActions()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const assigned = data.assign[storyId] ?? []
  const create = () => {
    const n = name.trim()
    if (!n) return
    const ex = data.tags.find((t) => t.name.toLowerCase() === n.toLowerCase())
    if (ex) {
      if (!assigned.includes(ex.id)) a.toggleAssign(storyId, ex.id)
    } else {
      const id = a.createTag(n)
      a.toggleAssign(storyId, id)
    }
    setName("")
  }
  return (
    <span className="relative">
      <button
        className="chip add"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <Icon n="tag" s={12} />
        {label && "Тег"}
        <Icon n="plus" s={11} />
      </button>
      <Popover open={open} onClose={() => setOpen(false)} className="tagpop">
        <div className="pop-t">Мої теги</div>
        <div className="pop-list">
          {data.tags.length === 0 && (
            <p className="muted sm">Тегів ще немає — створіть перший нижче.</p>
          )}
          {data.tags.map((t) => (
            <button
              key={t.id}
              className={assigned.includes(t.id) ? "on" : ""}
              onClick={() => a.toggleAssign(storyId, t.id)}
            >
              <span className="box">
                {assigned.includes(t.id) && <Icon n="check" s={11} />}
              </span>
              {t.name}
            </button>
          ))}
        </div>
        <div className="pop-new">
          <input
            placeholder="Новий тег…"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && create()}
          />
          <button className="btn gold sm" onClick={create}>
            Додати
          </button>
        </div>
      </Popover>
    </span>
  )
}

export function UserTagChips({
  storyId,
  removable,
}: {
  storyId: string
  removable?: boolean
}) {
  const { data } = useMe()
  const a = useActions()
  const ids = data.assign[storyId] ?? []
  return (
    <>
      {ids.map((id) => {
        const t = data.tags.find((x) => x.id === id)
        return t ? (
          <span key={id} className="chip mine">
            {t.name}
            {removable && (
              <button
                onClick={() => a.toggleAssign(storyId, id)}
                aria-label={`Зняти тег ${t.name}`}
              >
                <Icon n="close" s={10} />
              </button>
            )}
          </span>
        ) : null
      })}
    </>
  )
}

export function TagFilter({
  sel,
  toggle,
}: {
  sel: string[]
  toggle: (t: string) => void
}) {
  const { data } = useMe()
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState("")
  return (
    <span className="relative">
      <button
        className={`fbtn ${sel.length ? "on" : ""}`}
        onClick={() => setOpen(!open)}
      >
        <Icon n="tag" s={13} />
        Теги{sel.length ? ` · ${sel.length}` : ""}
        <Icon n="down" s={12} />
      </button>
      <Popover
        open={open}
        onClose={() => setOpen(false)}
        className="tagpop wide"
      >
        <input
          className="pop-in"
          placeholder="Знайти тег…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <div className="pop-list tall">
          {data.tags.filter((t) =>
            t.name.toLowerCase().includes(q.toLowerCase()),
          ).length > 0 && <div className="pop-t">Мої</div>}
          {data.tags
            .filter((t) => t.name.toLowerCase().includes(q.toLowerCase()))
            .map((t) => (
              <button
                key={t.id}
                className={sel.includes(`my:${t.id}`) ? "on" : ""}
                onClick={() => toggle(`my:${t.id}`)}
              >
                <span className="box">
                  {sel.includes(`my:${t.id}`) && <Icon n="check" s={11} />}
                </span>
                {t.name}
              </button>
            ))}
          <div className="pop-t">Системні</div>
          {SYSTEM_TAGS.filter((t) =>
            t.toLowerCase().includes(q.toLowerCase()),
          ).map((t) => (
            <button
              key={t}
              className={sel.includes(t) ? "on" : ""}
              onClick={() => toggle(t)}
            >
              <span className="box">
                {sel.includes(t) && <Icon n="check" s={11} />}
              </span>
              {t}
            </button>
          ))}
        </div>
      </Popover>
    </span>
  )
}

/** FR-20: фільтр за мовою оригінального мовлення (множинний вибір, як у тегів). */
export function LangFilter({
  sel,
  toggle,
}: {
  sel: string[]
  toggle: (l: string) => void
}) {
  const [open, setOpen] = useState(false)
  return (
    <span className="relative">
      <button
        className={`fbtn ${sel.length ? "on" : ""}`}
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <Icon n="globe" s={13} />
        Мова{sel.length ? ` · ${sel.length}` : ""}
        <Icon n="down" s={12} />
      </button>
      <Popover open={open} onClose={() => setOpen(false)} className="tagpop">
        <div className="pop-t">Мова оригінального мовлення</div>
        <div className="pop-list">
          {Object.entries(LANG).map(([k, v]) => (
            <button
              key={k}
              className={sel.includes(k) ? "on" : ""}
              onClick={() => toggle(k)}
            >
              <span className="box">
                {sel.includes(k) && <Icon n="check" s={11} />}
              </span>
              {v}
            </button>
          ))}
        </div>
      </Popover>
    </span>
  )
}
