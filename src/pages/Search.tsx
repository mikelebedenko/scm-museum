import { Logo } from "../components/Logo"
import { Segmented } from "../components/Segmented"
import { Checkbox } from "../components/Checkbox"
import { FilterButton } from "../components/FilterButton"
import { LinkButton } from "../components/LinkButton"
import { Button } from "../components/Button"
import { Chip } from "../components/Chip"
import { IconButton } from "../components/IconButton"
import { useEffect, useMemo, useRef, useState } from "react"
import { useMe, useStore, useActions } from "../store"
import Media from "./Media"
import { LibPanel } from "./LibPanel"
import { Icon, Popover, Modal, Empty, toast, Tip } from "../ui"
import {
  SUGGESTIONS,
  LANG,
  thumbUrl,
  frag,
  mat,
  fragStart,
  fragEnd,
  fragQuote,
  fragWho,
  stories,
  storyCover,
  storyMedia,
  story,
  RUBRICS,
  fragments,
} from "../data"
import { fmt, range, dShort, dt } from "../lib"
import { TagPicker, UserTagChips, TagFilter, LangFilter } from "./shared"
import { TagsModal, FavoritesModal } from "./Library"
import type { Msg } from "../types"

export default function Search() {
  const { state } = useStore()
  const { data, perms } = useMe()
  const a = useActions()
  const chat = data.chats.find((c) => c.id === data.active) ?? null
  const [input, setInput] = useState("")
  const [busy, setBusy] = useState(false)
  const [pick, setPick] = useState<string | null>(null)
  const [hist, setHist] = useState(false)
  const [hq, setHq] = useState("")
  const [del, setDel] = useState<string | null>(null)
  const end = useRef<HTMLDivElement>(null)
  const userRef = useRef<HTMLDivElement>(null)
  const [type, setType] = useState<"all" | "audio" | "video">("all")
  const [lang, setLang] = useState<string[]>([])
  const [tagF, setTagF] = useState<string[]>([])
  const [sel, setSel] = useState<string[]>([])
  const [storySel, setStorySel] = useState<string[]>([])
  const [script, setScript] = useState(false)
  const [media, setMedia] = useState<{ id: string; t: number; e: number } | null>(
    null,
  )
  const [favOnly, setFavOnly] = useState(false)
  const [scripts, setScripts] = useState(false)
  const [tagsM, setTagsM] = useState(false)
  const status = state.settings.storyStatus

  const aiMsgs = chat?.msgs.filter((m) => m.role === "ai") ?? []
  const active: Msg | undefined =
    aiMsgs.find((m) => m.id === pick) ?? aiMsgs[aiMsgs.length - 1]
  const [side, setSide] = useState(true)
  const [filtersOpen, setFiltersOpen] = useState(false)
  useEffect(() => {
    userRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }, [chat?.msgs.length, busy])

  const taRef = useRef<HTMLTextAreaElement>(null)
  const newChat = () => {
    // порожній чат не дублюємо: просто переводимо фокус на поле запиту
    if (chat && chat.msgs.length === 0)
      toast("Поточний чат порожній — введіть запит")
    else {
      a.newChat()
      setPick(null)
      toast("Створено новий чат")
    }
    setTimeout(() => taRef.current?.focus(), 50)
  }

  const send = (text: string, force = false) => {
    if (!text.trim() || busy) return
    setBusy(true)
    setInput("")
    setPick(null)
    a.sendQuery(text.trim(), chat?.id ?? null, force, () => setBusy(false))
  }

  // BR-03: приховуємо фрагменти історій, що перестали бути «Відкрита»
  const isOpen = (h: { fid: string }) =>
    status[mat(frag(h.fid).mid).storyId] === "Відкрита"
  const matches = (h: { fid: string }) => {
    const f = frag(h.fid)
    const m = mat(f.mid)
    if (type !== "all" && m.kind !== type) return false
    if (lang.length && !lang.includes(m.lang)) return false
    if (favOnly && !data.favs.includes(m.storyId)) return false
    return tagF.every((t) =>
      t.startsWith("my:")
        ? (data.assign[m.storyId] ?? []).includes(t.slice(3))
        : m.tags.includes(t) || f.tags.includes(t),
    )
  }
  const visibleHits = (m: Msg) => (m.hits ?? []).filter(isOpen).filter(matches)
  const hiddenCount = (m: Msg) => (m.hits ?? []).filter((h) => !isOpen(h)).length
  const picked = sel
  const storyFragments = fragments
    .filter((f) => storySel.includes(mat(f.mid).storyId))
    .map((f) => f.id)
  const scriptIds = Array.from(new Set([...picked, ...storyFragments]))
  const filtersOn =
    type !== "all" || lang.length > 0 || tagF.length > 0 || favOnly
  const toggleSel = (id: string) =>
    setSel((x) => (x.includes(id) ? x.filter((y) => y !== id) : [...x, id]))
  const toggleTag = (t: string) =>
    setTagF((x) => (x.includes(t) ? x.filter((y) => y !== t) : [...x, t]))
  const histChats = data.chats.filter(
    (c) =>
      !hq.trim() ||
      c.title.toLowerCase().includes(hq.toLowerCase()) ||
      c.msgs.some((m) =>
        (m.text + (m.answer ?? "")).toLowerCase().includes(hq.toLowerCase()),
      ),
  )
  const snippet = (c: typeof data.chats[number]) => {
    const m = c.msgs.find((x) =>
      (x.text + (x.answer ?? "")).toLowerCase().includes(hq.toLowerCase()),
    )
    return m ? (m.text || m.answer || "").slice(0, 70) : ""
  }

  const clearSel = () => {
    setSel([])
    setStorySel([])
  }
  const lastAi = aiMsgs[aiMsgs.length - 1]
  const foundStories = lastAi
    ? Array.from(
        new Map(
          visibleHits(lastAi).map((h) => {
            const m = mat(frag(h.fid).mid)
            return [m.storyId, m] as const
          }),
        ).values(),
      )
    : []
  const toggleStory = (id: string) =>
    setStorySel((cur) =>
      cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id],
    )
  const lastQuery = lastAi?.query
  const empty = !chat || chat.msgs.length === 0
  const aiCan = perms.has("ai")

  const composer = (
    <div className="cmp">
      <textarea
        ref={taRef}
        value={input}
        placeholder="Запитайте про історії архіву…"
        rows={2}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            send(input)
          }
        }}
      />
      <div className="cmp-bar">
        <span className="grow" />
        <Button
          disabled={!perms.has("script") || scriptIds.length === 0}
          onClick={() => setScript(true)}
        >
          <Icon n="spark" s={14} />
          Згенерувати сценарій
        </Button>
        <IconButton
          className="cmp-send"
          aria-label="Шукати"
          disabled={busy || !input.trim()}
          onClick={() => send(input)}
        >
          <Icon n="send" s={18} />
        </IconButton>
      </div>
    </div>
  )

  const renderHit = (m: Msg, h: { fid: string; score: number }) => {
    const f = frag(h.fid)
    const mm = mat(f.mid)
    const s = fragStart(f)
    const e = fragEnd(f)
    const key = `${m.id}:${f.id}`
    const fav = data.favs.includes(mm.storyId)
    const open = () => setMedia({ id: mm.id, t: s, e })
    return (
      <article key={h.fid} className={`hit ${sel.includes(f.id) ? "sel" : ""}`}>
        <button className="hit-thumb" onClick={open} aria-label={`Відкрити ${mm.title} з ${fmt(s)}`}>
          <img
            src={thumbUrl(mm.id, 480, 270)}
            alt=""
            loading="lazy"
            onError={(ev) => {
              ev.currentTarget.style.visibility = "hidden"
            }}
          />
          <span className="hit-play">
            <Icon n="play" s={16} fill />
          </span>
          <span className="hit-dur">{fmt(mm.duration)}</span>
        </button>
        <div className="hit-body">
          <h3>{mm.story}</h3>
          <p className="hit-meta">
            <span className={`kind ${mm.kind}`}>
              <Icon n={mm.kind} s={12} />
              {mm.kind === "video" ? "Відео" : "Аудіо"}
            </span>
            <span className="tcr">
              {fmt(s)} – {fmt(e)}
            </span>
            <span className="score">{h.score}%</span>
          </p>
          <p className="hit-quote">
            <b>{fragWho(f)}:</b> «{fragQuote(f)}»
          </p>
          <div className="hit-actions">
            <Button size="sm" onClick={open}>
              <Icon n="play" s={12} fill />
              Відкрити з {fmt(s)}
            </Button>
            <span className="grow" />
            <Checkbox
              className="hit-pick"
              title="Додати до сценарію"
              checked={sel.includes(f.id)}
              onChange={() => toggleSel(f.id)}
            >
              <em>У сценарій</em>
            </Checkbox>
            <IconButton
              size="sm"
              className="fav"
              active={fav}
              aria-label={fav ? "Видалити історію з вибраного" : "Додати історію до вибраного"}
              onClick={() => {
                a.toggleFav(mm.storyId)
                toast(fav ? "Історію видалено з вибраного" : "Історію додано до вибраного")
              }}
            >
              <Icon n="star" s={16} fill={fav} />
            </IconButton>
            <IconButton
              size="sm"
              active={data.ratings[key] === "rel"}
              aria-pressed={data.ratings[key] === "rel"}
              aria-label="Релевантно"
              onClick={() => a.rate(key, "rel")}
            >
              <Icon n="up" s={14} />
            </IconButton>
            <IconButton
              size="sm"
              className="dn bad"
              active={data.ratings[key] === "irrel"}
              aria-pressed={data.ratings[key] === "irrel"}
              aria-label="Нерелевантно"
              onClick={() => a.rate(key, "irrel")}
            >
              <Icon n="up" s={14} />
            </IconButton>
          </div>
        </div>
      </article>
    )
  }

  const lastUserId = [...(chat?.msgs ?? [])].reverse().find((m) => m.role === "user")?.id
  const thread = (
    <div className="thread2">
      {chat?.msgs.map((m) => {
        if (m.role === "user")
          return (
            <div
              key={m.id}
              className="msg-user"
              ref={m.id === lastUserId ? userRef : undefined}
            >
              {m.text}
            </div>
          )
        const vis = visibleHits(m)
        const hid = hiddenCount(m)
        return (
          <section key={m.id} className="msg-ai">
            {m.status === "error" && (
              <div className="state err">
                <Icon n="alert" />
                Не вдалося отримати результати пошуку.
                <Button size="sm" onClick={() => send(m.query ?? "", true)}>
                  Повторити
                </Button>
              </div>
            )}
            {m.status === "empty" && (
              <div className="state">
                <Icon n="search" />
                Релевантних історій не знайдено. Спробуйте інші слова.
              </div>
            )}
            {m.answer && (
              <p className="aitext">
                <Icon n="spark" s={14} /> {m.answer}
              </p>
            )}
            {m.status === "ok" && (
              <>
                {!m.answer && !aiCan && (
                  <p className="locknote">
                    <Icon n="lock" s={13} /> Відповідь ШІ — з Розширеною роллю
                  </p>
                )}
                {hid > 0 && (
                  <div className="banner">
                    <Icon n="lock" s={14} />
                    {hid} фрагм. приховано: історію більше не позначено як «Відкрита».
                  </div>
                )}
                <div className="hits">
                  {vis.map((h) => renderHit(m, h))}
                  {vis.length === 0 && (
                    <p className="muted">Нічого не відповідає фільтрам.</p>
                  )}
                </div>
              </>
            )}
          </section>
        )
      })}
      {busy && (
        <div className="state">
          <span className="dots">
            <i />
            <i />
            <i />
          </span>{" "}
          Шукаю в архіві…
        </div>
      )}
      <div ref={end} />
    </div>
  )

  const visibleChats = data.chats.filter(
    (c) => c.msgs.length > 0,
  )

  return (
    <div className={`shell ${side ? "" : "side-rail"}`}>
      <aside className={`side ${side ? "" : "is-rail"}`} aria-label="Меню">
        <div className="side-top">
          {side && <span className="side-title">Чати</span>}
          <IconButton
            aria-label={side ? "Згорнути меню" : "Розгорнути меню"}
            onClick={() => setSide(!side)}
          >
            <Icon n="panelL" s={20} />
          </IconButton>
        </div>
        <nav className="side-nav">
          <button title="Новий чат" onClick={newChat}>
            <Icon n="plus" s={20} />
            <span className="lbl">Новий чат</span>
          </button>
        </nav>
        {side && (
          <>
            <div className="side-label">Нещодавні</div>
            <ul className="side-chats">
              {visibleChats.length === 0 && (
                <li className="muted">Поки порожньо</li>
              )}
              {visibleChats.map((c) => (
                <li
                  key={c.id}
                  className={c.id === data.active ? "on" : ""}
                >
                  <button
                    className="side-chat"
                    onClick={() => {
                      a.setActive(c.id)
                      setPick(null)
                                      }}
                  >
                    {c.title}
                  </button>
                  <IconButton
                    size="sm"
                    aria-label="Видалити чат"
                    onClick={() => setDel(c.id)}
                  >
                    <Icon n="trash" s={18} />
                  </IconButton>
                </li>
              ))}
            </ul>
          </>
        )}
      </aside>

      <main className="main" aria-label="Пошуковий чат">
        {(
          <>
            <div className="chat-scroll">
              <div className="chat-col">
                {empty ? (
                  <div className="home">
                    <div className="home-logo">
                      <Logo size={56} />
                    </div>
                    <h1>Що ви шукаєте в архіві?</h1>
                    {!aiCan && (
                      <p className="locknote">
                        <Icon n="lock" s={13} /> Відповіді ШІ — з Розширеною роллю.
                      </p>
                    )}
                  </div>
                ) : (
                  thread
                )}
              </div>
            </div>
            <div className="chat-dock">
              <div className="chat-col">
                {composer}
              </div>
            </div>
          </>
        )}
        {media && (
          <Media
            key={`${media.id}:${media.t}`}
            id={media.id}
            t0={media.t}
            e0={media.e}
            onClose={() => setMedia(null)}
          />
        )}
      </main>

      <LibPanel
        foundStories={foundStories}
        storySel={storySel}
        selSummary={
          scriptIds.length > 0
            ? [
                storySel.length ? `${storySel.length} іст.` : "",
                picked.length ? `${picked.length} фрагм.` : "",
              ]
                .filter(Boolean)
                .join(" · ")
            : ""
        }
        canScript={perms.has("script")}
        busy={busy}
        onToggleStory={toggleStory}
        onClear={clearSel}
        onGenerate={() => setScript(true)}
        onAsk={send}
        onManageTags={() => setTagsM(true)}
        onOpenScripts={() => setScripts(true)}
      />

      {tagsM && <TagsModal onClose={() => setTagsM(false)} />}
      {scripts && <ScriptsModal onClose={() => setScripts(false)} />}
      {del && (
        <Modal
          title="Видалити чат?"
          onClose={() => setDel(null)}
          foot={
            <>
              <Button onClick={() => setDel(null)}>Скасувати</Button>
              <Button
                variant="danger"
                onClick={() => {
                  a.deleteChat(del)
                  setDel(null)
                  setPick(null)
                  toast("Чат видалено")
                }}
              >
                Видалити
              </Button>
            </>
          }
        >
          <p>Чат і всі його запити та результати буде видалено безповоротно.</p>
        </Modal>
      )}
      {script && (
        <ScriptModal ids={scriptIds} onClose={() => setScript(false)} />
      )}
    </div>
  )
}

function BrowseStory({
  story,
  selected,
  onToggle,
  onOpen,
}: {
  story: typeof stories[number]
  selected: boolean
  onToggle: () => void
  onOpen: (id: string) => void
}) {
  const { data } = useMe()
  const a = useActions()
  const cover = storyCover(story.id)
  const fav = data.favs.includes(story.id)

  return (
    <article className={`story-card ${selected ? "selected" : ""}`}>
      <Checkbox
        className="story-select"
        title="Додати історію до сценарію"
        checked={selected}
        onChange={onToggle}
      >
        <em>До сценарію</em>
      </Checkbox>
      <button
        className="story-cover"
        onClick={() => onOpen(cover.id)}
        aria-label={`Відкрити історію ${story.title}`}
      >
        <img
          src={thumbUrl(cover.id, 640, 360)}
          alt=""
          loading="lazy"
          onError={(e) => {
            e.currentTarget.style.visibility = "hidden"
          }}
        />
        <span className="story-open">
          <Icon n="play" s={15} fill />
          Відкрити
        </span>
      </button>
      <div className="story-card-body">
        <header>
          <div>
            <span className="story-label">ІСТОРІЯ</span>
            <h3>
              <button className="hlink" onClick={() => onOpen(cover.id)}>
                {story.title}
              </button>
            </h3>
          </div>
        </header>
        <p>{story.summary}</p>
        <div className="chips">
          {story.tags.slice(0, 3).map((tag) => (
            <Chip key={tag}>{tag}</Chip>
          ))}
          <UserTagChips storyId={story.id} />
          <TagPicker storyId={story.id} />
        </div>
        <footer className="story-actions">
          <Button
            size="sm"
            variant={fav ? "primary" : "default"}
            onClick={() => {
              a.toggleFav(story.id)
              toast(
                fav
                  ? "Історію видалено з вибраного"
                  : "Історію додано до вибраного",
              )
            }}
          >
            <Icon n="star" s={14} fill={fav} />
            {fav ? "У вибраному" : "Додати у вибране"}
          </Button>
          <LinkButton onClick={() => onOpen(cover.id)}>
            Переглянути історію
          </LinkButton>
        </footer>
      </div>
    </article>
  )
}

const PRESETS = [
  "Короткий огляд історій",
  "Документальний нарис",
  "Тези для статті",
]

function ScriptModal({ ids, onClose }: { ids: string[]; onClose: () => void }) {
  const a = useActions()
  const titles = Array.from(new Set(ids.map((id) => mat(frag(id).mid).story)))
  const [prompt, setPrompt] = useState("")
  const [out, setOut] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const run = () => {
    if (!prompt.trim()) return
    setBusy(true)
    setTimeout(() => {
      setOut(a.genScript(prompt.trim(), ids).body)
      setBusy(false)
    }, 900)
  }
  return (
    <Modal
      wide
      title="Новий сценарій"
      onClose={onClose}
      foot={
        out ? (
          <>
            <Button
              onClick={() => {
                navigator.clipboard?.writeText(out)
                toast("Скопійовано")
              }}
            >
              <Icon n="copy" s={14} />
              Копіювати
            </Button>
            <Button variant="primary" onClick={onClose}>
              Готово
            </Button>
          </>
        ) : (
          <>
            <Button onClick={onClose}>Скасувати</Button>
            <Button
              variant="primary"
              disabled={!prompt.trim() || busy}
              onClick={run}
            >
              <Icon n="spark" s={14} />
              {busy ? "Генерація…" : "Згенерувати сценарій"}
            </Button>
          </>
        )
      }
    >
      {!out ? (
        <>
          <section className="sc-sources">
            <div className="sc-label">Джерела</div>
            {ids.length === 0 ? (
              <p className="sub">Оберіть історії або фрагменти — вони з’являться тут.</p>
            ) : (
              <>
                <div className="chips">
                  {titles.map((t) => (
                    <Chip key={t}>{t}</Chip>
                  ))}
                </div>
                <p className="sc-count">
                  {titles.length} іст. · {ids.length} фрагм.
                </p>
              </>
            )}
          </section>
          <label className="fld">
            <span className="sc-label">Про що сценарій</span>
            <textarea
              rows={5}
              value={prompt}
              autoFocus
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Тема, акценти й тон. Напр.: взаємодопомога незнайомих людей під час евакуації, стримано й документально."
            />
          </label>
          <div className="chips sc-presets">
            {PRESETS.map((x) => (
              <Chip key={x} onClick={() => setPrompt(x)}>
                {x}
              </Chip>
            ))}
          </div>
          <p className="sc-note">
            <Icon n="lock" s={14} />
            Генерація виконується локально в інфраструктурі Замовника. Сценарій
            збережеться автоматично.
          </p>
        </>
      ) : (
        <>
          <div className="okmsg">
            <Icon n="check" />
            Сценарій збережено. Знайти його можна в «Сценарії» у бібліотеці.
          </div>
          <pre className="scriptout">{out}</pre>
        </>
      )}
    </Modal>
  )
}

function ScriptsModal({ onClose }: { onClose: () => void }) {
  const { data } = useMe()
  const a = useActions()
  const [open, setOpen] = useState<string | null>(null)
  return (
    <Modal wide title="Збережені сценарії" onClose={onClose}>
      {data.scripts.length === 0 && (
        <Empty icon="file" title="Сценаріїв ще немає">
          Оберіть фрагменти та натисніть «Сценарій».
        </Empty>
      )}
      {data.scripts.map((sc) => (
        <div key={sc.id} className="scr">
          <div className="scr-h">
            <button
              className="hlink"
              onClick={() => setOpen(open === sc.id ? null : sc.id)}
            >
              <b>{sc.title}</b>
            </button>
            <small>
              {dt(sc.created)} · {sc.sources.length} матеріалів
            </small>
            <IconButton
              size="sm"
              aria-label="Копіювати"
              onClick={() => {
                navigator.clipboard?.writeText(sc.body)
                toast("Скопійовано")
              }}
            >
              <Icon n="copy" s={14} />
            </IconButton>
            <IconButton
              size="sm"
              aria-label="Видалити"
              onClick={() => {
                a.deleteScript(sc.id)
                toast("Сценарій видалено")
              }}
            >
              <Icon n="trash" s={18} />
            </IconButton>
          </div>
          <p className="muted sm">Промпт: {sc.prompt}</p>
          {open === sc.id && <pre className="scriptout">{sc.body}</pre>}
        </div>
      ))}
    </Modal>
  )
}
export { range }
